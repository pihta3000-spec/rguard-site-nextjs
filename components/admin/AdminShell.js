import Head from 'next/head'
import { useRouter } from 'next/router'
import { ADMIN_PATH, LOGIN_PATH } from '@/lib/auth'

export default function AdminShell({ title, children, back }) {
  const router = useRouter()
  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace(LOGIN_PATH)
  }
  return (
    <>
      <Head><title>{title ? `${title} — RGUARD Admin` : 'RGUARD Admin'}</title><meta name="robots" content="noindex,nofollow" /></Head>
      <div style={{ minHeight: '100vh', background: '#05050c', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(239,68,68,0.2)', position: 'sticky', top: 0, background: '#05050c', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href={ADMIN_PATH} style={{ fontFamily: 'monospace', color: '#ef4444', letterSpacing: 4, fontSize: 13, textTransform: 'uppercase', textDecoration: 'none' }}>// RGUARD ADMIN</a>
            {back && <a href={back.href} style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>← {back.label}</a>}
          </div>
          <button onClick={logout} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}>Выйти</button>
        </header>
        <main style={{ maxWidth: 860, margin: '0 auto', padding: 24 }}>{children}</main>
      </div>
    </>
  )
}
