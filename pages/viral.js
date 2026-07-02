import Head from 'next/head'
import Seo from '@/components/Seo'
import Link from 'next/link'
import Layout from '@/components/Layout'
import HeroTitle from '@/components/HeroTitle'
import { LeadForm, StatBlock, CaseCard } from '@/components/ui'
import { getCases, resolvePageSeo } from '@/lib/db'

const STEPS = [
  { title: 'Анализ продукта и бизнес-процессов компании', desc: 'Погружаемся в продукт, внутренние процессы и специфику бизнеса, чтобы контент выглядел как часть индустрии, а не как внешняя реклама.' },
  { title: 'Определение реальной целевой аудитории', desc: 'Выявляем не абстрактную аудиторию, а конкретных людей, которые принимают решения, влияют на закупки или становятся амбассадорами бренда внутри рынка.' },
  { title: 'Изучение болей клиентов и кастдев', desc: 'Находим реальные боли, раздражители, страхи и триггеры аудитории — именно они становятся топливом для вирусных сценариев.' },
  { title: 'Анализ площадок и правил соцсетей', desc: 'Учитываем особенности алгоритмов, поведения пользователей и форматов каждой платформы, чтобы ролики получали максимальный органический охват.' },
  { title: 'Создание персонажей и архетипов аудитории', desc: 'Формируем узнаваемые типажи, в которых аудитория видит себя, коллег или клиентов — это резко повышает вовлечение и пересылки.' },
  { title: 'Разработка вирусных сценариев', desc: 'Используем storytelling, преувеличение, юмор, контраст и другие механики, которые удерживают внимание и вызывают желание поделиться роликом.' },
  { title: 'Съёмка тестовых роликов', desc: 'Не строим стратегию на догадках — сначала проверяем гипотезы на практике и собираем реальные данные по реакции аудитории.' },
  { title: 'Анализ удержания, пересылок и реакции аудитории', desc: 'Изучаем не только просмотры, но и глубину просмотра, комментарии, сохранения и органическое распространение контента.' },
  { title: 'Масштабирование лучших форматов', desc: 'Лучшие механики превращаем в системную контент-машину, которая стабильно приносит внимание, узнаваемость и входящие заявки.' },
]

export default function Viral({ cases , seo }) {
  const viralCases = cases.filter(c => c.service === 'viral')
  return (
    <Layout title="Вирусные видеоролики" description="Создаём вирусный контент для industrial-аудитории: производства, стройки, добыча, вахта. Ролики, которые пересылают в Telegram.">
      <Seo seo={seo} />
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <div className="max-w-6xl mb-6">
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">// ФЛАГМАНСКОЕ НАПРАВЛЕНИЕ RGUARD</div>
          <HeroTitle
            className="mb-8"
            accent="Вирусные"
            after="видеоролики"
            variant="split"
          />
          <p className="text-zinc-300 text-xl leading-relaxed max-w-4xl">Создаём контент для людей, а не для алгоритмов. Ролики начинают жить внутри профессионального сообщества: пересылаются в рабочих чатах, обсуждаются на объектах, становятся частью индустриального инфополя.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 mb-24">
          {[['2000+','Снятых роликов'],['2M+','Подписчиков'],['100+','Упоминаний в СМИ'],['10+','Чел. в команде']].map(([v,l]) => <StatBlock key={l} value={v} label={l} />)}
        </div>

        {/* Проблема + Принципы */}
        <div className="grid lg:grid-cols-2 gap-10 items-start mb-24">
          <div>
            <div className="text-4xl font-black mb-8">Современная реклама сломалась</div>
            <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
              <p>Люди научились игнорировать рекламу. Баннерная слепота, adblock, проматывание интеграций и переизбыток контента сделали классическую рекламу менее эффективной.</p>
              <p>Большинство компаний продолжают создавать «контент ради охватов», забывая главный вопрос: <strong className="text-white">а что с продажами?</strong></p>
              <p>Мы строим контент вокруг человеческих эмоций, боли аудитории, узнаваемых ситуаций и культурного кода отрасли.</p>
            </div>
          </div>
          <div className="p-10" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
            <div className="text-3xl font-black mb-8">Принципы вирусности</div>
            <div className="space-y-5 text-zinc-300 leading-relaxed text-lg">
              <p><strong className="text-white">Контент должен давать больше,</strong> чем зритель платит своим вниманием.</p>
              <p>Преувеличение, контраст, абсурд, storytelling, олицетворение и индустриальный юмор.</p>
              <p>Не более 10% рекламы. Если ролик ощущается как реклама — зритель его пролистнет.</p>
              <p>Соцсети — лишь точка входа. Настоящее распространение — в мессенджерах и внутри ЦА.</p>
            </div>
          </div>
        </div>

        {/* Шаги */}
        <div className="mb-24">
          <div className="text-4xl font-black mb-12">Как мы создаём вирусные ролики</div>
          <div className="space-y-4">
            {STEPS.map((item, i) => (
              <div key={i} className="p-8 flex gap-6 items-start" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
                <div className="font-mono-terminal text-2xl font-black text-red-500 min-w-[56px]" style={{textShadow:'0 0 10px rgba(239,68,68,0.6)'}}>0{i+1}</div>
                <div><div className="text-2xl font-bold mb-2">{item.title}</div><div className="text-zinc-400 leading-relaxed">{item.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Почему работает */}
        <div className="mb-24 p-10 md:p-12" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
          <div className="text-4xl font-black mb-10">Почему это работает в реальном секторе</div>
          <div className="grid md:grid-cols-2 gap-10 text-zinc-300 text-lg leading-relaxed">
            <div className="space-y-4">
              <p>• Умеем делать медийными сложные продукты</p>
              <p>• Работаем с промышленностью, добычей, стройкой и производством</p>
              <p>• Используем язык и юмор самой индустрии</p>
              <p>• Формируем эффект «это про нас»</p>
            </div>
            <div className="space-y-4">
              <p>• Ролики пересылают внутри профессионального сообщества</p>
              <p>• Компания становится узнаваемой внутри рынка</p>
              <p>• Контент начинает приводить входящие заявки</p>
              <p>• Видео продолжают работать месяцами</p>
            </div>
          </div>
        </div>

        {/* Кейсы + Цена */}
        <div className="mb-24">
          <div className="text-4xl font-black mb-10">Кейсы</div>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {viralCases.map(item => <CaseCard key={item.id} item={item} href={`/cases/${item.id}`} />)}
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-center p-10" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
            <div>
              <div className="text-3xl font-black mb-6">Стоимость</div>
              <div className="font-mono-terminal text-5xl font-black mb-6 neon-red">от 150 000 ₽</div>
              <div className="text-zinc-300 text-lg leading-relaxed">Сценарий, съёмка, монтаж, публикация и механики распространения.</div>
            </div>
            <LeadForm button="Обсудить вирусный ролик" textarea="Опишите вашу задачу" />
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const cases = await getCases()
  return { props: { seo: resolvePageSeo('/viral'), cases: cases || [] }, revalidate: 60 }
}
