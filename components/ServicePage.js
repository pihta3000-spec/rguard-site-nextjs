import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { LeadForm, StatBlock, CaseCard, Card } from '@/components/ui'

export default function ServicePage({ meta, hero, stats, problem, principles, steps, cases, price, cta }) {
  return (
    <Layout title={meta.title} description={meta.description}>
      <Head>
        <title>{meta.title} — RGUARD.RU</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={`https://rguard.ru${meta.path}`} />
        <meta property="og:title" content={`${meta.title} — RGUARD.RU`} />
        <meta property="og:description" content={meta.description} />
      </Head>
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="max-w-6xl mb-16">
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">{hero.eyebrow}</div>
          <h1 className="glitch-hero text-5xl md:text-7xl font-black leading-none mb-8">{hero.title}</h1>
          <p className="text-zinc-300 text-xl leading-relaxed max-w-4xl">{hero.text}</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid lg:grid-cols-4 gap-4 mt-16 mb-24">
            {stats.map(([v, l]) => <StatBlock key={l} value={v} label={l} />)}
          </div>
        )}

        {/* Problem + Principles */}
        {(problem || principles) && (
          <div className="mt-24 grid lg:grid-cols-2 gap-10 items-start mb-24">
            {problem && (
              <div>
                <div className="text-4xl font-black mb-8">{problem.title}</div>
                <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
                  {problem.items.map((t, i) => <div key={i}>{t}</div>)}
                </div>
              </div>
            )}
            {principles && (
              <div className="p-10" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
                <div className="text-3xl font-black mb-8">{principles.title}</div>
                <div className="space-y-5 text-zinc-300 leading-relaxed text-lg">
                  {principles.items.map((t, i) => <div key={i}>{t}</div>)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Steps */}
        {steps && (
          <div className="mt-24 mb-24">
            <div className="text-4xl font-black mb-12">{steps.title}</div>
            <div className="space-y-6">
              {steps.items.map((item, i) => (
                <div key={i} className="p-8 flex gap-6 items-start" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
                  <div className="font-mono-terminal text-2xl font-black neon-red min-w-[56px]" style={{ textShadow: '0 0 10px rgba(239,68,68,0.6)' }}>0{i+1}</div>
                  <div>
                    <div className="text-2xl font-bold mb-2">{item.title}</div>
                    <div className="text-zinc-400 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cases */}
        {cases?.length > 0 && (
          <div className="mt-24 mb-24">
            <div className="text-4xl font-black mb-10">Кейсы</div>
            <div className="grid md:grid-cols-2 gap-6">
              {cases.map(item => (
                <CaseCard key={item.id} item={item} href={`/cases/${item.id}`} />
              ))}
            </div>
          </div>
        )}

        {/* Price + CTA */}
        {price && (
          <div className="p-10 grid lg:grid-cols-2 gap-10 items-center" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(239,68,68,0.04)' }}>
            <div>
              <div className="text-3xl font-black mb-6">Стоимость</div>
              <div className="font-mono-terminal text-5xl font-black mb-6 neon-red">{price.value}</div>
              <div className="text-zinc-300 text-lg leading-relaxed">{price.desc}</div>
            </div>
            <LeadForm button={cta || 'Обсудить проект'} textarea="Опишите вашу задачу" />
          </div>
        )}
      </section>
    </Layout>
  )
}
