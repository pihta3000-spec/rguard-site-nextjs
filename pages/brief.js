import dynamic from 'next/dynamic'
import Layout from '@/components/Layout'
import Seo from '@/components/Seo'
import HeroTitle from '@/components/HeroTitle'
import BriefForm from '@/components/BriefForm'
import { resolvePageSeo } from '@/lib/db'

const BriefSequenceBackdrop = dynamic(() => import('@/components/BriefSequenceBackdrop'), { ssr: false })

export default function BriefPage({ seo }) {
  return (
    <Layout title="Бриф" description="Заполните бриф RGUARD: расскажите о задаче, аудитории и контактах, чтобы мы предложили подход к вирусному контенту.">
      <Seo seo={seo} />
      <BriefSequenceBackdrop />
      <section className="relative z-10 px-4 sm:px-6 py-16 md:py-24 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-10 xl:gap-16 items-start">
          <div className="pt-4 lg:sticky lg:top-28">
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">// INIT_REQUEST</div>
            <HeroTitle
              className="mb-8"
              before="Расскажите, какая"
              accent="задача стоит"
              after="перед брендом"
              variant="split"
            />
            <p className="text-zinc-300 text-xl leading-relaxed max-w-2xl">
              Ответьте на несколько вопросов. Мы разберем вводные и предложим сценарный, продюсерский или медийный подход под вашу аудиторию.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-3 max-w-xl">
              {['3-5 минут', 'Без лишних полей', 'Сразу в работу', 'Свяжемся лично'].map(item => (
                <div key={item} className="font-mono-terminal text-zinc-400 text-xs uppercase tracking-[2px] px-4 py-3" style={{ border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(10,10,20,0.62)' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 pointer-events-none" style={{ border: '1px solid rgba(239,68,68,0.12)', background: 'rgba(239,68,68,0.035)' }} />
            <div className="relative p-6 sm:p-10" style={{ border: '1px solid rgba(239,68,68,0.32)', background: 'rgba(10,10,20,0.94)', backdropFilter: 'blur(8px)' }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.75), transparent)' }} />
              <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs mb-8">// Бриф на сотрудничество</div>
              <BriefForm />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  return { props: { seo: resolvePageSeo('/brief') }, revalidate: 60 }
}
