import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import Layout from '@/components/Layout'
import { LeadForm, StatBlock, CaseCard } from '@/components/ui'
import { getCases } from '@/lib/sanity'

const FILTERS = [
  { id: 'all', label: 'Все кейсы' },
  { id: 'viral', label: 'Вирусные видеоролики' },
  { id: 'production', label: 'Продюсирование и СММ' },
  { id: 'corporate', label: 'Корпоративные фильмы' },
  { id: 'ai-content', label: 'ИИ ролики' },
]

export default function Cases({ cases }) {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? cases : cases.filter(c => c.service === filter)

  return (
    <Layout title="Кейсы" description="Реальные результаты: 40+ млн просмотров, корпоративные фильмы, SMM для B2B.">
      <Head>
        <title>Кейсы RGUARD — вирусный контент для реального бизнеса</title>
        <meta name="description" content="Реальные результаты: 40+ млн просмотров для Петроинжиниринг, корпоративные фильмы, SMM для B2B." />
        <link rel="canonical" href="https://rguard.ru/cases" />
      </Head>
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <div className="mb-24">
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">// CASES.RGUARD</div>
          <h1 className="glitch-hero text-5xl md:text-7xl font-black leading-none mb-8">Мы превращаем<br />сложный бизнес<br />в медийный</h1>
          <p className="text-zinc-400 text-xl leading-relaxed max-w-4xl mb-12">Производство. Стройка. Инженерия. Добыча. Реальный сектор.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[['1500+','Вертикальных роликов снято командой'],['B2B','Специализация на сложных нишах'],['Full','Production, продюсирование и креатив']].map(([v,l]) => (
              <StatBlock key={l} value={v} label={l} />
            ))}
          </div>
        </div>

        <div className="mb-24">
          <div className="font-mono-terminal text-4xl font-black mb-4">Компании, которые уже работали с нами</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-[100px] flex items-center justify-center" style={{ border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(10,10,20,0.8)' }}>
                <span className="font-mono-terminal text-zinc-700 text-xs tracking-[3px] uppercase">Logo</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-3 mb-10">
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`font-mono-terminal text-xs uppercase tracking-[2px] px-5 py-3 transition-all cursor-pointer ${filter === f.id ? 'text-white' : 'text-zinc-500 hover:text-red-400'}`}
                style={filter === f.id ? { border: '1px solid rgba(239,68,68,0.8)', background: 'rgba(239,68,68,0.15)' } : { border: '1px solid rgba(239,68,68,0.2)', background: 'transparent' }}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {filtered.map(item => (
              <CaseCard key={item.id} item={item} href={item.id === 'petro-engineering' ? '/cases/petro-engineering' : '#'} />
            ))}
          </div>
        </div>

        <div className="mt-24 p-10 md:p-14" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-4xl font-black leading-tight mb-6">Хотите такой же эффект для своей компании?</div>
              <p className="text-zinc-400 text-xl">Разберём задачу и предложим формат.</p>
            </div>
            <LeadForm button="Получить предложение" textarea="Кратко опишите задачу" />
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const cases = await getCases()
  return { props: { cases: cases || [] }, revalidate: 60 }
}
