// Applies the latest approved case data to the SQLite database.
// Idempotent: updates existing cases by slug and does not create new cases.
import fs from 'node:fs'
import path from 'node:path'
import { adminGetBySlug, adminUpsert } from '../lib/db.js'

const payloadPath = path.join(process.cwd(), 'scripts', 'cases-fresh-data.json')
const markerPath = path.join(process.cwd(), 'data', '.fresh-cases-20260702-applied')

if (fs.existsSync(markerPath) && !process.argv.includes('--force')) {
  console.log('Fresh case data already applied. Use --force to reapply.')
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
    title: item.title,
    service: item.service,
    accent: item.accent,
    shortText: item.shortText,
    task: item.task,
    solution: item.solution,
    metrics: item.metrics,
    links: item.links,
    whatWorked: item.whatWorked,
    insight: item.insight,
    featured: item.featured,
    order: item.order,
    slug: item.slug,
    _id: doc._id,
  })
  updated++
}

fs.mkdirSync(path.dirname(markerPath), { recursive: true })
fs.writeFileSync(markerPath, new Date().toISOString())
console.log(`Fresh case data applied. Updated: ${updated}. Created: 0. Skipped: ${skipped}.`)
