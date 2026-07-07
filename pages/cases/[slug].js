import Link from 'next/link'
import Layout from '@/components/Layout'
import SocialMeta from '@/components/SocialMeta'
import { LeadForm, CaptureTitle, SectionAccentTitle } from '@/components/ui'
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

const SERVICE_ROUTES = ['viral', 'production', 'corporate', 'ai-content']

function localVideoPoster(link) {
  return link
    .replace(/^\/cases-videos\//, '/cases-posters/')
    .replace(/\.(mp4|webm|mov)(\?.*)?$/i, '.jpg')
}

function toggleVideoFromSurface(event) {
  const video = event.currentTarget.parentElement?.querySelector('video')
  if (!video) return

  if (video.paused) {
    video.play().catch(() => {})
  } else {
    video.pause()
  }
}

export default function CasePage({ item, related = [] }) {
  const serviceLabel = (SERVICE_LABELS[item.service] || 'RGUARD').toUpperCase()
  const serviceHref = SERVICE_ROUTES.includes(item.service) ? `/${item.service}` : null
  const insight = splitInsight(item.insight)
  const metrics = (item.metrics || []).filter(m => m.value || m.label)
  const links = item.links || []
  const worked = item.whatWorked || []
  const isLocalVideo = (link) => /^\/.*\.(mp4|webm|mov)(\?|#|$)/i.test(link)
  const seoTitle = `Кейс ${item.title} — RGUARD`
  const seoDesc = item.shortText || `Кейс RGUARD: ${item.title}.`

  return (
    <Layout title={`${item.title} — кейс RGUARD`} description={seoDesc}>
      <SocialMeta title={seoTitle} description={seoDesc} url={`/cases/${item.id}`} image={item.coverImage} />
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <Link href="/cases" className="mb-10 inline-block font-mono-terminal text-zinc-500 hover:text-red-400 text-xs uppercase tracking-[3px]">← Назад к кейсам</Link>

        <div className="mb-16 max-w-6xl">
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">
            {'// КЕЙС / '}
            {serviceHref
              ? <Link href={serviceHref} className="hover:text-red-400 underline-offset-4 hover:underline">{serviceLabel}</Link>
              : serviceLabel}
            {item.accent ? ` · ${item.accent}` : ''}
          </div>
          <h1 className="glitch-hero text-5xl md:text-7xl font-black leading-none mb-8">{item.title}</h1>
          {item.shortText && <p className="text-zinc-300 text-xl leading-relaxed max-w-4xl">{item.shortText}</p>}
        </div>

        {item.coverImage && (
          <div className="mb-24 overflow-hidden" style={{ border: '1px solid rgba(239,68,68,0.2)', clipPath: 'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))' }}>
            <img src={item.coverImage} alt={item.title} decoding="async" className="w-full object-cover" style={{ aspectRatio: '16/9' }} />
          </div>
        )}

        {metrics.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-24">
            {metrics.map((m, i) => (
              <div key={i} className="flex-1 min-w-[140px] p-8 hud-corner" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
                <div className="font-mono-terminal text-3xl font-black neon-red mb-2">{m.value}</div>
                <div className="font-mono-terminal text-zinc-500 text-xs uppercase leading-relaxed" style={{ letterSpacing: '0.05em' }}>{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {links.length > 0 && (
          <div className="mb-24">
            <SectionAccentTitle className="mb-10" before="Видео" accent="кейса" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {links.map((link, i) => (
                isLocalVideo(link) ? (
                  <div key={i}
                    className="relative overflow-hidden transition-all hover:border-red-500"
                    style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'linear-gradient(180deg,#111 0%,black 100%)' }}>
                    <video
                      src={link}
                      poster={localVideoPoster(link)}
                      controls
                      preload="none"
                      playsInline
                      className="block w-full aspect-[9/16] object-cover bg-black cursor-pointer"
                    />
                    <button
                      type="button"
                      aria-label="Воспроизвести или поставить видео на паузу"
                      onClick={toggleVideoFromSurface}
                      className="absolute inset-x-0 top-0 bottom-14 z-10 cursor-pointer"
                      style={{ background: 'transparent' }}
                    />
                    <div className="pointer-events-none absolute left-3 top-3 font-mono-terminal text-red-500 uppercase tracking-[3px] text-xs bg-black/70 px-2 py-1">
                      Ролик {i + 1}
                    </div>
                  </div>
                ) : (
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
                )
              ))}
            </div>
          </div>
        )}

        {(item.task || item.solution) && (
          <div className="grid lg:grid-cols-2 gap-10 mb-24">
            {item.task && (
              <div className="p-10" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
                <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-5">// ЗАДАЧА</div>
                <SectionAccentTitle className="section-accent-title--compact mb-6" before="Что нужно было" accent="решить" />
                <p className="text-zinc-300 text-lg leading-relaxed">{item.task}</p>
              </div>
            )}
            {item.solution && (
              <div className="p-10" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(239,68,68,0.04)' }}>
                <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-5">// РЕШЕНИЕ</div>
                <SectionAccentTitle className="section-accent-title--compact mb-6" before="Что мы" accent="сделали" />
                <p className="text-zinc-300 text-lg leading-relaxed">{item.solution}</p>
              </div>
            )}
          </div>
        )}

        {worked.length > 0 && (
          <div className="mb-24">
            <SectionAccentTitle className="mb-10" before="Что" accent="сработало" />
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
              <SectionAccentTitle className="section-accent-title--allow-accent-wrap mb-8" accent={insight.head} />
              {insight.body && <p className="text-zinc-300 text-xl leading-relaxed">{insight.body}</p>}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mb-24">
            <div className="flex items-end justify-between gap-4 mb-8">
              <SectionAccentTitle className="section-accent-title--compact" before="Смотрите" accent="также" />
              {serviceHref && <Link href={serviceHref} className="font-mono-terminal text-red-400 hover:text-red-300 text-xs uppercase tracking-[2px] whitespace-nowrap">Все об услуге →</Link>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/cases/${r.id}`} className="cyber-card block overflow-hidden">
                  <div className="aspect-[16/9] overflow-hidden border-b border-red-950/20">
                    {r.coverImage
                      ? <img src={r.coverImage} alt={r.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      : <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#0d0d1a,#1a0a0e)' }} />}
                  </div>
                  <div className="p-5">
                    <div className="font-mono-terminal text-red-500 uppercase tracking-[2px] mb-2" style={{ fontSize: 10 }}>{SERVICE_LABELS[r.service] || r.service}</div>
                    <div className="text-lg font-black leading-tight">{r.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="p-10 md:p-14" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <CaptureTitle before="Хотите" accent="похожий результат" after="для своей компании?" />
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

  // Похожие кейсы: сперва той же категории, добор — остальными
  const all = (await getCases()) || []
  const pick = (arr) => arr.filter(c => c.id !== item.id)
  const sameService = pick(all.filter(c => c.service === item.service))
  const rest = pick(all.filter(c => c.service !== item.service))
  const related = [...sameService, ...rest].slice(0, 3).map(c => ({
    id: c.id, title: c.title, service: c.service || null, coverImage: c.coverImage || null,
  }))

  return { props: { item, related }, revalidate: 60 }
}
