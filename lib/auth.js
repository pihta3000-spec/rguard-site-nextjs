import { getIronSession } from 'iron-session'

// Секретный путь админки. Меняется здесь (и в имени папки pages/panel-rg7x).
export const ADMIN_PATH = '/panel-rg7x'
export const LOGIN_PATH = `${ADMIN_PATH}/login`

export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'dev-only-insecure-secret-change-me-32+chars',
  cookieName: 'rg_admin',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, // 8 часов
    path: '/',
  },
}

export function getSession(req, res) {
  return getIronSession(req, res, sessionOptions)
}

// Защита getServerSideProps: вернёт redirect на логин, если не админ.
export async function requireAdmin({ req, res }) {
  const session = await getSession(req, res)
  if (!session.isAdmin) {
    return { redirect: { destination: LOGIN_PATH, permanent: false } }
  }
  return null
}

// Защита API-роутов: true если ок, иначе сам шлёт 401.
export async function assertAdminApi(req, res) {
  const session = await getSession(req, res)
  if (!session.isAdmin) {
    res.status(401).json({ error: 'Не авторизован' })
    return false
  }
  return true
}
