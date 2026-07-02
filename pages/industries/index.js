import Head from 'next/head'
import Seo from '@/components/Seo'
import Link from 'next/link'
import { Pickaxe, HardHat, Factory, Wheat, Flame, Building2 } from 'lucide-react'
import Layout from '@/components/Layout'
import HeroTitle from '@/components/HeroTitle'
import { getIndustries, resolvePageSeo } from '@/lib/db'

const ICONS = {
  mining: Pickaxe, construction: HardHat, manufacturing: Factory,
  agro: Wheat, 'oil-gas': Flame, realty: Building2,
}

export default function Industries({ industries , seo }) {
  return (
    <Layout title="Отраслевые решения" description="Готовые контент-решения для добычи, строительства, производства, нефтегаза, агросектора и недвижимости.">
      <Seo seo={seo} />
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <div className="max-w-5xl mb-16">
          <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-4">// INDUSTRIES</div>
          <HeroTitle
            className="mb-6"
            accent="Отраслевые решения"
            variant="split"
          />
          <p className="text-zinc-400 text-xl max-w-3xl">Готовые контент-стратегии под вашу отрасль. Выберите направление — покажем, что работает именно в вашей нише.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, i) => {
            const Icon = ICONS[industry.slug] || Building2
            return (
              <Link key={industry._id} href={`/industries/${industry.slug}`} className="cyber-card p-8 block">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-red-500" style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.6))' }}>
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <div className="font-mono-terminal text-red-500/30 text-xs">#{String(i+1).padStart(2,'0')}</div>
                </div>
                <h2 className="text-2xl font-black mb-4 leading-tight">{industry.title}</h2>
                {industry.shortDesc && <p className="text-zinc-500 text-sm leading-relaxed mb-6">{industry.shortDesc}</p>}
                <div className="font-mono-terminal text-xs text-red-500 tracking-[2px]">ПОДРОБНЕЕ →</div>
              </Link>
            )
          })}
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const industries = await getIndustries()
  return { props: { seo: resolvePageSeo('/industries'), industries: industries || [] }, revalidate: 60 }
}
