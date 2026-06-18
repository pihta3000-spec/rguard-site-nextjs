import Head from 'next/head'
import Layout from '@/components/Layout'
import { LeadForm, Card } from '@/components/ui'
import { PhotoGallery, VideoWall } from '@/components/EventMedia'

// Отобранные 24 фото (3 модуля по 8). Порядок = порядок ячеек в DESKTOP_BENTO.
const P = (n) => `/events/photos/ev-${String(n).padStart(2, '0')}.webp`
const PHOTOS = [17, 2, 11, 12, 9, 10, 16, 30, 5, 45, 8, 31, 6, 13, 35, 7, 43, 41, 23, 42, 37, 32, 15, 1].map(P)

// Бенто-раскладка для 4 колонок: {c=столбец, r=строка, cs/rs=span}.
// Три модуля 4×4 (строки 1-4, 5-8, 9-12), каждый замощается без пробелов.
const DESKTOP_BENTO = [
  // Модуль 1 (строки 1-4): большой квадрат слева
  { c: 1, r: 1, cs: 2, rs: 2 }, { c: 3, r: 1, cs: 1, rs: 1 }, { c: 4, r: 1, cs: 1, rs: 2 }, { c: 3, r: 2, cs: 1, rs: 2 },
  { c: 1, r: 3, cs: 1, rs: 2 }, { c: 2, r: 3, cs: 1, rs: 2 }, { c: 4, r: 3, cs: 1, rs: 2 }, { c: 3, r: 4, cs: 1, rs: 1 },
  // Модуль 2 (строки 5-8): горизонтальные баннеры
  { c: 1, r: 5, cs: 1, rs: 2 }, { c: 2, r: 5, cs: 2, rs: 1 }, { c: 4, r: 5, cs: 1, rs: 2 }, { c: 2, r: 6, cs: 1, rs: 2 },
  { c: 3, r: 6, cs: 1, rs: 2 }, { c: 1, r: 7, cs: 1, rs: 2 }, { c: 4, r: 7, cs: 1, rs: 2 }, { c: 2, r: 8, cs: 2, rs: 1 },
  // Модуль 3 (строки 9-12): большой квадрат справа
  { c: 3, r: 9, cs: 2, rs: 2 }, { c: 2, r: 9, cs: 1, rs: 1 }, { c: 1, r: 9, cs: 1, rs: 2 }, { c: 2, r: 10, cs: 1, rs: 2 },
  { c: 4, r: 11, cs: 1, rs: 2 }, { c: 3, r: 11, cs: 1, rs: 2 }, { c: 1, r: 11, cs: 1, rs: 2 }, { c: 2, r: 12, cs: 1, rs: 1 },
]

const VIDEOS = Array.from({ length: 7 }, (_, i) => ({
  src: `/events/videos/ev-${i + 1}.mp4`,
  poster: `/events/posters/ev-${i + 1}.jpg`,
}))

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
        <div className="mb-24 overflow-hidden" style={{aspectRatio:'16/8',border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
          <img src="/events/photos/ev-38.webp" alt="Мероприятие RGUARD" className="w-full h-full object-cover" />
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
          <PhotoGallery photos={PHOTOS} desktopLayout={DESKTOP_BENTO} />
        </div>

        {/* Видео */}
        <div className="mb-24">
          <div className="text-4xl font-black mb-3">Видео с мероприятий</div>
          <p className="text-zinc-400 mb-10">Нажмите на любой ролик, чтобы посмотреть.</p>
          <VideoWall videos={VIDEOS} />
        </div>

        {/* Ведущие */}
        <div className="mb-24 p-10 md:p-14" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
          <div className="text-4xl font-black mb-10">Наши ведущие</div>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {[
              ['Дамир Ильгамович','Харизматичный ведущий с сильной медийной подачей.', '/uploads/f6b69defe1f931aa23717971b1ad83522dc5453b-900x1200.jpg'],
              ['Рамиль Ахтареев','Уверенная подача и контакт с аудиторией.', '/uploads/de8bacf08f394ee19774cfa1f62851a1bff3ba15-900x1200.jpg'],
              ['Дима Хрисанов','Энергичная работа с аудиторией и динамичная подача.', '/uploads/af78c328f9829e6e81b9966abf8ac4dea82da77a-900x1200.jpg'],
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
