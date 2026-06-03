import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { Pickaxe } from 'lucide-react'
import Layout from '@/components/Layout'
import { LeadForm } from '@/components/ui'
import { getBloggers, getBlogger } from '@/lib/sanity'

function PhotoGallery({ count = 6 }) {
  const [current, setCurrent] = useState(0)
  return (
    <div className="relative aspect-[4/5] bg-black overflow-hidden select-none" style={{ border: '1px solid rgba(239,68,68,0.4)' }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.10),transparent_40%)]" />
      <div className="absolute inset-0 flex items-center justify-center text-center p-8 z-10">
        <div>
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs mb-4">Фото {current + 1} / {count}</div>
          <div className="text-zinc-600 uppercase tracking-[3px] text-sm">Photo Placeholder</div>
        </div>
      </div>
      <button onClick={() => setCurrent(i => (i - 1 + count) % count)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white text-lg" style={{ border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(0,0,0,0.7)' }}>‹</button>
      <button onClick={() => setCurrent(i => (i + 1) % count)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white text-lg" style={{ border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(0,0,0,0.7)' }}>›</button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current ? 'bg-red-500 w-5' : 'bg-white/30 w-2'}`} />
        ))}
      </div>
    </div>
  )
}

export default function BloggerPage({ blogger }) {
  if (!blogger) return null

  return (
    <Layout title={blogger.name} description={blogger.desc}>
      <Head>
        <title>{blogger.name} — блогер RGUARD</title>
        <meta name="description" content={blogger.desc} />
        <link rel="canonical" href={`https://rguard.ru/bloggers/${blogger.slug}`} />
      </Head>
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <Link href="/bloggers" className="mb-10 inline-block font-mono-terminal text-zinc-500 hover:text-red-400 text-xs uppercase tracking-[3px]">← Все блогеры</Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-16 items-start">
          <PhotoGallery count={blogger.photoCount || 6} />
          <div>
            <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-4">// BLOGGER.RGUARD</div>
            <h1 className="glitch-hero text-5xl md:text-6xl font-black leading-none mb-6">{blogger.name}</h1>
            <div className="space-y-4 text-zinc-300 text-lg leading-relaxed mb-10">
              {(blogger.bio || []).map((block, i) => (
                <p key={i}>{block?.children?.[0]?.text || ''}</p>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {(blogger.metrics || []).map((m) => {
                const v = m.value || m[0]; const l = m.label || m[1];
                return (
                  <div key={l} className="p-5 text-center hud-corner" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
                    <div className="font-mono-terminal text-3xl font-black neon-red mb-2">{v}</div>
                    <div className="font-mono-terminal text-zinc-500 text-xs uppercase leading-relaxed" style={{ wordBreak: 'normal', overflowWrap: 'normal', letterSpacing: '0.05em' }}>{l}</div>
                  </div>
                )
              })}
            </div>
            <div className="mb-10">
              <div className="font-mono-terminal text-zinc-500 text-xs uppercase tracking-[3px] mb-4">Социальные сети</div>
              <div className="flex flex-wrap gap-3">
                {(blogger.socials || []).map(s => (
                  <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="cyber-card px-6 py-3 font-bold text-sm">{s.label}</a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {(blogger.specializations?.length > 0) && (
          <div className="mb-24 p-10 md:p-12" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
            <div className="font-mono-terminal text-zinc-500 text-xs uppercase tracking-[3px] mb-6">Специализации</div>
            <div className="flex flex-wrap gap-3">
              {blogger.specializations.map(spec => (
                <span key={spec} className="text-2xl md:text-3xl font-black text-white px-6 py-3 leading-tight" style={{ border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.1)' }}>{spec}</span>
              ))}
            </div>
          </div>
        )}

        <div className="p-10 md:p-14" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(239,68,68,0.04)' }}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-4xl md:text-5xl font-black mb-6">Хотите снять контент с {blogger.name}?</div>
              <p className="text-zinc-400 text-xl">Обсудим задачу и подберём формат.</p>
            </div>
            <LeadForm button="Обсудить проект" />
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticPaths() {
  const bloggers = await getBloggers()
  return { paths: (bloggers || []).map(b => ({ params: { slug: b.slug } })), fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const blogger = await getBlogger(params.slug)
  if (!blogger) return { notFound: true }
  return { props: { blogger }, revalidate: 60 }
}
