import Head from 'next/head'
import Layout from '@/components/Layout'
import Seo from '@/components/Seo'
import HeroTitle from '@/components/HeroTitle'
import { resolvePageSeo } from '@/lib/db'
import { LeadForm } from '@/components/ui'

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
            <div className="min-h-[280px] sm:min-h-[420px] w-full flex items-center justify-center" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(0,0,0,0.4)' }}>
              <span className="font-mono-terminal text-zinc-600 uppercase tracking-[3px] text-sm">Interactive Map</span>
            </div>
          </div>
        </div>

        <div className="p-10" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs mb-6">Социальные сети</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {['Telegram','YouTube','VK','Rutube'].map(s => (
              <a key={s} href="#" className="cyber-card p-6 text-center font-bold text-lg block">{s}</a>
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
