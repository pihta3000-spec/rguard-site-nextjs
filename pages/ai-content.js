import Seo from '@/components/Seo'
import Layout from '@/components/Layout'
import HeroTitle from '@/components/HeroTitle'
import { LeadForm, StatBlock, CaseCard, Card, CaptureTitle, SectionAccentTitle } from '@/components/ui'
import { getCases, resolvePageSeo } from '@/lib/db'

const HAS_AI_HERO_MEDIA = false

const STEPS = [
  { title: 'Определяем задачу', desc: 'Выясняем, какую цель должен решить ИИ-ролик: внимание, продажи, презентация идеи, тест гипотезы или рекламная кампания.' },
  { title: 'Ищем сильную идею', desc: 'Используем опыт вирусных роликов: конфликт, юмор, преувеличение, неожиданные сравнения и понятную драматургию.' },
  { title: 'Пишем сценарий', desc: 'Собираем ролик как историю: захват внимания, развитие, визуальная кульминация и призыв к действию.' },
  { title: 'Готовим запросы для генерации', desc: 'Переводим сценарий в точные промпты, описания сцен, персонажей, окружения и визуального стиля.' },
  { title: 'Генерируем и отбираем сцены', desc: 'Создаём варианты, выбираем сильные кадры и доводим их до нужного визуального качества.' },
  { title: 'Собираем ролик', desc: 'Дорабатываем монтаж, звук, ритм, титры и финальную подачу, чтобы видео работало как цельный рекламный продукт.' },
]

export default function AIContent({ cases , seo }) {
  const aiCases = cases.filter(c => c.service === 'ai-content')
  return (
    <Layout title="ИИ контент" description="Создаём ИИ-ролики с сильной идеей: AI-рекламные видео, гибридный продакшн, визуализация концепций. Сначала идея — потом генерация.">
      <Seo seo={seo} />
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <div className="max-w-6xl mb-16">
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">// СОЗДАНИЕ ВИДЕО / ИИ КОНТЕНТ</div>
          <HeroTitle
            className="mb-8"
            before="ИИ-контент, в котором"
            accent="есть идея"
            after="а не просто генерация"
            variant="split"
          />
          <p className="text-zinc-300 text-xl leading-relaxed max-w-5xl">С развитием искусственного интеллекта изменился баланс сил. Раньше дорого стоила реализация. Сегодня реализация стала доступнее. На первый план вышла идея.</p>
        </div>

        {/* Hero placeholder */}
        {HAS_AI_HERO_MEDIA && (
          <div className="mb-24 flex items-center justify-center" style={{aspectRatio:'16/8',border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
            <span className="font-mono-terminal text-zinc-600 uppercase tracking-[4px] text-sm">[ AI Video Placeholder ]</span>
          </div>
        )}

        {/* Старое vs новое */}
        <div className="grid lg:grid-cols-2 gap-10 mb-24">
          <div>
            <SectionAccentTitle className="mb-8" before="Раньше спорили:" accent="идея ничего не стоит" />
            <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
              <p>В классическом производстве большая часть бюджета уходила на реализацию: технику, свет, локации и специалистов.</p>
              <p>Из-за этого долго бытовал тезис: идея ничего не стоит, стоит только реализация.</p>
              <p>ИИ перевернул это уравнение. Реализация стала доступной. Дорогой стала сильная идея.</p>
            </div>
          </div>
          <div className="p-10" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
            <SectionAccentTitle className="section-accent-title--compact mb-8" before="Новая" accent="формула" />
            <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
              <p><strong className="text-white">Было:</strong> идея дешёвая, реализация дорогая.</p>
              <p><strong className="text-white">Стало:</strong> реализация доступная, идея дорогая.</p>
              <p>Поэтому выигрывает не тот, кто умеет пользоваться нейросетями, а тот, кто понимает драматургию, аудиторию и вирусное распространение.</p>
            </div>
          </div>
        </div>

        {/* Проблема рынка */}
        <div className="mb-24 grid lg:grid-cols-2 gap-12 items-start p-10 md:p-12" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
          <div>
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-5">// ПРОБЛЕМА РЫНКА</div>
            <SectionAccentTitle className="mb-6" before="Большинство ИИ-роликов выглядят как" accent="демонстрация технологии" />
            <p className="text-zinc-300 text-lg leading-relaxed">Многие специалисты разбираются в связках и технических приёмах. Они могут заставить нейросеть выдать красивую картинку. Но за этим нет смысла, конфликта, юмора и идеи, которую хочется переслать.</p>
          </div>
          <div className="p-8" style={{border:'1px solid rgba(239,68,68,0.15)',background:'rgba(0,0,0,0.4)'}}>
            <SectionAccentTitle className="section-accent-title--compact mb-6" before="Наш" accent="подход" />
            <div className="space-y-4 text-zinc-300 text-lg leading-relaxed">
              {['Сначала идея, потом генерация','Сначала зритель, потом инструмент','Сначала сценарий, потом промпт','Сначала смысл, потом визуальный эффект'].map(t => <p key={t}>• {t}</p>)}
            </div>
          </div>
        </div>

        {/* Что создаём */}
        <div className="mb-24">
          <SectionAccentTitle className="mb-10" before="Что мы" accent="создаём" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card title="ИИ-рекламные ролики" text="Короткие видео с сильной идеей, визуальной метафорой и понятной рекламной задачей." />
            <Card title="ИИ-видео для соцсетей" text="Контент для публикаций, тестов гипотез и вирусного распространения." />
            <Card title="ИИ-персонажи" text="Создаём героев, через которых можно вести серию роликов и развивать узнаваемость." />
            <Card title="Визуализация концепций" text="Быстро показываем, как может выглядеть рекламная идея до полноценного производства." />
            <Card title="ИИ-сцены для кампаний" text="Создаём отдельные сцены, образы и визуальные решения для больших рекламных проектов." />
            <Card title="Гибридный контент" text="Соединяем реальную съёмку, монтаж и ИИ-генерацию в одном ролике." />
          </div>
        </div>

        {/* Шаги */}
        <div className="mb-24">
          <SectionAccentTitle className="mb-12" before="Как мы" accent="работаем" />
          <div className="space-y-4">
            {STEPS.map((item, i) => (
              <div key={i} className="p-8 flex gap-6 items-start" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
                <div className="font-mono-terminal text-2xl font-black text-red-500 min-w-[56px]" style={{textShadow:'0 0 10px rgba(239,68,68,0.6)'}}>0{i+1}</div>
                <div><div className="text-2xl font-bold mb-2">{item.title}</div><div className="text-zinc-400 leading-relaxed">{item.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Кейсы */}
        {aiCases.length > 0 && (
          <div className="mb-24">
            <SectionAccentTitle className="mb-10" before="Кейсы" accent="ИИ-роликов" />

            <div className="grid md:grid-cols-2 gap-6">
              {aiCases.map(item => <CaseCard key={item.id} item={item} href={`/cases/${item.id}`} />)}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="grid lg:grid-cols-2 gap-12 items-center p-10 md:p-14" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
          <div>
            <CaptureTitle before="Обсудим ИИ-ролик" accent="с сильной идеей" />
            <p className="text-zinc-300 text-xl">Разберём задачу, найдём концепцию и предложим формат ИИ-контента под вашу аудиторию.</p>
          </div>
          <LeadForm button="Обсудить ИИ-ролик" />
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const cases = await getCases()
  return { props: { seo: resolvePageSeo('/ai-content'), cases: cases || [] }, revalidate: 60 }
}
