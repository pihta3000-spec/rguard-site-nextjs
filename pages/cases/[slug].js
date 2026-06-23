import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { LeadForm } from '@/components/ui'
import { getCases, getCase } from '@/lib/db'

const SERVICE_LABELS = {
  viral: 'Вирусные видеоролики',
  production: 'Продюсирование и SMM',
  corporate: 'Корпоративные фильмы',
  'ai-content': 'ИИ контент',
}

// Инсайт: первое предложение → заголовок, остальное → текст
function splitInsight(insight) {
  const s = (insight || '').trim()
  if (!s) return null
  const m = s.match(/^(.+?[.!?])(\s+)([\s\S]+)$/)
  if (m) return { head: m[1].trim(), body: m[3].trim() }
  return { head: s, body: '' }
}

export default function CasePage({ item }) {
  const eyebrow = `// КЕЙС / ${(SERVICE_LABELS[item.service] || 'RGUARD').toUpperCase()}`
  const insight = splitInsight(item.insight)
  const metrics = (item.metrics || []).filter(m => m.value || m.label)
  const links = item.links || []
  const worked = item.whatWorked || []

  return (
    <Layout title={`${item.title} — кейс RGUARD`} description={item.shortText || `Кейс RGUARD: ${item.title}.`}>
      <Head>
        <title>{`Кейс ${item.title} — RGUARD`}</title>
        <meta name="description" content={item.shortText || `Кейс RGUARD: ${item.title}.`} />
        <link rel="canonical" href={`https://rguard.ru/cases/${item.id}`} />
      </Head>
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <Link href="/cases" className="mb-10 inline-block font-mono-terminal text-zinc-500 hover:text-red-400 text-xs uppercase tracking-[3px]">← Назад к кейсам</Link>

        <div className="mb-16 max-w-6xl">
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">{eyebrow}{item.accent ? ` · ${item.accent}` : ''}</div>
          <h1 className="glitch-hero text-5xl md:text-7xl font-black leading-none mb-8">{item.title}</h1>
          {item.shortText && <p className="text-zinc-300 text-xl leading-relaxed max-w-4xl">{item.shortText}</p>}
        </div>

        {item.coverImage && (
          <div className="mb-24 overflow-hidden" style={{ border: '1px solid rgba(239,68,68,0.2)', clipPath: 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))' }}>
            <img src={item.coverImage} alt={item.title} className="w-full object-cover" style={{ aspectRatio: '16/9' }} />
          </div>
        )}

        {links.length > 0 && (
          <div className="mb-24">
            <div className="text-4xl font-black mb-10">Видео кейса</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map((link, i) => (
                <a key={i} href={link} target="_blank" rel="noreferrer"
                  className="relative aspect-[9/16] flex items-center justify-center text-center p-5 transition-all hover:border-red-500"
                  style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'linear-gradient(180deg,#111 0%,black 100%)' }}>
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at top,rgba(239,68,68,0.16),transparent 40%)' }} />
                  <div className="relative z-10">
                    <div className="font-mono-terminal text-red-500 uppercase tracking-[3px] text-xs mb-4">Ролик {i + 1}</div>
                    <div className="mx-auto mb-4 flex items-center justify-center rounded-full" style={{ width: 56, height: 56, background: 'rgba(239,68,68,0.9)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                    <div className="text-xl font-black mb-2">Смотреть ролик</div>
                    <div className="font-mono-terminal text-zinc-500 text-xs">Откроется в новой вкладке</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
            {metrics.map((m, i) => (
              <div key={i} className="p-8 hud-corner" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
                <div className="font-mono-terminal text-3xl font-black neon-red mb-2">{m.value}</div>
                <div className="font-mono-terminal text-zinc-500 text-xs uppercase leading-relaxed" style={{ letterSpacing: '0.05em' }}>{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {(item.task || item.solution) && (
          <div className="grid lg:grid-cols-2 gap-10 mb-24">
            {item.task && (
              <div className="p-10" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
                <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-5">// ЗАДАЧА</div>
                <h2 className="text-3xl md:text-4xl font-black mb-6">Что нужно было решить</h2>
                <p className="text-zinc-300 text-lg leading-relaxed">{item.task}</p>
              </div>
            )}
            {item.solution && (
              <div className="p-10" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(239,68,68,0.04)' }}>
                <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-5">// РЕШЕНИЕ</div>
                <h2 className="text-3xl md:text-4xl font-black mb-6">Что мы сделали</h2>
                <p className="text-zinc-300 text-lg leading-relaxed">{item.solution}</p>
              </div>
            )}
          </div>
        )}

        {worked.length > 0 && (
          <div className="mb-24">
            <div className="text-4xl font-black mb-10">Что сработало</div>
            <div className="grid md:grid-cols-3 gap-4">
              {worked.map((w, i) => (
                <div key={i} className="p-7" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
                  <div className="font-mono-terminal text-red-500 text-xs mb-3">0{i + 1}</div>
                  <div className="text-xl font-black leading-tight">{w}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {insight && (
          <div className="mb-24 relative overflow-hidden p-10 md:p-14" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(10,10,20,0.9)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at top right,rgba(239,68,68,0.08) 0%,transparent 60%)' }} />
            <div className="relative z-10 max-w-5xl">
              <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">// СИЛЬНЫЙ ИНСАЙТ КЕЙСА</div>
              <h2 className="text-3xl md:text-5xl font-black leading-tight mb-8">{insight.head}</h2>
              {insight.body && <p className="text-zinc-300 text-xl leading-relaxed">{insight.body}</p>}
            </div>
          </div>
        )}

        <div className="p-10 md:p-14" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-4xl md:text-5xl font-black leading-tight mb-6">Хотите похожий результат для своей компании?</div>
              <p className="text-zinc-300 text-xl">Разберём вашу задачу и предложим формат, который привлечёт внимание нужной аудитории.</p>
            </div>
            <LeadForm button="Обсудить проект" />
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticPaths() {
  const cases = await getCases()
  const paths = (cases || []).filter(c => c.id).map(c => ({ params: { slug: c.id } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const item = await getCase(params.slug)
  if (!item) return { notFound: true }
  return { props: { item }, revalidate: 60 }
}
