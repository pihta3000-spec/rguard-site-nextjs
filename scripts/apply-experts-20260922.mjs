import fs from 'node:fs'
import path from 'node:path'
import { adminUpsert, getDb } from '../lib/db.js'

const profiles = JSON.parse(fs.readFileSync(new URL('../data-import/experts-20260922.json', import.meta.url), 'utf8'))
const allocation = JSON.parse(fs.readFileSync(new URL('../data-import/article-authors-20260922.json', import.meta.url), 'utf8'))
const db = getDb()
const marker = 'experts-20260922'
db.exec('CREATE TABLE IF NOT EXISTS content_migrations (id TEXT PRIMARY KEY, appliedAt TEXT NOT NULL)')
if (db.prepare('SELECT 1 FROM content_migrations WHERE id = ?').get(marker)) {
  console.log('Expert migration already applied; all editorial changes preserved.')
} else {
  const seen = new Set()
  for (const profile of profiles) {
    if (!fs.existsSync(path.join(process.cwd(), 'public', profile.photo))) throw new Error(`Missing photo: ${profile.photo}`)
    const existing = db.prepare('SELECT _id, slug FROM employees WHERE _id = ? OR slug = ?').all(profile._id, profile.slug)
    if (existing.some(row => row._id !== profile._id || row.slug !== profile.slug)) throw new Error(`Employee identity conflict: ${profile.slug}`)
  }
  for (const [slug, articles] of Object.entries(allocation)) {
    if (!profiles.some(p => p.slug === slug)) throw new Error(`Unknown author: ${slug}`)
    for (const article of articles) {
      if (seen.has(article)) throw new Error(`Duplicate allocation: ${article}`)
      seen.add(article)
    }
  }
  const backup = `${db.name}.before-experts-${Date.now()}.bak`
  await db.backup(backup)
  let added = 0, assigned = 0
  const warnings = []
  db.transaction(() => {
    for (const profile of profiles) {
      if (!db.prepare('SELECT 1 FROM employees WHERE _id = ?').get(profile._id)) {
        adminUpsert('employees', profile)
        added++
      }
      for (const slug of allocation[profile.slug] || []) {
        const post = db.prepare('SELECT _id, authorId FROM posts WHERE slug = ?').get(slug)
        if (!post) { warnings.push(`Missing article: ${slug}`); continue }
        if (post.authorId && post.authorId !== profile._id) { warnings.push(`Existing author preserved: ${slug}`); continue }
        if (!post.authorId) assigned += db.prepare('UPDATE posts SET authorId = ? WHERE _id = ?').run(profile._id, post._id).changes
      }
    }
    db.prepare('INSERT INTO content_migrations (id, appliedAt) VALUES (?, ?)').run(marker, new Date().toISOString())
  })()
  console.log(JSON.stringify({ backup, added, assigned, warnings,
    unassigned: db.prepare("SELECT slug FROM posts WHERE authorId IS NULL OR authorId = ''").all() }, null, 2))
}
// One-time supplementary publication supplied after the initial local migration.
const publicationMarker = 'roman-radio-kp-790303'
if (!db.prepare('SELECT 1 FROM content_migrations WHERE id = ?').get(publicationMarker)) {
  const roman = profiles.find(p => p.slug === 'roman-sergeev')
  const item = roman.publications.find(p => p.url.includes('/790303'))
  const row = db.prepare('SELECT publications FROM employees WHERE _id = ?').get(roman._id)
  if (!row || !item) throw new Error('Roman profile or Radio KP publication missing')
  await db.backup(`${db.name}.before-radio-kp-${Date.now()}.bak`)
  db.transaction(() => {
    const publications = JSON.parse(row.publications || '[]')
    if (!publications.some(p => p.url === item.url)) {
      db.prepare('UPDATE employees SET publications = ? WHERE _id = ?').run(JSON.stringify([item, ...publications]), roman._id)
    }
    db.prepare('INSERT INTO content_migrations (id, appliedAt) VALUES (?, ?)').run(publicationMarker, new Date().toISOString())
  })()
  console.log('Radio KP interview linked to Roman; other profile data preserved.')
}
db.close()
