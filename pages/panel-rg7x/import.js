import { useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { ADMIN_PATH, requireAdmin } from '@/lib/auth'

const TYPE_LABEL = { cases: 'Кейсы', posts: 'Статьи', industries: 'Отрасли', bloggers: 'Блогеры' }

export default function ImportPage() {
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')

  const submit = async () => {
    if (!file) return
    setBusy(true); setErr(''); setResult(null)
    try {
      const fd = new FormData(); fd.append('file', file)
      const r = await fetch('/api/admin/import', { method: 'POST', body: fd })
      const d = await r.json()
      if (r.ok) setResult(d.summary)
      else setErr(d.error || 'Ошибка импорта')
    } catch { setErr('Ошибка сети') } finally { setBusy(false) }
  }

  return (
    <AdminShell title="Импорт таблицы" back={{ href: ADMIN_PATH, label: 'Дашборд' }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Импорт из Google-таблицы</h1>
      <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
        В Google Таблицах: <b>Файл → Скачать → Microsoft Excel (.xlsx)</b>, затем загрузите файл сюда.
        Записи сопоставляются по <b>slug</b>: существующие обновляются, новые создаются.
        Загруженные картинки, фото и обложки <b>сохраняются</b> (их в таблице нет).
      </p>

      <div style={{ border: '1px solid rgba(239,68,68,0.25)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label style={{ alignSelf: 'flex-start', cursor: 'pointer', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5', padding: '10px 20px', fontSize: 14, fontWeight: 600, userSelect: 'none' }}>
          {file ? '📄 Выбрать другой файл' : '📂 Выбрать файл .xlsx'}
          <input
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={e => { setFile(e.target.files?.[0] || null); setErr(''); setResult(null) }}
            style={{ display: 'none' }}
          />
        </label>

        {file
          ? <div style={{ color: '#cbd5e1', fontSize: 14 }}>Выбран: <b style={{ color: '#fff' }}>{file.name}</b> ({(file.size / 1024).toFixed(0)} КБ)</div>
          : <div style={{ color: '#64748b', fontSize: 13 }}>Сначала выберите файл — затем кнопка «Импортировать» станет активной.</div>}

        <button onClick={submit} disabled={!file || busy}
          style={{ alignSelf: 'flex-start', background: '#ef4444', color: '#fff', border: 'none', padding: '12px 28px', fontWeight: 700, cursor: (!file || busy) ? 'not-allowed' : 'pointer', opacity: (!file || busy) ? 0.6 : 1 }}>
          {busy ? 'Импорт…' : 'Импортировать'}
        </button>
      </div>

      {err && <p style={{ color: '#f87171', marginTop: 16 }}>{err}</p>}

      {result && (
        <div style={{ marginTop: 24, border: '1px solid rgba(34,197,94,0.4)', padding: 20 }}>
          <div style={{ color: '#4ade80', fontWeight: 700, marginBottom: 12 }}>Импорт завершён</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ textAlign: 'left', color: '#64748b', fontSize: 13 }}><th style={{ padding: 6 }}>Тип</th><th style={{ padding: 6 }}>Создано</th><th style={{ padding: 6 }}>Обновлено</th></tr></thead>
            <tbody>
              {Object.entries(result.byType).map(([t, v]) => (
                <tr key={t} style={{ borderTop: '1px solid rgba(148,163,184,0.12)' }}>
                  <td style={{ padding: 6 }}>{TYPE_LABEL[t] || t}</td>
                  <td style={{ padding: 6, color: '#4ade80' }}>+{v.created}</td>
                  <td style={{ padding: 6, color: '#fbbf24' }}>~{v.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {result.warnings?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ color: '#fbbf24', fontSize: 13, marginBottom: 6 }}>Предупреждения ({result.warnings.length}):</div>
              <ul style={{ color: '#94a3b8', fontSize: 13, paddingLeft: 18 }}>
                {result.warnings.slice(0, 30).map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  )
}

export async function getServerSideProps(context) {
  const redirect = await requireAdmin(context)
  if (redirect) return redirect
  return { props: {} }
}
