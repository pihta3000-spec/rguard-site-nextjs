import { useState } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => typeof window !== 'undefined' && !localStorage.getItem('cookie_accepted'))

  const accept = () => {
    localStorage.setItem('cookie_accepted', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '860px',
        zIndex: 9998,
        border: '1px solid rgba(239,68,68,0.35)',
        background: 'rgba(10,10,20,0.97)',
        backdropFilter: 'blur(12px)',
      }}
      className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
    >
      <p className="font-mono-terminal text-zinc-300 text-xs leading-relaxed flex-1">
        Мы используем файлы cookie для обеспечения корректной работы сайта, персонализации контента и анализа трафика.
        Продолжая использовать сайт, вы соглашаетесь с нашей{' '}
        <Link href="/privacy" target="_blank" className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors">
          Политикой конфиденциальности
        </Link>.
      </p>
      <button
        onClick={accept}
        className="btn-primary shrink-0"
        style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}
      >
        Принять
      </button>
    </div>
  )
}
