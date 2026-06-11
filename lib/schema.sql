-- Схема контента RGUARD. Единый источник для lib/db.js и scripts/migrate-from-sanity.mjs.
-- Имена полей совпадают со схемами Sanity, чтобы импорт Google-таблицы не ломался.
-- Массивы/объекты — JSON в TEXT. Rich-text (body/bio) — HTML. Картинки — строка-URL.

CREATE TABLE IF NOT EXISTS cases (
  _id        TEXT PRIMARY KEY,
  title      TEXT,
  slug       TEXT UNIQUE,
  service    TEXT,
  accent     TEXT,
  shortText  TEXT,
  task       TEXT,
  solution   TEXT,
  metrics    TEXT,            -- JSON [{value,label}]
  links      TEXT,            -- JSON [url]
  whatWorked TEXT,            -- JSON [string]
  featured   INTEGER DEFAULT 0,
  "order"    INTEGER
);

CREATE TABLE IF NOT EXISTS posts (
  _id          TEXT PRIMARY KEY,
  title        TEXT,
  slug         TEXT UNIQUE,
  category     TEXT,
  publishedAt  TEXT,
  coverImage   TEXT,          -- URL
  excerpt      TEXT,
  body         TEXT,          -- HTML
  seo          TEXT,          -- JSON {metaTitle,metaDescription,ogImage}
  relatedPosts TEXT           -- JSON [_id]
);

CREATE TABLE IF NOT EXISTS industries (
  _id            TEXT PRIMARY KEY,
  title          TEXT,
  slug           TEXT UNIQUE,
  icon           TEXT,
  coverImage     TEXT,        -- URL
  shortDesc      TEXT,
  body           TEXT,        -- HTML
  linkedServices TEXT,        -- JSON [{title,pageId,description}]
  seo            TEXT,        -- JSON {metaTitle,metaDescription,ogImage}
  "order"        INTEGER
);

CREATE TABLE IF NOT EXISTS bloggers (
  _id             TEXT PRIMARY KEY,
  name            TEXT,
  slug            TEXT UNIQUE,
  "desc"          TEXT,
  bio             TEXT,        -- HTML
  photos          TEXT,        -- JSON [url]
  showreel        TEXT,        -- URL
  metrics         TEXT,        -- JSON [{value,label}]
  socials         TEXT,        -- JSON [{label,url}]
  specializations TEXT,        -- JSON [string]
  "order"         INTEGER
);
