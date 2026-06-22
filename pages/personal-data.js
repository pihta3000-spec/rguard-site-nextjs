import Head from 'next/head'
import Layout from '@/components/Layout'
import Seo from '@/components/Seo'
import { resolvePageSeo } from '@/lib/db'

export default function PersonalData({ seo }) {
  return (
    <Layout title="Обработка персональных данных" description="Порядок обработки персональных данных RGUARD (ООО «Красная Гвардия»).">
      <Seo seo={seo} />
      <section className="px-4 sm:px-6 py-20 max-w-4xl mx-auto">
        <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-6">// LEGAL</div>
        <h1 className="text-4xl md:text-5xl font-black mb-12 leading-tight">Обработка персональных данных</h1>

        <div className="space-y-10 text-zinc-300 text-lg leading-relaxed">

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">1. Согласие на обработку персональных данных</h2>
            <p>Отправляя форму на сайте rguard.ru, вы (субъект персональных данных) выражаете добровольное, конкретное, информированное и сознательное согласие на обработку ваших персональных данных оператором — ООО «Красная Гвардия».</p>
            <p className="mt-4">Согласие даётся в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">2. Перечень обрабатываемых данных</h2>
            <p>В рамках обращения через формы Сайта обрабатываются:</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>Фамилия, имя, отчество (при указании)</li>
              <li>Наименование организации</li>
              <li>Номер телефона</li>
              <li>Адрес электронной почты (при указании)</li>
              <li>Имя пользователя в мессенджерах</li>
              <li>Содержание обращения и иные данные, добровольно предоставленные пользователем</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">3. Цели обработки</h2>
            <ul className="mt-2 space-y-2 list-disc list-inside">
              <li>Ответ на обращение пользователя</li>
              <li>Заключение и исполнение договора об оказании услуг</li>
              <li>Направление информационных и коммерческих сообщений (с отдельного согласия)</li>
              <li>Улучшение качества работы Сайта</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">4. Срок обработки</h2>
            <p>Персональные данные обрабатываются в течение 5 (пяти) лет с момента получения согласия либо до его отзыва субъектом персональных данных.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">5. Передача третьим лицам</h2>
            <p>Персональные данные не передаются третьим лицам без согласия субъекта, за исключением случаев, предусмотренных законодательством Российской Федерации.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">6. Отзыв согласия</h2>
            <p>Вы вправе в любой момент отозвать своё согласие, направив письменное заявление по адресу: г. Уфа, ул. Мингажева 102, или по электронной почте <a href="mailto:propala@rguard.ru" className="text-red-400 hover:text-red-300">propala@rguard.ru</a>.</p>
            <p className="mt-4">Отзыв согласия не влияет на законность обработки, осуществлённой до его отзыва.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">7. Права субъекта</h2>
            <p>В соответствии с Федеральным законом № 152-ФЗ вы вправе:</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>Получать информацию об обработке ваших персональных данных</li>
              <li>Требовать уточнения, блокирования или уничтожения неактуальных данных</li>
              <li>Обжаловать действия оператора в Роскомнадзоре</li>
            </ul>
          </div>

          <div className="pt-6" style={{borderTop:'1px solid rgba(239,68,68,0.15)'}}>
            <p className="font-mono-terminal text-zinc-500 text-sm">Дата последнего обновления: {new Date().toLocaleDateString('ru-RU', {day:'numeric',month:'long',year:'numeric'})}</p>
          </div>

        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  return { props: { seo: resolvePageSeo('/personal-data') }, revalidate: 60 }
}
