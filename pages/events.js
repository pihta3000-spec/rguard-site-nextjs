import Layout from '@/components/Layout'
import Seo from '@/components/Seo'
import HeroTitle from '@/components/HeroTitle'
import HeroVideo from '@/components/HeroVideo'
import { resolvePageSeo } from '@/lib/db'
import { LeadForm, Card, CaptureTitle, SectionAccentTitle } from '@/components/ui'
import { PhotoGallery, VideoWall } from '@/components/EventMedia'

// 23 фото (фото с детьми убраны, добавлены кадры с корпоратива). Без детей.
// Порядок = порядок ячеек в DESKTOP_BENTO. Широкие кадры — в крупные ячейки.
const P = (n) => `/events/photos/ev-${String(n).padStart(2, '0')}.webp`
const PHOTOS = [
  52, 2, 8, 11, 49, 50, 35, 1,   // модуль 1
  32, 17, 15, 47, 48, 42, 23, 51, // модуль 2
  46, 6, 7, 5, 9, 43, 45,         // модуль 3 (7 фото)
].map(P)

// Бенто-раскладка для 4 колонок: {c=столбец, r=строка, cs/rs=span}.
// Модули 4×4 (строки 1-4, 5-8) + 4×2 (строки 9-10) — замощаются без пробелов.
const DESKTOP_BENTO = [
  // Модуль 1 (строки 1-4): большой квадрат слева
  { c: 1, r: 1, cs: 2, rs: 2 }, { c: 3, r: 1, cs: 1, rs: 1 }, { c: 4, r: 1, cs: 1, rs: 2 }, { c: 3, r: 2, cs: 1, rs: 2 },
  { c: 1, r: 3, cs: 1, rs: 2 }, { c: 2, r: 3, cs: 1, rs: 2 }, { c: 4, r: 3, cs: 1, rs: 2 }, { c: 3, r: 4, cs: 1, rs: 1 },
  // Модуль 2 (строки 5-8): горизонтальные баннеры
  { c: 1, r: 5, cs: 1, rs: 2 }, { c: 2, r: 5, cs: 2, rs: 1 }, { c: 4, r: 5, cs: 1, rs: 2 }, { c: 2, r: 6, cs: 1, rs: 2 },
  { c: 3, r: 6, cs: 1, rs: 2 }, { c: 1, r: 7, cs: 1, rs: 2 }, { c: 4, r: 7, cs: 1, rs: 2 }, { c: 2, r: 8, cs: 2, rs: 1 },
  // Модуль 3 (строки 9-10): широкий баннер + ряд квадратов
  { c: 1, r: 9, cs: 2, rs: 1 }, { c: 3, r: 9, cs: 1, rs: 1 }, { c: 4, r: 9, cs: 1, rs: 1 },
  { c: 1, r: 10, cs: 1, rs: 1 }, { c: 2, r: 10, cs: 1, rs: 1 }, { c: 3, r: 10, cs: 1, rs: 1 }, { c: 4, r: 10, cs: 1, rs: 1 },
]

