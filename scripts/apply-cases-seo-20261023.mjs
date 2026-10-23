import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import { getDb } from '../lib/db.js'

export function applyCaseSeo(db, rows) {
  return db.transaction(() => {
    let updated = 0
    for (const [slug, metaTitle, metaDescription] of rows) {
      const row = db.prepare('SELECT seo FROM cases WHERE slug = ?').get(slug)
      if (!row) throw new Error(`Case missing: ${slug}`)
      const seo = row.seo ? JSON.parse(row.seo) : {}
      // Fill only empty fields; subsequent deployments must preserve editor changes.
      const next = { ...seo, metaTitle: seo.metaTitle || metaTitle, metaDescription: seo.metaDescription || metaDescription }
      if (JSON.stringify(next) !== JSON.stringify(seo)) {
        db.prepare('UPDATE cases SET seo = ? WHERE slug = ?').run(JSON.stringify(next), slug)
        updated++
      }
    }
    return updated
  })()
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const db = getDb()
  const marker = 'cases-seo-20261023'
  db.exec('CREATE TABLE IF NOT EXISTS content_migrations (id TEXT PRIMARY KEY, appliedAt TEXT NOT NULL)')
  if (!db.prepare('SELECT 1 FROM content_migrations WHERE id = ?').get(marker)) {
    const rows = JSON.parse(fs.readFileSync(new URL('../data-import/cases-seo-20261023.json', import.meta.url)))
    db.transaction(() => {
      console.log('Cases SEO updated:', applyCaseSeo(db, rows))
      db.prepare('INSERT INTO content_migrations (id, appliedAt) VALUES (?, ?)').run(marker, new Date().toISOString())
    })()
  } else console.log('Cases SEO migration already applied')
  db.close()
}
