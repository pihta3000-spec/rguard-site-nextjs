import fs from 'node:fs'
import path from 'node:path'
import { adminDelete, adminGetBySlug, adminUpsert, getDb } from '../lib/db.js'

const DATA_PATH = path.join(process.cwd(), 'scripts', 'articles-data.json')
const MANAGED_PATH = path.join(process.cwd(), 'scripts', 'articles-managed-slugs.json')
const articles = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))
const managedSlugs = fs.existsSync(MANAGED_PATH)
  ? JSON.parse(fs.readFileSync(MANAGED_PATH, 'utf8'))
  : articles.map(article => article.slug)

let created = 0
let updated = 0
let deleted = 0

for (const slug of managedSlugs) {
  const existing = adminGetBySlug('posts', slug)
  if (existing && adminDelete('posts', existing._id)) deleted++
}

for (const article of articles) {
  const existing = adminGetBySlug('posts', article.slug)
  adminUpsert('posts', {
    ...(existing || {}),
    ...article,
    _id: existing?._id,
  })
  existing ? updated++ : created++
}

getDb().pragma('wal_checkpoint(TRUNCATE)')

console.log(`Articles applied: ${deleted} deleted, ${created} created, ${updated} updated`)
