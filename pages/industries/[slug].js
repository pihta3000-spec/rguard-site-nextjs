import Head from 'next/head'
import Link from 'next/link'
import { Pickaxe, HardHat, Factory, Wheat, Flame, Building2 } from 'lucide-react'
import Layout from '@/components/Layout'
import { LeadForm, CaptureTitle } from '@/components/ui'
import RichText from '@/components/RichText'
import { getIndustries, getIndustry } from '@/lib/db'

const ICONS = {
  mining: Pickaxe, construction: HardHat, manufacturing: Factory,
  agro: Wheat, 'oil-gas': Flame, realty: Building2,
}

export default function IndustryPage({ industry }) {
  if (!industry) return null
  const Icon = ICONS[industry.slug] || Building2
  const seoTitle = industry.seo?.metaTitle || `${industry.title} — контент-решения RGUARD`
  const seoDesc = industry.seo?.metaDescription || industry.shortDesc || ''

  return (
    <Layout title={industry.title} description={seoDesc}>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <link rel="canonical" href={`https://rguard.ru/industries/${industry.slug}`} />
      </Head>
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <Link href="/industries" className="mb-10 inline-block font-mono-terminal text-zinc-500 hover:text-red-400 text-xs uppercase tracking-[3px]">← Все отрасли</Link>

        <div className="grid lg:grid-cols-2 gap-16 mb-20 items-start">
          <div>
            <div className="text-red-500 mb-6" style={{ filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.7))' }}>
              <Icon size={56} strokeWidth={1.5} />
            </div>
            <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-4">// INDUSTRY</div>
            <h1 className="glitch-hero text-5xl md:text-6xl font-black leading-none mb-6">{industry.title}</h1>
            {industry.shortDesc && <p className="text-zinc-300 text-xl leading-relaxed">{industry.shortDesc}</p>}
          </div>
          {industry.coverImage && (
            <img src={industry.coverImage} alt={industry.title} className="w-full aspect-video object-cover" style={{ border: '1px solid rgba(239,68,68,0.15)' }} />
          )}
        </div>

        {industry.body && (
          <div className="max-w-4xl mb-20">
            <RichText html={industry.body} />
          </div>
        )}

        {industry.linkedServices?.length > 0 && (
          <div className="mb-20">
            <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-8">// НАШИ РЕШЕНИЯ ДЛЯ ВАШЕЙ ОТРАСЛИ</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {industry.linkedServices.map((svc, i) => (
                <Link key={i} href={`/${svc.pageId}`} className="cyber-card p-8 block">
                  <div className="font-mono-terminal text-red-500 text-xs tracking-[3px] uppercase mb-4">SVC_{String(i+1).padStart(2,'0')}</div>
                  <div className="text-xl font-black mb-3">{svc.title}</div>
                  {svc.description && <p className="text-zinc-500 text-sm leading-relaxed mb-5">{svc.description}</p>}
                  <div className="font-mono-terminal text-xs text-red-500 tracking-[2px]">УЗНАТЬ ПОДРОБНЕЕ →</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="p-10 md:p-14" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.85)' }}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <CaptureTitle before="Нужен контент" accent={`для ${industry.title.toLowerCase()}?`} />
              <p className="text-zinc-400 text-lg">Разберём специфику бизнеса и предложим подходящие форматы.</p>
            </div>
            <LeadForm button="Обсудить проект" />
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticPaths() {
  const industries = await getIndustries()
  return { paths: (industries || []).map(i => ({ params: { slug: i.slug } })), fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const industry = await getIndustry(params.slug)
  if (!industry) return { notFound: true }
  return { props: { industry }, revalidate: 60 }
}
