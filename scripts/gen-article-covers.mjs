// Generates cyberpunk RGUARD covers for imported SEO articles.
// Usage:
//   node scripts/gen-article-covers.mjs
//   node scripts/gen-article-covers.mjs --only virusnyj-rolik-dlya-promyshlennosti --out public/article-covers/_preview.jpg --no-data
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const args = process.argv.slice(2)
const argValue = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : null
}

const ONLY = argValue('--only')
const OUT_FILE = argValue('--out')
const NO_DATA = args.includes('--no-data')
const W = 1200
const H = 630
const RED = '#ef4444'
const BG = '#0a0a14'
const WHITE = '#f8fafc'
const ZINC = '#a1a1aa'
const CYAN = '#00f0ff'
const MAGENTA = '#ff003c'
const OUT = path.join(process.cwd(), 'public', 'article-covers')
const DATA_PATH = path.join(process.cwd(), 'scripts', 'articles-data.json')

fs.mkdirSync(OUT, { recursive: true })
if (OUT_FILE) fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })

const articles = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))

const esc = (s) => String(s || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

function hash(str) {
  let h = 2166136261
  for (const ch of String(str)) {
    h ^= ch.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function seeded(seed) {
  let x = seed || 1
  return () => {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    return ((x >>> 0) % 10000) / 10000
  }
}

function wrap(text, fontSize, maxWidth, maxLines = 4) {
  const words = String(text || '').split(/\s+/).filter(Boolean)
  const charWidth = fontSize * 0.54
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

  if (lines.length <= maxLines) return lines
  const visible = lines.slice(0, maxLines)
  visible[maxLines - 1] = `${visible[maxLines - 1].replace(/[,.!?;:]+$/, '')}...`
  return visible
}

function titleLines(title) {
  for (const size of [52, 49, 46, 43, 40]) {
    const lines = wrap(title, size, 590, 5)
    if (lines.length <= 5 && (lines.length < 5 || lines[4].length <= 28)) return { size, lines }
  }
  return { size: 40, lines: wrap(title, 40, 590, 5) }
}

function categoryCode(article) {
  const source = article.categorySlug || article.category || 'article'
  return source.toUpperCase().replace(/[^A-ZА-ЯЁ0-9]+/gi, '_').replace(/^_+|_+$/g, '')
}

function geometricField(seed, category) {
  const rnd = seeded(seed)
  const shapes = []
  const categoryHue = (seed % 5)
  const secondary = categoryHue === 0 ? CYAN : categoryHue === 1 ? '#f97316' : categoryHue === 2 ? '#f43f5e' : categoryHue === 3 ? '#22d3ee' : '#fb7185'

  for (let i = 0; i < 11; i++) {
    const x = 770 + rnd() * 360
    const y = 95 + rnd() * 440
    const r = 18 + rnd() * 96
    const opacity = 0.08 + rnd() * 0.18
    shapes.push(`<circle cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' r='${r.toFixed(1)}' fill='none' stroke='${i % 3 === 0 ? secondary : RED}' stroke-width='${i % 2 ? 2 : 1}' opacity='${opacity.toFixed(2)}'/>`)
  }

  const circuit = Array.from({ length: 10 }, (_, i) => {
    const x1 = 790 + rnd() * 310
    const y1 = 125 + rnd() * 380
    const x2 = x1 + (rnd() - 0.5) * 180
    const y2 = y1 + (rnd() - 0.5) * 120
    return `<path d='M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}' fill='none' stroke='${i % 2 ? RED : secondary}' stroke-width='2' opacity='.18'/>`
  }).join('')

  return `
    <g filter='url(#softGlow)'>
      <path d='M790 130H1108V500H790Z' fill='rgba(10,10,20,.42)' stroke='rgba(239,68,68,.18)'/>
      ${shapes.join('')}
      ${circuit}
      <path d='M844 188H1058L1118 248V442L1058 502H844L784 442V248Z' fill='rgba(239,68,68,.03)' stroke='rgba(239,68,68,.38)' stroke-width='2'/>
      <path d='M892 236H1010L1054 280V410L1010 454H892L848 410V280Z' fill='rgba(0,0,0,.2)' stroke='${secondary}' stroke-width='2' opacity='.45'/>
      <text x='950' y='338' text-anchor='middle' font-family='Share Tech Mono, Consolas, monospace' font-size='20' font-weight='700' fill='${RED}' letter-spacing='4'>${esc(category.slice(0, 18))}</text>
      <text x='950' y='372' text-anchor='middle' font-family='Share Tech Mono, Consolas, monospace' font-size='72' font-weight='900' fill='rgba(239,68,68,.20)' letter-spacing='-2'>RG</text>
    </g>`
}

function renderCover(article, index) {
  const seed = hash(`${article.slug}:${article.categorySlug}`)
  const { size, lines } = titleLines(article.title)
  const tag = `// ${categoryCode(article)}`
  const material = article.materialType || 'Статья'
  const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'RGUARD'
  const titleSvg = lines.map((line, i) => {
    const y = 190 + i * (size * 1.02)
    const fill = i === 1 ? RED : WHITE
    const glow = i === 1 ? " filter='url(#redGlow)'" : ''
    return `
      <text x='76' y='${y}' font-family='Arial Black, Arial, sans-serif' font-size='${size}' font-weight='900' fill='${CYAN}' opacity='.35' transform='translate(4,-2)'>${esc(line)}</text>
      <text x='66' y='${y}' font-family='Arial Black, Arial, sans-serif' font-size='${size}' font-weight='900' fill='${MAGENTA}' opacity='.32' transform='translate(-3,2)'>${esc(line)}</text>
      <text x='70' y='${y}' font-family='Arial Black, Arial, sans-serif' font-size='${size}' font-weight='900' fill='${fill}'${glow}>${esc(line)}</text>`
  }).join('')

  return `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}'>
    <defs>
      <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${BG}'/>
        <stop offset='.52' stop-color='#12070d'/>
        <stop offset='1' stop-color='#040407'/>
      </linearGradient>
      <radialGradient id='pulse' cx='.78' cy='.45' r='.55'>
        <stop offset='0' stop-color='rgba(239,68,68,.38)'/>
        <stop offset='.42' stop-color='rgba(239,68,68,.08)'/>
        <stop offset='1' stop-color='rgba(239,68,68,0)'/>
      </radialGradient>
      <pattern id='grid' width='38' height='38' patternUnits='userSpaceOnUse'>
        <path d='M38 0H0V38' fill='none' stroke='rgba(239,68,68,.075)' stroke-width='1'/>
      </pattern>
      <pattern id='scan' width='5' height='5' patternUnits='userSpaceOnUse'>
        <path d='M0 4H5' stroke='rgba(0,0,0,.28)' stroke-width='1'/>
      </pattern>
      <filter id='redGlow'><feGaussianBlur stdDeviation='4' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>
      <filter id='softGlow'><feGaussianBlur stdDeviation='1.2' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>
      <linearGradient id='fade' x1='0' y1='0' x2='1' y2='0'>
        <stop offset='0' stop-color='rgba(10,10,20,.0)'/>
        <stop offset='.55' stop-color='rgba(10,10,20,.08)'/>
        <stop offset='1' stop-color='rgba(10,10,20,.76)'/>
      </linearGradient>
    </defs>

    <rect width='${W}' height='${H}' fill='url(#bg)'/>
    <rect width='${W}' height='${H}' fill='url(#pulse)'/>
    <rect width='${W}' height='${H}' fill='url(#grid)'/>
    <rect width='${W}' height='${H}' fill='url(#scan)'/>
    <rect x='0' y='0' width='${W}' height='${H}' fill='url(#fade)'/>

    <path d='M0 0H${W}V5H0Z' fill='${RED}' opacity='.84'/>
    <path d='M0 ${H - 5}H${W}V${H}H0Z' fill='${RED}' opacity='.36'/>
    <path d='M42 44H178V82H42Z' fill='rgba(10,10,20,.82)' stroke='${RED}' stroke-width='2'/>
    <text x='62' y='69' font-family='Share Tech Mono, Consolas, monospace' font-size='21' font-weight='700' fill='${WHITE}' letter-spacing='3' filter='url(#redGlow)'>RGUARD</text>
    <text x='156' y='69' font-family='Share Tech Mono, Consolas, monospace' font-size='14' font-weight='700' fill='${RED}'>.RU</text>
    <text x='218' y='68' font-family='Share Tech Mono, Consolas, monospace' font-size='18' font-weight='700' fill='${RED}' letter-spacing='4'>${esc(tag)}</text>
    <text x='1138' y='68' text-anchor='end' font-family='Share Tech Mono, Consolas, monospace' font-size='16' font-weight='700' fill='${ZINC}' letter-spacing='4'>ARTICLE.${String(index + 1).padStart(2, '0')}</text>

    <path d='M52 126H112M52 126V186M52 566H112M52 566V506M730 126H670M730 126V186M730 566H670M730 566V506' stroke='${RED}' stroke-width='2' opacity='.82'/>
    <path d='M70 150V520' stroke='${RED}' stroke-width='3' opacity='.84'/>
    <text x='96' y='142' font-family='Share Tech Mono, Consolas, monospace' font-size='17' font-weight='700' fill='${RED}' letter-spacing='4'>${esc(material.toUpperCase())}</text>
    ${titleSvg}

    <g>
      <path d='M88 524H642L678 560V594H88Z' fill='rgba(10,10,20,.68)' stroke='rgba(239,68,68,.36)'/>
      <path d='M88 524H270' stroke='${RED}' stroke-width='4'/>
      <text x='112' y='566' font-family='Share Tech Mono, Consolas, monospace' font-size='18' font-weight='700' fill='${ZINC}' letter-spacing='3'>${esc(article.category || 'Статьи')} / ${esc(date)}</text>
    </g>

    ${geometricField(seed, categoryCode(article))}
  </svg>`
}

async function generate(article, index) {
  const svg = renderCover(article, index)
  return sharp(Buffer.from(svg))
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer()
}

const selected = articles.filter(article => !ONLY || article.slug === ONLY)
if (ONLY && selected.length === 0) throw new Error(`Article not found: ${ONLY}`)

let ok = 0
for (const article of selected) {
  const index = articles.findIndex(item => item.slug === article.slug)
  const file = OUT_FILE || path.join(OUT, `${article.slug}.jpg`)
  const buffer = await generate(article, index)
  fs.writeFileSync(file, buffer)
  article.coverImage = `/article-covers/${article.slug}.jpg`
  if (article.seo) article.seo.ogImage = article.coverImage
  console.log(`✓ ${article.slug} -> ${file}`)
  ok++
}

if (!NO_DATA && !OUT_FILE) {
  fs.writeFileSync(DATA_PATH, `${JSON.stringify(articles, null, 2)}\n`, 'utf8')
}

console.log(`Done: ${ok}${NO_DATA || OUT_FILE ? ' (data untouched)' : ''}`)
