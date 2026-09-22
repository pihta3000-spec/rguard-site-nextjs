import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import SocialMeta from '@/components/SocialMeta'
import RichText from '@/components/RichText'
import { getEmployee, getPostsByAuthor } from '@/lib/db'
import { employeePath, articlePath, profileSchema, jsonLdText } from '@/lib/authorSchema'

export default function EmployeeProfile({ employee, posts }) {
  const title = employee.seo?.metaTitle || `${employee.name} — ${employee.jobTitle} | RGUARD`
  const description = employee.seo?.metaDescription || employee.description
  return <Layout title={employee.name} description={description}>
    <SocialMeta title={title} description={description} url={employeePath(employee.slug)} image={employee.photo} />
    <Head><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(profileSchema(employee, posts)) }} /></Head>
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <Link href="/team" className="text-red-400 underline underline-offset-4">Все сотрудники</Link>
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-10 mt-10">
        <img src={employee.photo} alt={employee.name} className="w-full aspect-[3/4] object-cover object-top" />
        <div className="min-w-0">
          <h1 className="text-4xl md:text-5xl font-black mb-4 break-words">{employee.name}</h1>
          <p className="text-xl text-red-400 mb-6">{employee.jobTitle}</p>
          <p className="text-lg text-zinc-300 mb-8">{employee.description}</p>
          <RichText html={employee.bio} />
          {!!employee.expertise.length && <section className="mt-8"><h2 className="text-2xl font-bold mb-4">Области экспертизы</h2><ul className="list-disc pl-5 space-y-2 text-zinc-300">{employee.expertise.map((item, i) => <li key={i}>{item}</li>)}</ul></section>}
          {!!employee.credentials.length && <section className="mt-8"><h2 className="text-2xl font-bold mb-4">Квалификация и регалии</h2><ul className="list-disc pl-5 space-y-2">{employee.credentials.map((item, i) => <li key={i}>{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="text-red-400 underline">{item.name}</a> : item.name}</li>)}</ul></section>}
          {!!employee.sameAs.length && <section className="mt-8"><h2 className="text-2xl font-bold mb-4">Профессиональные профили</h2><ul className="space-y-3">{employee.sameAs.map(url => <li key={url}><a href={url} target="_blank" rel="noreferrer" className="text-red-400 underline break-all">{url}</a></li>)}</ul></section>}
        </div>
      </div>
      {!!employee.publications.length && <section className="mt-16"><h2 className="text-3xl font-bold mb-6">Интервью и публикации в СМИ</h2><ul className="space-y-5">{employee.publications.map((item, i) => <li key={i}><a href={item.url} target="_blank" rel="noreferrer" className="text-red-400 underline text-lg">{item.title}</a><p className="text-zinc-300">{item.publisher}{item.publisher ? ' · ' : ''}{item.relation === 'about' ? 'Интервью / материал об эксперте' : 'Авторская публикация'}</p></li>)}</ul></section>}
      <section className="mt-16"><h2 className="text-3xl font-bold mb-6">Статьи на RGUARD</h2>
        {posts.length ? <ul className="space-y-6">{posts.map(post => <li key={post._id} className="border-b border-red-500/20 pb-6"><Link href={articlePath(post)} className="text-xl font-bold hover:text-red-400">{post.title}</Link>{post.excerpt && <p className="text-zinc-300 mt-2">{post.excerpt}</p>}</li>)}</ul> : <p className="text-zinc-300">Публикаций пока нет.</p>}
      </section>
    </section>
  </Layout>
}

export async function getServerSideProps({ params }) {
  const employee = getEmployee(params.slug)
  if (!employee) return { notFound: true }
  return { props: { employee, posts: getPostsByAuthor(employee._id) } }
}
