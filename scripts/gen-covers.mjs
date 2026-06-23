// Генератор графических обложек кейсов (шаблон A — нижний градиент).
// Берёт кадр из YouTube-ролика как подложку, накладывает заголовок/метрику/тег/лого.
// Сохраняет 1280x720 webp в public/cases-covers/<slug>.webp и проставляет coverImage в БД.
// Запуск: node scripts/gen-covers.mjs [--no-db]
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { getCases, adminGetBySlug, adminUpsert } from '../lib/db.js'

const NO_DB = process.argv.includes('--no-db')
const W = 1280, H = 720, RED = '#ef4444'
const OUT = 'public/cases-covers'
fs.mkdirSync(OUT, { recursive: true })

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const ytId = (u) => { const m = String(u).match(/(?:shorts\/|youtu\.be\/|v=)([A-Za-z0-9_-]{6,})/); return m ? m[1] : null }

const CACHE = process.env.THUMB_CACHE || 'D:/Temp/yt'
async function fetchThumb(id) {
  // 1) локальный кэш (кадры, скачанные через curl — fetch в среде заблокирован)
  const local = path.join(CACHE, `${id}.jpg`)
  if (fs.existsSync(local) && fs.statSync(local).size > 3000) return fs.readFileSync(local)
  // 2) попытка сети (если доступна)
  for (const q of ['maxresdefault', 'hqdefault']) {
    try {
      const r = await fetch(`https://img.youtube.com/vi/${id}/${q}.jpg`)
      if (r.ok) { const buf = Buffer.from(await r.arrayBuffer()); if (buf.length > 3000) return buf }
    } catch {}
  }
  return null
}

// Перенос заголовка по словам под заданный размер шрифта (грубая оценка ширины)
function wrap(title, fs, maxW) {
  const words = title.split(/\s+/)
  const cw = fs * 0.6
  const lines = []; let cur = ''
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w
    if (t.length * cw > maxW && cur) { lines.push(cur); cur = w } else cur = t
  }
  if (cur) lines.push(cur)
  return lines
}

// Точная ширина текста: рендерим строку и обрезаем прозрачные поля
async function textWidth(str, fs, weight = 700, ls = 0) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='3000' height='${Math.ceil(fs * 1.6)}'><text x='2' y='${fs}' font-family='Arial' font-size='${fs}' font-weight='${weight}' letter-spacing='${ls}' fill='#fff'>${esc(str)}</text></svg>`
  try {
    const { info } = await sharp(Buffer.from(svg)).trim().toBuffer({ resolveWithObject: true })
    return info.width
  } catch { return str.length * fs * 0.6 }
}

async function templateA({ title, accent, service, metric }) {
  const tag = (accent || service || '').toUpperCase()
  const tagText = `// ${tag}`
  const TAG_FS = 20, TAG_LS = 2, TAG_PAD = 18
  const tagW = Math.round(await textWidth(tagText, TAG_FS, 700, TAG_LS)) + TAG_PAD * 2
  // Заголовок в обложку НЕ вшиваем — он есть под карточкой и на детальной странице.
  // Хук обложки — крупная метрика внизу слева.
  const metricSvg = metric && (metric.value || metric.label)
    ? `<text x='54' y='${H - 100}' font-family='Arial' font-size='118' font-weight='900' fill='${RED}'>${esc(metric.value || '')}</text>
   <text x='58' y='${H - 52}' font-family='Arial' font-size='34' font-weight='700' fill='#fff' letter-spacing='3'>${esc((metric.label || '').toUpperCase())}</text>`
    : ''
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}'>
   <defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>
    <stop offset='0' stop-color='#05050c' stop-opacity='0'/><stop offset='0.5' stop-color='#05050c' stop-opacity='0.45'/><stop offset='1' stop-color='#05050c' stop-opacity='0.92'/></linearGradient></defs>
   <rect width='${W}' height='${H}' fill='url(#g)'/>
   <rect width='${W}' height='6' fill='${RED}'/>
   <rect x='52' y='48' width='${tagW}' height='44' fill='none' stroke='${RED}' stroke-width='2'/>
   <text x='${52 + TAG_PAD}' y='76' font-family='Arial' font-size='${TAG_FS}' font-weight='700' fill='${RED}' letter-spacing='${TAG_LS}'>${esc(tagText)}</text>
   <text x='${W - 52}' y='80' text-anchor='end' font-family='Arial' font-size='26' font-weight='900' fill='${RED}'>RGUARD.RU</text>
   ${metricSvg}
  </svg>`
}

// Локальный кадр по slug (приоритетнее YouTube): D:/скрин/<slug>.(jpg|jpeg|png|webp)
const FRAMES = process.env.FRAMES_DIR || 'D:/скрин'
function localFrame(slug) {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const p = path.join(FRAMES, `${slug}.${ext}`)
    if (fs.existsSync(p) && fs.statSync(p).size > 3000) return p
  }
  return null
}

const cases = await getCases()
let ok = 0, skip = 0
for (const c of cases) {
  // База обложки: сперва локальный кадр, иначе кадр YouTube
  let buf = null
  const lf = localFrame(c.id)
  if (lf) buf = fs.readFileSync(lf)
  else {
    const link = (c.links || []).find(l => /youtube|youtu\.be/i.test(l))
    const id = link && ytId(link)
    buf = id ? await fetchThumb(id) : null
  }
  if (!buf) { skip++; continue } // нет кадра — остаётся фирменная заглушка

  const base = await sharp(buf).resize(W, H, { fit: 'cover' }).toBuffer()
  const svg = await templateA({ title: c.title, accent: c.accent, service: c.service, metric: (c.metrics || [])[0] })
  const file = path.join(OUT, `${c.id}.webp`)
  await sharp(base).composite([{ input: Buffer.from(svg) }]).webp({ quality: 84 }).toFile(file)
  if (!NO_DB) {
    const doc = adminGetBySlug('cases', c.id)
    if (doc) adminUpsert('cases', { ...doc, coverImage: `/cases-covers/${c.id}.webp`, _id: doc._id })
  }
  console.log('✓', c.id, lf ? '(кадр)' : '(youtube)')
  ok++
}
console.log(`Готово: ${ok}, без кадра (заглушка): ${skip}${NO_DB ? ' (БД не трогали)' : ''}`)
