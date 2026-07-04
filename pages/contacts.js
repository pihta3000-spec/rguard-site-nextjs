import Layout from '@/components/Layout'
import Seo from '@/components/Seo'
import HeroTitle from '@/components/HeroTitle'
import { resolvePageSeo } from '@/lib/db'

const SOCIAL_LINKS = [
  {
    label: 'Telegram',
    handle: '@redguardmedia',
    href: 'https://t.me/redguardmedia',
    code: 'TG',
  },
  {
    label: 'Instagram',
    handle: '@red.guard_',
    href: 'https://www.instagram.com/red.guard_',
    code: 'IG',
  },
  {
    label: 'VK',
    handle: 'rguardrussia',
    href: 'https://vk.ru/rguardrussia',
    code: 'VK',
  },
]

export default function Contacts({ seo }) {
  return (
    <Layout title="Контакты" description="Свяжитесь с Красной Гвардией. Вирусный контент, продюсирование и HR-маркетинг.">
      <Seo seo={seo} />
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <div className="max-w-5xl mb-20">
          <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-6">// CONTACTS</div>
          <HeroTitle
            className="mb-8"
            before="Свяжитесь с"
            accent="Красной Гвардией"
            variant="split"
          />
          <p className="text-zinc-300 text-xl leading-relaxed">Если у вас задача по вирусному контенту, продюсированию, HR-маркетингу или медийности бренда — свяжитесь напрямую.</p>
        </div>

        <div className="p-10 md:p-14 mb-20 relative overflow-hidden" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(239,68,68,0.8),transparent)' }} />
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex px-4 py-2 rounded-full mb-6 font-mono-terminal text-red-400 text-xs tracking-[3px]" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(0,0,0,0.4)' }}>Приоритетный способ связи</div>
              <div className="text-4xl md:text-5xl font-black mb-4">Усманов Радим</div>
              <div className="text-zinc-400 text-xl mb-8">Коммерческий директор</div>
              <div className="space-y-5 mb-10">
                <a href="tel:+79273412252" className="block text-2xl font-bold hover:text-red-400 transition-all">+7 927 341-22-52</a>
                <a href="https://t.me/usmradim" target="_blank" rel="noreferrer" className="block text-xl text-zinc-300 hover:text-white transition-all">Telegram: @usmradim</a>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+79273412252" className="btn-primary text-center">Позвонить</a>
                <a href="https://t.me/usmradim" target="_blank" rel="noreferrer" className="btn-secondary text-center">Написать в Telegram</a>
              </div>
            </div>
            <div className="aspect-[4/5] overflow-hidden" style={{ border: '1px solid rgba(239,68,68,0.25)' }}>
              <img src="/radim.jpg" alt="Усманов Радим" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 mb-20">
          <div className="p-6 sm:p-10 w-full min-w-0" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs mb-5">Общие контакты</div>
            <div className="space-y-8">
              <div>
                <div className="font-mono-terminal text-zinc-500 text-xs uppercase tracking-[3px] mb-2">Телефон</div>
                <a href="tel:+79177802782" className="block text-2xl sm:text-3xl font-black hover:text-red-400 transition-all break-words">+7 917 780-27-82</a>
              </div>
              <div>
                <div className="font-mono-terminal text-zinc-500 text-xs uppercase tracking-[3px] mb-2">Email</div>
                <a href="mailto:propala@rguard.ru" className="block text-xl sm:text-2xl font-bold hover:text-red-400 transition-all break-all">propala@rguard.ru</a>
              </div>
              <div>
                <div className="font-mono-terminal text-zinc-500 text-xs uppercase tracking-[3px] mb-2">Адрес офиса</div>
                <div className="text-xl sm:text-2xl font-bold text-zinc-200">г. Уфа, ул. Мингажева 102</div>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8 w-full min-w-0" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs mb-5">Карта офиса</div>
            <div
              className="relative min-h-[280px] sm:min-h-[420px] w-full overflow-hidden hud-corner"
              style={{ border: '1px solid rgba(239,68,68,0.26)', background: 'rgba(0,0,0,0.65)' }}
            >
              <iframe
                title="Офис RGUARD на карте"
                src="https://yandex.ru/map-widget/v1/?text=%D0%A3%D1%84%D0%B0%2C%20%D1%83%D0%BB.%20%D0%9C%D0%B8%D0%BD%D0%B3%D0%B0%D0%B6%D0%B5%D0%B2%D0%B0%20102&z=16"
                className="absolute inset-0 h-full w-full"
                style={{ border: 0, filter: 'grayscale(1) invert(0.92) contrast(1.05) brightness(0.72) sepia(0.35) hue-rotate(310deg) saturate(1.65)' }}
                loading="lazy"
                allowFullScreen
              />
              <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(8,8,16,0.15),rgba(239,68,68,0.08)), repeating-linear-gradient(0deg,rgba(255,255,255,0.035) 0,rgba(255,255,255,0.035) 1px,transparent 1px,transparent 4px)' }} />
              <div className="pointer-events-none absolute left-4 top-4 font-mono-terminal text-red-400 text-xs uppercase tracking-[3px]">Уфа / Мингажева 102</div>
            </div>
          </div>
        </div>

        <div className="p-10" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs mb-6">Социальные сети</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOCIAL_LINKS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="cyber-card group p-6 sm:p-8 block"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs mb-4">// {s.code}</div>
                    <div className="text-2xl sm:text-3xl font-black mb-2 group-hover:text-red-400 transition-colors">{s.label}</div>
                    <div className="font-mono-terminal text-zinc-500 text-sm tracking-[2px]">{s.handle}</div>
                  </div>
                  <div className="font-mono-terminal text-red-500 text-xs uppercase tracking-[3px] opacity-60 group-hover:opacity-100 transition-opacity">open</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  return { props: { seo: resolvePageSeo('/contacts') }, revalidate: 60 }
}
