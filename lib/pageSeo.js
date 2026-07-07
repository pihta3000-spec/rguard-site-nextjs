// ─────────────────────────────────────────────────────────────────────────────
// SEO статических страниц: ДЕФОЛТЫ в коде (fallback) + список редактируемых
// страниц. Реальные значения = дефолт ⊕ override из таблицы page_seo (lib/db.js).
// Это гарантирует, что без БД-настроек SEO остаётся прежним (ничего не регрессит).
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_ORIGIN = 'https://rguard.ru'

// Глобальные дефолты (редактируются в админке как страница «__site__»)
export const SITE_DEFAULTS = {
  siteName: 'RGUARD',
  defaultDescription: 'Вирусные видеоролики, продюсирование и контент-стратегии для компаний реального сектора.',
  defaultOgImage: '/og-default.png',
  // Данные для разметки Organization (JSON-LD по всему сайту)
  orgName: 'RGUARD — Красная Гвардия',
  orgLegalName: 'ООО «Красная Гвардия»',
  orgUrl: SITE_ORIGIN,
  orgLogo: `${SITE_ORIGIN}/og-default.png`,
  orgPhone: '+7 927 341-22-52',
  orgSameAs: 'https://t.me/redguardmedia\nhttps://vk.ru/rguardrussia', // ссылки на соцсети, по одной в строке
}

// Полный список редактируемых страниц с дефолтными title/description/canonical.
// Порядок = порядок в админ-списке.
export const PAGE_DEFAULTS = {
  '/':              { label: 'Главная',                 title: 'RGUARD.RU — Вирусные ролики для промышленности', description: 'Вирусные видеоролики, продюсирование и контент-стратегии для компаний реального сектора. 2000+ роликов, 40+ млн просмотров.' },
  '/viral':         { label: 'Вирусные ролики',          title: 'Вирусные видеоролики для промышленности и B2B — RGUARD', description: 'Создаём вирусный контент для industrial-аудитории: производства, стройки, добыча, вахта. Ролики, которые пересылают в Telegram.' },
  '/corporate':     { label: 'Корпоративные фильмы',     title: 'Корпоративные фильмы для B2B и промышленности — RGUARD', description: 'Снимаем корпоративные фильмы с юмором и динамикой: HR-фильмы, техника безопасности, бренд-фильмы и обучающий контент для реального сектора.' },
  '/ai-content':    { label: 'ИИ-контент',               title: 'ИИ-контент и AI-видео для бизнеса — RGUARD', description: 'Создаём ИИ-ролики с сильной идеей: AI-рекламные видео, гибридный продакшн, визуализация концепций. Сначала идея — потом генерация.' },
  '/production':    { label: 'Продюсирование',           title: 'Продюсирование и SMM для бизнеса — RGUARD', description: 'Системный SMM и видеопродюсирование для B2B-компаний. Контент-стратегия, съёмка, публикации и аналитика под ключ.' },
  '/scripts':       { label: 'Сценарии',                 title: 'Написание сценариев для вирусных роликов — RGUARD', description: 'Разрабатываем вирусные сценарии для видеороликов: захват внимания, удержание, драматургия и призыв к действию. Раскадровка в комплекте.' },
  '/concepts':      { label: 'Концепции кампаний',       title: 'Концепции рекламных кампаний — RGUARD', description: 'Разрабатываем рекламные концепции, которые распространяются сами: HR-кампании, запуски продуктов, вирусные спецпроекты и PR-инфоповоды.' },
  '/events':        { label: 'Мероприятия',              title: 'Организация мероприятий в Уфе — RGUARD', description: 'Организуем корпоративы, городские праздники, фестивали и бренд-активации. От идеи до финала под ключ — с видеосъёмкой и контентом.' },
  '/contacts':      { label: 'Контакты',                 title: 'Контакты RGUARD — Красная Гвардия', description: 'Свяжитесь с нами: вирусный контент, продюсирование, HR-маркетинг и медийность бренда.' },
  '/cases':         { label: 'Кейсы (список)',           title: 'Кейсы RGUARD — вирусный контент для реального бизнеса', description: 'Реальные результаты: 40+ млн просмотров для Петроинжиниринг, корпоративные фильмы, SMM для B2B.' },
  '/articles':      { label: 'Статьи (список)',          title: 'Статьи о вирусном контенте и industrial-маркетинге — RGUARD', description: 'Экспертные статьи о вирусном контенте, B2B-маркетинге и продвижении в реальном секторе.' },
  '/industries':    { label: 'Отрасли (список)',         title: 'Отраслевые решения для вашего бизнеса — RGUARD', description: 'Готовые контент-стратегии под вашу отрасль. Добыча, строительство, производство, нефтегаз, агросектор, недвижимость.' },
  '/bloggers':      { label: 'Блогеры (список)',         title: 'Блогеры и лица проекта RGUARD', description: 'Каждый блогер — отдельный тип подачи и взаимодействия с industrial-аудиторией.' },
  '/privacy':       { label: 'Политика конфиденц.',      title: 'Политика конфиденциальности — RGUARD.RU', description: 'Политика конфиденциальности и обработки персональных данных RGUARD (ООО «Красная Гвардия»).', noindex: true },
  '/personal-data': { label: 'Обработка перс. данных',   title: 'Обработка персональных данных — RGUARD.RU', description: 'Согласие на обработку персональных данных и порядок их обработки в RGUARD.', noindex: true },
}

export const SEO_PATHS = Object.keys(PAGE_DEFAULTS)

