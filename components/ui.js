import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import HeroTitle from './HeroTitle'

// Общие компоненты

const SERVICE_LABELS = {
  viral: 'Вирусные видеоролики',
  production: 'Продюсирование и СММ',
  corporate: 'Корпоративные фильмы',
  'ai-content': 'ИИ контент',
}

export function Card({ title, text }) {
  return (
    <div className="p-6" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
      <div className="font-mono-terminal text-red-500 uppercase tracking-[3px] text-xs mb-4">RGUARD</div>
      <h3 className="text-xl font-extrabold mb-3 leading-tight">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{text}</p>
    </div>
  )
}

export function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="max-w-4xl mb-14">
      <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs mb-4">// {eyebrow}</div>
      <h2 className="glitch-hero text-3xl sm:text-5xl font-extrabold leading-tight mb-6">{title}</h2>
      {text && <p className="text-zinc-400 text-lg leading-relaxed">{text}</p>}
    </div>
  )
}

export function CaptureTitle({ before, accent, after, className = '' }) {
  return (
    <HeroTitle
      as="h2"
      before={before}
      accent={accent}
      after={after}
      variant="split"
      className={`capture-title mb-6 ${className}`}
    />
  )
}

export function LeadForm({ button = 'Отправить заявку', textarea = 'Опишите задачу' }) {
  const [company,  setCompany]  = React.useState('')
  const [contact,  setContact]  = React.useState('')
  const [message,  setMessage]  = React.useState('')
  const [consent,  setConsent]  = React.useState(false)
  const [status,   setStatus]   = React.useState('idle') // idle | loading | error
  const [errMsg,   setErrMsg]   = React.useState('')
  const router = useRouter()

  const submit = async (e) => {
    e.preventDefault()
    if (!contact.trim()) { setErrMsg('Укажите номер телефона'); return }
    if (!consent)         { setErrMsg('Необходимо согласие на обработку данных'); return }
    setErrMsg('')
    setStatus('loading')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, contact, message, button }),
      })
      if (r.ok) { router.push('/thank-you'); return }
      setStatus('error'); setErrMsg('Ошибка отправки. Попробуйте ещё раз.')
    } catch {
      setStatus('error'); setErrMsg('Ошибка сети. Попробуйте ещё раз.')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <input
        value={company} onChange={e => setCompany(e.target.value)}
        placeholder="Название компании"
        className="w-full px-5 py-4 outline-none text-white placeholder-zinc-600 font-mono-terminal text-sm"
        style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(239,68,68,0.25)', color: 'inherit' }}
      />
      <input
        type="tel"
        value={contact} onChange={e => setContact(e.target.value)}
        placeholder="Номер телефона *"
        required
        className="w-full px-5 py-4 outline-none text-white placeholder-zinc-600 font-mono-terminal text-sm"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${errMsg && !contact ? 'rgba(239,68,68,0.8)' : 'rgba(239,68,68,0.25)'}`, color: 'inherit' }}
      />
      <textarea
        value={message} onChange={e => setMessage(e.target.value)}
        placeholder={textarea}
        className="w-full h-28 px-5 py-4 outline-none resize-none text-white placeholder-zinc-600 font-mono-terminal text-sm"
        style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(239,68,68,0.25)', color: 'inherit' }}
      />
      <label className="flex items-start gap-3 cursor-pointer group">
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}
          className="mt-1 shrink-0 cursor-pointer accent-red-500" style={{ width: '16px', height: '16px' }} />
        <span className="font-mono-terminal text-zinc-400 text-xs leading-relaxed group-hover:text-zinc-300 transition-colors">
          Даю согласие на{' '}
          <a href="/personal-data" target="_blank" rel="noreferrer"
            className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
            onClick={e => e.stopPropagation()}>обработку персональных данных</a>
          , согласно действующей{' '}
          <a href="/privacy" target="_blank" rel="noreferrer"
            className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
            onClick={e => e.stopPropagation()}>Политике конфиденциальности</a>
        </span>
      </label>
      {errMsg && <p className="font-mono-terminal text-red-400 text-xs">{errMsg}</p>}
      <button
        type="submit"
        disabled={status === 'loading' || !consent}
        className="btn-primary w-full"
        style={{ opacity: (!consent || status === 'loading') ? 0.5 : 1, cursor: (!consent || status === 'loading') ? 'not-allowed' : 'pointer' }}
      >
        {status === 'loading' ? '...' : button}
      </button>
    </form>
  )
}

export function StatBlock({ value, label }) {
  return (
    <div className="p-6 hud-corner" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
      <div className="font-mono-terminal text-3xl font-black neon-red mb-2">{value}</div>
      <div className="font-mono-terminal text-zinc-500 text-xs uppercase leading-relaxed" style={{ wordBreak: 'normal', overflowWrap: 'normal', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  )
}

// Брендовая заглушка-превью для кейсов без графической обложки.
// Единый стиль карточек по всему сайту, пока не загружены реальные кадры.
function CaseCoverFallback({ item }) {
  const metric = (item.metrics || []).find(m => m && (m.value || m.label))
  const tag = item.accent || SERVICE_LABELS[item.service] || item.service || ''
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#0d0d1a 0%,#1a0a0e 100%)' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(239,68,68,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(239,68,68,0.06) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="absolute top-0 left-0 right-0" style={{ height: 3, background: '#ef4444' }} />
      {tag && <div className="absolute top-3 left-3 font-mono-terminal text-red-500 uppercase border border-red-500/50 px-2 py-1" style={{ fontSize: 10, letterSpacing: 1.5 }}>// {tag}</div>}
      <div className="absolute top-3 right-3 font-mono-terminal text-red-500 font-black" style={{ fontSize: 10, letterSpacing: 1 }}>RGUARD.RU</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        {metric
          ? <>
              <div className="text-red-500 font-black" style={{ fontSize: 40, lineHeight: 1 }}>{metric.value}</div>
              <div className="text-zinc-400 font-mono-terminal uppercase mt-2" style={{ fontSize: 11, letterSpacing: 2 }}>{metric.label}</div>
            </>
          : <div className="text-zinc-600 font-mono-terminal uppercase" style={{ fontSize: 13, letterSpacing: 3 }}>RGUARD</div>}
      </div>
    </div>
  )
}

export function CaseCard({ item, href }) {
  const content = (
    <div className="cyber-card w-full overflow-hidden block">
      <div className="relative z-10 p-5 sm:p-8 md:p-10">
        <div className="flex flex-col items-start gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:mb-8">
          <div className="font-mono-terminal border border-red-950/40 px-3 sm:px-4 py-2 text-xs text-red-400 uppercase tracking-[1px] sm:tracking-[2px] max-w-full break-words">{SERVICE_LABELS[item.service] || item.category || item.service}</div>
          {item.accent && <div className="font-mono-terminal text-zinc-600 text-xs uppercase tracking-[2px] sm:tracking-[3px] break-words min-w-0">{item.accent}</div>}
        </div>
        <div className="aspect-[16/9] border border-red-950/20 mb-8 overflow-hidden relative"
          style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
          {item.coverImage
            ? <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
            : <CaseCoverFallback item={item} />}
        </div>
        <div className="text-2xl sm:text-3xl md:text-4xl font-black mb-5 break-words">{item.title}</div>
        <div className="text-zinc-400 text-lg leading-relaxed">{item.shortText || item.text}</div>
      </div>
    </div>
  )

  if (href) {
    const Link = require('next/link').default
    return <Link href={href} className="block">{content}</Link>
  }
  return content
}

export function BackButton({ href, label }) {
  const Link = require('next/link').default
  return (
    <Link href={href} className="mb-10 inline-block font-mono-terminal text-zinc-500 hover:text-red-400 transition-all text-xs uppercase tracking-[3px] cursor-pointer">
      ← {label}
    </Link>
  )
}
