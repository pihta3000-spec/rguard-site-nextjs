import fs from 'node:fs'
import path from 'node:path'
import ExcelJS from 'exceljs'

const source = process.argv[2]
const dataPath = path.join(process.cwd(), 'scripts', 'articles-data.json')
const managedPath = path.join(process.cwd(), 'scripts', 'articles-managed-slugs.json')

if (!source) {
  console.error('Usage: node scripts/build-articles-data.mjs <xlsx-path>')
  process.exit(1)
}

function text(value) {
  if (value == null) return ''
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'object' && 'text' in value) return String(value.text || '').trim()
  return String(value).trim()
}

function slugFromUrl(url) {
  const value = text(url)
  const match = value.match(/\/articles\/([^/?#]+)/i)
  return match?.[1] || value.replace(/^\/+|\/+$/g, '')
}

function normalizeDate(value) {
  const raw = text(value)
  if (!raw) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return `${raw}T00:00:00.000Z`
  const date = new Date(raw)
  if (!Number.isNaN(date.getTime())) return date.toISOString()
  return raw
}

function extractJsonLd(html) {
  const jsonLd = []
  const body = String(html || '').replace(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    (_, raw) => {
      try {
        jsonLd.push(JSON.parse(raw.trim()))
      } catch (error) {
        console.warn(`JSON-LD parse warning: ${error.message}`)
      }
      return ''
    },
  )
  return { body, jsonLd }
}

function cell(row, headers, name) {
  const index = headers.indexOf(name)
  return index >= 0 ? row.getCell(index + 1).value : null
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

const workbook = new ExcelJS.Workbook()
await workbook.xlsx.readFile(source)

const worksheet = workbook.worksheets[0]
const headers = worksheet.getRow(1).values.slice(1).map(text)
const articles = []

for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
  const row = worksheet.getRow(rowNumber)
  const slug = slugFromUrl(cell(row, headers, 'URL'))
  const seoTitle = text(cell(row, headers, 'Title'))
  const title = text(cell(row, headers, 'H1')) || seoTitle
  const articleHtml = text(cell(row, headers, 'Статья'))

  if (!slug || !title || !articleHtml) continue

  const metaDescription = text(cell(row, headers, 'Meta'))
  const { body, jsonLd } = extractJsonLd(articleHtml)
  articles.push({
    title,
    slug,
    category: text(cell(row, headers, 'Категория')),
    publishedAt: normalizeDate(cell(row, headers, 'Дата публикации')),
    coverImage: '',
    excerpt: metaDescription,
    body,
    seo: {
      metaTitle: seoTitle || title,
      metaDescription,
      ...(jsonLd.length ? { jsonLd } : {}),
    },
    relatedPosts: [],
  })
}

const previousManaged = readJson(managedPath, [])
const previousArticles = readJson(dataPath, [])
const managedSlugs = Array.from(new Set([
  ...previousManaged,
  ...previousArticles.map(article => article.slug),
  ...articles.map(article => article.slug),
].filter(Boolean)))

fs.writeFileSync(dataPath, `${JSON.stringify(articles, null, 2)}\n`, 'utf8')
fs.writeFileSync(managedPath, `${JSON.stringify(managedSlugs, null, 2)}\n`, 'utf8')

console.log(JSON.stringify({
  articles: articles.length,
  managedSlugs: managedSlugs.length,
  dataPath,
  managedPath,
}, null, 2))
