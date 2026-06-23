// Проставляет coverImage кейсам по файлам в public/cases-covers/<slug>.webp.
// Нужен только better-sqlite3 (без exceljs/сети). Запуск: node scripts/set-covers-db.mjs
import fs from 'node:fs'
import { adminGetBySlug, adminUpsert } from '../lib/db.js'

const DIR = 'public/cases-covers'
let set = 0
for (const f of fs.existsSync(DIR) ? fs.readdirSync(DIR) : []) {
  const m = f.match(/^(.+)\.webp$/)
  if (!m) continue
  const slug = m[1]
  const doc = adminGetBySlug('cases', slug)
  if (!doc) { console.log('нет кейса для', slug); continue }
  const url = `/cases-covers/${slug}.webp`
  if (doc.coverImage === url) { continue }
  adminUpsert('cases', { ...doc, coverImage: url, _id: doc._id })
  console.log('✓', slug)
  set++
}
console.log('coverImage проставлено:', set)
