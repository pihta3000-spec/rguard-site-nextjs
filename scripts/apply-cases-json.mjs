// Применяет кейсы из JSON (удалить все → создать). Нужен только better-sqlite3,
// без exceljs. JSON готовится локально из таблицы. Запуск: node scripts/apply-cases-json.mjs <cases.json>
import fs from 'node:fs'
import { getDb, adminList, adminDelete, adminUpsert } from '../lib/db.js'

const path = process.argv[2]
if (!path) { console.error('Укажите путь к cases.json'); process.exit(1) }

const db = getDb()
for (const col of ['insight', 'coverImage']) {
  try { db.exec(`ALTER TABLE cases ADD COLUMN ${col} TEXT`); console.log('+ колонка', col) }
  catch { console.log('= колонка', col, 'уже есть') }
}

const cases = JSON.parse(fs.readFileSync(path, 'utf8'))
const existing = adminList('cases')
for (const c of existing) adminDelete('cases', c._id)
let created = 0
for (const doc of cases) { adminUpsert('cases', doc); created++ }
console.log('Удалено:', existing.length, '| создано:', created)
