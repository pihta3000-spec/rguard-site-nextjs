import Link from 'next/link'
import Layout from '@/components/Layout'
import SocialMeta from '@/components/SocialMeta'

const articleHref = post => post?.urlPath || `/articles/${post?.slug || ''}`

export default function ArticleCategoryPage({ category, posts = [] }) {
  const title = category?.category || 'Статьи'
  const description = `Статьи RGUARD в категории «${title}»: подходы, примеры и практические разборы для industrial B2B.`
  const formatDate = iso => iso ? new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  return (
    <Layout title={`${title} — статьи RGUARD`} description={description}>
      <SocialMeta title={`${title} — статьи RGUARD`} description={description} url={category?.categoryUrl || '/articles'} type="website" />
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <nav className="mb-10 flex flex-wrap items-center gap-2 font-mono-terminal text-xs uppercase tracking-[2px] text-zinc-600">
          <Link href="/articles" className="hover:text-red-400">Статьи</Link>
          <span>/</span>
          <span className="text-zinc-500">{title}</span>
        </nav>

        <div className="max-w-5xl mb-16">
          <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-4">{'// ARTICLES_CATEGORY'}</div>
          <h1 className="glitch-hero text-4xl md:text-6xl font-black leading-tight mb-6">{title}</h1>
          <p className="text-zinc-400 text-xl">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post._id} href={articleHref(post)} className="cyber-card overflow-hidden block">
              {post.coverImage ? (
                <img src={post.coverImage} alt={post.title} loading="lazy" decoding="async" className="w-full aspect-video object-cover" />
              ) : (
                <div className="w-full aspect-video flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.05)', borderBottom: '1px solid rgba(239,68,68,0.12)' }}>
                  <span className="font-mono-terminal text-red-500/30 text-xs tracking-[3px]">NO IMAGE</span>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {post.materialType && <span className="font-mono-terminal text-red-500 text-xs tracking-[2px] uppercase">{post.materialType}</span>}
                  {post.publishedAt && <span className="font-mono-terminal text-zinc-600 text-xs">{formatDate(post.publishedAt)}</span>}
                </div>
                <h2 className="text-xl font-black mb-3 leading-tight">{post.title}</h2>
                {post.excerpt && <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>}
                <div className="font-mono-terminal text-xs text-red-500 tracking-[2px]">Читать →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  )
}
