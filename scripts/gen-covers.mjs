// Generates cyberpunk RGUARD case covers.
// Usage:
//   node scripts/gen-covers.mjs
//   node scripts/gen-covers.mjs --only alabuga --out public/cases-covers/_template-alabuga.webp --no-db
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { getCases, adminGetBySlug, adminUpsert } from '../lib/db.js'

const args = process.argv.slice(2)
const argValue = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : null
}

const NO_DB = args.includes('--no-db')
const ONLY = argValue('--only')
const OUT_FILE = argValue('--out')
const W = 1280
const H = 720
const RED = '#ef4444'
const BG = '#0a0a14'
const CYAN = '#00f0ff'
const MAGENTA = '#ff003c'
const OUT = 'public/cases-covers'
const CACHE = process.env.THUMB_CACHE || 'D:/Temp/yt'
const FRAMES = [
  process.env.CASE_FRAMES_DIR || path.join(process.cwd(), 'public', 'cases-video-frames'),
  process.env.FRAMES_DIR || 'D:/скрин',
]

fs.mkdirSync(OUT, { recursive: true })
if (OUT_FILE) fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })

const esc = (s) => String(s || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const ytId = (u) => {
  const m = String(u).match(/(?:shorts\/|youtu\.be\/|v=)([A-Za-z0-9_-]{6,})/)
  return m ? m[1] : null
}

async function fetchThumb(id) {
  const local = path.join(CACHE, `${id}.jpg`)
  if (fs.existsSync(local) && fs.statSync(local).size > 3000) return fs.readFileSync(local)

  for (const q of ['maxresdefault', 'hqdefault']) {
    try {
      const r = await fetch(`https://img.youtube.com/vi/${id}/${q}.jpg`)
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer())
        if (buf.length > 3000) return buf
      }
    } catch {}
  }
  return null
}

function wrap(text, fontSize, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean)
  const charWidth = fontSize * 0.56
  const lines = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length * charWidth > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

