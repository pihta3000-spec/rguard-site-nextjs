import Head from 'next/head'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import Layout from '@/components/Layout'
import { getPosts } from '@/lib/sanity'

const CATEGORIES = [
  { id: 'all', label: 'Все статьи' },
  { id: 'viral', label: 'Вирусный контент' },
  { id: 'cases', label: 'Кейсы' },
  { id: 'tools', label: 'Инструменты' },
  { id: 'trends', label: 'Тренды' },
]

export default function Articles({ posts }) {
  const [filter, setFilter] = useState('all')
  const filtered = useMemo(() => filter === 'all' ? posts : posts.filter(p => p.category === filter), [posts, filter])
  const formatDate = iso => iso ? new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  return (
    <Layout title="Статьи" description="Экспертные статьи о вирусном контенте, B2B-маркетинге и продвижении в реальном секторе.">
      <Head>
        <title>Статьи о вирусном контенте и industrial-маркетинге — RGUARD</title>
        <meta name="description" content="Экспертные статьи о вирусном контенте, B2B-маркетинге и продвижении в реальном секторе." />
        <link rel="canonical" href="https://rguard.ru/articles" />
      </Head>
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <div className="max-w-5xl mb-16">
          <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-4">// ARTICLES</div>
          <h1 className="glitch-hero text-5xl md:text-7xl font-black leading-none mb-6">Статьи</h1>
          <p className="text-zinc-400 text-xl">Экспертный контент о вирусном маркетинге, industrial-аудитории и реальных кейсах.</p>
        </div>
        <div className="flex flex-wrap gap-3 mb-12">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setFilter(cat.id)}
              className={`font-mono-terminal text-xs uppercase tracking-[2px] px-5 py-3 transition-all cursor-pointer ${filter === cat.id ? 'text-white' : 'text-zinc-500 hover:text-red-400'}`}
              style={filter === cat.id ? { border: '1px solid rgba(239,68,68,0.8)', background: 'rgba(239,68,68,0.15)' } : { border: '1px solid rgba(239,68,68,0.2)', background: 'transparent' }}>
              {cat.label}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-24" style={{ border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(10,10,20,0.8)' }}>
            <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] mb-4">// EMPTY</div>
            <div className="text-2xl font-black mb-4">Статьи появятся здесь</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <Link key={post._id} href={`/articles/${post.slug}`} className="cyber-card overflow-hidden block">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-full aspect-video object-cover" />
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.05)', borderBottom: '1px solid rgba(239,68,68,0.12)' }}>
                    <span className="font-mono-terminal text-red-500/30 text-xs tracking-[3px]">NO IMAGE</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono-terminal text-red-500 text-xs tracking-[2px] uppercase">{CATEGORIES.find(c => c.id === post.category)?.label || post.category}</span>
                    {post.publishedAt && <span className="font-mono-terminal text-zinc-600 text-xs">{formatDate(post.publishedAt)}</span>}
                  </div>
                  <h2 className="text-xl font-black mb-3 leading-tight">{post.title}</h2>
                  {post.excerpt && <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>}
                  <div className="font-mono-terminal text-xs text-red-500 tracking-[2px]">ЧИТАТЬ →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = await getPosts()
  return { props: { posts: posts || [] }, revalidate: 60 }
}
