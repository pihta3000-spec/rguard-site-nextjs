import Head from 'next/head'
import Layout from '@/components/Layout'
import { LeadForm, Card } from '@/components/ui'

const SERVICES = [
  ['Подбор площадки','Ищем локацию под формат и бюджет.'],
  ['Питание','Организация еды, напитков и сервиса.'],
  ['Оформление','Декор, атмосфера и пространство.'],
  ['Развлекательная программа','Активности, шоу и конкурсы.'],
  ['Детские зоны','Активности для маленьких гостей.'],
  ['Техническая часть','Свет, звук, сцена и экраны.'],
  ['Фото и видео','Съёмка и контент с мероприятия.'],
  ['Полная координация','От идеи до финала события.'],
]

const PHOTO_LAYOUTS = ['col-span-2 row-span-2','col-span-1 row-span-1','col-span-1 row-span-1','col-span-1 row-span-2','col-span-1 row-span-1','col-span-2 row-span-1','col-span-1 row-span-1','col-span-1 row-span-2','col-span-1 row-span-1','col-span-2 row-span-2','col-span-1 row-span-1','col-span-1 row-span-1']

export default function Events() {
  return (
    <Layout title="Организация мероприятий" description="Организуем корпоративы, городские праздники, фестивали и бренд-активации. От идеи до финала под ключ — с видеосъёмкой и контентом.">
      <Head>
        <title>Организация мероприятий в Уфе — RGUARD</title>
        <meta name="description" content="Организуем корпоративы, городские праздники, фестивали и бренд-активации. От идеи до финала под ключ — с видеосъёмкой и контентом." />
        <link rel="canonical" href="https://rguard.ru/events" />
      </Head>
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <div className="max-w-6xl mb-20">
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">// ОРГАНИЗАЦИЯ МЕРОПРИЯТИЙ</div>
          <h1 className="glitch-hero text-5xl md:text-7xl font-black leading-none mb-8">Организуем события, которые запоминаются и становятся контентом</h1>
          <p className="text-zinc-300 text-xl leading-relaxed max-w-5xl">От камерных частных праздников до масштабных городских мероприятий на тысячи гостей. Берём на себя организацию под ключ или подключаемся как отдельная команда.</p>
        </div>

        {/* Hero */}
        <div className="mb-24 flex items-center justify-center" style={{aspectRatio:'16/8',border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
          <span className="font-mono-terminal text-zinc-600 uppercase tracking-[4px] text-sm">[ Hero Event Photo / Video ]</span>
        </div>

        {/* Частные / Масштабные */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          <div className="p-10" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs mb-5">Частные мероприятия</div>
            <div className="text-3xl font-black mb-6">Камерные события с вниманием к деталям</div>
            <div className="space-y-3 text-zinc-300 text-lg leading-relaxed">
              {['Дни рождения','Юбилеи','Свадьбы','Корпоративы','Детские мероприятия','Семейные праздники'].map(t => <p key={t}>• {t}</p>)}
            </div>
          </div>
          <div className="p-10" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs mb-5">Масштабные мероприятия</div>
            <div className="text-3xl font-black mb-6">События для больших аудиторий</div>
            <div className="space-y-3 text-zinc-300 text-lg leading-relaxed">
              {['Городские праздники','Фестивали','Публичные мероприятия','Открытия объектов','Бренд-активации','Корпоративные большие события'].map(t => <p key={t}>• {t}</p>)}
            </div>
          </div>
        </div>

        {/* Что берём на себя */}
        <div className="mb-24">
          <div className="text-4xl font-black mb-10">Что мы берём на себя</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map(([title,text]) => <Card key={title} title={title} text={text} />)}
          </div>
        </div>

        {/* Фото галерея */}
        <div className="mb-24">
          <div className="text-4xl font-black mb-10">Фото с мероприятий</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[220px] grid-flow-dense">
            {PHOTO_LAYOUTS.map((layout, i) => (
              <div key={i} className={`flex items-center justify-center ${layout}`} style={{border:'1px solid rgba(239,68,68,0.15)',background:'rgba(10,10,20,0.8)'}}>
                <span className="font-mono-terminal text-zinc-700 text-xs uppercase tracking-[3px]">Photo</span>
              </div>
            ))}
          </div>
        </div>

        {/* Видео */}
        <div className="mb-24">
          <div className="text-4xl font-black mb-10">Видео с мероприятий</div>
          <div className="grid md:grid-cols-2 gap-6">
            {[0,1].map(i => (
              <div key={i} className="aspect-video flex items-center justify-center" style={{border:'1px solid rgba(239,68,68,0.15)',background:'rgba(10,10,20,0.8)'}}>
                <span className="font-mono-terminal text-zinc-600 text-sm tracking-[3px] uppercase">Video Placeholder</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ведущие */}
        <div className="mb-24 p-10 md:p-14" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
          <div className="text-4xl font-black mb-10">Наши ведущие</div>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {[
              ['Дамир Ильгамович','Харизматичный ведущий с сильной медийной подачей.', null],
              ['Рамиль Ахтареев','Уверенная подача и контакт с аудиторией.', 'https://cdn.sanity.io/images/y9ptramm/production/de8bacf08f394ee19774cfa1f62851a1bff3ba15-900x1200.jpg'],
              ['Дима Хрисанов','Энергичная работа с аудиторией и динамичная подача.', 'https://cdn.sanity.io/images/y9ptramm/production/af78c328f9829e6e81b9966abf8ac4dea82da77a-900x1200.jpg'],
            ].map(([name,desc,photo]) => (
              <div key={name} className="p-8" style={{border:'1px solid rgba(239,68,68,0.15)',background:'rgba(0,0,0,0.4)'}}>
                <div className="aspect-square flex items-center justify-center mb-6 overflow-hidden" style={{border:'1px solid rgba(239,68,68,0.15)',background:'rgba(10,10,20,0.8)'}}>
                  {photo ? (
                    <img src={photo} alt={name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <span className="font-mono-terminal text-zinc-600 text-xs uppercase tracking-[3px]">Photo</span>
                  )}
                </div>
                <div className="text-2xl font-black mb-3">{name}</div>
                <div className="text-zinc-300 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
          <p className="text-zinc-300 text-lg leading-relaxed">Наши ведущие могут работать как на мероприятиях, которые организуем мы, так и как отдельная услуга.</p>
        </div>

        {/* Форматы работы */}
        <div className="mb-24">
          <div className="text-4xl font-black mb-10">Форматы работы</div>
          <div className="grid md:grid-cols-3 gap-4">
            <Card title="Под ключ" text="Берём на себя весь цикл организации." />
            <Card title="Частичное подключение" text="Закрываем отдельные блоки мероприятия." />
            <Card title="Только ведущие" text="Если событие организовано другой командой." />
          </div>
        </div>

        {/* CTA */}
        <div className="grid lg:grid-cols-2 gap-12 items-center p-10 md:p-14" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
          <div>
            <div className="text-5xl font-black leading-tight mb-6">Обсудим ваше мероприятие</div>
            <p className="text-zinc-300 text-xl">Расскажите о формате, масштабе и задачах — предложим оптимальный вариант организации.</p>
          </div>
          <LeadForm button="Обсудить мероприятие" textarea="Опишите ваше событие" />
        </div>
      </section>
    </Layout>
  )
}
