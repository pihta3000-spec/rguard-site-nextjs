import { getCases, getPosts, getIndustries, getBloggers } from '@/lib/db'
import { PAGE_DEFAULTS, SITE_ORIGIN } from '@/lib/pageSeo'

const loc = (p) => `${SITE_ORIGIN}${p === '/' ? '/' : p}`

export async function getServerSideProps({ res }) {
  // Статические страницы (кроме noindex — privacy/personal-data)
  const staticPaths = Object.entries(PAGE_DEFAULTS).filter(([, d]) => !d.noindex).map(([p]) => p)

  const [cases, posts, industries, bloggers] = await Promise.all([
    getCases(), getPosts(), getIndustries(), getBloggers(),
  ])

  const urls = [
    ...staticPaths,
    ...(cases || []).map(c => `/cases/${c.id}`),
    ...Array.from(new Set((posts || []).map(p => p.categoryUrl).filter(Boolean))),
    ...(posts || []).map(p => p.urlPath || `/articles/${p.slug}`),
    ...(industries || []).map(i => `/industries/${i.slug}`),
    ...(bloggers || []).map(b => `/bloggers/${b.slug}`),
  ].filter(Boolean)

  const body = urls.map(u => `  <url><loc>${loc(u)}</loc></url>`).join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate')
  res.write(xml)
  res.end()
  return { props: {} }
}

export default function Sitemap() { return null }