const VIDEOS = Array.from({ length: 8 }, (_, i) => ({
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

export default function Events({ seo }) {
  return (
    <Layout title="Организация мероприятий" description="Организуем корпоративы, городские праздники, фестивали и бренд-активации. От идеи до финала под ключ — с видеосъёмкой и контентом.">
      <Seo seo={seo} />
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        {/* HERO: текст слева, вертикальный шоурил справа (по образцу главной) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-24">
          <div>
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">// ОРГАНИЗАЦИЯ МЕРОПРИЯТИЙ</div>
            <HeroTitle
              className="mb-8"
              before={['Организуем события, которые', 'запоминаются и']}
              accent="становятся контентом"
              variant="split"
            />
            <p className="text-zinc-300 text-xl leading-relaxed mb-10">От камерных частных праздников до масштабных городских мероприятий на тысячи гостей. Берём на себя организацию под ключ или подключаемся как отдельная команда.</p>
            <a href="#events-contact" className="btn-primary">Обсудить мероприятие</a>
          </div>
          <HeroVideo desktopSrc="/reel-events.mp4" mobileSrc="/reel-events-mobile.mp4" poster="/reel-events-poster.jpg" />
        </div>

        {/* Частные / Масштабные */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          <div className="p-10" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs mb-5">Частные мероприятия</div>
            <SectionAccentTitle className="section-accent-title--compact mb-6" before="Камерные события" accent="с вниманием к деталям" />
            <div className="space-y-3 text-zinc-300 text-lg leading-relaxed">
              {['Дни рождения','Юбилеи','Свадьбы','Корпоративы','Детские мероприятия','Семейные праздники'].map(t => <p key={t}>• {t}</p>)}
            </div>
          </div>
          <div className="p-10" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs mb-5">Масштабные мероприятия</div>
            <SectionAccentTitle className="section-accent-title--compact mb-6" before="События" accent="для больших аудиторий" />
            <div className="space-y-3 text-zinc-300 text-lg leading-relaxed">
              {['Городские праздники','Фестивали','Публичные мероприятия','Открытия объектов','Бренд-активации','Корпоративные большие события'].map(t => <p key={t}>• {t}</p>)}
            </div>
          </div>
        </div>

        {/* Что берём на себя */}
        <div className="mb-24">
          <SectionAccentTitle className="mb-10" before="Что мы" accent="берём на себя" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map(([title,text]) => <Card key={title} title={title} text={text} />)}
          </div>
        </div>

        {/* Фото галерея */}
        <div className="mb-24">
          <SectionAccentTitle className="mb-10" before="Фото" accent="с мероприятий" />
          <PhotoGallery photos={PHOTOS} desktopLayout={DESKTOP_BENTO} />
        </div>

        {/* Видео */}
        <div className="mb-24">
          <SectionAccentTitle className="mb-3" before="Видео" accent="с мероприятий" />
          <p className="text-zinc-400 mb-10">Нажмите на любой ролик, чтобы посмотреть.</p>
          <VideoWall videos={VIDEOS} />
        </div>

        {/* Ведущие */}
        <div className="mb-24 p-10 md:p-14" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
          <SectionAccentTitle className="mb-10" before="Наши" accent="ведущие" />
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {[
              ['Дамир Ильгамович','Харизматичный ведущий с сильной медийной подачей.', '/uploads/f6b69defe1f931aa23717971b1ad83522dc5453b-900x1200.jpg'],
              ['Рамиль Ахтареев','Уверенная подача и контакт с аудиторией.', '/uploads/de8bacf08f394ee19774cfa1f62851a1bff3ba15-900x1200.jpg'],
              ['Дима Хрисанов','Энергичная работа с аудиторией и динамичная подача.', '/uploads/af78c328f9829e6e81b9966abf8ac4dea82da77a-900x1200.jpg'],
            ].map(([name,desc,photo]) => (
              <div key={name} className="p-8" style={{border:'1px solid rgba(239,68,68,0.15)',background:'rgba(0,0,0,0.4)'}}>
                <div className="aspect-square flex items-center justify-center mb-6 overflow-hidden" style={{border:'1px solid rgba(239,68,68,0.15)',background:'rgba(10,10,20,0.8)'}}>
                  {photo ? (
                    <img src={photo} alt={name} loading="lazy" decoding="async" className="w-full h-full object-cover object-top" />
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
          <SectionAccentTitle className="mb-10" before="Форматы" accent="работы" />
          <div className="grid md:grid-cols-3 gap-4">
            <Card title="Под ключ" text="Берём на себя весь цикл организации." />
            <Card title="Частичное подключение" text="Закрываем отдельные блоки мероприятия." />
            <Card title="Только ведущие" text="Если событие организовано другой командой." />
          </div>
        </div>

        {/* CTA */}
        <div id="events-contact" className="grid lg:grid-cols-2 gap-12 items-center p-10 md:p-14 scroll-mt-24" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
          <div>
            <CaptureTitle before="Обсудим" accent="ваше мероприятие" />
            <p className="text-zinc-300 text-xl">Расскажите о формате, масштабе и задачах — предложим оптимальный вариант организации.</p>
          </div>
          <LeadForm button="Обсудить мероприятие" textarea="Опишите ваше событие" />
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  return { props: { seo: resolvePageSeo('/events') }, revalidate: 60 }
}
