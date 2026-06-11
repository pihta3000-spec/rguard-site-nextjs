import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import Database from 'better-sqlite3'
import sanitizeHtml from 'sanitize-html'
import { MODELS } from './contentModel.js'

// ──────────────────────────────────────────────────────────────────────────
// Слой доступа к данным. Зеркалит API lib/sanity.js: те же функции,
// та же форма ответа — страницы сайта переключаются простой заменой импорта.
//
// Хранилище: SQLite (better-sqlite3). Массивы/объекты лежат в TEXT-колонках
// как JSON. Rich-text (body / bio) — HTML-строка. Картинки — строка-URL.
// ID полей совпадают со схемами Sanity, чтобы импорт Google-таблицы не ломался.
// ──────────────────────────────────────────────────────────────────────────

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'content.db')

// Синглтон через global — переживает HMR в dev и переиспользуется между вызовами.
function init() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  const schema = fs.readFileSync(path.join(process.cwd(), 'lib', 'schema.sql'), 'utf8')
  db.exec(schema)

  return db
}

export function getDb() {
  if (!globalThis.__rguardDb) globalThis.__rguardDb = init()
  return globalThis.__rguardDb
}

// ── helpers ────────────────────────────────────────────────────────────────
const J = (v, fallback) => {
  if (v == null) return fallback
  try { return JSON.parse(v) } catch { return fallback }
}

// Санитизация rich-text (body/bio). Сервер-сайд → не попадает в клиентский бандл.
const SANITIZE = {
  allowedTags: [
    'p', 'br', 'strong', 'em', 'u', 's', 'blockquote',
    'h2', 'h3', 'h4', 'ul', 'ol', 'li',
    'a', 'figure', 'figcaption', 'img', 'iframe', 'span', 'video', 'source',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'loading', 'width', 'height'],
    iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder'],
    video: ['src', 'controls', 'width', 'height', 'poster', 'preload'],
    source: ['src', 'type'],
    span: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: { img: ['http', 'https', 'data'], video: ['http', 'https'], source: ['http', 'https'] },
  // Локальные /uploads/... — относительные пути, оставляем как есть
  allowProtocolRelative: false,
}
const clean = (html) => (html ? sanitizeHtml(html, SANITIZE) : '')

// ── Статьи (post) ───────────────────────────────────────────────────────────
function mapPostSummary(row) {
  if (!row) return null
  return {
    _id: row._id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    publishedAt: row.publishedAt,
    excerpt: row.excerpt,
    coverImage: row.coverImage || null,
  }
}

function mapPost(db, row) {
  if (!row) return null
  const relIds = J(row.relatedPosts, [])
  const related = relIds
    .map(id => db.prepare('SELECT * FROM posts WHERE _id = ?').get(id))
    .filter(Boolean)
    .map(mapPostSummary)
  return {
    _id: row._id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    publishedAt: row.publishedAt,
    excerpt: row.excerpt,
    body: clean(row.body),
    seo: J(row.seo, null),
    coverImage: row.coverImage || null,
    relatedPosts: related,
  }
}

export async function getPosts() {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM posts ORDER BY publishedAt DESC').all()
  return rows.map(r => mapPost(db, r))
}

export async function getPost(slug) {
  const db = getDb()
  const row = db.prepare('SELECT * FROM posts WHERE slug = ?').get(slug)
  return mapPost(db, row)
}

// ── Кейсы (case) ────────────────────────────────────────────────────────────
function mapCase(row) {
  if (!row) return null
  return {
    _id: row._id,
    id: row.slug,                 // в sanity.js кейс отдаёт slug как `id`
    title: row.title,
    service: row.service,
    accent: row.accent,
    shortText: row.shortText,
    task: row.task,
    solution: row.solution,
    metrics: J(row.metrics, []),
    links: J(row.links, []),
    whatWorked: J(row.whatWorked, []),
    featured: !!row.featured,
  }
}

export async function getCases() {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM cases ORDER BY "order" ASC').all()
  return rows.map(mapCase)
}

// ── Отрасли (industry) ──────────────────────────────────────────────────────
function mapIndustry(row) {
  if (!row) return null
  return {
    _id: row._id,
    title: row.title,
    slug: row.slug,
    icon: row.icon,
    shortDesc: row.shortDesc,
    body: clean(row.body),
    linkedServices: J(row.linkedServices, []),
    seo: J(row.seo, null),
    coverImage: row.coverImage || null,
  }
}

export async function getIndustries() {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM industries ORDER BY "order" ASC').all()
  return rows.map(mapIndustry)
}