async function textWidth(str, fontSize, weight = 700, letterSpacing = 0) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='3000' height='${Math.ceil(fontSize * 1.7)}'><text x='2' y='${fontSize}' font-family='Share Tech Mono, Consolas, Arial' font-size='${fontSize}' font-weight='${weight}' letter-spacing='${letterSpacing}' fill='#fff'>${esc(str)}</text></svg>`
  try {
    const { info } = await sharp(Buffer.from(svg)).trim().toBuffer({ resolveWithObject: true })
    return info.width
  } catch {
    return String(str).length * fontSize * 0.6
  }
}

function localFrame(slug) {
  for (const dir of FRAMES) {
    for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
      const file = path.join(dir, `${slug}.${ext}`)
      if (fs.existsSync(file) && fs.statSync(file).size > 3000) return file
    }
  }
  return null
}

async function makeCyberBase(buf, source) {
  if (!buf) {
    const fallback = `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}'>
      <defs>
        <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='${BG}'/>
          <stop offset='.58' stop-color='#12070a'/>
          <stop offset='1' stop-color='#050508'/>
        </linearGradient>
      </defs>
      <rect width='${W}' height='${H}' fill='url(#bg)'/>
    </svg>`
    return sharp(Buffer.from(fallback)).png().toBuffer()
  }

  const bg = await sharp(buf)
    .resize(W, H, { fit: 'cover' })
    .blur(30)
    .modulate({ brightness: 0.38, saturation: 0.82 })
    .toBuffer()

  const frame = await sharp(buf)
    .resize(Math.round(W * 0.44), Math.round(H * 0.86), { fit: 'inside' })
    .modulate({ brightness: 0.82, saturation: 0.92 })
    .toBuffer()

  const frameMeta = await sharp(frame).metadata()
  const frameW = frameMeta.width || 430
  const frameH = frameMeta.height || 640
  const left = W - frameW - 82
  const top = Math.round((H - frameH) / 2)

  const frameHud = Buffer.from(`<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}'>
    <rect width='${W}' height='${H}' fill='rgba(10,10,20,.38)'/>
    <path d='M0 0H${W}V${H}H0Z' fill='none'/>
    <g opacity='.92'>
      <path d='M${left - 18} ${top - 18} H${left + 92} M${left - 18} ${top - 18} V${top + 92}' stroke='${RED}' stroke-width='2'/>
      <path d='M${left + frameW + 18} ${top + frameH + 18} H${left + frameW - 92} M${left + frameW + 18} ${top + frameH + 18} V${top + frameH - 92}' stroke='${RED}' stroke-width='2'/>
      <path d='M${left - 18} ${top + frameH + 18} H${left + 64} M${left - 18} ${top + frameH + 18} V${top + frameH - 64}' stroke='rgba(239,68,68,.42)' stroke-width='1'/>
      <path d='M${left + frameW + 18} ${top - 18} H${left + frameW - 64} M${left + frameW + 18} ${top - 18} V${top + 64}' stroke='rgba(239,68,68,.42)' stroke-width='1'/>
    </g>
    <rect x='${left - 28}' y='${top - 28}' width='${frameW + 56}' height='${frameH + 56}' fill='none' stroke='rgba(239,68,68,.15)'/>
    <text x='${left}' y='${top + frameH + 52}' font-family='Share Tech Mono, Consolas, Arial' font-size='16' fill='rgba(239,68,68,.7)' letter-spacing='3'>SOURCE.${source.toUpperCase()}</text>
  </svg>`)

  return sharp(bg)
    .composite([
      { input: frame, left, top },
      { input: frameHud },
    ])
    .png()
    .toBuffer()
}

async function overlay({ title, accent, service, metric, slug }) {
  const tag = `// ${(accent || service || 'CASE').toUpperCase()}`
  const tagW = Math.round(await textWidth(tag, 22, 700, 2)) + 42
  const titleLines = wrap(title, 62, 650).slice(0, 3)
  const titleSvg = titleLines.map((line, i) => {
    const y = 178 + i * 70
    return `
      <text x='70' y='${y}' font-family='Plus Jakarta Sans, Arial Black, Arial' font-size='62' font-weight='900' fill='${CYAN}' opacity='.55'>${esc(line)}</text>
      <text x='62' y='${y}' font-family='Plus Jakarta Sans, Arial Black, Arial' font-size='62' font-weight='900' fill='${MAGENTA}' opacity='.42'>${esc(line)}</text>
      <text x='66' y='${y}' font-family='Plus Jakarta Sans, Arial Black, Arial' font-size='62' font-weight='900' fill='#fff'>${esc(line)}</text>`
  }).join('')

  const metricValue = metric?.value || ''
  const metricLabel = (metric?.label || '').toUpperCase()
  const metricSize = metricValue.length > 12 ? 76 : metricValue.length > 8 ? 92 : 112

  return `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}'>
    <defs>
      <pattern id='grid' width='34' height='34' patternUnits='userSpaceOnUse'>
        <path d='M34 0H0V34' fill='none' stroke='rgba(239,68,68,.075)' stroke-width='1'/>
      </pattern>
      <pattern id='scan' width='4' height='4' patternUnits='userSpaceOnUse'>
        <path d='M0 3H4' stroke='rgba(0,0,0,.22)' stroke-width='1'/>
      </pattern>
      <filter id='redGlow'><feGaussianBlur stdDeviation='5' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>
      <linearGradient id='bottom' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' stop-color='${BG}' stop-opacity='0'/>
        <stop offset='.66' stop-color='${BG}' stop-opacity='.52'/>
        <stop offset='1' stop-color='${BG}' stop-opacity='.94'/>
      </linearGradient>
    </defs>

    <rect width='${W}' height='${H}' fill='url(#grid)'/>
    <rect width='${W}' height='${H}' fill='url(#bottom)'/>
    <rect width='${W}' height='${H}' fill='url(#scan)'/>

    <path d='M0 0H${W}V6H0Z' fill='${RED}' opacity='.92'/>
    <path d='M0 ${H - 6}H${W}V${H}H0Z' fill='${RED}' opacity='.45'/>
    <path d='M38 42H174V78H38Z' fill='rgba(10,10,20,.84)' stroke='${RED}' stroke-width='2'/>
    <text x='58' y='66' font-family='Share Tech Mono, Consolas, Arial' font-size='20' font-weight='700' fill='${RED}' letter-spacing='4'>RGUARD</text>
    <rect x='205' y='42' width='${tagW}' height='36' fill='rgba(10,10,20,.74)' stroke='rgba(239,68,68,.42)'/>
    <text x='226' y='66' font-family='Share Tech Mono, Consolas, Arial' font-size='22' font-weight='700' fill='${RED}' letter-spacing='2'>${esc(tag)}</text>
    <text x='${W - 48}' y='66' text-anchor='end' font-family='Share Tech Mono, Consolas, Arial' font-size='20' font-weight='700' fill='rgba(255,255,255,.82)' letter-spacing='5'>CASES.RGUARD.RU</text>

    <path d='M46 116H96M46 116V166M46 650H96M46 650V600M770 116H720M770 116V166M770 650H720M770 650V600' stroke='${RED}' stroke-width='2' opacity='.88'/>
    ${titleSvg}

    <g filter='url(#redGlow)'>
      <path d='M58 400H746L782 436V586H58Z' fill='rgba(10,10,20,.88)' stroke='rgba(239,68,68,.55)' stroke-width='2'/>
      <path d='M58 400H260' stroke='${RED}' stroke-width='5'/>
      <path d='M707 400H746L782 436' stroke='${RED}' stroke-width='3'/>
    </g>
    <text x='88' y='506' font-family='Share Tech Mono, Consolas, Arial' font-size='${metricSize}' font-weight='900' fill='${RED}' filter='url(#redGlow)'>${esc(metricValue)}</text>
    <text x='92' y='552' font-family='Share Tech Mono, Consolas, Arial' font-size='30' font-weight='700' fill='#d4d4d8' letter-spacing='5'>${esc(metricLabel)}</text>
    <text x='92' y='624' font-family='Share Tech Mono, Consolas, Arial' font-size='16' fill='rgba(113,113,122,.95)' letter-spacing='3'>ID:${esc(slug.toUpperCase())} / STATUS: VERIFIED</text>
  </svg>`
}

