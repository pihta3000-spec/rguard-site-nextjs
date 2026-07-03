import Head from 'next/head'
import Layout from '@/components/Layout'
import Seo from '@/components/Seo'
import { resolvePageSeo } from '@/lib/db'

export default function Privacy({ seo }) {
  return (
    <Layout title="Политика конфиденциальности" description="Политика конфиденциальности RGUARD — обработка персональных данных.">
      <Seo seo={seo} />
      <section className="px-4 sm:px-6 py-20 max-w-4xl mx-auto">
        <div className="font-mono-terminal text-red-500 text-xs tracking-[4px] uppercase mb-6">// LEGAL</div>
        <h1 className="text-4xl md:text-5xl font-black mb-12 leading-tight">Политика конфиденциальности</h1>

        <div className="space-y-10 text-zinc-300 text-lg leading-relaxed">

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">1. Общие положения</h2>
            <p>Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки и защиты персональных данных пользователей сайта rguard.ru (далее — «Сайт»), принадлежащего ООО «Красная Гвардия» (далее — «Оператор»).</p>
            <p className="mt-4">Использование Сайта означает безоговорочное согласие пользователя с настоящей Политикой и указанными в ней условиями обработки персональных данных.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">2. Оператор персональных данных</h2>
            <div className="p-6" style={{border:'1px solid rgba(239,68,68,0.18)',background:'rgba(10,10,20,0.85)'}}>
              <p><strong className="text-white">Наименование:</strong> ООО «Красная Гвардия»</p>
              <p className="mt-2"><strong className="text-white">Адрес:</strong> г. Уфа, ул. Мингажева 102</p>
              <p className="mt-2"><strong className="text-white">Email:</strong> propala@rguard.ru</p>
              <p className="mt-2"><strong className="text-white">Телефон:</strong> +7 917 780-27-82</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">3. Состав персональных данных</h2>
            <p>Оператор обрабатывает следующие персональные данные, предоставляемые пользователем через формы обратной связи на Сайте:</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>Наименование компании</li>
              <li>Номер телефона</li>
              <li>Имя пользователя (при указании)</li>
              <li>Адрес электронной почты (при указании)</li>
              <li>Имя пользователя в мессенджерах (Telegram и др.)</li>
              <li>Содержание обращения</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">4. Цели обработки персональных данных</h2>
            <p>Персональные данные обрабатываются в следующих целях:</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>Обработка входящих обращений и заявок</li>
              <li>Связь с пользователем по вопросам сотрудничества</li>
              <li>Направление коммерческих предложений (с согласия пользователя)</li>
              <li>Улучшение качества работы Сайта и предоставляемых услуг</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">5. Правовые основания обработки</h2>
            <p>Обработка персональных данных осуществляется на основании:</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>Согласия субъекта персональных данных (ст. 6 Федерального закона № 152-ФЗ)</li>
              <li>Договоры, стороной которых является субъект персональных данных</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">6. Порядок и условия обработки</h2>
            <p>Оператор осуществляет обработку персональных данных следующими способами: сбор, запись, систематизация, накопление, хранение, уточнение, использование, передача, обезличивание, блокирование, удаление, уничтожение.</p>
            <p className="mt-4">Персональные данные не передаются третьим лицам, за исключением случаев, предусмотренных законодательством Российской Федерации.</p>
            <p className="mt-4">Срок обработки персональных данных — до достижения целей обработки или до момента отзыва согласия субъектом персональных данных.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">7. Права субъекта персональных данных</h2>
            <p>Пользователь вправе:</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>Получать информацию об обработке своих персональных данных</li>
              <li>Требовать уточнения, блокирования или уничтожения персональных данных</li>
              <li>Отозвать согласие на обработку персональных данных</li>
              <li>Обжаловать действия Оператора в уполномоченном органе по защите прав субъектов персональных данных</li>
            </ul>
            <p className="mt-4">Для реализации прав обращайтесь по адресу: <a href="mailto:propala@rguard.ru" className="text-red-400 hover:text-red-300">propala@rguard.ru</a></p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">8. Защита персональных данных</h2>
            <p>Оператор принимает необходимые организационные и технические меры для защиты персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">9. Использование файлов cookie</h2>
            <p>Сайт использует файлы cookie для обеспечения корректной работы. Продолжая использовать Сайт, пользователь соглашается с использованием cookie. Пользователь вправе отключить cookie в настройках браузера.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">10. Изменение Политики</h2>
            <p>Оператор оставляет за собой право вносить изменения в настоящую Политику. Актуальная версия всегда доступна на странице rguard.ru/privacy.</p>
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
  return { props: { seo: resolvePageSeo('/privacy') }, revalidate: 60 }
}