export async function getIndustry(slug) {
  const db = getDb()
  const row = db.prepare('SELECT * FROM industries WHERE slug = ?').get(slug)
  return mapIndustry(row)
}

// ── Блогеры (blogger) ───────────────────────────────────────────────────────
function mapBlogger(row) {
  if (!row) return null
  return {
    _id: row._id,
    name: row.name,
    slug: row.slug,
    desc: row.desc,
    bio: clean(row.bio),
    metrics: J(row.metrics, []),
    socials: J(row.socials, []),
    specializations: J(row.specializations, []),
    photos: J(row.photos, []),
    showreel: row.showreel || null,
  }
}

export async function getBloggers() {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM bloggers ORDER BY "order" ASC').all()
  return rows.map(mapBlogger)
}

export async function getBlogger(slug) {
  const db = getDb()
  const row = db.prepare('SELECT * FROM bloggers WHERE slug = ?').get(slug)
  return mapBlogger(row)
}

// ─────────────────────────────────────────────────────────────────────────────
// Админ-CRUD (generic, по модели contentModel.js). Тело rich-text НЕ санитизируем
// здесь — это делается на публичном чтении. Админ редактирует исходный HTML.
// ─────────────────────────────────────────────────────────────────────────────

function model(type) {
  const m = MODELS[type]
  if (!m) throw new Error(`Неизвестный тип: ${type}`)
  return m
}

// Сериализация значения поля в колонку
function toColumn(field, value) {
  if (field.json) return value == null ? null : JSON.stringify(value)
  if (field.kind === 'boolean') return value ? 1 : 0
  if (field.kind === 'number') return value === '' || value == null ? null : Number(value)
  return value == null || value === '' ? null : String(value)
}

// Десериализация колонки в значение поля (для форм)
function fromColumn(field, value) {
  if (field.json) return J(value, field.kind === 'objectList' || field.kind === 'tags' || field.kind === 'imageList' || field.kind === 'refList' ? [] : null)
  if (field.kind === 'boolean') return !!value
  if (field.kind === 'number') return value == null ? '' : value
  return value == null ? '' : value
}

export function adminList(type) {
  const m = model(type)
  const db = getDb()
  const rows = db.prepare(`SELECT * FROM ${m.table}`).all()
  // Сортировка: по "order" если есть поле, иначе по titleField
  const hasOrder = m.fields.some(f => f.name === 'order')
  const list = rows.map(r => ({
    _id: r._id,
    title: r[m.titleField],
    slug: r.slug,
    order: r.order ?? null,
    featured: 'featured' in r ? !!r.featured : null,
  }))
  list.sort((a, b) => hasOrder
    ? (a.order ?? 9999) - (b.order ?? 9999)
    : String(a.title).localeCompare(String(b.title), 'ru'))
  return list
}

export function adminGet(type, id) {
  const m = model(type)
  const db = getDb()
  const row = db.prepare(`SELECT * FROM ${m.table} WHERE _id = ?`).get(id)
  if (!row) return null
  const doc = { _id: row._id }
  for (const f of m.fields) doc[f.name] = fromColumn(f, row[f.name])
  return doc
}

export function adminUpsert(type, doc) {
  const m = model(type)
  const db = getDb()
  const _id = doc._id || `${type.replace(/s$/, '')}-${crypto.randomUUID()}`
  const cols = ['_id', ...m.fields.map(f => f.name)]
  const params = { _id }
  for (const f of m.fields) params[f.name] = toColumn(f, doc[f.name])
  const quoted = cols.map(c => `"${c}"`).join(',')
  const placeholders = cols.map(c => `@${c}`).join(',')
  db.prepare(`INSERT OR REPLACE INTO ${m.table} (${quoted}) VALUES (${placeholders})`).run(params)
  return _id
}

export function adminDelete(type, id) {
  const m = model(type)
  const db = getDb()
  const info = db.prepare(`DELETE FROM ${m.table} WHERE _id = ?`).run(id)
  return info.changes > 0
}

export function adminGetBySlug(type, slug) {
  const m = model(type)
  const db = getDb()
  const row = db.prepare(`SELECT _id FROM ${m.table} WHERE slug = ?`).get(slug)
  return row ? adminGet(type, row._id) : null
}

// Проверка уникальности slug (для валидации в форме)
export function slugTaken(type, slug, exceptId) {
  const m = model(type)
  const db = getDb()
  const row = db.prepare(`SELECT _id FROM ${m.table} WHERE slug = ?`).get(slug)
  return !!row && row._id !== exceptId
}
