import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminShell from '@/components/admin/AdminShell'
import FieldInput from '@/components/admin/Fields'
import { ADMIN_PATH, requireAdmin } from '@/lib/auth'
import { adminGet } from '@/lib/db'
import { MODELS } from '@/lib/contentModel'

function emptyDoc(fields) {
  const d = {}
  for (const f of fields) {
    if (f.json) d[f.name] = (f.kind === 'seo') ? {} : []
    else if (f.kind === 'boolean') d[f.name] = false
    else if (f.kind === 'datetime' && f.name === 'publishedAt') d[f.name] = new Date().toISOString()
    else d[f.name] = ''
  }
  return d
}

export default function EditPage({ type, id, initialDoc }) {
  const router = useRouter()
  const m = MODELS[type]
  const isNew = id === 'new'
  const [doc, setDoc] = useState(initialDoc)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const setField = (name, val) => setDoc(d => ({ ...d, [name]: val }))

  const save = async () => {
    setErr(''); setSaving(true)
    try {
      const url = isNew ? `/api/admin/content/${type}` : `/api/admin/content/${type}/${id}`
      const method = isNew ? 'POST' : 'PUT'
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(doc) })
      const d = await r.json().catch(() => ({}))
      if (r.ok) router.push(`${ADMIN_PATH}/${type}`)
      else { setErr(d.error || 'Ошибка сохранения'); setSaving(false) }
    } catch { setErr('Ошибка сети'); setSaving(false) }
  }

  const remove = async () => {
    if (!window.confirm('Удалить запись? Действие необратимо.')) return
    const r = await fetch(`/api/admin/content/${type}/${id}`, { method: 'DELETE' })
    if (r.ok) router.push(`${ADMIN_PATH}/${type}`)
    else alert('Не удалось удалить')
  }

  return (
    <AdminShell title={isNew ? `Новый: ${m.labelSingular}` : doc[m.titleField] || m.labelSingular} back={{ href: `${ADMIN_PATH}/${type}`, label: m.labelPlural }}>
      <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24 }}>{isNew ? `Создать: ${m.labelSingular}` : `Редактировать: ${doc[m.titleField] || ''}`}</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {m.fields.map(f => (
          <div key={f.name}>
            <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>
              {f.label}{f.required ? <span style={{ color: '#ef4444' }}> *</span> : null}
            </label>
            <FieldInput field={f} value={doc[f.name]} onChange={v => setField(f.name, v)} doc={doc} currentId={isNew ? null : id} />
          </div>
        ))}
      </div>

      {err && <p style={{ color: '#f87171', marginTop: 16 }}>{err}</p>}

      <div style={{ display: 'flex', gap: 12, marginTop: 28, position: 'sticky', bottom: 0, background: '#05050c', padding: '16px 0', borderTop: '1px solid rgba(239,68,68,0.15)' }}>
        <button onClick={save} disabled={saving} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '12px 28px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Сохранение…' : 'Сохранить'}
        </button>
        <a href={`${ADMIN_PATH}/${type}`} style={{ border: '1px solid rgba(148,163,184,0.3)', color: '#94a3b8', padding: '12px 24px', textDecoration: 'none' }}>Отмена</a>
        {!isNew && <button onClick={remove} style={{ marginLeft: 'auto', background: 'none', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', padding: '12px 20px', cursor: 'pointer' }}>Удалить</button>}
      </div>
    </AdminShell>
  )
}

export async function getServerSideProps(context) {
  const redirect = await requireAdmin(context)
  if (redirect) return redirect
  const { type, id } = context.params
  const m = MODELS[type]
  if (!m) return { notFound: true }
  if (id === 'new') return { props: { type, id, initialDoc: emptyDoc(m.fields) } }
  const doc = adminGet(type, id)
  if (!doc) return { notFound: true }
  return { props: { type, id, initialDoc: doc } }
}
