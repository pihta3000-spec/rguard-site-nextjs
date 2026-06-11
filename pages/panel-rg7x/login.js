import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { ADMIN_PATH, getSession } from '@/lib/auth'

export default function AdminLogin() {
  const router = useRouter()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setLoading(true)
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      })
      if (r.ok) { router.replace(ADMIN_PATH) }
      else { const d = await r.json().catch(() => ({})); setErr(d.error || 'Ошибка входа'); setLoading(false) }
    } catch { setErr('Ошибка сети'); setLoading(false) }
  }

  return (
    <>
      <Head><title>Вход — RGUARD Admin</title><meta name="robots" content="noindex,nofollow" /></Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05050c', padding: 16 }}>
        <form onSubmit={submit} style={{ width: '100%', maxWidth: 380, padding: 32, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(10,10,20,0.98)' }}>
          <div style={{ fontFamily: 'monospace', color: '#ef4444', letterSpacing: 4, fontSize: 12, textTransform: 'uppercase', marginBottom: 24 }}>// RGUARD ADMIN</div>
          <input
            value={login} onChange={e => setLogin(e.target.value)} placeholder="Логин" autoFocus autoComplete="username"
            style={inp} />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" autoComplete="current-password"
            style={inp} />
          {err && <p style={{ color: '#f87171', fontFamily: 'monospace', fontSize: 12, margin: '4px 0 12px' }}>{err}</p>}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? '...' : 'Войти'}
          </button>
        </form>
      </div>
    </>
  )
}

const inp = {
  width: '100%', padding: '14px 16px', marginBottom: 12, background: 'rgba(0,0,0,0.6)',
  border: '1px solid rgba(239,68,68,0.25)', color: '#fff', fontFamily: 'monospace', fontSize: 14, outline: 'none', boxSizing: 'border-box',
}

// Если уже залогинен — сразу в дашборд
export async function getServerSideProps({ req, res }) {
  const session = await getSession(req, res)
  if (session.isAdmin) return { redirect: { destination: ADMIN_PATH, permanent: false } }
  return { props: {} }
}
