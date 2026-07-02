import Head from 'next/head'
import Layout from '@/components/Layout'
import Seo from '@/components/Seo'
import HeroTitle from '@/components/HeroTitle'
import { resolvePageSeo } from '@/lib/db'
import { LeadForm, Card } from '@/components/ui'

const STEPS = [
  ['01','Определяем цель','Выясняем, чего хочет добиться рекламодатель: продажи, узнаваемость, запуск продукта, HR-набор или репозиционирование.'],
  ['02','Изучаем аудиторию','Проводим кастдев, изучаем боли, возражения, триггеры и реальные разговоры вашей аудитории.'],
  ['03','Ищем конфликт','Самые сильные рекламные идеи рождаются там, где есть напряжение, противоречие или спорная тема.'],
  ['04','Формулируем центральную идею','Хорошая концепция почти всегда умещается в одно короткое предложение, которое мгновенно считывается.'],
  ['05','Проверяем вирусный потенциал','Оцениваем, есть ли шанс, что люди сами захотят обсуждать и распространять эту идею.'],
  ['06','Продумываем реализацию','Определяем, где идея раскроется лучше всего: наружная реклама, digital, соцсети, инсталляции или офлайн-активации.'],
]

const TYPES = ['Рекламные кампании','Наружная реклама','Вирусные спецпроекты','HR-кампании','Социальные кампании','PR-инфоповоды','Запуски продуктов','Бренд-активации']

export default function Concepts({ seo }) {
  return (
    <Layout title="Концепции рекламных кампаний" description="Разрабатываем рекламные концепции, которые распространяются сами: HR-кампании, запуски продуктов, вирусные спецпроекты и PR-инфоповоды.">
      <Seo seo={seo} />
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <div className="max-w-6xl mb-20">
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">// КРЕАТИВ / КОНЦЕПЦИИ РЕКЛАМНЫХ КАМПАНИЙ</div>
          <HeroTitle
            className="mb-8"
            before={['Концепции рекламных кампаний,', 'о которых']}
            accent="говорят бесплатно"
            variant="split"
          />
          <p className="text-zinc-300 text-xl leading-relaxed max-w-5xl">Создаём рекламные идеи, задача которых — проникнуть в обсуждения, социальные сети и повседневные разговоры.</p>
        </div>

        {/* Hero placeholder */}
        <div className="mb-24 flex items-center justify-center" style={{aspectRatio:'16/8',border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
          <span className="font-mono-terminal text-zinc-600 uppercase tracking-[4px] text-sm">[ Campaign Visual Placeholder ]</span>
        </div>

        {/* Проблема + хорошая концепция */}
        <div className="grid lg:grid-cols-2 gap-10 mb-24">
          <div>
            <div className="text-4xl font-black mb-8">Почему обычная реклама не работает</div>
            <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
              <p>Большинство рекламных кампаний выглядят одинаково: логотип, слоган, обещание скидки — и мгновенно забываются.</p>
              <p>Современный человек перегружен информацией. Если реклама не вызывает эмоцию или удивление, она исчезает в шуме.</p>
              <p>Сегодня побеждает не самая громкая реклама, а та, которую люди сами начинают обсуждать.</p>
            </div>
          </div>
          <div className="p-10" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
            <div className="text-3xl font-black mb-8">Что такое хорошая концепция</div>
            <div className="space-y-4 text-zinc-300 text-lg leading-relaxed">
              {['Понятна за несколько секунд','Умещается в одну сильную мысль','Вызывает эмоцию и обсуждение','Легко пересказывается другим','Работает на конкретную бизнес-задачу'].map(t => <p key={t}>• {t}</p>)}
            </div>
          </div>
        </div>

        {/* Наш принцип */}
        <div className="mb-24 relative overflow-hidden p-10 md:p-14" style={{border:'1px solid rgba(239,68,68,0.2)',background:'rgba(10,10,20,0.9)'}}>
          <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(circle at top right,rgba(239,68,68,0.08) 0%,transparent 60%)'}} />
          <div className="relative z-10 max-w-5xl">
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">// НАШ ПРИНЦИП</div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-8">Лучшая реклама — та, которую распространяют сами люди</h2>
            <p className="text-zinc-300 text-xl leading-relaxed">В каждой концепции мы задаём себе вопрос: захочет ли человек снять это на телефон, отправить друзьям или выложить в социальные сети? Если нет — идея недостаточно сильна.</p>
          </div>
        </div>

        {/* Шаги */}
        <div className="mb-24">
          <div className="text-4xl font-black mb-12">Как мы работаем</div>
          <div className="space-y-4">
            {STEPS.map(([num,title,desc]) => (
              <div key={num} className="p-8 flex gap-6 items-start" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
                <div className="font-mono-terminal text-2xl font-black text-red-500 min-w-[56px]" style={{textShadow:'0 0 10px rgba(239,68,68,0.6)'}}>{num}</div>
                <div><div className="text-2xl font-bold mb-2">{title}</div><div className="text-zinc-400 leading-relaxed">{desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Какие концепции */}
        <div className="mb-24">
          <div className="text-4xl font-black mb-10">Какие концепции мы создаём</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TYPES.map(t => <Card key={t} title={t} text="Идеи, которые работают на внимание и обсуждение." />)}
          </div>
        </div>

        {/* Наше мышление */}
        <div className="mb-24 p-10 md:p-14" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-5">// НАШЕ МЫШЛЕНИЕ</div>
          <div className="text-4xl md:text-5xl font-black leading-tight mb-8">Мы не спрашиваем «как сделать красивую рекламу?»</div>
          <p className="text-zinc-300 text-2xl leading-relaxed max-w-5xl">Мы спрашиваем: как сделать так, чтобы люди сами стали распространителями этой идеи?</p>
        </div>

        {/* CTA */}
        <div className="grid lg:grid-cols-2 gap-12 items-center p-10 md:p-14" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
          <div>
            <div className="text-5xl font-black leading-tight mb-6">Обсудим вашу рекламную кампанию</div>
            <p className="text-zinc-300 text-xl">Разберём задачу и предложим концепцию, которая сможет выйти за пределы оплаченного охвата.</p>
          </div>
          <LeadForm button="Обсудить кампанию" textarea="Опишите вашу рекламную задачу" />
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  return { props: { seo: resolvePageSeo('/concepts') }, revalidate: 60 }
}
