import Head from 'next/head'
import Seo from '@/components/Seo'
import Layout from '@/components/Layout'
import HeroTitle from '@/components/HeroTitle'
import { LeadForm, StatBlock, CaseCard } from '@/components/ui'
import { getCases, resolvePageSeo } from '@/lib/db'

const STEPS = [
  { title: 'Компания обращается с запросом на создание вертикального контента', desc: 'На старте определяем реальные задачи бизнеса: нужен ли поток заявок, рост узнаваемости, усиление HR-бренда или медийность внутри рынка.' },
  { title: 'Проводим анализ текущих аккаунтов и решаем: развивать или запускать новые', desc: 'Изучаем аудиторию, активность, репутацию площадок и принимаем решение, какая стратегия даст максимальный результат.' },
  { title: 'Определяем цели: узнаваемость, охваты, лидогенерация или HR-задачи', desc: 'Формируем KPI будущего контента, чтобы ролики работали не только на просмотры, но и на бизнес-результат.' },
  { title: 'Погружаемся в бизнес-процессы и анализируем боли аудитории', desc: 'Изучаем внутреннюю кухню компании, типажи сотрудников, страхи, желания и триггеры целевой аудитории.' },
  { title: 'Создаём майнд-карту контента и ключевых направлений', desc: 'Собираем систему рубрик, персонажей, конфликтов и смыслов, из которых формируется долгосрочный контент-план.' },
  { title: 'Пишем пробные вирусные сценарии с юмором и storytelling', desc: 'Используем преувеличение, контраст, олицетворение, абсурд и другие механики, которые удерживают внимание.' },
  { title: 'Снимаем тестовый пул роликов и анализируем реакцию аудитории', desc: 'Отслеживаем удержание, вовлечённость, комментарии, пересылки и ищем форматы с максимальным потенциалом.' },
  { title: 'Выбираем лучшие форматы и усиливаем сильное', desc: 'Успешные ролики превращаются в масштабируемые контент-серии, которые стабильно набирают охваты.' },
  { title: 'Продолжаем производство с постоянными экспериментами', desc: 'Контент развивается циклично: тестируем новые идеи, адаптируемся под тренды и усиливаем работающие механики.' },
]

export default function Production({ cases , seo }) {
  const productionCases = cases.filter(c => c.service === 'production')
  return (
    <Layout title="Продюсирование и СММ" description="Системный SMM и видеопродюсирование для B2B-компаний. Контент-стратегия, съёмка, публикации и аналитика под ключ — от 8 роликов в месяц.">
      <Seo seo={seo} />
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <div className="max-w-6xl mb-6">
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">// ПРОДЮСИРОВАНИЕ И СММ</div>
          <HeroTitle
            className="mb-8"
            accent="Контент-система"
            after="для бизнеса"
            variant="split"
          />
          <p className="text-zinc-300 text-xl leading-relaxed max-w-4xl">Строим системную медийность компании: анализируем рынок, находим сильные стороны бизнеса, создаём вирусные форматы и превращаем соцсети в постоянный источник внимания и входящих заявок.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-4 mt-16 mb-24">
          {[['8–10','Видео ежемесячно'],['Full','Продакшн и постинг под ключ'],['Cross','Кросспостинг на все платформы'],['B2B','Специализация на сложных нишах']].map(([v,l]) => <StatBlock key={l} value={v} label={l} />)}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start mb-24">
          <div>
            <div className="text-4xl font-black mb-8">Большинство компаний снимают контент хаотично</div>
            <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
              <p>Нет стратегии, нет понимания аудитории, нет системы тестирования гипотез. Контент превращается в набор случайных публикаций.</p>
              <p>Мы выстраиваем контент как полноценную медиа-систему: с аналитикой, гипотезами и постоянным усилением работающих форматов.</p>
              <p>Наша задача — не просто выкладывать ролики, а создавать контент, который начинает жить внутри рынка.</p>
            </div>
          </div>
          <div className="p-10" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
            <div className="text-3xl font-black mb-8">Что входит в продюсирование</div>
            <div className="space-y-4 text-zinc-300 text-lg leading-relaxed">
              {['Разработка контент-стратегии','Создание вирусных сценариев','Съёмка и монтаж роликов','Кросспостинг на платформы','Аналитика и тестирование гипотез','Усиление успешных форматов','Сторис и backstage-контент'].map(t => <p key={t}>• {t}</p>)}
            </div>
          </div>
        </div>

        <div className="mb-24">
          <div className="text-4xl font-black mb-12">Как мы работаем</div>
          <div className="space-y-4">
            {STEPS.map((item, i) => (
              <div key={i} className="p-8 flex gap-6 items-start" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
                <div className="font-mono-terminal text-2xl font-black text-red-500 min-w-[56px]" style={{textShadow:'0 0 10px rgba(239,68,68,0.6)'}}>0{i+1}</div>
                <div><div className="text-2xl font-bold mb-2">{item.title}</div><div className="text-zinc-400 leading-relaxed">{item.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-24 p-10 md:p-12" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
          <div className="text-4xl font-black mb-10">Принципы нашей работы</div>
          <div className="grid md:grid-cols-2 gap-10 text-zinc-300 text-lg leading-relaxed">
            <div className="space-y-4">
              <p>• Контент должен выглядеть нативно, а не как реклама</p>
              <p>• В центре всегда реальные боли и интересы аудитории</p>
              <p>• Мы тестируем гипотезы, а не угадываем</p>
              <p>• Лучшие ролики масштабируются в серию</p>
            </div>
            <div className="space-y-4">
              <p>• Используем юмор, преувеличение и контраст</p>
              <p>• Контент должен вызывать эмоцию и желание переслать</p>
              <p>• Аналитика важнее субъективного вкуса</p>
              <p>• Постоянно добавляем новые механики и эксперименты</p>
            </div>
          </div>
        </div>

        <div>
          {productionCases.length > 0 && (
            <>
              <div className="text-4xl font-black mb-10">Кейсы</div>
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {productionCases.map(item => <CaseCard key={item.id} item={item} href="/cases" />)}
              </div>
            </>
          )}
          <div className="grid lg:grid-cols-2 gap-10 items-center p-10" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
            <div>
              <div className="text-3xl font-black mb-6">Стоимость</div>
              <div className="font-mono-terminal text-5xl font-black mb-6 neon-red">от 125 000 ₽</div>
              <div className="text-zinc-300 text-lg">Создание 8–10 вертикальных видео, публикация, аналитика и контент-сопровождение.</div>
            </div>
            <LeadForm button="Обсудить продюсирование" textarea="Какие задачи хотите решить через контент" />
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const cases = await getCases()
  return { props: { seo: resolvePageSeo('/production'), cases: cases || [] }, revalidate: 60 }
}
