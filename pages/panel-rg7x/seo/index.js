import AdminShell from '@/components/admin/AdminShell'
import { ADMIN_PATH, requireAdmin } from '@/lib/auth'
import { adminListSeo } from '@/lib/db'

export default function SeoList({ pages }) {
  return (
    <AdminShell title="SEO страниц" back={{ href: ADMIN_PATH, label: 'Дашборд' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>SEO страниц сайта</h1>
        <a href={`${ADMIN_PATH}/seo/edit?path=__site__`} style={btn}>⚙ Глобальные настройки</a>
      </div>
      <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
        Title, описание, соцсети (OG/Twitter), canonical, индексация и JSON-LD каждой страницы.
        Пустые поля берут значения по умолчанию. После сохранения страница пересобирается автоматически.
      </p>

      <div style={{ border: '1px solid rgba(239,68,68,0.18)' }}>
        {pages.map((p, i) => (
          <a key={p.path} href={`${ADMIN_PATH}/seo/edit?path=${encodeURIComponent(p.path)}`}
            style={{ display: 'block', padding: '14px 18px', textDecoration: 'none', color: 'inherit',
              borderTop: i ? '1px solid rgba(148,163,184,0.12)' : 'none', background: 'rgba(10,10,20,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{p.label}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{p.path}</span>
                  {p.customized && <span style={tag('#22c55e')}>изменено</span>}
                  {p.noindex && <span style={tag('#f59e0b')}>noindex</span>}
                </div>
                <div style={{ color: '#cbd5e1', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                <div style={{ color: '#64748b', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description}</div>
              </div>
              <span style={{ color: '#fca5a5', fontSize: 13, whiteSpace: 'nowrap' }}>Редактировать →</span>
            </div>
          </a>
        ))}
      </div>
    </AdminShell>
  )
}

const btn = { border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: '10px 16px', textDecoration: 'none', fontSize: 14 }
const tag = (c) => ({ fontSize: 11, color: c, border: `1px solid ${c}55`, padding: '1px 6px', borderRadius: 3 })

export async function getServerSideProps(context) {
  const redirect = await requireAdmin(context)
  if (redirect) return redirect
  return { props: { pages: adminListSeo() } }
}
