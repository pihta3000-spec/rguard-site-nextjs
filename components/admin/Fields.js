import { useState, useEffect } from 'react'
import { slugify } from '@/lib/contentModel'
import RichEditor from './RichEditor'

const inp = {
  width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.5)',
  border: '1px solid rgba(239,68,68,0.25)', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
}
const smallBtn = { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: '6px 12px', cursor: 'pointer', fontSize: 13 }
const ghostBtn = { background: 'none', border: '1px solid rgba(148,163,184,0.3)', color: '#94a3b8', padding: '4px 10px', cursor: 'pointer', fontSize: 12 }

async function uploadFile(file) {
  const fd = new FormData(); fd.append('file', file)
  const r = await fetch('/api/admin/upload', { method: 'POST', body: fd })
  const d = await r.json()
  if (!r.ok) throw new Error(d.error || 'Ошибка загрузки')
  return d.url
}

// ── Загрузка одной картинки ──────────────────────────────────────────────────
function ImageInput({ value, onChange }) {
  const [busy, setBusy] = useState(false)
  const pick = () => {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = 'image/*'
    input.onchange = async () => {
      const f = input.files?.[0]; if (!f) return
      setBusy(true)
      try { onChange(await uploadFile(f)) } catch (e) { alert(e.message) } finally { setBusy(false) }
    }
    input.click()
  }
  return (
    <div>
      {value && <img src={value} alt="" style={{ maxWidth: 200, maxHeight: 140, display: 'block', marginBottom: 8, border: '1px solid rgba(239,68,68,0.2)' }} />}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="button" style={smallBtn} onClick={pick} disabled={busy}>{busy ? 'Загрузка…' : value ? 'Заменить' : 'Загрузить'}</button>
        {value && <button type="button" style={ghostBtn} onClick={() => onChange('')}>Убрать</button>}
        <input style={{ ...inp, flex: 1, minWidth: 160 }} placeholder="или URL вручную" value={value || ''} onChange={e => onChange(e.target.value)} />
      </div>
    </div>
  )
}

// ── Список картинок ──────────────────────────────────────────────────────────
function ImageList({ value = [], onChange }) {
  const arr = Array.isArray(value) ? value : []
  const set = (i, v) => { const n = [...arr]; n[i] = v; onChange(n) }
  const add = () => onChange([...arr, ''])
  const del = (i) => onChange(arr.filter((_, j) => j !== i))
  const move = (i, d) => { const n = [...arr]; const t = n[i + d]; if (t === undefined) return; n[i + d] = n[i]; n[i] = t; onChange(n) }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {arr.map((v, i) => (
        <div key={i} style={{ border: '1px solid rgba(148,163,184,0.15)', padding: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>#{i + 1}</span>
            <span style={{ display: 'flex', gap: 6 }}>
              <button type="button" style={ghostBtn} onClick={() => move(i, -1)}>↑</button>
              <button type="button" style={ghostBtn} onClick={() => move(i, 1)}>↓</button>
              <button type="button" style={ghostBtn} onClick={() => del(i)}>Удалить</button>
            </span>
          </div>
          <ImageInput value={v} onChange={(nv) => set(i, nv)} />
        </div>
      ))}
      <button type="button" style={smallBtn} onClick={add}>+ Добавить фото</button>
    </div>
  )
}

// ── Теги / список строк ──────────────────────────────────────────────────────
function TagsInput({ value = [], onChange, placeholder }) {
  const arr = Array.isArray(value) ? value : []
  const [draft, setDraft] = useState('')
  const add = () => { const v = draft.trim(); if (v) { onChange([...arr, v]); setDraft('') } }
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {arr.map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', padding: '4px 8px', fontSize: 13 }}>
            {t}<button type="button" onClick={() => onChange(arr.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }}>✕</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input style={{ ...inp, flex: 1 }} value={draft} placeholder={placeholder || 'Добавить и Enter'}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }} />
        <button type="button" style={smallBtn} onClick={add}>Добавить</button>
      </div>
    </div>
  )
}

