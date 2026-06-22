import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import RetroGrid from '@/components/backgrounds/RetroGrid'

export default function ThankYou() {
  return (
    <Layout title="Спасибо за заявку" description="Заявка отправлена. Мы свяжемся с вами в ближайшее время.">
      <Head><meta name="robots" content="noindex,follow" /></Head>
      <section className="relative overflow-hidden flex items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <RetroGrid />
        <div className="relative z-10 text-center max-w-3xl mx-auto py-24">
          <div className="font-mono-terminal text-red-500 uppercase tracking-[5px] text-xs font-bold mb-6 flicker">// REQUEST_RECEIVED</div>

          <div className="mx-auto mb-8 flex items-center justify-center" style={{ width: 88, height: 88, borderRadius: '50%', border: '2px solid rgba(239,68,68,0.6)', background: 'rgba(239,68,68,0.08)', boxShadow: '0 0 40px rgba(239,68,68,0.35)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>

          <h1 className="glitch-hero text-5xl md:text-7xl font-black leading-none mb-6">Заявка отправлена</h1>
          <p className="text-zinc-300 text-xl leading-relaxed mb-4 mx-auto max-w-xl" style={{ textWrap: 'balance' }}>Спасибо! Мы получили вашу заявку и&nbsp;свяжемся с&nbsp;вами в&nbsp;ближайшее время.</p>
          <p className="text-zinc-500 text-base mb-10 mx-auto max-w-xl" style={{ textWrap: 'balance' }}>Обычно отвечаем в течение рабочего дня. Если срочно — звоните: <a href="tel:+79273412252" className="text-red-400 hover:text-red-300 transition-colors whitespace-nowrap">+7&nbsp;927&nbsp;341‑22‑52</a></p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">На главную</Link>
            <Link href="/cases" className="btn-secondary">Смотреть кейсы</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
