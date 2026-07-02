// Updates existing cases from the RGUARD content workbook.
// Does not create new cases. Matching: explicit slug -> generated slug -> title -> known aliases.
// Usage: node scripts/update-cases-from-sheet.mjs <path.xlsx>
import ExcelJS from 'exceljs'
import { adminGetBySlug, adminList, adminUpsert } from '../lib/db.js'
import { slugify } from '../lib/contentModel.js'

const workbookPath = process.argv[2]
if (!workbookPath) {
  console.error('Usage: node scripts/update-cases-from-sheet.mjs <path.xlsx>')
  process.exit(1)
}

const aliases = new Map([
  ['петроинжиниринг', 'petro-engineering'],
  ['иск петроинжиниринг', 'petro-engineering'],
  ['ростелеком', 'rostelekom'],
])

const text = (cell) => {
  const v = cell?.value
  if (v == null) return ''
  if (typeof v === 'object') {
    if (v.text != null) return String(v.text).trim()
    if (Array.isArray(v.richText)) return v.richText.map(t => t.text).join('').trim()
    if (v.result != null) return String(v.result).trim()
  }
  return String(v).trim()
}

const yes = (value) => /^(да|yes|true|1|\+)$/i.test(String(value || '').trim())
const splitComma = (value) => String(value || '').split(',').map(x => x.trim()).filter(Boolean)
const isEmpty = (value) => {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}
const cleanUrl = (value) => {
  const url = String(value || '').trim()
  if (!url) return ''
  if (/^(https?:)?\/\//i.test(url) || /^mailto:/i.test(url)) return url
  if (/^(vk|vkvideo|rutube|youtube|youtu\.be|instagram)\./i.test(url)) return `https://${url}`
  return url
}

function makeResolver(ws) {
  const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim()
  const headers = []
  ws.getRow(1).eachCell((cell, col) => headers.push({ col, title: norm(text(cell)) }))
  const findCol = (re) => headers.find(h => re.test(h.title))?.col
  return (row) => (re) => {
    const col = findCol(re)
    return col ? text(row.getCell(col)) : ''
  }
}

function resolveSlug(title, explicitSlug, existingByTitle) {
  if (explicitSlug && adminGetBySlug('cases', explicitSlug)) return explicitSlug

  const generated = slugify(title)
  if (generated && adminGetBySlug('cases', generated)) return generated

  const titleKey = title.trim().toLowerCase()
  if (existingByTitle.has(titleKey)) return existingByTitle.get(titleKey).slug
  if (aliases.has(titleKey)) return aliases.get(titleKey)

  return null
}

function mappedDoc(g) {
  const title = g(/^Название$/i).trim()
  if (!title) return null

  const metrics = [1, 2, 3].map(n => ({
    value: g(new RegExp(`Метрика\\s*${n}.*(Значение|Число)`, 'i')),
    label: g(new RegExp(`Метрика\\s*${n}.*Подпись`, 'i')),
  })).filter(m => m.value || m.label)

  const links = [
    cleanUrl(g(/Ссылка на видео\s*1/i)),
    cleanUrl(g(/Ссылка на видео\s*2/i)),
  ].filter(Boolean)

  return {
    title,
    explicitSlug: g(/^(slug|url)/i),
    service: g(/Категория/i),
    accent: g(/^Тег\b|Акцент/i),
    shortText: g(/Краткое описание/i),
    task: g(/Задача/i),
    solution: g(/Решение/i),
    metrics,
    links,
    whatWorked: splitComma(g(/Что сработало/i)),
    insight: g(/Главный инсайт|инсайт/i),
    featured: yes(g(/На главной/i)),
    order: g(/Порядок/i),
  }
}

const workbook = new ExcelJS.Workbook()
await workbook.xlsx.readFile(workbookPath)
const ws = workbook.getWorksheet('КЕЙСЫ')
if (!ws) throw new Error('Sheet "КЕЙСЫ" not found')

const existingList = adminList('cases')
const existingByTitle = new Map(existingList.map(item => [String(item.title).trim().toLowerCase(), item]))
const resolve = makeResolver(ws)

const rowsBySlug = new Map()
const duplicates = []

for (let r = 2; r <= ws.rowCount; r++) {
  const rowDoc = mappedDoc(resolve(ws.getRow(r)))
  if (!rowDoc) continue

  const slug = resolveSlug(rowDoc.title, rowDoc.explicitSlug, existingByTitle)
  if (!slug || !adminGetBySlug('cases', slug)) {
    console.warn(`skip row ${r}: no existing case for "${rowDoc.title}"`)
    continue
  }

  const incoming = { row: r, slug, ...rowDoc }
  delete incoming.explicitSlug

  if (rowsBySlug.has(slug)) {
    const prev = rowsBySlug.get(slug)
    duplicates.push(`${slug}: rows ${prev.row}, ${r}`)
    rowsBySlug.set(slug, {
      ...prev,
      ...Object.fromEntries(Object.entries(incoming).filter(([, v]) => !isEmpty(v))),
      // The workbook has a Petro duplicate: row 2 carries homepage order,
      // row 15 has fuller case text. Keep first order/featured.
      featured: prev.featured,
      order: prev.order,
      row: `${prev.row}+${r}`,
    })
  } else {
    rowsBySlug.set(slug, incoming)
  }
}

let updated = 0
for (const [slug, incoming] of rowsBySlug) {
  const existing = adminGetBySlug('cases', slug)
  if (!existing) continue

  const next = {
    ...existing,
    ...Object.fromEntries(Object.entries(incoming).filter(([key, value]) =>
      !['row', 'slug'].includes(key) && !isEmpty(value)
    )),
    slug,
    coverImage: existing.coverImage,
    _id: existing._id,
  }

  adminUpsert('cases', next)
  updated++
  console.log(`updated ${slug} from row ${incoming.row}`)
}

console.log(`Done. Updated: ${updated}. Created: 0.`)
if (duplicates.length) console.log(`Duplicates merged: ${duplicates.join('; ')}`)
