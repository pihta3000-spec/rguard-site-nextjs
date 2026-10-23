import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import ExcelJS from 'exceljs'

fs.mkdirSync('data', { recursive: true })
process.env.DB_PATH = path.join(fs.mkdtempSync(path.resolve('data', 'cases-seo-test-')), 'content.db')
const old = new Database(process.env.DB_PATH)
old.exec(fs.readFileSync('lib/schema.sql', 'utf8').replace('  seo        TEXT,            -- JSON {metaTitle,metaDescription,ogImage}\n', ''))
old.close()
const db = await import('../lib/db.js')
const { importWorkbook } = await import('../lib/importSheet.js')
const { applyCaseSeo } = await import('../scripts/apply-cases-seo-20261023.mjs')
const { caseSchema } = await import('../lib/authorSchema.js')
const rows = JSON.parse(fs.readFileSync('data-import/cases-seo-20261023.json', 'utf8'))

function sheet(headers, values) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('КЕЙСЫ')
  ws.addRow(headers); ws.addRow(values)
  return importWorkbook(wb)
}
test('26 unique metadata sets; migration preserves content and manual edits', async () => {
  assert.equal(rows.length, 26)
  for (const index of [0, 1, 2]) assert.equal(new Set(rows.map(r => r[index])).size, 26)
  for (const [slug, title, description] of rows) {
    assert.ok(title.length <= 75 && description.length >= 100 && description.length <= 200)
    db.adminUpsert('cases', { _id: slug, slug, title: slug, shortText: 'original', links: ['/video.mp4'] })
  }
  const before = db.getDb().prepare('SELECT slug,title,shortText,links FROM cases ORDER BY slug').all()
  assert.equal(applyCaseSeo(db.getDb(), rows), 26)
  assert.equal(applyCaseSeo(db.getDb(), rows), 0)
  assert.deepEqual(db.getDb().prepare('SELECT slug,title,shortText,links FROM cases ORDER BY slug').all(), before)
  const doc = db.adminGetBySlug('cases', 'petro-engineering')
  assert.equal((await db.getCase(doc.slug)).seo.metaTitle, rows[0][1])
  assert.equal(caseSchema(await db.getCase(doc.slug)).description, rows[0][2])
  db.adminUpsert('cases', { ...doc, seo: { ...doc.seo, metaTitle: 'Ручная правка' } })
  applyCaseSeo(db.getDb(), rows)
  assert.equal(db.adminGetBySlug('cases', doc.slug).seo.metaTitle, 'Ручная правка')
})
test('legacy spreadsheet, empty cells and partial SEO updates retain existing metadata and ID', () => {
  const original = db.adminGetBySlug('cases', 'petro-engineering')
  sheet(['Название', 'Slug', 'Краткое описание'], ['New name', original.slug, 'New text'])
  let updated = db.adminGetBySlug('cases', original.slug)
  assert.deepEqual(updated.seo, original.seo)
  assert.equal(updated._id, original._id)
  assert.deepEqual(updated.links, original.links)
  sheet(['Slug', 'SEO Description', 'Название', 'SEO Title'], [original.slug, '', 'New name', 'Новый SEO Title'])
  updated = db.adminGetBySlug('cases', original.slug)
  assert.equal(updated.seo.metaTitle, 'Новый SEO Title')
  assert.equal(updated.seo.metaDescription, original.seo.metaDescription)
  const { seo, ...legacy } = updated
  db.adminUpsert('cases', legacy)
  assert.deepEqual(db.adminGetBySlug('cases', original.slug).seo, seo)
  sheet(['Название', 'Slug', 'SEO Title', 'SEO Description'], ['New', 'new-case', 'New SEO', 'New Description'])
  assert.equal(db.adminGetBySlug('cases', 'new-case').seo.metaDescription, 'New Description')
  db.getDb().close()
})
