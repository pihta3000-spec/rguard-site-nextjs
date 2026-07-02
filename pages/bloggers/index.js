import Head from 'next/head'
import Seo from '@/components/Seo'
import Link from 'next/link'
import Layout from '@/components/Layout'
import HeroTitle from '@/components/HeroTitle'
import { getBloggers, resolvePageSeo } from '@/lib/db'

export default function Bloggers({ bloggers , seo }) {
  return (
    <Layout title="Блогеры" description="Лица проекта RGUARD — блогеры и амбассадоры industrial-контента.">
      <Seo seo={seo} />
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <div className="max-w-5xl mb-16">
          <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-4">// BLOGGERS</div>
          <HeroTitle
            className="mb-6"
            before="Люди, которые"
            accent="делают контент"
            after="RGUARD живым"
            variant="split"
          />
          <p className="text-zinc-300 text-xl">Каждый блогер — отдельный тип подачи, аудитории и взаимодействия с industrial-средой.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bloggers.map((blogger, i) => (
            <Link key={blogger._id} href={`/bloggers/${blogger.slug}`} className="cyber-card overflow-hidden block">
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
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const bloggers = await getBloggers()
  return { props: { seo: resolvePageSeo('/bloggers'), bloggers: bloggers || [] }, revalidate: 60 }
}
