// Импорт контента из Google-таблицы (.xlsx).
// Колонки ищутся ПО ЗАГОЛОВКАМ (строка 1), а не по позиции — устойчиво к
// добавлению/перестановке столбцов. Стратегия — МЁРДЖ по slug: существующие
// записи обновляются, новые создаются; поля, которых нет в таблице (картинки,
// фото, обложки, иконки), сохраняются.

import { adminGetBySlug, adminUpsert, adminList } from './db.js'
import { slugify } from './contentModel.js'

const SHEET_TYPE = {
  'КЕЙСЫ': 'cases',
  'ОТРАСЛЕВЫЕ РЕШЕНИЯ': 'industries',
  'СТАТЬИ': 'posts',
  'БЛОГЕРЫ': 'bloggers',
}

function cellText(cell) {
  const v = cell?.value
  if (v == null) return ''
  if (typeof v === 'string') return v.trim()
  if (typeof v === 'number') return String(v)
  if (v instanceof Date) return v.toISOString()
  if (typeof v === 'object') {
    if (v.text != null) return String(v.text).trim()
    if (Array.isArray(v.richText)) return v.richText.map(t => t.text).join('').trim()
    if (v.result != null) return String(v.result).trim()
  }
  return String(v).trim()
}

const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const paras = (...t) => t.filter(x => x && x.trim()).map(x => `<p>${esc(x)}</p>`).join('')
const splitComma = (s) => (s || '').split(',').map(x => x.trim()).filter(Boolean)
const yes = (s) => /^(да|yes|true|1|\+)$/i.test((s || '').trim())
function toIso(s) { if (!s) return ''; const d = new Date(s); return isNaN(d) ? s : d.toISOString() }

// Резолвер колонок по заголовку. norm() убирает переносы/лишние пробелы.
function makeResolver(ws) {
  const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim()
  const headers = []
  ws.getRow(1).eachCell((cell, col) => { headers.push({ col, text: norm(cellText(cell)) }) })
  const findCol = (re) => headers.find(h => re.test(h.text))?.col
  return (row) => (re, fallback = '') => {
    const col = findCol(re)
    return col ? cellText(row.getCell(col)) : fallback
  }
}

// ── Мапперы (g = функция доступа к ячейке текущей строки по regex заголовка) ──
function mapCase(g) {
  const title = g(/Название/)
  if (!title) return null
  const slug = g(/^(slug|url)/i) || slugify(title)
  const metrics = [1, 2, 3].map(n => ({
    value: g(new RegExp(`Метрика\\s*${n}.*(Значение|Число)`, 'i')),
    label: g(new RegExp(`Метрика\\s*${n}.*Подпись`, 'i')),
  })).filter(m => m.value || m.label)
  const links = [g(/Ссылка.*1/i), g(/Ссылка.*2/i)].filter(Boolean)
  return { slug, doc: {
    title, slug, service: g(/Категори/), accent: g(/Тег|Акцент/),
    shortText: g(/Краткое описание/), task: g(/Задача/), solution: g(/Решение/),
    metrics, links, whatWorked: splitComma(g(/Что сработало/)),
    featured: yes(g(/На главной/)), order: g(/Порядок/),
  } }
}

function mapIndustry(g) {
  const slug = g(/slug/i) || slugify(g(/Название/))
  const title = g(/Название/)
  if (!title && !slug) return null
  const linkedServices = [1, 2, 3].map(n => ({
    title: g(new RegExp(`Услуга\\s*${n}\\s*Назван`, 'i')),
    pageId: g(new RegExp(`Услуга\\s*${n}.*PageId`, 'i')),
    description: g(new RegExp(`Услуга\\s*${n}.*Описание`, 'i')),
  })).filter(s => s.title)
  return { slug, doc: {
    slug, title, shortDesc: g(/Краткое описание/),
    body: paras(g(/Абзац\s*1/i), g(/Абзац\s*2/i), g(/Абзац\s*3/i)),
    linkedServices,
    seo: { metaTitle: g(/SEO Title/i), metaDescription: g(/SEO Description/i) },
  } }
}

