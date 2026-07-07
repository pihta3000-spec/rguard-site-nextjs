import Layout from '@/components/Layout'
import Seo from '@/components/Seo'
import HeroTitle from '@/components/HeroTitle'
import DesktopOnly from '@/components/DesktopOnly'
import dynamic from 'next/dynamic'
import { resolvePageSeo } from '@/lib/db'
import { LeadForm, Card, CaptureTitle, SectionAccentTitle } from '@/components/ui'

const ServiceScrollAnimation = dynamic(() => import('@/components/ServiceScrollAnimation'), { ssr: false })

const STEPS = [
  ['01','Изучаем аудиторию','Разбираемся в продукте, задачах бизнеса, болях клиентов, возражениях и конфликтных точках.'],
  ['02','Находим конфликт','Любой вирусный сценарий строится на напряжении. Ищем противоречия, спорные мнения и эмоциональные триггеры.'],
  ['03','Создаём персонажей','Продумываем типажи, характеры, манеру речи, узнаваемые реплики и поведение в кадре.'],
  ['04','Пишем сценарий','Проектируем захват внимания, развитие конфликта, сильную развязку и призыв к действию. Сразу рассчитываем хронометраж.'],
  ['05','Проектируем визуальную часть','Прописываем крупность кадров, локации, действия персонажей и визуальные акценты.'],
  ['06','Собираем раскадровку','Все материалы собираются в единый онлайн-документ: сценарий, сцены, визуальные референсы и тайминг.'],
  ['07','Согласование','До съёмки клиент получает полное понимание будущего ролика без сюрпризов на площадке.'],
]

export default function Scripts({ seo }) {
  return (
    <Layout title="Написание сценариев" description="Разрабатываем вирусные сценарии для видеороликов: захват внимания, удержание, драматургия и призыв к действию. Раскадровка в комплекте.">
      <Seo seo={seo} />
      <DesktopOnly><ServiceScrollAnimation variant="scripts" /></DesktopOnly>
      <section className="relative px-4 sm:px-6 py-20 max-w-7xl mx-auto" style={{ zIndex: 2 }}>
        <div className="max-w-6xl mb-20">
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">// КРЕАТИВ / НАПИСАНИЕ СЦЕНАРИЕВ</div>
          <HeroTitle
            className="mb-8"
            before="Сценарии, которые"
            accent="хочется досматривать"
            after="и пересылать"
            variant="split"
          />
          <p className="text-zinc-300 text-xl leading-relaxed max-w-4xl">Создаём сценарии не ради красивого текста. Наша задача — удержать внимание зрителя, вызвать эмоцию и помочь ролику распространиться.</p>
        </div>

        {/* Проблема + что должен делать */}
        <div className="grid lg:grid-cols-2 gap-10 mb-24">
          <div>
            <SectionAccentTitle className="mb-8" before="Почему обычные сценарии" accent="не работают" />
            <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
              <p>Большинство сценариев пишутся как литературный текст. Но вирусный ролик — это точный расчёт человеческого внимания.</p>
              <p>Важно не только, что сказать, но и когда, как удержать интерес и что заставит человека переслать ролик коллегам.</p>
              <p>Мы проектируем сценарии под бизнес-задачу, а не ради красивых формулировок.</p>
            </div>
          </div>
          <div className="p-10" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
            <SectionAccentTitle className="section-accent-title--compact mb-8" before="Что должен делать" accent="хороший сценарий" />
            <div className="space-y-4 text-zinc-300 text-lg leading-relaxed">
              {['Зацепить внимание в первые секунды','Удерживать интерес до конца','Вызывать эмоцию и обсуждение','Формировать доверие к бренду','Подталкивать к нужному действию'].map(t => <p key={t}>• {t}</p>)}
            </div>
          </div>
        </div>

        {/* Раскадровка */}
        <div className="mb-24 grid lg:grid-cols-2 gap-12 items-center p-10 md:p-14" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
          <div>
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-5">// ПРИМЕР РАБОЧЕГО ДОКУМЕНТА</div>
            <SectionAccentTitle className="mb-6" before="Рабочая раскадровка" accent="до начала съёмок" />
            <p className="text-zinc-300 text-lg leading-relaxed mb-8">Клиент получает прозрачный рабочий документ, где собраны сценарий, сцены, визуальные ориентиры и логика ролика.</p>
            <a href="https://docs.google.com/spreadsheets/d/1zC_i7OlNglaqsuE-jAOFpRZc7jxqidL9Sbr0w3_ybvc/edit?gid=0#gid=0" target="_blank" rel="noreferrer" className="btn-primary inline-flex">Посмотреть пример раскадровки</a>
          </div>
          <div className="overflow-hidden" style={{aspectRatio:'16/10',border:'1px solid rgba(239,68,68,0.15)',background:'rgba(0,0,0,0.4)'}}>
            <img src="/scripts-storyboard.webp" alt="Пример рабочей раскадровки RGUARD" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </div>
        </div>

        {/* Шаги */}
        <div className="mb-24">
          <SectionAccentTitle className="mb-12" before="Как мы" accent="работаем" />
          <div className="space-y-4">
            {STEPS.map(([num,title,desc]) => (
              <div key={num} className="p-8 flex gap-6 items-start" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
                <div className="font-mono-terminal text-2xl font-black text-red-500 min-w-[56px]" style={{textShadow:'0 0 10px rgba(239,68,68,0.6)'}}>{num}</div>
                <div><div className="text-2xl font-bold mb-2">{title}</div><div className="text-zinc-400 leading-relaxed">{desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Что получает клиент */}
        <div className="mb-24">
          <SectionAccentTitle className="mb-10" before="Что получает" accent="клиент" />
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card title="Готовый сценарий" text="Полноценный текст для съёмки." />
            <Card title="Раскадровка" text="Пошаговый план производства." />
            <Card title="Визуальные ориентиры" text="Понимание будущих сцен." />
            <Card title="Тайминг" text="Расчёт длительности ролика." />
            <Card title="Персонажи" text="Проработанные роли и реплики." />
          </div>
        </div>

        {/* CTA */}
        <div className="grid lg:grid-cols-2 gap-12 items-center p-10 md:p-14" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
          <div>
            <CaptureTitle
              before={['Нужен сценарий,', 'который']}
              accent="будут смотреть до конца?"
            />
            <p className="text-zinc-300 text-xl">Разберём вашу задачу и предложим сценарный подход под вашу аудиторию.</p>
          </div>
          <LeadForm button="Обсудить сценарий" />
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  return { props: { seo: resolvePageSeo('/scripts') }, revalidate: 60 }
}