const abs = (u) => (!u ? u : /^https?:\/\//.test(u) ? u : `${SITE_ORIGIN}${u.startsWith('/') ? '' : '/'}${u}`)
const pick = (...vals) => vals.find(v => v != null && v !== '')

// Строит Organization JSON-LD из глобальных настроек.
function organizationJsonLd(site) {
  const sameAs = String(site.orgSameAs || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.orgName,
    legalName: site.orgLegalName || undefined,
    url: site.orgUrl,
    logo: abs(site.orgLogo),
    telephone: site.orgPhone || undefined,
  }
  if (sameAs.length) org.sameAs = sameAs
  Object.keys(org).forEach(k => org[k] === undefined && delete org[k])
  return org
}

// Главная функция: дефолт ⊕ override(page) ⊕ глобальные настройки → готовый seo-объект
// для компонента <Seo>. override и siteOverride — объекты из page_seo (могут быть пустыми).
export function mergeSeo(path, override = {}, siteOverride = {}) {
  const def = PAGE_DEFAULTS[path] || {}
  const site = { ...SITE_DEFAULTS, ...clean(siteOverride) }
  const o = clean(override)

  const title = pick(o.title, def.title, SITE_DEFAULTS.siteName)
  const description = pick(o.description, def.description, site.defaultDescription)
  const canonical = pick(o.canonical, `${SITE_ORIGIN}${path === '/' ? '/' : path}`)
  const ogImage = abs(pick(o.ogImage, site.defaultOgImage))

  const noindex = o.noindex != null ? o.noindex : def.noindex
  const nofollow = o.nofollow != null ? o.nofollow : def.nofollow
  const robots = [(noindex ? 'noindex' : 'index'), (nofollow ? 'nofollow' : 'follow')].join(',')

  // JSON-LD: Organization (глобально) + произвольная разметка страницы/сайта (если задана валидным JSON)
  const jsonLd = [organizationJsonLd(site)]
  for (const raw of [site.jsonLd, o.jsonLd]) {
    if (!raw) continue
    try { const v = JSON.parse(raw); Array.isArray(v) ? jsonLd.push(...v) : jsonLd.push(v) } catch {}
  }

  return {
    title,
    description,
    keywords: pick(o.keywords) || null,
    canonical,
    robots,
    og: {
      title: pick(o.ogTitle, title),
      description: pick(o.ogDescription, description),
      image: ogImage,
      type: pick(o.ogType, path === '/' ? 'website' : 'website'),
      siteName: site.siteName,
    },
    twitter: {
      card: pick(o.twitterCard, 'summary_large_image'),
      title: pick(o.twitterTitle, o.ogTitle, title),
      description: pick(o.twitterDescription, o.ogDescription, description),
      image: abs(pick(o.twitterImage, o.ogImage, site.defaultOgImage)),
    },
    jsonLd,
  }
}

function clean(obj) {
  const o = {}
  for (const [k, v] of Object.entries(obj || {})) if (v != null && v !== '') o[k] = v
  return o
}

// Описание полей формы в админке (порядок и группировка)
export const SEO_FIELDS = [
  { group: 'Основное', fields: [
    { name: 'title', label: 'Title (заголовок вкладки)', kind: 'text', max: 60 },
    { name: 'description', label: 'Description (мета-описание)', kind: 'textarea', max: 160 },
    { name: 'keywords', label: 'Keywords (через запятую, опц.)', kind: 'text' },
  ]},
  { group: 'Соцсети (Open Graph)', fields: [
    { name: 'ogTitle', label: 'OG Title (по умолч. = Title)', kind: 'text' },
    { name: 'ogDescription', label: 'OG Description (по умолч. = Description)', kind: 'textarea' },
    { name: 'ogImage', label: 'OG Image (картинка превью, 1200×630)', kind: 'image' },
  ]},
  { group: 'Twitter / X', fields: [
    { name: 'twitterCard', label: 'Тип карточки', kind: 'select', options: ['summary_large_image', 'summary'] },
    { name: 'twitterImage', label: 'Twitter Image (по умолч. = OG Image)', kind: 'image' },
  ]},
  { group: 'Индексация', fields: [
    { name: 'canonical', label: 'Canonical URL (по умолч. — авто)', kind: 'text' },
    { name: 'noindex', label: 'Скрыть от поисковиков (noindex)', kind: 'boolean' },
    { name: 'nofollow', label: 'Не передавать вес ссылкам (nofollow)', kind: 'boolean' },
  ]},
  { group: 'Расширенное', fields: [
    { name: 'jsonLd', label: 'JSON-LD разметка страницы (валидный JSON, опц.)', kind: 'textarea' },
  ]},
]

// Поля глобальных настроек (страница «__site__»)
export const SITE_FIELDS = [
  { group: 'Сайт', fields: [
    { name: 'siteName', label: 'Название сайта', kind: 'text' },
    { name: 'defaultDescription', label: 'Описание по умолчанию', kind: 'textarea' },
    { name: 'defaultOgImage', label: 'OG-картинка по умолчанию', kind: 'image' },
  ]},
  { group: 'Организация (разметка Organization)', fields: [
    { name: 'orgName', label: 'Название организации', kind: 'text' },
    { name: 'orgLegalName', label: 'Юридическое название', kind: 'text' },
    { name: 'orgUrl', label: 'URL сайта', kind: 'text' },
    { name: 'orgLogo', label: 'Логотип (URL)', kind: 'image' },
    { name: 'orgPhone', label: 'Телефон', kind: 'text' },
    { name: 'orgSameAs', label: 'Соцсети (по одной ссылке в строке)', kind: 'textarea' },
  ]},
  { group: 'Расширенное', fields: [
    { name: 'jsonLd', label: 'Глобальный JSON-LD (валидный JSON, опц.)', kind: 'textarea' },
  ]},
]
