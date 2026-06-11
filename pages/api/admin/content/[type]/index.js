import { assertAdminApi } from '@/lib/auth'
import { adminList, adminUpsert, slugTaken } from '@/lib/db'
import { MODELS } from '@/lib/contentModel'
import { revalidatePaths } from '@/lib/revalidate'

export default async function handler(req, res) {
  if (!(await assertAdminApi(req, res))) return
  const { type } = req.query
  if (!MODELS[type]) return res.status(404).json({ error: 'Неизвестный тип' })

  if (req.method === 'GET') {
    return res.status(200).json({ items: adminList(type) })
  }

  if (req.method === 'POST') {
    const doc = req.body || {}
    if (!doc.slug) return res.status(400).json({ error: 'Укажите slug' })
    if (slugTaken(type, doc.slug, doc._id)) return res.status(409).json({ error: 'Такой slug уже занят' })
    const id = adminUpsert(type, doc)
    await revalidatePaths(res, type, doc.slug)
    return res.status(200).json({ ok: true, _id: id })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
