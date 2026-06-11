import { getSession } from '@/lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const session = await getSession(req, res)
  session.destroy()
  return res.status(200).json({ ok: true })
}
