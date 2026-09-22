import { assertAdminApi } from '@/lib/auth'
import { adminGet, adminUpsert, adminDelete, slugTaken } from '@/lib/db'
import { MODELS } from '@/lib/contentModel'
import { revalidatePaths } from '@/lib/revalidate'

export default async function handler(req, res) {
  if (!(await assertAdminApi(req, res))) return
  const { type, id } = req.query
  if (!MODELS[type]) return res.status(404).json({ error: 'Неизвестный тип' })

  if (req.method === 'GET') {
    const doc = adminGet(type, id)
    if (!doc) return res.status(404).json({ error: 'Не найдено' })
    return res.status(200).json({ doc })
  }

  if (req.method === 'PUT') {
    const existing = adminGet(type, id)
    if (!existing) return res.status(404).json({ error: 'Не найдено' })
    const doc = { ...existing, ...(req.body || {}), _id: id }
    if (!doc.slug) return res.status(400).json({ error: 'Укажите slug' })
    if (slugTaken(type, doc.slug, id)) return res.status(409).json({ error: 'Такой slug уже занят' })
    try { adminUpsert(type, doc) }
    catch (error) { return res.status(400).json({ error: error.message }) }
    if (existing.slug !== doc.slug) await revalidatePaths(res, type, existing.slug)
    await revalidatePaths(res, type, doc.slug)
    return res.status(200).json({ ok: true, _id: id })
  }

  if (req.method === 'DELETE') {
    const existing = adminGet(type, id)
    let ok
    try { ok = adminDelete(type, id) }
    catch (error) { return res.status(409).json({ error: error.message }) }
    if (existing) await revalidatePaths(res, type, existing.slug)
    return res.status(200).json({ ok })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
