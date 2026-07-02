// Applies processed local case videos to the SQLite database.
// Idempotent: updates existing cases by slug and does not create new cases.
import fs from 'node:fs'
import path from 'node:path'
import { adminGetBySlug, adminUpsert } from '../lib/db.js'

const payloadPath = path.join(process.cwd(), 'scripts', 'cases-videos-data.json')
const markerPath = path.join(process.cwd(), 'data', '.case-videos-20260702-restore-after-fresh-data-applied')

if (fs.existsSync(markerPath) && !process.argv.includes('--force')) {
  console.log('Case videos already applied. Use --force to reapply.')
  process.exit(0)
}

const cases = JSON.parse(fs.readFileSync(payloadPath, 'utf8'))

let updated = 0
let skipped = 0

for (const item of cases) {
  const doc = adminGetBySlug('cases', item.slug)
  if (!doc) {
    skipped++
    console.warn(`skip missing case: ${item.slug}`)
    continue
  }

  adminUpsert('cases', {
    ...doc,
    title: item.title || doc.title,
    links: item.links || doc.links || [],
    coverImage: `/cases-covers/${item.slug}.webp`,
    slug: item.slug,
    _id: doc._id,
  })
  updated++
}

fs.mkdirSync(path.dirname(markerPath), { recursive: true })
fs.writeFileSync(markerPath, new Date().toISOString())
console.log(`Case videos applied. Updated: ${updated}. Created: 0. Skipped: ${skipped}.`)
