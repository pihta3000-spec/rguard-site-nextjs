import Seo from '@/components/Seo'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import Layout from '@/components/Layout'
import HeroTitle from '@/components/HeroTitle'
import { getPosts, resolvePageSeo } from '@/lib/db'

export default function Articles({ posts , seo }) {
  const [filter, setFilter] = useState('all')
  const categories = useMemo(() => {
    const bySlug = new Map()
    for (const post of posts || []) {
      const id = post.categorySlug || post.category
      if (id && !bySlug.has(id)) bySlug.set(id, { id, label: post.category })
    }
    return [{ id: 'all', label: 'Все статьи' }, ...Array.from(bySlug.values())]
  }, [posts])
  const filtered = useMemo(() => filter === 'all' ? posts : posts.filter(p => (p.categorySlug || p.category) === filter), [posts, filter])
  const formatDate = iso => iso ? new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  return (
    <Layout title="Статьи" description="Экспертные статьи о вирусном контенте, B2B-маркетинге и продвижении в реальном секторе.">
      <Seo seo={seo} />
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <div className="max-w-5xl mb-16">
          <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-4">{'// ARTICLES'}</div>
          <HeroTitle
            className="mb-6"
            accent="Статьи"
            variant="split"
          />
          <p className="text-zinc-400 text-xl">Экспертный контент о вирусном маркетинге, industrial-аудитории и реальных кейсах.</p>
        </div>
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setFilter(cat.id)}
              className={`font-mono-terminal text-xs uppercase tracking-[2px] px-5 py-3 transition-all cursor-pointer ${filter === cat.id ? 'text-white' : 'text-zinc-500 hover:text-red-400'}`}
              style={filter === cat.id ? { border: '1px solid rgba(239,68,68,0.8)', background: 'rgba(239,68,68,0.15)' } : { border: '1px solid rgba(239,68,68,0.2)', background: 'transparent' }}>
              {cat.label}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-24" style={{ border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(10,10,20,0.8)' }}>
            <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] mb-4">{'// EMPTY'}</div>
            <div className="text-2xl font-black mb-4">Статьи появятся здесь</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <Link key={post._id} href={post.urlPath || `/articles/${post.slug}`} className="cyber-card overflow-hidden block">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} loading="lazy" decoding="async" className="w-full aspect-video object-cover" />
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.05)', borderBottom: '1px solid rgba(239,68,68,0.12)' }}>
                    <span className="font-mono-terminal text-red-500/30 text-xs tracking-[3px]">NO IMAGE</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono-terminal text-red-500 text-xs tracking-[2px] uppercase">{post.category}</span>
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
  const summaries = (posts || []).map(({ _id, title, slug, category, materialType, categorySlug, categoryUrl, urlPath, publishedAt, excerpt, coverImage }) => ({
    _id,
    title,
    slug,
    category,
    materialType,
    categorySlug,
    categoryUrl,
    urlPath,
    publishedAt,
    excerpt,
    coverImage,
  }))
  return { props: { seo: resolvePageSeo('/articles'), posts: summaries }, revalidate: 60 }
}
