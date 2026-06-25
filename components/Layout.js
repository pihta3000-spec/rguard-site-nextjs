import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import BriefModal from './BriefModal'

const nav = [
  { href: '/cases', label: 'Кейсы' },
  { label: 'Видео', children: [
    { href: '/viral', label: 'Вирусные видеоролики' },
    { href: '/corporate', label: 'Корпоративные фильмы' },
    { href: '/ai-content', label: 'ИИ контент' },
  ]},
  { href: '/production', label: 'Продюсирование' },
  { label: 'Креатив', children: [
    { href: '/scripts', label: 'Написание сценариев' },
    { href: '/concepts', label: 'Концепции рекламных кампаний' },
  ]},
  { href: '/events', label: 'Мероприятия' },
  { href: '/articles', label: 'Статьи' },
  { href: '/industries', label: 'Решения' },
  { href: '/contacts', label: 'Контакты' },
]

// Услуги для перелинковки «Другие направления» (показывается на самих страницах услуг)
const SERVICE_PAGES = [
  ['/viral', 'Вирусные видеоролики'],
  ['/corporate', 'Корпоративные фильмы'],
  ['/production', 'Продюсирование и SMM'],
  ['/ai-content', 'ИИ-контент'],
  ['/scripts', 'Сценарии'],
  ['/concepts', 'Концепции кампаний'],
  ['/events', 'Мероприятия'],
]

export default function Layout({ children, title, description }) {
  const router = useRouter()
  const [menu, setMenu] = useState(false)
  const [briefOpen, setBriefOpen] = useState(false)
  const [showBrief, setShowBrief] = useState(false)

  // Плавающая кнопка «Заполнить бриф» появляется после прокрутки одного экрана
  useEffect(() => {
    const onScroll = () => setShowBrief(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const siteTitle = title ? `${title} — RGUARD.RU` : 'RGUARD.RU — Вирусные ролики для промышленности'
  const siteDesc = description || 'Вирусные видеоролики, продюсирование и контент-стратегии для компаний реального сектора.'

  return (
    <div className="min-h-screen text-white overflow-x-hidden font-sans relative scanlines" style={{ background: '#0a0a14', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Grid background */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        backgroundImage: 'linear-gradient(rgba(239,68,68,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ borderBottom: '1px solid rgba(239,68,68,0.2)', background: 'rgba(10,10,20,0.92)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-mono-terminal text-2xl font-black tracking-tight neon-red cursor-pointer flicker">
            RGUARD<span className="text-red-500/60 text-sm">.RU</span>
          </Link>

          <a href="tel:+79273412252" className="lg:hidden font-mono-terminal text-xs font-bold tracking-tight text-red-500 hover:text-red-400 transition-all">+7 927 341-22-52</a>

          <nav className="hidden lg:flex items-center gap-8">
            {nav.map((item) => (
              <div key={item.label || item.href} className="relative group flex items-center">
                {item.children ? (
                  <>
                    <button className="font-mono-terminal text-xs uppercase tracking-[2px] text-zinc-400 hover:text-red-400 transition-all inline-flex items-center gap-1 cursor-pointer leading-none">
                      {item.label}<span className="text-[10px] leading-none mt-px">▾</span>
                    </button>
                    <div className="absolute top-full left-0 pt-4 hidden group-hover:block z-50">
                      <div className="w-[320px] p-2" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(10,10,20,0.98)' }}>
                        {item.children.map((child) => (
                          <Link key={child.href} href={child.href}
                            className="block w-full text-left px-4 py-3 font-mono-terminal text-xs uppercase tracking-[2px] text-zinc-400 hover:text-red-400 hover:bg-red-950/20 transition-all break-words">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link href={item.href}
                    className={`font-mono-terminal text-xs uppercase tracking-[2px] transition-all cursor-pointer leading-none ${router.pathname === item.href ? 'text-red-400' : 'text-zinc-400 hover:text-red-400'}`}>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <button onClick={() => setMenu(v => !v)} className="lg:hidden w-12 h-12 flex items-center justify-center font-mono-terminal text-red-500 cursor-pointer" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>☰</button>
        </div>

        {menu && (
          <div className="lg:hidden px-4 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto" style={{ borderTop: '1px solid rgba(239,68,68,0.15)', background: 'rgba(10,10,20,0.98)' }}>
            {nav.map((item) => (
              <div key={item.label || item.href}>
                {item.children ? (
                  <div>
                    <div className="px-4 pt-3 pb-1 font-mono-terminal text-red-500 uppercase tracking-[3px] text-xs">{item.label}</div>
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} onClick={() => setMenu(false)}
                        className="block w-full text-left px-6 py-3 font-mono-terminal text-xs uppercase tracking-[2px] text-zinc-400 hover:text-red-400 transition-all">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link href={item.href} onClick={() => setMenu(false)}
                    className="block w-full text-left px-4 py-3 font-mono-terminal text-xs uppercase tracking-[2px] text-zinc-400 hover:text-red-400 transition-all">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </header>

      <main className="pt-20 relative z-10">{children}</main>

      {SERVICE_PAGES.some(([p]) => p === router.pathname) && (
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-6">// ДРУГИЕ НАПРАВЛЕНИЯ</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {SERVICE_PAGES.filter(([p]) => p !== router.pathname).map(([p, l]) => (
              <Link key={p} href={p} className="cyber-card p-5 block font-bold leading-tight text-sm">{l}</Link>
            ))}
          </div>
        </section>
      )}

      <footer className="py-10 relative z-10" style={{ borderTop: '1px solid rgba(239,68,68,0.2)', background: 'rgba(5,5,12,0.98)' }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.6), transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="font-mono-terminal text-2xl font-black tracking-tight neon-red flicker">RGUARD.RU</div>
            <div className="font-mono-terminal text-zinc-600 mt-2 text-xs tracking-[3px] uppercase">// Industrial Creative Agency</div>
          </div>
          <div className="font-mono-terminal text-zinc-600 text-xs max-w-xl leading-relaxed tracking-[1px]">Вирусные видеоролики, продюсирование, мероприятия и креативные концепции для компаний реального сектора.</div>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="font-mono-terminal text-zinc-600 text-xs hover:text-red-400 transition-colors">Политика конфиденциальности</Link>
            <Link href="/personal-data" className="font-mono-terminal text-zinc-600 text-xs hover:text-red-400 transition-colors">Согласие на обработку персональных данных</Link>
          </div>
        </div>
      </footer>

      <button
        onClick={() => setBriefOpen(true)}
        aria-hidden={!showBrief}
        tabIndex={showBrief ? 0 : -1}
        className="btn-primary fixed bottom-6 right-6 z-40 shadow-lg"
        style={{
          boxShadow: '0 4px 24px rgba(239,68,68,0.35)',
          opacity: showBrief ? 1 : 0,
          transform: showBrief ? 'translateY(0)' : 'translateY(20px)',
          pointerEvents: showBrief ? 'auto' : 'none',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        Заполнить бриф
      </button>

      <BriefModal open={briefOpen} onClose={() => setBriefOpen(false)} />
    </div>
  )
}
