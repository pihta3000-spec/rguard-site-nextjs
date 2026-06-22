import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import Beams from '@/components/backgrounds/Beams'

export default function NotFound() {
  return (
    <Layout title="Страница не найдена" description="Страница не найдена — ошибка 404.">
      <Head><meta name="robots" content="noindex,follow" /></Head>
      <section className="relative overflow-hidden flex items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <Beams />
        <div className="relative z-10 text-center max-w-2xl mx-auto py-24">
          <div className="font-mono-terminal text-red-500 uppercase tracking-[5px] text-xs font-bold mb-6 flicker">// ERROR · PAGE_NOT_FOUND</div>

          <h1 className="glitch-hero font-black leading-none mb-6" data-text="404" style={{ fontSize: 'clamp(96px, 22vw, 200px)' }}>404</h1>

          <div className="text-3xl md:text-4xl font-black mb-5">Страница не найдена</div>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10">
            Похоже, такой страницы не существует или она была перемещена.
            Проверьте адрес или вернитесь на главную.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">На главную</Link>
            <Link href="/contacts" className="btn-secondary">Связаться с нами</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
