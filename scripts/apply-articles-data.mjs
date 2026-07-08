import fs from 'node:fs'
import path from 'node:path'
import { adminGetBySlug, adminUpsert, getDb } from '../lib/db.js'

const DATA_PATH = path.join(process.cwd(), 'scripts', 'articles-data.json')
const articles = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))

let created = 0
let updated = 0

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

console.log(`Articles applied: ${created} created, ${updated} updated`)
