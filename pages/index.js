import Head from 'next/head'
import Seo from '@/components/Seo'
import Link from 'next/link'
import Layout from '@/components/Layout'
import HeroTitle from '@/components/HeroTitle'
import { LeadForm, StatBlock, CaseCard, Card, CaptureTitle, SectionAccentTitle } from '@/components/ui'
import { getCases, getBloggers, resolvePageSeo } from '@/lib/db'
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

export default function Home({ cases, bloggers , seo }) {
  const featured = (cases || []).filter(c => c.featured).slice(0, 4)

  return (
    <Layout
      title="Вирусные ролики для промышленности и реального сектора"
      description="RGUARD — создаём контент, который пересылают и обсуждают внутри индустрии. Производства, стройки, карьеры, добыча — наша среда."
    >
      <Seo seo={seo} />

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
            <HeroTitle
              className="mb-8"
              accent="Вирусные ролики"
              after={['для промышленности', 'и реального сектора']}
              variant="split"
            />
            <div className="space-y-4 mb-10" style={{ borderLeft: '2px solid rgba(239,68,68,0.4)', paddingLeft: '1.25rem' }}>
              <p className="text-zinc-300 text-lg leading-relaxed">Мы создаём контент, который пересылают и обсуждают внутри индустрии.</p>
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
              <CaptureTitle
                before={['Покажем, какие', 'вирусные ролики']}
                accent="могут сработать"
                after="в вашей нише"
              />
              <p className="text-zinc-400 text-lg leading-relaxed">Разберём вашу аудиторию и предложим идеи роликов под industrial B2B.</p>
            </div>
            <LeadForm button="Получить идеи роликов" />
          </div>
        </div>

        {/* УСЛУГИ */}
        <div className="mb-32">
          <div className="mb-10 relative z-10">
            <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-3">// SERVICES.LIST</div>
            <SectionAccentTitle
              className="mb-4"
              before="Строим"
              accent="контент-системы"
              after="а не просто снимаем ролики"
            />
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
              <HeroTitle
                as="h2"
                className="mb-8"
                before="Мы не просто снимаем ролики."
                accent="Проектируем"
                after={['распространение', 'внимания.']}
                variant="split"
              />
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
            <SectionAccentTitle
              before="Проекты, которые показывают"
              accent="наш подход"
              after="в действии"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            {featured.map(item => (
              <CaseCard key={item.id} item={item} href={`/cases/${item.id}`} />
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
            <SectionAccentTitle
              className="mb-4"
              before="Люди, через которых индустрия смотрит"
              accent="контент RGUARD"
            />
            <p className="text-zinc-400 text-lg">Каждый блогер — отдельный тип подачи и взаимодействия с аудиторией.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {(bloggers || []).slice(0, 3).map((blogger, i) => (
              <Link key={blogger.slug} href={`/bloggers/${blogger.slug}`} className="cyber-card overflow-hidden block">
                <div className="aspect-[4/5] flex items-center justify-center text-center p-6 relative overflow-hidden" style={{ borderBottom: '1px solid rgba(239,68,68,0.12)', background: 'rgba(0,0,0,0.35)' }}>
                  <div className="absolute top-3 left-3 font-mono-terminal text-red-500/30 text-xs z-10">#{String(i+1).padStart(2,'0')}</div>
                  {blogger.photos?.[0] ? (
                    <img src={blogger.photos[0]} alt={blogger.name} className="absolute inset-0 w-full h-full object-cover object-top" />
                  ) : (
                    <div>
                      <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] mb-3 flicker">[ PHOTO ]</div>
                      <div className="text-2xl font-extrabold">{blogger.name}</div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xl font-bold mb-3">{blogger.name}</div>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-4">{blogger.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(blogger.metrics || []).map((m) => {
                      const v = m.value || m[0]; const l = m.label || m[1];
                      return (
                        <div key={l} className="px-3 py-2 hud-corner" style={{ border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(10,10,20,0.85)' }}>
                          <div className="font-mono-terminal text-sm font-black neon-red">{v}</div>
                          <div className="font-mono-terminal text-zinc-600 text-xs">{l}</div>
                        </div>
                      )
                    })}
                  </div>
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
  return { props: { seo: resolvePageSeo('/'), cases: cases || [], bloggers: bloggers || [] }, revalidate: 60 }
}
