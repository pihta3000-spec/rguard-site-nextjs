import Head from 'next/head'
import { useRouter } from 'next/router'
import { ADMIN_PATH, LOGIN_PATH, requireAdmin } from '@/lib/auth'
import { getDb } from '@/lib/db'

const TYPES = [
  { key: 'cases', label: 'Кейсы', href: `${ADMIN_PATH}/cases` },
  { key: 'posts', label: 'Статьи', href: `${ADMIN_PATH}/posts` },
  { key: 'industries', label: 'Отрасли', href: `${ADMIN_PATH}/industries` },
  { key: 'bloggers', label: 'Блогеры', href: `${ADMIN_PATH}/bloggers` },
]

export default function AdminDashboard({ counts }) {
  const router = useRouter()
  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace(LOGIN_PATH)
  }
  return (
    <>
      <Head><title>RGUARD Admin</title><meta name="robots" content="noindex,nofollow" /></Head>
      <div style={{ minHeight: '100vh', background: '#05050c', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', borderBottom: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ fontFamily: 'monospace', color: '#ef4444', letterSpacing: 4, fontSize: 13, textTransform: 'uppercase' }}>// RGUARD ADMIN</div>
          <button onClick={logout} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}>Выйти</button>
        </header>
        <main style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900 }}>Контент</h1>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href={`${ADMIN_PATH}/seo`} style={{ border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: '10px 18px', textDecoration: 'none', fontSize: 14 }}>★ SEO страниц</a>
              <a href={`${ADMIN_PATH}/import`} style={{ border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: '10px 18px', textDecoration: 'none', fontSize: 14 }}>↑ Импорт таблицы</a>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {TYPES.map(t => (
              <a key={t.key} href={t.href} style={card}>
                <div style={{ fontSize: 40, fontWeight: 900, color: '#ef4444' }}>{counts[t.key] ?? 0}</div>
                <div style={{ fontSize: 15, marginTop: 4 }}>{t.label}</div>
              </a>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}

const card = {
  display: 'block', padding: 24, textDecoration: 'none', color: 'inherit',
  border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)',
}

export async function getServerSideProps(context) {
  const redirect = await requireAdmin(context)
  if (redirect) return redirect
  const db = getDb()
  const count = (t) => db.prepare(`SELECT COUNT(*) n FROM ${t}`).get().n
  return { props: { counts: {
    cases: count('cases'), posts: count('posts'),
    industries: count('industries'), bloggers: count('bloggers'),
  } } }
}
