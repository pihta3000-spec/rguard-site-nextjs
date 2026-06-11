// Разовая миграция Sanity → SQLite.
// Тянет все доки, скачивает картинки в /public/uploads, конвертит body/bio
// Portable Text → HTML, пишет в data/content.db. Идемпотентно (INSERT OR REPLACE).
//
// Запуск:  node scripts/migrate-from-sanity.mjs
//
// Картинки лежат как строки-URL вида /uploads/<hash>.jpg.

import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createClient } from '@sanity/client'
import { toHTML } from '@portabletext/to-html'
import Database from 'better-sqlite3'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const UPLOADS_DIR = path.join(ROOT, 'public', 'uploads')
const DB_PATH = process.env.DB_PATH || path.join(ROOT, 'data', 'content.db')

const sanity = createClient({
  projectId: 'y9ptramm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

// ── Скачивание картинок ──────────────────────────────────────────────────────
fs.mkdirSync(UPLOADS_DIR, { recursive: true })
const downloaded = new Map() // sanityUrl -> /uploads/<file>

async function localizeImage(url) {
  if (!url) return null
  if (downloaded.has(url)) return downloaded.get(url)
  const clean = url.split('?')[0]
  const base = clean.split('/').pop() // <hash>-WxH.jpg
  const dest = path.join(UPLOADS_DIR, base)
  const local = `/uploads/${base}`
  if (!fs.existsSync(dest)) {
    const res = await fetch(url)
    if (!res.ok) { console.warn('  ! не скачалось:', url, res.status); return url }
    const buf = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(dest, buf)
    console.log('  ↓', base, `(${(buf.length / 1024).toFixed(0)} КБ)`)
  }
  downloaded.set(url, local)
  return local
}

// ── Portable Text → HTML ─────────────────────────────────────────────────────
const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function ptComponents() {
  return {
    types: {
      // value.url подставлен GROQ-проекцией ниже и уже локализован перед toHTML
      image: ({ value }) => {
        if (!value?.url) return ''
        const cap = value.caption ? `<figcaption>${esc(value.caption)}</figcaption>` : ''
        return `<figure><img src="${esc(value.url)}" alt="${esc(value.caption || '')}" loading="lazy" />${cap}</figure>`
      },
      videoEmbed: ({ value }) => {
        if (!value?.url) return ''
        const cap = value.caption ? `<figcaption>${esc(value.caption)}</figcaption>` : ''
        return `<figure><a href="${esc(value.url)}" target="_blank" rel="noreferrer">${esc(value.caption || value.url)}</a>${cap}</figure>`
      },
    },
    marks: {
      link: ({ children, value }) => {
        const blank = value?.blank ? ' target="_blank" rel="noreferrer"' : ''
        return `<a href="${esc(value?.href || '')}"${blank}>${children}</a>`
      },
    },
  }
}

// Локализует все картинки внутри PT-блоков (тип image с уже разрешённым url)
async function localizeBlocks(blocks) {
  if (!Array.isArray(blocks)) return blocks
  for (const b of blocks) {
    if (b?._type === 'image' && b.url) b.url = await localizeImage(b.url)
  }
  return blocks
}

async function ptToHtml(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return ''
  await localizeBlocks(blocks)
  return toHTML(blocks, { components: ptComponents() })
}

// ── Запись в БД ──────────────────────────────────────────────────────────────
const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.exec(fs.readFileSync(path.join(ROOT, 'lib', 'schema.sql'), 'utf8'))

const S = (v) => (v == null ? null : JSON.stringify(v))

async function migrateCases() {
  const rows = await sanity.fetch(`*[_type=="case"]{
    _id, title, "slug": slug.current, service, accent, shortText, task, solution,
    metrics, links, whatWorked, featured, "order": order
  }`)
  const stmt = db.prepare(`INSERT OR REPLACE INTO cases
    (_id,title,slug,service,accent,shortText,task,solution,metrics,links,whatWorked,featured,"order")
    VALUES (@_id,@title,@slug,@service,@accent,@shortText,@task,@solution,@metrics,@links,@whatWorked,@featured,@order)`)
  for (const r of rows) {
    stmt.run({
      _id: r._id, title: r.title ?? null, slug: r.slug ?? null, service: r.service ?? null,
      accent: r.accent ?? null, shortText: r.shortText ?? null, task: r.task ?? null,
      solution: r.solution ?? null, metrics: S(r.metrics), links: S(r.links),
      whatWorked: S(r.whatWorked), featured: r.featured ? 1 : 0, order: r.order ?? null,
    })
  }
  console.log(`Кейсы: ${rows.length}`)
}

async function migratePosts() {
  const rows = await sanity.fetch(`*[_type=="post"]{
    _id, title, "slug": slug.current, category, publishedAt, excerpt,
    "coverImage": coverImage.asset->url,
    body[]{ ..., _type=="image" => { ..., "url": asset->url } },
    seo{ metaTitle, metaDescription, "ogImage": ogImage.asset->url },
    "relatedPosts": relatedPosts[]._ref
  }`)
  const stmt = db.prepare(`INSERT OR REPLACE INTO posts
    (_id,title,slug,category,publishedAt,coverImage,excerpt,body,seo,relatedPosts)
    VALUES (@_id,@title,@slug,@category,@publishedAt,@coverImage,@excerpt,@body,@seo,@relatedPosts)`)
  for (const r of rows) {
    const seo = r.seo ? { ...r.seo, ogImage: r.seo.ogImage ? await localizeImage(r.seo.ogImage) : undefined } : null
    stmt.run({
      _id: r._id, title: r.title ?? null, slug: r.slug ?? null, category: r.category ?? null,
      publishedAt: r.publishedAt ?? null, coverImage: await localizeImage(r.coverImage),
      excerpt: r.excerpt ?? null, body: await ptToHtml(r.body),
      seo: S(seo), relatedPosts: S(r.relatedPosts || []),
    })
  }
  console.log(`Статьи: ${rows.length}`)
}

async function migrateIndustries() {
  const rows = await sanity.fetch(`*[_type=="industry"]{
    _id, title, "slug": slug.current, icon, shortDesc,
    "coverImage": coverImage.asset->url,
    body[]{ ..., _type=="image" => { ..., "url": asset->url } },
    linkedServices,
    seo{ metaTitle, metaDescription, "ogImage": ogImage.asset->url },
    "order": order
  }`)
  const stmt = db.prepare(`INSERT OR REPLACE INTO industries
    (_id,title,slug,icon,coverImage,shortDesc,body,linkedServices,seo,"order")
    VALUES (@_id,@title,@slug,@icon,@coverImage,@shortDesc,@body,@linkedServices,@seo,@order)`)
  for (const r of rows) {
    const seo = r.seo ? { ...r.seo, ogImage: r.seo.ogImage ? await localizeImage(r.seo.ogImage) : undefined } : null
    stmt.run({
      _id: r._id, title: r.title ?? null, slug: r.slug ?? null, icon: r.icon ?? null,
      coverImage: await localizeImage(r.coverImage), shortDesc: r.shortDesc ?? null,
      body: await ptToHtml(r.body), linkedServices: S(r.linkedServices), seo: S(seo),
      order: r.order ?? null,
    })
  }
  console.log(`Отрасли: ${rows.length}`)
}

async function migrateBloggers() {
  const rows = await sanity.fetch(`*[_type=="blogger"]{
    _id, name, "slug": slug.current, "desc": desc, showreel,
    bio, metrics, socials, specializations, "order": order,
    "photos": photos[].asset->url
  }`)
  const stmt = db.prepare(`INSERT OR REPLACE INTO bloggers
    (_id,name,slug,"desc",bio,photos,showreel,metrics,socials,specializations,"order")
    VALUES (@_id,@name,@slug,@desc,@bio,@photos,@showreel,@metrics,@socials,@specializations,@order)`)
  for (const r of rows) {
    const photos = []
    for (const u of (r.photos || [])) photos.push(await localizeImage(u))
    stmt.run({
      _id: r._id, name: r.name ?? null, slug: r.slug ?? null, desc: r.desc ?? null,
      bio: await ptToHtml(r.bio), photos: S(photos), showreel: r.showreel ?? null,
      metrics: S(r.metrics), socials: S(r.socials), specializations: S(r.specializations),
      order: r.order ?? null,
    })
  }
  console.log(`Блогеры: ${rows.length}`)
}

console.log('Миграция Sanity → SQLite:', DB_PATH)
await migrateCases()
await migratePosts()
await migrateIndustries()
await migrateBloggers()
console.log('Готово. Картинок скачано:', downloaded.size)
db.close()
