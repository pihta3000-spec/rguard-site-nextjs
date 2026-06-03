import Head from 'next/head'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import Layout from '@/components/Layout'
import { LeadForm } from '@/components/ui'
import { getPosts, getPost } from '@/lib/sanity'

const CATEGORIES = { viral: 'Вирусный контент', cases: 'Кейсы', tools: 'Инструменты', trends: 'Тренды' }

const ptComponents = {
  block: {
    h2: ({ children }) => <h2 className="glitch-hero text-3xl font-black mt-12 mb-6">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold mt-8 mb-4 text-white">{children}</h3>,
    normal: ({ children }) => <p className="text-zinc-300 text-lg leading-relaxed mb-6">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 pl-6 py-4" style={{ borderLeft: '3px solid rgba(239,68,68,0.6)', background: 'rgba(239,68,68,0.04)' }}>
        <p className="text-zinc-200 text-lg italic">{children}</p>
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
    link: ({ value, children }) => <a href={value?.href} target={value?.blank ? '_blank' : undefined} rel="noreferrer" className="text-red-400 hover:text-red-300 underline underline-offset-4">{children}</a>,
  },
  types: {
    image: ({ value }) => value?.asset?.url ? (
      <figure className="my-10">
        <img src={value.asset.url} alt={value.caption || ''} className="w-full" style={{ border: '1px solid rgba(239,68,68,0.15)' }} />
        {value.caption && <figcaption className="font-mono-terminal text-zinc-500 text-xs mt-3 text-center">{value.caption}</figcaption>}
      </figure>
    ) : null,
    videoEmbed: ({ value }) => value?.url ? (
      <a href={value.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-6 cyber-card my-10 block">
        <div className="font-mono-terminal text-red-500 text-xs tracking-[3px]">[ VIDEO ]</div>
        <div className="text-zinc-300 text-sm">{value.caption || value.url}</div>
      </a>
    ) : null,
  },
}

export default function Article({ post }) {
  if (!post) return null
  const seoTitle = post.seo?.metaTitle || `${post.title} — RGUARD`
  const seoDesc = post.seo?.metaDescription || post.excerpt || ''
  const formatDate = iso => iso ? new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  return (
    <Layout title={post.title} description={seoDesc}>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <link rel="canonical" href={`https://rguard.ru/articles/${post.slug}`} />
      </Head>
      <section className="px-4 sm:px-6 py-20 max-w-4xl mx-auto">
        <Link href="/articles" className="mb-10 inline-block font-mono-terminal text-zinc-500 hover:text-red-400 text-xs uppercase tracking-[3px]">← Все статьи</Link>
        {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full aspect-video object-cover mb-10" style={{ border: '1px solid rgba(239,68,68,0.15)' }} />}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono-terminal text-red-500 text-xs tracking-[2px] uppercase">{CATEGORIES[post.category] || post.category}</span>
          {post.publishedAt && <span className="font-mono-terminal text-zinc-600 text-xs">{formatDate(post.publishedAt)}</span>}
        </div>
        <h1 className="glitch-hero text-4xl md:text-6xl font-black leading-tight mb-8">{post.title}</h1>
        {post.excerpt && <p className="text-zinc-300 text-xl leading-relaxed mb-12 pb-12" style={{ borderBottom: '1px solid rgba(239,68,68,0.15)' }}>{post.excerpt}</p>}
        {post.body && <PortableText value={post.body} components={ptComponents} />}

        {post.relatedPosts?.length > 0 && (
          <div className="mt-20 pt-12" style={{ borderTop: '1px solid rgba(239,68,68,0.15)' }}>
            <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-8">// ПОХОЖИЕ СТАТЬИ</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.relatedPosts.map(p => (
                <Link key={p._id} href={`/articles/${p.slug}`} className="cyber-card p-6 block">
                  <div className="font-mono-terminal text-red-500 text-xs tracking-[2px] uppercase mb-3">{CATEGORIES[p.category] || p.category}</div>
                  <div className="text-lg font-bold leading-tight mb-2">{p.title}</div>
                  {p.excerpt && <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{p.excerpt}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 p-10 md:p-14" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-4xl font-black mb-6">Хотите такой же контент?</div>
              <p className="text-zinc-400 text-lg">Разберём нишу и предложим форматы.</p>
            </div>
            <LeadForm button="Обсудить проект" />
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticPaths() {
  const posts = await getPosts()
  return { paths: (posts || []).map(p => ({ params: { slug: p.slug } })), fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const post = await getPost(params.slug)
  if (!post) return { notFound: true }
  return { props: { post }, revalidate: 60 }
}
