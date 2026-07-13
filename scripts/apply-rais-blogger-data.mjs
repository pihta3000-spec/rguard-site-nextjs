import { adminGetBySlug, adminUpsert, getDb } from '../lib/db.js'

const existing = adminGetBySlug('bloggers', 'rais')

const bio = `
<p><strong>Раис «RAISSIA» Габитов</strong> — автор вирусных вертикальных роликов для Reels, Shorts и TikTok. Совокупная аудитория во всех социальных сетях превышает 1,2 млн человек.</p>
<p>Основной формат контента — короткие вертикальные ролики с живой подачей, узнаваемым образом и быстрым входом в тему.</p>
<h2>Тематика</h2>
<p>Чаще всего Раис снимает обзоры путешествий, производств, фестивалей и мероприятий, ресторанов и кафе, отелей, глэмпингов, одежды, туристического и спортивного снаряжения.</p>
<h2>Аудитория</h2>
<p><strong>YouTube и TikTok:</strong> основная аудитория федеральная — около 75%, также есть зрители из стран СНГ, преимущественно Центральной Азии.</p>
<p><strong>Instagram и ВКонтакте:</strong> помимо федеральной аудитории, до 25% аудитории составляют жители Республики Башкортостан и Челябинской области.</p>
<h2>Сообщества</h2>
<p>ВКонтакте — быстрорастущее официальное сообщество, верифицированное и зарегистрированное в Роскомнадзоре. Также Раис ведёт страницы в Facebook, Telegram, Дзене, Rutube, Threads и Пикабу.</p>
`.trim()

adminUpsert('bloggers', {
  ...(existing || {}),
  _id: existing?._id || 'blogger-rais',
  name: 'Раис «RAISSIA» Габитов',
  slug: 'rais',
  desc: 'Автор вирусных вертикальных роликов для Reels, Shorts и TikTok. Совокупная аудитория — 1,2 млн+ человек.',
  bio,
  photos: [
    '/bloggers/rais/rais-01.jpg',
    '/bloggers/rais/rais-02.jpg',
    '/bloggers/rais/rais-03.jpg',
    '/bloggers/rais/rais-04.jpg',
    '/bloggers/rais/rais-05.jpg',
    '/bloggers/rais/rais-06.jpg',
  ],
  showreel: existing?.showreel || '',
  metrics: [
    { _key: 'm1', value: '1,2M+', label: 'совокупная аудитория' },
    { _key: 'm2', value: '487K', label: 'TikTok' },
    { _key: 'm3', value: '475K', label: 'YouTube' },
    { _key: 'm4', value: '115K', label: 'Instagram' },
    { _key: 'm5', value: '26K', label: 'ВКонтакте' },
  ],
  socials: [
    { _key: 's1', label: 'YouTube', url: 'https://youtube.com/@raissia' },
    { _key: 's2', label: 'TikTok', url: 'https://www.tiktok.com/@raissia_official' },
    { _key: 's3', label: 'Instagram', url: 'https://www.instagram.com/raissia_official' },
    { _key: 's4', label: 'ВКонтакте', url: 'https://vk.ru/raissia_official' },
  ],
  specializations: [
    'Reels',
    'Shorts',
    'TikTok',
    'Путешествия',
    'Производства',
    'Мероприятия',
    'Рестораны и кафе',
    'Отели и глэмпинги',
    'Туристическое снаряжение',
  ],
  order: existing?.order ?? 5,
})

getDb().pragma('wal_checkpoint(TRUNCATE)')

console.log('Rais blogger profile applied')
