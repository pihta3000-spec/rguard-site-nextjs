import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '@/components/admin/AdminShell'
import { ADMIN_PATH, requireAdmin } from '@/lib/auth'
import { adminList } from '@/lib/db'
import { MODELS } from '@/lib/contentModel'

export default function ListPage({ type, items, labelPlural, labelSingular }) {
  const router = useRouter()
  const [list, setList] = useState(items)

  const remove = async (id, title) => {
    if (!window.confirm(`Удалить «${title || id}»? Действие необратимо.`)) return
    const r = await fetch(`/api/admin/content/${type}/${id}`, { method: 'DELETE' })
    if (r.ok) setList(list.filter(x => x._id !== id))
    else alert('Не удалось удалить')
  }

  return (
    <AdminShell title={labelPlural} back={{ href: ADMIN_PATH, label: 'Дашборд' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>{labelPlural} <span style={{ color: '#64748b', fontWeight: 400 }}>({list.length})</span></h1>
        <a href={`${ADMIN_PATH}/${type}/new`} style={{ background: '#ef4444', color: '#fff', padding: '10px 18px', textDecoration: 'none', fontWeight: 700 }}>+ Создать</a>
      </div>
      <div style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
        {list.length === 0 && <div style={{ padding: 24, color: '#64748b' }}>Пусто. Создайте первую запись.</div>}
        {list.map(it => (
          <div key={it._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 16px', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {it.title || <span style={{ color: '#64748b' }}>(без названия)</span>}
                {it.featured ? <span style={{ marginLeft: 8, fontSize: 11, color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)', padding: '1px 6px' }}>на главной</span> : null}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>/{it.slug}{it.order != null ? ` · #${it.order}` : ''}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <a href={`${ADMIN_PATH}/${type}/${it._id}`} style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5', padding: '6px 14px', textDecoration: 'none', fontSize: 13 }}>Изменить</a>
              <button onClick={() => remove(it._id, it.title)} style={{ background: 'none', border: '1px solid rgba(148,163,184,0.3)', color: '#94a3b8', padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}

export async function getServerSideProps(context) {
  const redirect = await requireAdmin(context)
  if (redirect) return redirect
  const { type } = context.params
  const m = MODELS[type]
  if (!m) return { notFound: true }
  return { props: { type, items: adminList(type), labelPlural: m.labelPlural, labelSingular: m.labelSingular } }
}
