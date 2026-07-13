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

function categoryCode(article) {
  const source = article.categorySlug || article.category || 'article'
  return source.toUpperCase().replace(/[^A-ZА-ЯЁ0-9]+/gi, '_').replace(/^_+|_+$/g, '')
}

function geometricField(seed, category) {
  const rnd = seeded(seed)
  const shapes = []
  const categoryHue = (seed % 5)
  const secondary = categoryHue === 0 ? CYAN : categoryHue === 1 ? '#f97316' : categoryHue === 2 ? '#f43f5e' : categoryHue === 3 ? '#22d3ee' : '#fb7185'

  for (let i = 0; i < 7; i++) {
    const x = 360 + rnd() * 480
    const y = 122 + rnd() * 330
    const r = 34 + rnd() * 134
    const opacity = 0.06 + rnd() * 0.12
    shapes.push(`<circle cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' r='${r.toFixed(1)}' fill='none' stroke='${i % 3 === 0 ? secondary : RED}' stroke-width='${i % 2 ? 2 : 1}' opacity='${opacity.toFixed(2)}'/>`)
  }

  const circuit = Array.from({ length: 6 }, (_, i) => {
    const x1 = 420 + rnd() * 340
    const y1 = 180 + rnd() * 240
    const x2 = x1 + (rnd() - 0.5) * 160
    const y2 = y1 + (rnd() - 0.5) * 110
    return `<path d='M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}' fill='none' stroke='${i % 2 ? RED : secondary}' stroke-width='2' opacity='.18'/>`
  }).join('')

  return `
    <g filter='url(#softGlow)'>
      ${shapes.join('')}
      ${circuit}
      <path d='M452 130H748L826 208V422L748 500H452L374 422V208Z' fill='rgba(239,68,68,.025)' stroke='rgba(239,68,68,.34)' stroke-width='2'/>
      <path d='M510 186H690L746 242V388L690 444H510L454 388V242Z' fill='rgba(0,0,0,.2)' stroke='${secondary}' stroke-width='2' opacity='.42'/>
      <text x='600' y='302' text-anchor='middle' font-family='Arial Black, Arial, sans-serif' font-size='118' font-weight='900' fill='rgba(255,255,255,.09)' letter-spacing='-5'>RG</text>
      <text x='600' y='338' text-anchor='middle' font-family='Share Tech Mono, Consolas, monospace' font-size='18' font-weight='700' fill='${RED}' letter-spacing='5'>${esc(category.slice(0, 22))}</text>
    </g>`
}

function renderCover(article, index) {
  const seed = hash(`${article.slug}:${article.categorySlug}`)
  const tag = `// ${categoryCode(article)}`
  const material = article.materialType || 'Статья'
  const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'RGUARD'

  return `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}'>
    <defs>
      <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${BG}'/>
        <stop offset='.56' stop-color='#10060a'/>
        <stop offset='1' stop-color='#040407'/>
      </linearGradient>
      <radialGradient id='pulse' cx='.50' cy='.45' r='.55'>
        <stop offset='0' stop-color='rgba(239,68,68,.24)'/>
        <stop offset='.42' stop-color='rgba(239,68,68,.06)'/>
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
        <stop offset='0' stop-color='rgba(10,10,20,.12)'/>
        <stop offset='.55' stop-color='rgba(10,10,20,.02)'/>
        <stop offset='1' stop-color='rgba(10,10,20,.12)'/>
      </linearGradient>
    </defs>

    <rect width='${W}' height='${H}' fill='url(#bg)'/>
    <rect width='${W}' height='${H}' fill='url(#pulse)'/>
    <rect width='${W}' height='${H}' fill='url(#grid)'/>
    <rect width='${W}' height='${H}' fill='url(#scan)'/>
    <rect x='0' y='0' width='${W}' height='${H}' fill='url(#fade)'/>

    <path d='M0 0H${W}V4H0Z' fill='${RED}' opacity='.78'/>
    <path d='M0 ${H - 4}H${W}V${H}H0Z' fill='${RED}' opacity='.28'/>
    <path d='M62 54H190V90H62Z' fill='rgba(10,10,20,.78)' stroke='rgba(239,68,68,.72)' stroke-width='2'/>
    <text x='80' y='78' font-family='Share Tech Mono, Consolas, monospace' font-size='19' font-weight='700' fill='${WHITE}' letter-spacing='3' filter='url(#redGlow)'>RGUARD</text>
    <text x='166' y='78' font-family='Share Tech Mono, Consolas, monospace' font-size='13' font-weight='700' fill='${RED}'>.RU</text>
    <text x='238' y='78' font-family='Share Tech Mono, Consolas, monospace' font-size='15' font-weight='700' fill='${RED}' letter-spacing='4'>${esc(tag)}</text>
    <text x='1130' y='78' text-anchor='end' font-family='Share Tech Mono, Consolas, monospace' font-size='15' font-weight='700' fill='${ZINC}' letter-spacing='4'>ARTICLE.${String(index + 1).padStart(2, '0')}</text>

    <path d='M74 128H148M74 128V202M74 502V428M74 502H148M1126 128H1052M1126 128V202M1126 502V428M1126 502H1052' stroke='${RED}' stroke-width='2' opacity='.62'/>
    <text x='600' y='146' text-anchor='middle' font-family='Share Tech Mono, Consolas, monospace' font-size='15' font-weight='700' fill='rgba(239,68,68,.92)' letter-spacing='6'>${esc(material.toUpperCase())}</text>
    <text x='600' y='484' text-anchor='middle' font-family='Share Tech Mono, Consolas, monospace' font-size='15' font-weight='700' fill='rgba(161,161,170,.85)' letter-spacing='4'>${esc(article.category || 'Статьи')} / ${esc(date)}</text>

    <g>
      <path d='M458 530H742L772 560L742 590H458L428 560Z' fill='rgba(10,10,20,.62)' stroke='rgba(239,68,68,.28)'/>
      <text x='600' y='568' text-anchor='middle' font-family='Share Tech Mono, Consolas, monospace' font-size='20' font-weight='700' fill='rgba(248,250,252,.78)' letter-spacing='7'>RGUARD JOURNAL</text>
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
