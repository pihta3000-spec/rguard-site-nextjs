import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import SocialMeta from '@/components/SocialMeta'
import { getEmployees } from '@/lib/db'
import { employeePath } from '@/lib/authorSchema'

export default function Employees({ employees }) {
  return <Layout title="Сотрудники и авторы" description="Команда RGUARD: профессиональный опыт и публикации авторов.">
    <SocialMeta title="Сотрудники и авторы — RGUARD" description="Команда RGUARD: профессиональный опыт и публикации авторов." url="/сотрудники" />
    {!employees.length && <Head><meta name="robots" content="noindex,follow" /></Head>}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <h1 className="text-4xl md:text-6xl font-black mb-10">Сотрудники и авторы</h1>
      {!employees.length ? <p className="text-zinc-300">Профили команды готовятся к публикации.</p> :
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">{employees.map(person =>
          <Link key={person._id} href={employeePath(person.slug)} className="cyber-card overflow-hidden">
            <img src={person.photo} alt={person.name} className="w-full aspect-[3/4] object-cover object-top" loading="lazy" />
            <div className="p-6"><h2 className="text-2xl font-bold mb-2">{person.name}</h2><p className="text-red-400 mb-3">{person.jobTitle}</p><p className="text-zinc-300">{person.description}</p></div>
          </Link>)}</div>}
    </section>
  </Layout>
}

export async function getServerSideProps() { return { props: { employees: getEmployees() } } }
