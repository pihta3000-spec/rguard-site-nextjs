import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { LeadForm, StatBlock, CaseCard, Card } from '@/components/ui'
import { getCases, getBloggers } from '@/lib/sanity'
import dynamic from 'next/dynamic'

const ScrollAnimation = dynamic(() => import('@/components/ScrollAnimation'), { ssr: false })


const SERVICES = [
  { href: '/viral', title: 'Вирусные видеоролики', text: 'Вертикальный контент с акцентом на вирусность и органическое распространение.' },
  { href: '/corporate', title: 'Корпоративные фильмы', text: 'Имиджевые и производственные фильмы для B2B.' },
  { href: '/ai-content', title: 'ИИ контент', text: 'AI-generated и hybrid production для современного digital-контента.' },
  { href: '/production', title: 'Продюсирование и СММ', text: 'Контент-стратегия, продакшн, аналитика и управление соцсетями.' },
  { href: '/scripts', title: 'Написание сценариев', text: 'Вирусные, storytelling и рекламные сценарии под бизнес-задачи.' },
  { href: '/concepts', title: 'Концепции рекламных кампаний', text: 'Креативные механики для масштабируемых кампаний.' },
  { href: '/events', title: 'Организация мероприятий', text: 'События, которые становятся контентом и инфоповодом.' },
]