function mapPost(g) {
  const title = g(/Заголовок/)
  if (!title) return null
  const slug = g(/^(slug|url)/i) || slugify(title)
  let body = paras(g(/Абзац\s*1|Введение/i))
  for (const n of [1, 2, 3]) {
    const h = g(new RegExp(`H2 раздел ${n}.*Заголов`, 'i'))
    const t = g(new RegExp(`H2 раздел ${n}.*Текст`, 'i'))
    if (h) body += `<h2>${esc(h)}</h2>`
    if (t) body += `<p>${esc(t)}</p>`
  }
  const quote = g(/Цитата|blockquote/i)
  if (quote) body += `<blockquote><p>${esc(quote)}</p></blockquote>`
  const concl = g(/Заключение/)
  if (concl) body += paras(concl)
  return {
    slug, relatedSlugs: splitComma(g(/Похожие/)),
    doc: {
      title, slug, category: g(/Категори/), publishedAt: toIso(g(/Дата/)),
      excerpt: g(/Краткое|excerpt/i), body,
      seo: { metaTitle: g(/SEO Title/i), metaDescription: g(/SEO Description/i) },
    },
  }
}

function mapBlogger(g) {
  const name = g(/Имя/)
  if (!name) return null
  const slug = g(/slug/i) || slugify(name)
  const metrics = [1, 2, 3].map(n => ({
    value: g(new RegExp(`Метрика\\s*${n}\\s*(Значение|Число)`, 'i')),
    label: g(new RegExp(`Метрика\\s*${n}\\s*Подпись`, 'i')),
  })).filter(m => m.value || m.label)
  const socials = [['TikTok', /TikTok/i], ['YouTube', /YouTube/i], ['VK', /VK/i], ['Rutube', /Rutube/i]]
    .map(([label, re]) => ({ label, url: g(re) })).filter(s => s.url)
  return { slug, doc: {
    name, slug, desc: g(/Краткое описание/),
    bio: paras(g(/Био.*1/i), g(/Био.*2/i), g(/Био.*3/i)),
    metrics, socials, specializations: splitComma(g(/Специализаци/)), order: g(/Порядок/),
  } }
}

const MAPPERS = { cases: mapCase, industries: mapIndustry, posts: mapPost, bloggers: mapBlogger }

// Пустое значение из таблицы не должно затирать существующие данные при мёрдже.
function isEmpty(v) {
  if (v == null) return true
  if (typeof v === 'string') return v.trim() === ''
  if (Array.isArray(v)) return v.length === 0
  if (typeof v === 'object') return Object.values(v).every(isEmpty)
  return false // boolean / number — считаем заполненными
}
function pruneEmpty(doc) {
  const o = {}
  for (const [k, v] of Object.entries(doc)) if (!isEmpty(v)) o[k] = v
  return o
}

export function importWorkbook(workbook) {
  const summary = { byType: {}, warnings: [] }
  const postRelations = []

  for (const ws of workbook.worksheets) {
    const type = SHEET_TYPE[ws.name?.trim()]
    if (!type) continue
    const mapper = MAPPERS[type]
    const access = makeResolver(ws)
    let created = 0, updated = 0
    for (let r = 2; r <= ws.rowCount; r++) {
      const row = ws.getRow(r)
      const g = access(row)
      let mapped
      try { mapped = mapper(g) } catch (e) { summary.warnings.push(`${ws.name} стр.${r}: ${e.message}`); continue }
      if (!mapped) continue
      const { slug, doc } = mapped
      if (!slug) { summary.warnings.push(`${ws.name} стр.${r}: пустой slug, пропущено`); continue }
      const existing = adminGetBySlug(type, slug)
      // При обновлении накладываем только непустые поля — пустые ячейки не затирают контент
      const merged = existing ? { ...existing, ...pruneEmpty(doc), _id: existing._id } : doc
      adminUpsert(type, merged)
      existing ? updated++ : created++
      if (type === 'posts' && mapped.relatedSlugs?.length) postRelations.push({ slug, relatedSlugs: mapped.relatedSlugs })
    }
    summary.byType[type] = { created, updated }
  }

  if (postRelations.length) {
    const idBySlug = Object.fromEntries(adminList('posts').map(p => [p.slug, p._id]))
    for (const { slug, relatedSlugs } of postRelations) {
      const doc = adminGetBySlug('posts', slug)
      if (!doc) continue
      const ids = relatedSlugs.map(s => idBySlug[s]).filter(Boolean)
      adminUpsert('posts', { ...doc, relatedPosts: ids, _id: doc._id })
    }
  }

  return summary
}
