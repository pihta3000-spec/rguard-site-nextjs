import { assertAdminApi } from '@/lib/auth'
import { adminGetSeo, adminSaveSeo, adminListSeo } from '@/lib/db'
import { SEO_PATHS } from '@/lib/pageSeo'

const SITE_KEY = '__site__'
const VALID = new Set([...SEO_PATHS, SITE_KEY])

export default async function handler(req, res) {
  if (!(await assertAdminApi(req, res))) return

  if (req.method === 'GET') {
    const { path } = req.query
    if (path) {
      if (!VALID.has(path)) return res.status(404).json({ error: 'Неизвестная страница' })
      return res.status(200).json({ override: adminGetSeo(path) })
    }
    return res.status(200).json({ pages: adminListSeo() })
  }

  if (req.method === 'POST') {
    const { path, doc } = req.body || {}
    if (!VALID.has(path)) return res.status(400).json({ error: 'Неизвестная страница' })
    adminSaveSeo(path, doc || {})

    // Пересобрать затронутые страницы. Глобальные настройки влияют на все.
    const targets = path === SITE_KEY ? SEO_PATHS : [path]
    await Promise.all(targets.map(p => res.revalidate(p).catch(() => {})))

    return res.status(200).json({ ok: true })
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
