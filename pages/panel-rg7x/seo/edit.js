import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '@/components/admin/AdminShell'
import FieldInput from '@/components/admin/Fields'
import { ADMIN_PATH, requireAdmin } from '@/lib/auth'
import { adminGetSeo } from '@/lib/db'
import { SEO_FIELDS, SITE_FIELDS, PAGE_DEFAULTS, SITE_DEFAULTS, SITE_ORIGIN } from '@/lib/pageSeo'

const SITE_KEY = '__site__'

export default function SeoEdit({ path, label, isSite, groups, override, defaults }) {
  const router = useRouter()
  const [doc, setDoc] = useState(override || {})
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const set = (name, value) => setDoc(d => ({ ...d, [name]: value }))

  const save = async () => {
    setBusy(true); setMsg('')
    try {
      const r = await fetch('/api/admin/seo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, doc }),
      })
      const d = await r.json()
      if (r.ok) { setMsg('Сохранено ✓'); setTimeout(() => router.push(`${ADMIN_PATH}/seo`), 600) }
      else setMsg(d.error || 'Ошибка сохранения')
    } catch { setMsg('Ошибка сети') } finally { setBusy(false) }
  }

  // Превью сниппета (только для страниц, не для глобальных настроек)
  const effTitle = doc.title || defaults.title || ''
  const effDesc = doc.description || defaults.description || ''
  const url = SITE_ORIGIN + (path === '/' ? '' : path)

  const counter = (val, max) => {
    const n = (val || '').length
    const color = n === 0 ? '#64748b' : n > max ? '#f87171' : n > max * 0.9 ? '#f59e0b' : '#4ade80'
    return <span style={{ fontSize: 12, color }}>{n}/{max}</span>
  }

  return (
    <AdminShell title={`SEO — ${label}`} back={{ href: `${ADMIN_PATH}/seo`, label: 'SEO страниц' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900 }}>{isSite ? 'Глобальные SEO-настройки' : label}</h1>
        {!isSite && <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#64748b' }}>{path}</span>}
      </div>

      {!isSite && (
        <div style={{ marginBottom: 24, padding: 16, background: '#fff', borderRadius: 8, maxWidth: 600 }}>
          <div style={{ color: '#1a0dab', fontSize: 18, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{effTitle}</div>
          <div style={{ color: '#006621', fontSize: 13, margin: '2px 0 4px' }}>{url}</div>
          <div style={{ color: '#545454', fontSize: 13, lineHeight: 1.4 }}>{effDesc}</div>
        </div>
      )}

      <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 28 }}>
        {groups.map(g => (
          <div key={g.group}>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#ef4444', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid rgba(239,68,68,0.2)' }}>{g.group}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {g.fields.map(f => (
                <div key={f.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: 13, color: '#cbd5e1' }}>{f.label}</label>
                    {f.max && counter(doc[f.name], f.max)}
                  </div>
                  <FieldInput field={f} value={doc[f.name]} onChange={(v) => set(f.name, v)} doc={doc} />
                  {f.name === 'title' && defaults.title && <Hint text={`По умолчанию: ${defaults.title}`} />}
                  {f.name === 'description' && defaults.description && <Hint text={`По умолчанию: ${defaults.description}`} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 28 }}>
        <button onClick={save} disabled={busy}
          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '12px 28px', fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.6 : 1 }}>
          {busy ? 'Сохранение…' : 'Сохранить'}
        </button>
        {msg && <span style={{ color: msg.includes('✓') ? '#4ade80' : '#f87171' }}>{msg}</span>}
      </div>
    </AdminShell>
  )
}

function Hint({ text }) {
  return <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 1.4 }}>{text}</div>
}

export async function getServerSideProps(context) {
  const redirect = await requireAdmin(context)
  if (redirect) return redirect
  const path = String(context.query.path || '')
  const isSite = path === SITE_KEY
  if (!isSite && !PAGE_DEFAULTS[path]) return { notFound: true }
  return {
    props: {
      path,
      isSite,
      label: isSite ? 'Глобальные настройки' : PAGE_DEFAULTS[path].label,
      groups: isSite ? SITE_FIELDS : SEO_FIELDS,
      override: adminGetSeo(path),
      defaults: isSite ? { ...SITE_DEFAULTS } : { title: PAGE_DEFAULTS[path].title, description: PAGE_DEFAULTS[path].description },
    },
  }
}