// ── Список объектов (метрики, соцсети, услуги) ───────────────────────────────
function ObjectList({ value = [], onChange, item }) {
  const arr = Array.isArray(value) ? value : []
  const set = (i, key, v) => { const n = arr.map((r, j) => j === i ? { ...r, [key]: v } : r); onChange(n) }
  const add = () => onChange([...arr, Object.fromEntries(item.map(f => [f.name, '']))])
  const del = (i) => onChange(arr.filter((_, j) => j !== i))
  const move = (i, d) => { const n = [...arr]; const t = n[i + d]; if (t === undefined) return; n[i + d] = n[i]; n[i] = t; onChange(n) }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {arr.map((row, i) => (
        <div key={i} style={{ border: '1px solid rgba(148,163,184,0.15)', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
            <button type="button" style={ghostBtn} onClick={() => move(i, -1)}>↑</button>
            <button type="button" style={ghostBtn} onClick={() => move(i, 1)}>↓</button>
            <button type="button" style={ghostBtn} onClick={() => del(i)}>Удалить</button>
          </div>
          {item.map(f => f.textarea ? (
            <textarea key={f.name} style={{ ...inp, minHeight: 60 }} placeholder={f.label} value={row[f.name] || ''} onChange={e => set(i, f.name, e.target.value)} />
          ) : (
            <input key={f.name} style={inp} placeholder={f.label} value={row[f.name] || ''} onChange={e => set(i, f.name, e.target.value)} />
          ))}
        </div>
      ))}
      <button type="button" style={smallBtn} onClick={add}>+ Добавить</button>
    </div>
  )
}

// ── SEO-блок ─────────────────────────────────────────────────────────────────
function counter(len, max) {
  const color = len > max ? '#f87171' : len > max * 0.85 ? '#fbbf24' : '#64748b'
  return <span style={{ fontSize: 11, color }}>{len} / {max}</span>
}
function SeoInput({ value, onChange, doc }) {
  const v = value || {}
  const set = (k, val) => onChange({ ...v, [k]: val })
  const title = v.metaTitle || doc.title || doc.name || ''
  const desc = v.metaDescription || doc.excerpt || doc.shortDesc || ''
  return (
    <div style={{ border: '1px solid rgba(239,68,68,0.2)', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={{ display: 'block' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ fontSize: 13, color: '#94a3b8' }}>Meta Title</span>{counter((v.metaTitle || '').length, 60)}</div>
        <input style={inp} value={v.metaTitle || ''} onChange={e => set('metaTitle', e.target.value)} placeholder="≤ 60 символов" />
      </label>
      <label style={{ display: 'block' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ fontSize: 13, color: '#94a3b8' }}>Meta Description</span>{counter((v.metaDescription || '').length, 160)}</div>
        <textarea style={{ ...inp, minHeight: 64 }} value={v.metaDescription || ''} onChange={e => set('metaDescription', e.target.value)} placeholder="≤ 160 символов" />
      </label>
      <div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>OG Image</div>
        <ImageInput value={v.ogImage || ''} onChange={u => set('ogImage', u)} />
      </div>
      <div style={{ background: '#fff', padding: 12, borderRadius: 4 }}>
        <div style={{ fontSize: 11, color: '#5f6368', marginBottom: 2 }}>Превью в Google:</div>
        <div style={{ color: '#1a0dab', fontSize: 18, lineHeight: 1.2, fontFamily: 'arial' }}>{title || 'Заголовок страницы'}</div>
        <div style={{ color: '#006621', fontSize: 13, fontFamily: 'arial' }}>rguard.ru/…</div>
        <div style={{ color: '#4d5156', fontSize: 13, fontFamily: 'arial' }}>{desc || 'Описание страницы появится здесь.'}</div>
      </div>
    </div>
  )
}

// ── Выбор похожих статей ─────────────────────────────────────────────────────
function RefList({ value = [], onChange, refType, currentId }) {
  const [opts, setOpts] = useState([])
  const arr = Array.isArray(value) ? value : []
  useEffect(() => {
    fetch(`/api/admin/content/${refType}`).then(r => r.json()).then(d => setOpts(d.items || [])).catch(() => {})
  }, [refType])
  const toggle = (id) => onChange(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id])
  return (
    <div style={{ border: '1px solid rgba(148,163,184,0.15)', padding: 10, maxHeight: 200, overflowY: 'auto' }}>
      {opts.filter(o => o._id !== currentId).map(o => (
        <label key={o._id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0', cursor: 'pointer' }}>
          <input type="checkbox" checked={arr.includes(o._id)} onChange={() => toggle(o._id)} />
          <span style={{ fontSize: 14 }}>{o.title}</span>
        </label>
      ))}
      {opts.length === 0 && <div style={{ color: '#64748b', fontSize: 13 }}>Нет доступных записей</div>}
    </div>
  )
}

// ── URL c кнопкой загрузки файла (видео/картинка) ───────────────────────────
function UrlInput({ value, onChange }) {
  const [busy, setBusy] = useState(false)
  const pick = () => {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = 'video/*,image/*'
    input.onchange = async () => {
      const f = input.files?.[0]; if (!f) return
      setBusy(true)
      try { onChange(await uploadFile(f)) } catch (e) { alert(e.message) } finally { setBusy(false) }
    }
    input.click()
  }
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input style={{ ...inp, flex: 1 }} value={value || ''} onChange={e => onChange(e.target.value)} placeholder="URL или загрузите файл" />
      <button type="button" style={smallBtn} onClick={pick} disabled={busy}>{busy ? '…' : 'Файл'}</button>
    </div>
  )
}

// ── Slug с автогенерацией ────────────────────────────────────────────────────
function SlugInput({ field, value, onChange, doc }) {
  const source = doc[field.slugFrom] || ''
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input style={{ ...inp, flex: 1 }} value={value || ''} onChange={e => onChange(slugify(e.target.value))} placeholder="latinitsa-cherez-defis" />
      <button type="button" style={smallBtn} onClick={() => onChange(slugify(source))} disabled={!source}>Из «{field.slugFrom === 'name' ? 'имени' : 'названия'}»</button>
    </div>
  )
}

// ── Диспетчер поля ───────────────────────────────────────────────────────────
export default function FieldInput({ field, value, onChange, doc, currentId }) {
  switch (field.kind) {
    case 'textarea':
      return <textarea style={{ ...inp, minHeight: 80 }} value={value || ''} onChange={e => onChange(e.target.value)} />
    case 'number':
      return <input type="number" style={inp} value={value ?? ''} onChange={e => onChange(e.target.value)} />
    case 'boolean':
      return <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}><input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} /> <span style={{ fontSize: 14 }}>Да</span></label>
    case 'select':
      return (
        <select style={inp} value={value || ''} onChange={e => onChange(e.target.value)}>
          <option value="">— не выбрано —</option>
          {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )
    case 'datetime':
      return <input type="datetime-local" style={inp} value={(value || '').slice(0, 16)} onChange={e => onChange(e.target.value ? new Date(e.target.value).toISOString() : '')} />
    case 'slug':
      return <SlugInput field={field} value={value} onChange={onChange} doc={doc} />
    case 'image':
      return <ImageInput value={value} onChange={onChange} />
    case 'imageList':
      return <ImageList value={value} onChange={onChange} />
    case 'tags':
      return <TagsInput value={value} onChange={onChange} />
    case 'objectList':
      return <ObjectList value={value} onChange={onChange} item={field.item} />
    case 'richtext':
      return <RichEditor value={value} onChange={onChange} />
    case 'seo':
      return <SeoInput value={value} onChange={onChange} doc={doc} />
    case 'refList':
      return <RefList value={value} onChange={onChange} refType={field.refType} currentId={currentId} />
    case 'url':
      return <UrlInput value={value} onChange={onChange} />
    case 'text':
    default:
      return <input style={inp} value={value || ''} onChange={e => onChange(e.target.value)} />
  }
}
