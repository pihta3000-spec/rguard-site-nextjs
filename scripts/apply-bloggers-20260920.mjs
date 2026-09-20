import fs from 'node:fs'
import path from 'node:path'
import { adminGetBySlug, adminUpsert, getDb } from '../lib/db.js'

const profiles = JSON.parse(fs.readFileSync(new URL('../data-import/bloggers-20260920.json', import.meta.url), 'utf8'))
const db = getDb()
const missing = profiles.filter(profile => !adminGetBySlug('bloggers', profile.slug))
// Insert only: subsequent deploys must not overwrite edits made in the admin panel.
for (const profile of missing) {
  for (const index of [1, 2]) {
    const file = path.join(process.cwd(), 'public', 'bloggers', profile.slug, `${index}.png`)
    if (!fs.existsSync(file)) throw new Error(`Missing photo: ${file}`)
  }
  if (db.prepare('SELECT 1 FROM bloggers WHERE _id = ?').get(profile._id)) {
    throw new Error(`Existing blogger ID conflict: ${profile._id}`)
  }
}
if (missing.length) {
  const backup = `${db.name}.before-bloggers-20260920-${Date.now()}.bak`
  await db.backup(backup)
  db.transaction(() => {
    let order = db.prepare('SELECT COALESCE(MAX("order"), 0) AS n FROM bloggers').get().n
    for (const profile of missing) {
      adminUpsert('bloggers', {
        ...profile,
        photos: [1, 2].map(i => `/bloggers/${profile.slug}/${i}.png`),
        metrics: [],
        showreel: '',
        order: ++order,
      })
    }
  })()
}
console.log(`New blogger profiles added: ${missing.length}; existing profiles preserved`)
