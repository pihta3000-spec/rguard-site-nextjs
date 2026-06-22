import Head from 'next/head'
import Seo from '@/components/Seo'
import Layout from '@/components/Layout'
import { LeadForm, CaseCard, Card } from '@/components/ui'
import { getCases, resolvePageSeo } from '@/lib/db'

const FILM_TYPES = ['HR-фильмы','Фильмы о компании','Видео для адаптации сотрудников','Техника безопасности','Обучающие ролики','Фильмы для внутренних мероприятий','Бренд-фильмы','Видео для HR-бренда']

export default function Corporate({ cases , seo }) {
  const corporateCases = cases.filter(c => c.service === 'corporate')
  return (
    <Layout title="Корпоративные фильмы" description="Снимаем корпоративные фильмы с юмором и динамикой: HR-фильмы, техника безопасности, бренд-фильмы для реального сектора.">
      <Seo seo={seo} />
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <div className="max-w-6xl mb-16">
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">// СОЗДАНИЕ ВИДЕО / КОРПОРАТИВНЫЕ ФИЛЬМЫ</div>
          <h1 className="glitch-hero text-5xl md:text-7xl font-black leading-none mb-8">Корпоративные фильмы,<br />которые не скучно смотреть</h1>
          <p className="text-zinc-300 text-xl leading-relaxed max-w-5xl">Большинство корпоративных фильмов выглядят одинаково: медленный монтаж, шаблонный дикторский текст и ощущение обязательного просмотра. Мы делаем иначе.</p>
        </div>

        {/* Hero placeholder */}
        <div className="mb-24 flex items-center justify-center" style={{aspectRatio:'16/8',border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
          <span className="font-mono-terminal text-zinc-600 uppercase tracking-[4px] text-sm">[ Corporate Film Hero ]</span>
        </div>

        {/* Проблема + подход */}
        <div className="grid lg:grid-cols-2 gap-10 mb-24">
          <div>
            <div className="text-4xl font-black mb-8">Проблема стандартных корпоративных фильмов</div>
            <div className="space-y-4 text-zinc-300 text-lg leading-relaxed">
              {['Пафосный дикторский голос','Общие фразы без конкретики','Медленный ритм и шаблонный монтаж','Постановочные кадры без жизни','Видео, которое никто не хочет досматривать'].map(t => <p key={t}>• {t}</p>)}
            </div>
          </div>
          <div className="p-10" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
            <div className="text-3xl font-black mb-8">Наш подход</div>
            <div className="space-y-5 text-zinc-300 text-lg leading-relaxed">
              <p>Используем принципы вирусного контента даже там, где обычно ожидают скучное корпоративное видео.</p>
              <p>Юмор, драматургия, динамика, неожиданные повороты, персонажи и запоминающиеся образы работают не только в рекламе, но и в корпоративной коммуникации.</p>
              <p className="text-white font-bold pt-2">Если видео не удерживает внимание — оно не работает.</p>
            </div>
          </div>
        </div>

        {/* Кейсы */}
        {corporateCases.length > 0 && (
          <div className="mb-24">
            <div className="text-4xl font-black mb-12">Примеры нашего подхода</div>
            <div className="grid md:grid-cols-2 gap-8">
              {corporateCases.map(item => <CaseCard key={item.id} item={item} href="/cases" />)}
            </div>
          </div>
        )}

        {/* Типы фильмов */}
        <div className="mb-24">
          <div className="text-4xl font-black mb-10">Какие корпоративные фильмы мы создаём</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FILM_TYPES.map(t => <Card key={t} title={t} text="Современный формат корпоративной коммуникации." />)}
          </div>
        </div>

        {/* Почему работает */}
        <div className="mb-24">
          <div className="text-4xl font-black mb-10">Почему это работает</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title="Видео досматривают" text="Информация не теряется в скучном формате." />
            <Card title="Смыслы запоминаются" text="За счёт эмоций и образов." />
            <Card title="Компания выглядит современно" text="Даже в консервативной отрасли." />
            <Card title="Контент вызывает уважение" text="А не неловкость при показе." />
          </div>
        </div>

        {/* Медиа */}
        <div className="mb-24">
          <div className="text-4xl font-black mb-10">Фото и видео материалы</div>
          <div className="grid md:grid-cols-3 gap-4">
            {Array.from({length:6}).map((_,i) => (
              <div key={i} className="aspect-video flex items-center justify-center" style={{border:'1px solid rgba(239,68,68,0.15)',background:'rgba(10,10,20,0.8)'}}>
                <span className="font-mono-terminal text-zinc-600 text-xs tracking-[3px] uppercase">Media</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="grid lg:grid-cols-2 gap-12 items-center p-10 md:p-14" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
          <div>
            <div className="text-5xl font-black leading-tight mb-6">Обсудим корпоративный фильм, который не захочется перемотать</div>
            <p className="text-zinc-300 text-xl">Разберём вашу задачу и предложим современный формат.</p>
          </div>
          <LeadForm button="Обсудить корпоративный фильм" />
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const cases = await getCases()
  return { props: { seo: resolvePageSeo('/corporate'), cases: cases || [] }, revalidate: 60 }
}
