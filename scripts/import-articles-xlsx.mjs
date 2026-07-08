import ExcelJS from 'exceljs'
import { adminGetBySlug, adminUpsert, getDb } from '../lib/db.js'

const SOURCE = process.argv[2]

if (!SOURCE) {
  console.error('Usage: node scripts/import-articles-xlsx.mjs <xlsx-path>')
  process.exit(1)
}

function text(value) {
  if (value == null) return ''
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'object' && 'text' in value) return String(value.text || '').trim()
  return String(value).trim()
}

function slugFromUrl(url) {
  const value = text(url)
  const match = value.match(/\/articles\/([^/?#]+)/i)
  return match?.[1] || value.replace(/^\/+|\/+$/g, '')
}

function normalizeDate(value) {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString()
  const raw = text(value)
  if (!raw) return ''
  const date = new Date(raw)
  if (!Number.isNaN(date.getTime())) return date.toISOString()
  return raw
}

function extractJsonLd(html) {
  const jsonLd = []
  const body = String(html || '').replace(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    (_, raw) => {
      try {
        jsonLd.push(JSON.parse(raw.trim()))
      } catch (error) {
        console.warn(`JSON-LD parse warning: ${error.message}`)
      }
      return ''
    },
  )

  return { body, jsonLd }
}

function excerptFrom(meta, body) {
  const explicit = text(meta)
  if (explicit) return explicit
  const plain = String(body || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.length > 220 ? `${plain.slice(0, 217)}...` : plain
}

function cell(row, headers, name) {
  const index = headers.indexOf(name)
  return index >= 0 ? row.getCell(index + 1).value : null
}

const workbook = new ExcelJS.Workbook()
await workbook.xlsx.readFile(SOURCE)

const worksheet = workbook.worksheets[0]
const headerRow = worksheet.getRow(1)
const headers = headerRow.values.slice(1).map(text)

let created = 0
let updated = 0
const slugs = []

for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
  const row = worksheet.getRow(rowNumber)
  const slug = slugFromUrl(cell(row, headers, 'URL'))
  const title = text(cell(row, headers, 'H1')) || text(cell(row, headers, 'Title'))
  const seoTitle = text(cell(row, headers, 'Title')) || title
  const metaDescription = text(cell(row, headers, 'Meta'))
  const articleHtml = text(cell(row, headers, 'Статья'))

  if (!slug || !title || !articleHtml) continue

  const existing = adminGetBySlug('posts', slug)
  const { body, jsonLd } = extractJsonLd(articleHtml)
  const seo = {
    metaTitle: seoTitle,
    metaDescription,
    ...(jsonLd.length ? { jsonLd } : {}),
  }

  adminUpsert('posts', {
    ...(existing || {}),
    title,
    slug,
    category: text(cell(row, headers, 'Категория')),
    publishedAt: normalizeDate(cell(row, headers, 'Дата публикации')),
    excerpt: excerptFrom(metaDescription, body),
    body,
    seo,
    _id: existing?._id,
  })

  existing ? updated++ : created++
  slugs.push(slug)
}

const db = getDb()
db.pragma('wal_checkpoint(TRUNCATE)')

console.log(JSON.stringify({ created, updated, total: slugs.length, slugs }, null, 2))
