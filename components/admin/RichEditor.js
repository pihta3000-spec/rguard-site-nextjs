import { useRef, useEffect, useState } from 'react'

// Простой WYSIWYG → HTML на contentEditable. Для внутренней админки (один редактор).
// Неконтролируемый (innerHTML ставится один раз), чтобы не прыгал курсор.

const BTN = { background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(239,68,68,0.25)', color: '#e2e8f0', padding: '6px 10px', cursor: 'pointer', fontSize: 13, minWidth: 34 }

export default function RichEditor({ value = '', onChange }) {
  const ref = useRef(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || '')) {
      ref.current.innerHTML = value || ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sync = () => onChange?.(ref.current?.innerHTML || '')
  const exec = (cmd, arg = null) => { ref.current?.focus(); document.execCommand(cmd, false, arg); sync() }
  const block = (tag) => exec('formatBlock', tag)

  const addLink = () => {
    const url = window.prompt('URL ссылки:')
    if (url) exec('createLink', url)
  }

  const addMedia = async (accept) => {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = accept
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return
      setBusy(true)
      try {
        const fd = new FormData(); fd.append('file', file)
        const r = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const d = await r.json()
        if (r.ok) {
          ref.current?.focus()
          const html = d.kind === 'video'
            ? `<figure><video src="${d.url}" controls preload="metadata"></video><figcaption></figcaption></figure><p><br/></p>`
            : `<figure><img src="${d.url}" alt="" /><figcaption></figcaption></figure><p><br/></p>`
          document.execCommand('insertHTML', false, html)
          sync()
        } else alert(d.error || 'Ошибка загрузки')
      } finally { setBusy(false) }
    }
    input.click()
  }

  return (
    <div style={{ border: '1px solid rgba(239,68,68,0.25)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: 6, borderBottom: '1px solid rgba(239,68,68,0.2)', background: 'rgba(10,10,20,0.6)' }}>
        <button type="button" style={{ ...BTN, fontWeight: 700 }} onClick={() => exec('bold')} title="Жирный">B</button>
        <button type="button" style={{ ...BTN, fontStyle: 'italic' }} onClick={() => exec('italic')} title="Курсив">I</button>
        <button type="button" style={BTN} onClick={() => block('<h2>')}>H2</button>
        <button type="button" style={BTN} onClick={() => block('<h3>')}>H3</button>
        <button type="button" style={BTN} onClick={() => block('<blockquote>')} title="Цитата">❝</button>
        <button type="button" style={BTN} onClick={() => block('<p>')} title="Обычный текст">¶</button>
        <button type="button" style={BTN} onClick={() => exec('insertUnorderedList')} title="Список">• —</button>
        <button type="button" style={BTN} onClick={addLink} title="Ссылка">🔗</button>
        <button type="button" style={BTN} onClick={() => addMedia('image/*')} disabled={busy} title="Картинка">{busy ? '…' : '🖼'}</button>
        <button type="button" style={BTN} onClick={() => addMedia('video/*')} disabled={busy} title="Видео">{busy ? '…' : '🎬'}</button>
        <button type="button" style={BTN} onClick={() => exec('removeFormat')} title="Очистить формат">⨯</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onBlur={sync}
        className="rich-content"
        style={{ minHeight: 220, padding: 16, outline: 'none', background: 'rgba(0,0,0,0.4)' }}
      />
    </div>
  )
}