export default function Home({ cases, bloggers }) {
  const featured = (cases || []).filter(c => c.featured).slice(0, 4)

  return (
    <Layout
      title="Вирусные ролики для промышленности и реального сектора"
      description="RGUARD — создаём контент, который рабочие пересылают в Telegram. Производства, стройки, карьеры, добыча — наша среда."
    >
      <Head>
        <title>RGUARD.RU — Вирусные ролики для промышленности</title>
        <meta name="description" content="Вирусные видеоролики, продюсирование и контент-стратегии для компаний реального сектора. 2000+ роликов, 40+ млн просмотров." />
        <meta property="og:title" content="RGUARD.RU — Вирусные ролики для промышленности" />
        <meta property="og:description" content="Создаём контент, который рабочие пересылают в Telegram." />
        <link rel="canonical" href="https://rguard.ru/" />
      </Head>

      {/* Scroll animation — фиксированный фон слева */}
      <ScrollAnimation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-32 relative" style={{ zIndex: 2 }}>

        {/* HERO */}
        <div className="relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-32">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 font-mono-terminal text-xs tracking-[4px] uppercase"
              style={{ border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.05)', color: '#ef4444' }}>
              <span className="w-2 h-2 rounded-full bg-red-500 flicker" style={{ boxShadow: '0 0 6px #ef4444' }} />
              [ VIRAL_CONTENT • INDUSTRIAL_AUDIENCE ]
            </div>
            <h1 className="glitch-hero text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.92] mb-8">
              Вирусные ролики для промышленности и реального сектора
            </h1>
            <div className="space-y-4 mb-10" style={{ borderLeft: '2px solid rgba(239,68,68,0.4)', paddingLeft: '1.25rem' }}>
              <p className="text-zinc-300 text-lg leading-relaxed">Мы создаём контент, который рабочие пересылают друг другу в Telegram и обсуждают внутри индустрии.</p>
              <p className="text-zinc-500 text-lg leading-relaxed">Производства, стройки, карьеры, тяжёлая техника и добыча — наша естественная среда.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/viral" className="btn-primary">Получить идеи роликов</Link>
              <Link href="/cases" className="btn-secondary">Смотреть кейсы</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[['2000+','Снятых роликов'],['2M+','Подписчиков'],['100+','Упоминаний в СМИ'],['10+','Чел. в команде']].map(([v,l]) => (
                <StatBlock key={l} value={v} label={l} />
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[360px]">
              <div className="relative aspect-[9/16] overflow-hidden"
                style={{ background: 'linear-gradient(180deg,#0d0d1a 0%,#0a0a14 100%)', border: '1px solid rgba(239,68,68,0.4)', clipPath: 'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))', boxShadow: '0 0 40px rgba(239,68,68,0.2)' }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.15) 3px,rgba(0,0,0,0.15) 4px)' }} />
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(239,68,68,0.6)' }} />
                <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(239,68,68,0.6)' }} />
                <div className="absolute top-3 left-3 w-5 h-5" style={{ borderTop: '2px solid #ef4444', borderLeft: '2px solid #ef4444' }} />
                <div className="absolute top-3 right-3 w-5 h-5" style={{ borderTop: '2px solid #ef4444', borderRight: '2px solid #ef4444' }} />
                <div className="absolute bottom-3 left-3 w-5 h-5" style={{ borderBottom: '2px solid #ef4444', borderLeft: '2px solid #ef4444' }} />
                <div className="absolute bottom-3 right-3 w-5 h-5" style={{ borderBottom: '2px solid #ef4444', borderRight: '2px solid #ef4444' }} />
                <video src="/reel.mp4" autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(transparent,#0a0a14)' }} />
                <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-10">
                  <div className="font-mono-terminal text-red-500 text-xs tracking-[3px] flicker">[ REC • LIVE ]</div>
                  <div className="w-2 h-2 rounded-full bg-red-500 flicker" style={{ boxShadow: '0 0 6px #ef4444' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEAD FORM */}
        <div className="mb-32 p-8 lg:p-12 relative" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.22)' }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(239,68,68,0.8),transparent)' }} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-4">// INIT_REQUEST</div>
              <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-6">Покажем, какие вирусные ролики могут сработать в вашей нише</h2>
              <p className="text-zinc-400 text-lg leading-relaxed">Разберём вашу аудиторию и предложим идеи роликов под industrial B2B.</p>
            </div>
            <LeadForm button="Получить идеи роликов" />
          </div>
        </div>

        {/* УСЛУГИ */}
        <div className="mb-32">
          <div className="mb-10 relative z-10">
            <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-3">// SERVICES.LIST</div>
            <h2 className="glitch-hero text-3xl sm:text-5xl font-extrabold leading-tight mb-4">Строим контент-системы, а не просто снимаем ролики</h2>
            <p className="text-zinc-400 text-lg">Выберите направление под вашу задачу.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {SERVICES.map((svc, i) => (
              <Link key={svc.href} href={svc.href} className="cyber-card p-7 block">
                <div className="font-mono-terminal text-red-500 text-xs tracking-[3px] uppercase mb-3">SVC_{String(i+1).padStart(2,'0')}</div>
                <div className="text-xl font-extrabold mb-3 leading-tight">{svc.title}</div>
                <div className="text-zinc-500 leading-relaxed text-sm">{svc.text}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* О КОМПАНИИ */}
        <div className="mb-32 relative overflow-hidden p-8 md:p-14" style={{ background: 'rgba(10,10,20,0.9)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,rgba(239,68,68,0.8),transparent)' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at top right,rgba(239,68,68,0.08) 0%,transparent 60%)' }} />
          <div className="absolute -right-8 -bottom-8 overflow-hidden pointer-events-none" style={{ zIndex: 0, width: '380px', opacity: 0.05 }}>
            <img src="/favicon.svg" alt="" style={{ width: '100%' }} />
          </div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-6">// ABOUT.RGUARD</div>
              <h2 className="text-3xl md:text-5xl font-black leading-tight mb-8">
                Мы не просто снимаем ролики.<br />
                <span className="neon-red">Мы проектируем распространение внимания.</span>
              </h2>
              <div className="space-y-5 text-zinc-400 text-lg leading-relaxed">
                <p><span className="text-white font-bold">Красная Гвардия</span> — креативное агентство, основанное в 2014 году. Прошли путь от digital-агентства до команды, специализирующейся на вирусных кампаниях через вертикальный видеоконтент.</p>
                <p>Собственные методики вирусного контента — не просто на просмотры, а на репосты и органическое распространение внутри целевой аудитории.</p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="p-8 flex items-center justify-center min-h-[200px]" style={{ border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(0,0,0,0.4)' }}>
                <img src="/logow.svg" alt="Красная Гвардия" className="logo-glitch max-w-[320px] w-full opacity-95" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['2000+','Снятых роликов'],['2M+','Подписчиков'],['100+','Упоминаний в СМИ'],['50+','Выступлений'],['10+','Специалистов'],['2014','Год основания']].map(([v,l]) => (
                  <StatBlock key={l} value={v} label={l} />
                ))}
              </div>
            </div>
          </div>
          <div className="relative z-10 grid md:grid-cols-3 gap-4">
            <Card title="Собственная методология" text="Контент по проверенным механикам вирусного распространения и удержания внимания." />
            <Card title="Full-cycle команда" text="Сценаристы, актёры, операторы, монтажёры, AI-специалисты — всё внутри одной команды." />
            <Card title="Понимание сложных ниш" text="Industrial, B2B, производство, стройка и сложные продукты — наша естественная среда." />
          </div>
        </div>

        {/* КЕЙСЫ */}
        <div className="mb-32">
          <div className="mb-10 relative z-10">
            <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-3">// CASES.FEATURED</div>
            <h2 className="glitch-hero text-3xl sm:text-5xl font-extrabold leading-tight">Проекты, которые показывают наш подход в действии</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            {featured.map(item => (
              <CaseCard key={item.id} item={item} href={item.id === 'petro-engineering' ? '/cases/petro-engineering' : '/cases'} />
            ))}
          </div>
          <div className="mt-8 text-center relative z-10">
            <Link href="/cases" className="btn-secondary">Смотреть все кейсы</Link>
          </div>
        </div>

        {/* БЛОГЕРЫ */}
        <div className="mb-16">
          <div className="mb-10">
            <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-3">// BLOGGERS.INDEX</div>
            <h2 className="glitch-hero text-3xl sm:text-5xl font-extrabold leading-tight mb-4">Люди, через которых индустрия смотрит контент RGUARD</h2>
            <p className="text-zinc-400 text-lg">Каждый блогер — отдельный тип подачи и взаимодействия с аудиторией.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {(bloggers || []).slice(0, 3).map((blogger, i) => (
              <Link key={blogger.slug} href={`/bloggers/${blogger.slug}`} className="cyber-card overflow-hidden block">
                <div className="aspect-[3/4] relative overflow-hidden"
                  style={{ borderBottom: '1px solid rgba(239,68,68,0.12)' }}>
                  <div className="absolute top-3 left-3 z-10 font-mono-terminal text-red-500/40 text-xs">#{String(i+1).padStart(2,'0')}</div>
                  {blogger.photos?.[0] ? (
                    <img
                      src={blogger.photos[0]}
                      alt={blogger.name}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.35)' }}>
                      <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] flicker">[ PHOTO ]</div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-20" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
                </div>
                <div className="p-6">
                  <div className="text-xl font-bold mb-3">{blogger.name}</div>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-5">{blogger.desc}</p>
                  <div className="font-mono-terminal text-xs text-red-500 tracking-[2px]">OPEN_PROFILE →</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center relative z-10">
            <Link href="/bloggers" className="btn-secondary">Посмотреть всех блогеров</Link>
          </div>
        </div>

      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const [cases, bloggers] = await Promise.all([getCases(), getBloggers()])
  return { props: { cases: cases || [], bloggers: bloggers || [] }, revalidate: 60 }
}
