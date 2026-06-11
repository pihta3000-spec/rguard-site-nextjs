import bcrypt from 'bcryptjs'
import { getSession } from '@/lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { login, password } = req.body || {}
  if (!login || !password) return res.status(400).json({ error: 'Укажите логин и пароль' })

  const okLogin = login === process.env.ADMIN_LOGIN
  const hash = process.env.ADMIN_PASSWORD_HASH || ''
  // bcrypt.compare всегда выполняется (постоянное время), даже если логин неверный
  const okPass = hash ? await bcrypt.compare(password, hash) : false

  if (!okLogin || !okPass) {
    return res.status(401).json({ error: 'Неверный логин или пароль' })
  }

  const session = await getSession(req, res)
  session.isAdmin = true
  session.login = login
  await session.save()
  return res.status(200).json({ ok: true })
}
