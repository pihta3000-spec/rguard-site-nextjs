import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { LeadForm, Card } from '@/components/ui'

export default function PetroEngineering() {
  return (
    <Layout title="Петроинжиниринг — кейс RGUARD" description="Вирусная HR-кампания для Петроинжиниринг: 40+ млн просмотров, 1,8 млн лайков, 100+ тысяч репостов.">
      <Head>
        <title>Кейс Петроинжиниринг — 40 млн просмотров. RGUARD</title>
        <meta name="description" content="Вирусная HR-кампания для привлечения вахтовых специалистов: 40+ млн просмотров, 1,8+ млн лайков, 100+ тысяч репостов." />
        <link rel="canonical" href="https://rguard.ru/cases/petro-engineering" />
      </Head>
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <Link href="/cases" className="mb-10 inline-block font-mono-terminal text-zinc-500 hover:text-red-400 text-xs uppercase tracking-[3px]">← Назад к кейсам</Link>

        <div className="mb-20 max-w-6xl">
          <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">// КЕЙС / ВИРУСНЫЕ ВИДЕОРОЛИКИ</div>
          <h1 className="glitch-hero text-5xl md:text-7xl font-black leading-none mb-8">Петроинжиниринг</h1>
          <p className="text-zinc-300 text-xl leading-relaxed max-w-4xl">Вирусная HR-кампания для привлечения специалистов на работу вахтовым методом на север России.</p>
        </div>

        {/* Видео */}
        <div className="mb-24">
          <div className="text-4xl font-black mb-10">Видео кейса</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {['https://youtube.com/shorts/R7nzxpo4YVk','https://youtube.com/shorts/vmCO0Hx8xng',''].map((link, i) => (
              <a key={i} href={link || '#'} target={link ? '_blank' : undefined} rel={link ? 'noreferrer' : undefined}
                className="relative aspect-[9/16] flex items-center justify-center text-center p-5" style={{border:'1px solid rgba(239,68,68,0.3)',background:'linear-gradient(180deg,#111 0%,black 100%)'}}>
                <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(circle at top,rgba(239,68,68,0.16),transparent 40%)'}}>  </div>
                <div className="relative z-10">
                  <div className="font-mono-terminal text-red-500 uppercase tracking-[3px] text-xs mb-4">Видео {i+1}</div>
                  <div className="text-xl font-black mb-3">{link ? 'Смотреть ролик' : 'Video Placeholder'}</div>
                  <div className="font-mono-terminal text-zinc-500 text-xs">{link ? 'Откроется в новой вкладке' : 'Материал будет добавлен'}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Метрики */}
        <div className="grid md:grid-cols-4 gap-4 mb-24">
          {[['40+ млн','просмотров'],['1,8+ млн','лайков'],['15+ тыс.','комментариев'],['100+ тыс.','репостов']].map(([v,l]) => (
            <div key={l} className="p-8 hud-corner" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
              <div className="font-mono-terminal text-3xl font-black neon-red mb-2">{v}</div>
              <div className="font-mono-terminal text-zinc-500 text-xs uppercase leading-relaxed" style={{wordBreak:'normal',overflowWrap:'normal',letterSpacing:'0.05em'}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Задача + Решение */}
        <div className="grid lg:grid-cols-2 gap-10 mb-24">
          <div className="p-10" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-5">// ЗАДАЧА</div>
            <h2 className="text-4xl font-black mb-6">Что нужно было решить</h2>
            <p className="text-zinc-300 text-lg leading-relaxed">Привлечь специалистов на работу вахтовым методом на север России.</p>
          </div>
          <div className="p-10" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(239,68,68,0.04)'}}>
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-5">// РЕШЕНИЕ</div>
            <h2 className="text-4xl font-black mb-6">Что мы сделали</h2>
            <p className="text-zinc-300 text-lg leading-relaxed">Натурная съёмка серии коротких вертикальных видео и создание привлекательного образа вахтовой работы.</p>
          </div>
        </div>

        {/* Что сработало */}
        <div className="mb-24">
          <div className="text-4xl font-black mb-10">Что сработало</div>
          <div className="grid md:grid-cols-3 gap-4">
            <Card title="Негатив в позитив" text="Этот принцип усилил удержание внимания, обсуждение и распространение кейса." />
            <Card title="Харизма и литературный юмор" text="Этот принцип усилил удержание внимания, обсуждение и распространение кейса." />
            <Card title="Захват, удержание, призыв" text="Этот принцип усилил удержание внимания, обсуждение и распространение кейса." />
          </div>
        </div>

        {/* Сильный инсайт */}
        <div className="mb-24 relative overflow-hidden p-10 md:p-14" style={{border:'1px solid rgba(239,68,68,0.2)',background:'rgba(10,10,20,0.9)'}}>
          <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(circle at top right,rgba(239,68,68,0.08) 0%,transparent 60%)'}} />
          <div className="relative z-10 max-w-5xl">
            <div className="font-mono-terminal text-red-500 uppercase tracking-[4px] text-xs font-bold mb-6">// СИЛЬНЫЙ ИНСАЙТ КЕЙСА</div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-8">HR-служба не справлялась с входящими звонками</h2>
            <p className="text-zinc-300 text-xl leading-relaxed">После публикации первого ролика заказчик попросил заменить статический номер телефона на многоканальный 8-800, потому что HR-служба не успевала принимать входящие обращения. Дополнительный эффект — ролики бесплатно подхватили федеральные паблики с многомиллионной аудиторией.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-10 md:p-14" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-4xl md:text-5xl font-black leading-tight mb-6">Хотите похожий результат для своей компании?</div>
              <p className="text-zinc-300 text-xl">Разберём вашу задачу и предложим формат, который сможет привлечь внимание нужной аудитории.</p>
            </div>
            <LeadForm button="Обсудить проект" />
          </div>
        </div>
      </section>
    </Layout>
  )
}