async function coverForCase(c) {
  let source = 'generated'
  let buf = null
  const frame = localFrame(c.id)

  if (frame) {
    source = 'frame'
    buf = fs.readFileSync(frame)
  } else {
    const link = (c.links || []).find(l => /youtube|youtu\.be/i.test(l))
    const id = link && ytId(link)
    buf = id ? await fetchThumb(id) : null
    if (buf) source = 'youtube'
  }

  const base = await makeCyberBase(buf, source)
  const svg = await overlay({
    title: c.title,
    accent: c.accent,
    service: c.service,
    metric: (c.metrics || [])[0],
    slug: c.id,
  })
  return sharp(base).composite([{ input: Buffer.from(svg) }]).webp({ quality: 86 }).toBuffer()
}

const cases = (await getCases()).filter(c => !ONLY || c.id === ONLY)
if (ONLY && cases.length === 0) throw new Error(`Case not found: ${ONLY}`)

let ok = 0
for (const c of cases) {
  const out = OUT_FILE || path.join(OUT, `${c.id}.webp`)
  const buf = await coverForCase(c)
  fs.writeFileSync(out, buf)

  if (!NO_DB && !OUT_FILE) {
    const doc = adminGetBySlug('cases', c.id)
    if (doc) adminUpsert('cases', { ...doc, coverImage: `/cases-covers/${c.id}.webp`, _id: doc._id })
  }
  console.log(`✓ ${c.id} -> ${out}`)
  ok++
}

console.log(`Done: ${ok}${NO_DB || OUT_FILE ? ' (DB untouched)' : ''}`)
