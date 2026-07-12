import fs from 'node:fs'
import path from 'node:path'
import ExcelJS from 'exceljs'

const source = process.argv[2]
const dataPath = path.join(process.cwd(), 'scripts', 'articles-data.json')
const managedPath = path.join(process.cwd(), 'scripts', 'articles-managed-slugs.json')

if (!source) {
  console.error('Usage: node scripts/build-articles-data.mjs <xlsx-or-csv-path>')
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
  const cleanPath = normalizePath(value)
  const parts = cleanPath.split('/').filter(Boolean)
  return parts.at(-1) || value.replace(/^\/+|\/+$/g, '')
}

function normalizePath(value, { trailingSlash = false } = {}) {
  const raw = text(value)
  if (!raw) return ''
  let pathname = raw
  try {
    pathname = new URL(raw, 'https://rguard.ru').pathname
  } catch {
    pathname = raw.split(/[?#]/)[0]
  }
  pathname = `/${pathname.replace(/^\/+|\/+$/g, '')}`
  if (pathname === '/') return '/'
  return trailingSlash ? `${pathname}/` : pathname
}

function categorySlugFromUrl(url) {
  const value = normalizePath(url)
  const parts = value.split('/').filter(Boolean)
  if (parts[0] === 'articles' && parts[1]) return parts[1]
  return parts.at(-1) || ''
}

function normalizeDate(value) {
  const raw = text(value)
  if (!raw) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return `${raw}T00:00:00.000Z`
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

function cell(row, headers, name) {
  const index = headers.indexOf(name)
  return index >= 0 ? row.getCell(index + 1).value : null
}

function parseCsv(textValue, delimiter = ';') {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < textValue.length; i++) {
    const char = textValue[i]
    const next = textValue[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === delimiter) {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (char !== '\r') {
      field += char
    }
  }

  row.push(field)
  if (row.some(value => value !== '')) rows.push(row)
  return rows
}

async function readRows(inputPath) {
  if (path.extname(inputPath).toLowerCase() === '.csv') {
    const rows = parseCsv(fs.readFileSync(inputPath, 'utf8'))
    const headers = rows.shift()?.map(text) || []
    return rows.map(values => {
      const record = {}
      headers.forEach((header, index) => {
        record[header] = text(values[index])
      })
      return record
    })
  }

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(inputPath)

  const worksheet = workbook.worksheets[0]
  const headers = worksheet.getRow(1).values.slice(1).map(text)
  const records = []

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
    const row = worksheet.getRow(rowNumber)
    const record = {}
    headers.forEach(header => {
      record[header] = text(cell(row, headers, header))
    })
    records.push(record)
  }

  return records
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

const records = await readRows(source)
const articles = []

for (const record of records) {
  const urlPath = normalizePath(record.URL)
  const categoryUrl = normalizePath(record['ЧПУ категории'], { trailingSlash: true })
  const slug = slugFromUrl(urlPath)
  const seoTitle = text(record.Title)
  const title = text(record.H1) || seoTitle
  const articleHtml = text(record['Статья'])

  if (!slug || !title || !articleHtml) continue

  const metaDescription = text(record.Meta)
  const { body, jsonLd } = extractJsonLd(articleHtml)
  articles.push({
    title,
    slug,
    category: text(record['Категория']),
    materialType: text(record['Тип материала']),
    categorySlug: categorySlugFromUrl(categoryUrl),
    categoryUrl,
    urlPath,
    publishedAt: normalizeDate(record['Дата публикации']),
    coverImage: '',
    excerpt: metaDescription,
    body,
    seo: {
      metaTitle: seoTitle || title,
      metaDescription,
      ...(jsonLd.length ? { jsonLd } : {}),
    },
    relatedPosts: [],
  })
}

const previousManaged = readJson(managedPath, [])
const previousArticles = readJson(dataPath, [])
const managedSlugs = Array.from(new Set([
  ...previousManaged,
  ...previousArticles.map(article => article.slug),
  ...articles.map(article => article.slug),
].filter(Boolean)))

fs.writeFileSync(dataPath, `${JSON.stringify(articles, null, 2)}\n`, 'utf8')
fs.writeFileSync(managedPath, `${JSON.stringify(managedSlugs, null, 2)}\n`, 'utf8')

console.log(JSON.stringify({
  articles: articles.length,
  managedSlugs: managedSlugs.length,
  dataPath,
  managedPath,
}, null, 2))
