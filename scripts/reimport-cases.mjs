// Разовая перезаливка кейсов из вкладки КЕЙСЫ (удалить все → создать заново).
// Остальные типы контента НЕ трогает. Запуск: node scripts/reimport-cases.mjs <path.xlsx>
import { getDb } from '../lib/db.js'
import { replaceCasesFromWorkbook } from '../lib/importSheet.js'
import ExcelJS from 'exceljs'

const path = process.argv[2]
if (!path) { console.error('Укажите путь к .xlsx'); process.exit(1) }

const db = getDb()
// Добавить новые колонки в существующую таблицу (для свежей БД они уже в schema.sql)
for (const col of ['insight', 'coverImage']) {
  try { db.exec(`ALTER TABLE cases ADD COLUMN ${col} TEXT`); console.log('+ колонка', col) }
  catch { console.log('= колонка', col, 'уже есть') }
}

const wb = new ExcelJS.Workbook()
await wb.xlsx.readFile(path)
const res = replaceCasesFromWorkbook(wb)
console.log('Удалено:', res.deleted, '| создано:', res.created)
if (res.warnings.length) console.log('Предупреждения:', res.warnings)
