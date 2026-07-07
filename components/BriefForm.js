import React from 'react'
import { useRouter } from 'next/router'
import { STEPS, ROOT_ID, TASK_LABELS } from '../lib/briefSteps'

function ProgressDots({ count, index }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-1 flex-1"
          style={{
            background: i <= index ? '#ef4444' : 'rgba(239,68,68,0.15)',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  )
}

function OptionButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-5 py-4 font-mono-terminal text-sm transition-all cursor-pointer"
      style={{
        border: `1px solid ${active ? '#ef4444' : 'rgba(239,68,68,0.25)'}`,
        background: active ? 'rgba(239,68,68,0.12)' : 'rgba(0,0,0,0.6)',
        color: active ? '#fca5a5' : '#e2e8f0',
      }}
    >
      {active ? '[x] ' : '[ ] '}{children}
    </button>
  )
}

export default function BriefForm({ onCancel, onSubmitted }) {
  const [stepId, setStepId] = React.useState(ROOT_ID)
  const [history, setHistory] = React.useState([])
  const [answers, setAnswers] = React.useState({})
  const [contacts, setContacts] = React.useState({})
  const [consent, setConsent] = React.useState(false)
  const [status, setStatus] = React.useState('idle')
  const [errMsg, setErrMsg] = React.useState('')
  const [textVal, setTextVal] = React.useState('')
  const router = useRouter()
  const cancel = onCancel || (() => router.push('/'))

  const step = STEPS[stepId]

  React.useEffect(() => {
    setTextVal(answers[stepId] || '')
  }, [answers, stepId])

  const goTo = (nextId) => {
    setHistory(h => [...h, stepId])
    setStepId(nextId)
  }

  const goBack = () => {
    setHistory(h => {
      if (h.length === 0) return h
      const prev = h[h.length - 1]
      setStepId(prev)
      return h.slice(0, -1)
    })
    setErrMsg('')
  }

  const selectSingle = (opt) => {
    setAnswers(a => ({ ...a, [stepId]: opt.value }))
    goTo(opt.next)
  }

  const toggleMulti = (value) => {
    setAnswers(a => {
      const cur = Array.isArray(a[stepId]) ? a[stepId] : []
      const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]
      return { ...a, [stepId]: next }
    })
  }

  const submitMulti = () => {
    const cur = answers[stepId]
    if (!cur || cur.length === 0) {
      setErrMsg('Выберите хотя бы один вариант')
      return
    }
    setErrMsg('')
    goTo(step.next)
  }

  const submitText = () => {
    if (!textVal.trim()) {
      setErrMsg('Заполните поле')
      return
    }
    setAnswers(a => ({ ...a, [stepId]: textVal.trim() }))
    setErrMsg('')
    goTo(step.next)
  }

  const submitContacts = async (e) => {
    e.preventDefault()
    for (const f of step.fields) {
      if (f.required && !contacts[f.name]?.trim()) {
        setErrMsg(`Заполните поле «${f.label}»`)
        return
      }
    }
    if (!consent) {
      setErrMsg('Необходимо согласие на обработку данных')
      return
    }
    setErrMsg('')
    setStatus('loading')
    try {
      const r = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, contacts }),
      })
      if (r.ok) {
        onSubmitted?.()
        router.push('/thank-you')
        return
      }
      setStatus('error')
      setErrMsg('Ошибка отправки. Попробуйте еще раз.')
    } catch {
      setStatus('error')
      setErrMsg('Ошибка сети. Попробуйте еще раз.')
    }
  }

  const progressIndex = history.length
  const progressCount = Math.max(progressIndex + 2, 4)

  return (
    <div>
      {step.type !== 'contacts' && <ProgressDots count={progressCount} index={progressIndex} />}

      {(step.type === 'single' || step.type === 'multi') && (
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold mb-2 leading-snug">{step.question}</h3>
          {step.note && <div className="font-mono-terminal text-zinc-500 text-xs uppercase tracking-[2px] mb-6">{step.note}</div>}
          <div className="space-y-3">
            {step.options.map(opt => (
              <OptionButton
                key={opt.value}
                active={step.type === 'multi' ? (answers[stepId] || []).includes(opt.value) : answers[stepId] === opt.value}
                onClick={() => step.type === 'multi' ? toggleMulti(opt.value) : selectSingle(opt)}
              >
                {opt.label}
              </OptionButton>
            ))}
          </div>
          {errMsg && <p className="font-mono-terminal text-red-400 text-xs mt-4">{errMsg}</p>}
          <div className="flex items-center justify-between mt-8">
            <button onClick={history.length ? goBack : cancel} className="btn-secondary">{history.length ? 'Назад' : 'Отмена'}</button>
            {step.type === 'multi' && <button onClick={submitMulti} className="btn-primary">Далее</button>}
          </div>
        </div>
      )}

      {step.type === 'text' && (
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold mb-6 leading-snug">{step.question}</h3>
          <input
            type={step.inputType || 'text'}
            value={textVal}
            onChange={e => setTextVal(e.target.value)}
            placeholder={step.placeholder}
            className="w-full px-5 py-4 outline-none text-white placeholder-zinc-600 font-mono-terminal text-sm"
            style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(239,68,68,0.25)', color: 'inherit' }}
          />
          {errMsg && <p className="font-mono-terminal text-red-400 text-xs mt-4">{errMsg}</p>}
          <div className="flex items-center justify-between mt-8">
            <button onClick={goBack} className="btn-secondary">Назад</button>
            <button onClick={submitText} className="btn-primary">Далее</button>
          </div>
        </div>
      )}

      {step.type === 'contacts' && (
        <form onSubmit={submitContacts} className="space-y-3">
          <h3 className="text-xl sm:text-2xl font-extrabold mb-1 leading-snug">{step.question}</h3>
          <div className="font-mono-terminal text-zinc-500 text-xs uppercase tracking-[2px] mb-6">// Финальный шаг — {TASK_LABELS[answers[ROOT_ID]] || ''}</div>
          {step.fields.map(f => f.kind === 'long' ? (
            <textarea
              key={f.name}
              value={contacts[f.name] || ''}
              onChange={e => setContacts(c => ({ ...c, [f.name]: e.target.value }))}
              placeholder={f.label + (f.required ? ' *' : '')}
              className="w-full h-24 px-5 py-4 outline-none resize-none text-white placeholder-zinc-600 font-mono-terminal text-sm"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(239,68,68,0.25)', color: 'inherit' }}
            />
          ) : (
            <input
              key={f.name}
              value={contacts[f.name] || ''}
              onChange={e => setContacts(c => ({ ...c, [f.name]: e.target.value }))}
              placeholder={f.label + (f.required ? ' *' : '')}
              className="w-full px-5 py-4 outline-none text-white placeholder-zinc-600 font-mono-terminal text-sm"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(239,68,68,0.25)', color: 'inherit' }}
            />
          ))}
          <label className="flex items-start gap-3 cursor-pointer group pt-1">
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-1 shrink-0 cursor-pointer accent-red-500"
              style={{ width: '16px', height: '16px' }}
            />
            <span className="font-mono-terminal text-zinc-400 text-xs leading-relaxed group-hover:text-zinc-300 transition-colors">
              Даю согласие на{' '}
              <a href="/personal-data" target="_blank" rel="noreferrer" className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors">
                обработку персональных данных
              </a>
              , согласно действующей{' '}
              <a href="/privacy" target="_blank" rel="noreferrer" className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors">
                Политике конфиденциальности
              </a>
            </span>
          </label>
          {errMsg && <p className="font-mono-terminal text-red-400 text-xs">{errMsg}</p>}
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={goBack} className="btn-secondary">Назад</button>
            <button
              type="submit"
              disabled={status === 'loading' || !consent}
              className="btn-primary"
              style={{ opacity: (!consent || status === 'loading') ? 0.5 : 1, cursor: (!consent || status === 'loading') ? 'not-allowed' : 'pointer' }}
            >
              {status === 'loading' ? '...' : 'Отправить бриф'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
