import { adminGetBySlug, adminUpsert, getDb } from '../lib/db.js'

const articleDescriptions = {
  'virusnyj-rolik-dlya-promyshlennosti': 'Вирусность в B2B работает не через случайные просмотры, а через пересылки внутри профессионального рынка. Разбираем, как найти идею, которую зритель захочет передать дальше.',
  'videorolik-dlya-proizvodstva': 'Промышленное видео может показывать сложный продукт без скуки и рекламной пластмассы. В фокусе — масштаб, люди, процесс и понятный смысл для клиента.',
  'reklamnyj-rolik-dlya-zavoda': 'Заводской ролик работает сильнее, когда показывает не цех под музыку, а причину выбрать компанию. Важны центральная идея, люди, оборудование и доказательства.',
  'korporativnyj-film-kotoryj-smotryat': 'Корпоративный фильм может работать на HR, продажи, имидж и внутренние коммуникации, если в нём есть история, люди и причина досмотреть.',
  'smm-dlya-promyshlennoj-kompanii': 'SMM промышленной компании начинается не с пресс-релизов, а с контент-системы: рубрик, героев, процессов, регулярных форматов и понятной аудитории.',
  'ii-video-dlya-biznesa': 'ИИ-видео помогает бизнесу быстрее проверять визуальные идеи, персонажей и метафоры. Но сильный результат всё равно начинается со сценария и концепции.',
  'scenarij-reklamnogo-rolika-zakazat': 'Сценарий рекламного ролика — это инженерия внимания: хук, ситуация, конфликт, обострение и финальное действие, а не просто текст для съёмки.',
  'reklamnaya-koncepciya-dlya-b2b': 'Сильная рекламная концепция держится на центральной идее, конфликте и механике, которую можно масштабировать в ролики, публикации и кампанию.',
  'korporativnoe-meropriyatie-kak-kontent': 'Корпоративное мероприятие может работать после финального слова, если заранее спроектировать событие как контент, инфоповод и серию публикаций.',
  'video-dlya-strojki-i-dobychi': 'Видео для стройки и добычи должно показывать масштаб без глянца: технику, смены, маршруты, безопасность, людей и реальные условия работы.',
  'chto-takoe-virusnyj-rolik': 'Вирусный ролик распространяется добровольно, когда в нём есть эмоция, конфликт, узнаваемая ситуация и повод переслать видео другому человеку.',
  'pochemu-b2b-video-ne-rabotaet': 'B2B-видео часто не работает, когда выглядит как реклама без конфликта и пользы для зрителя. Разбираем ошибки, из-за которых ролики не досматривают.',
  'kak-snyat-video-dlya-proizvodstva': 'Подготовка видео для производства начинается с цели, аудитории, сцен, героев, доступа на объект и понимания того, какую историю нужно показать.',
  'oshibki-korporativnogo-filma': 'Корпоративный фильм теряет зрителя, когда говорит общими словами, прячет людей и не показывает конфликт. Разбираем ошибки, из-за которых видео перематывают.',
  'scenarij-virusnogo-rolika-struktura': 'Структура вирусного ролика строится вокруг короткого конфликта: хука, узнаваемой ситуации, обострения, развязки и действия зрителя.',
  'kontent-plan-dlya-b2b': 'Контент-план для B2B — это не календарь ради публикаций, а система аудиторий, рубрик, героев, форматов, съёмок и повторного использования материалов.',
  'kak-ispolzovat-ii-v-reklame': 'ИИ полезен в рекламе, когда усиливает идею: помогает искать концепты, персонажей, визуальные метафоры и варианты подачи без замены стратегии.',
  'kpi-video-kontenta': 'Просмотры удобны, но не показывают всю ценность видео. Для оценки важны охват, удержание, пересылки, сохранения, комментарии и заявки.',
  'chto-snimat-v-socseti-promyshlennoj-kompanii': 'Соцсети промышленной компании держатся на понятных рубриках: людях и сменах, процессах, технике, до/после, ошибках, мифах и рабочих ситуациях.',
  'vertikalnye-video-dlya-b2b': 'Вертикальные видео для B2B работают, когда в первые секунды есть хук, один ролик держит один конфликт, а титры и ритм помогают досмотреть.',
  'hr-roliki-dlya-vahty': 'HR-ролики для вахты привлекают людей через узнаваемые ситуации: условия работы, быт, дорогу, оплату, команду и честные ответы на страхи кандидата.',
  'brend-rabotodatelya-na-proizvodstve': 'Бренд работодателя на производстве сильнее лозунгов, когда показывает людей, условия, быт, карьеру и реальные причины доверять компании.',
  'roliki-po-tehnike-bezopasnosti': 'Ролики по технике безопасности заменяют сухие инструкции короткими понятными сценами, где правила видны через реальные рабочие ситуации.',
  'video-dlya-adaptacii-sotrudnikov': 'Видео для адаптации помогает новичку быстрее понять людей, правила, быт, процессы и культуру компании без ощущения обязательной лекции.',
  'pr-dlya-b2b-kompanii': 'PR для B2B-компании начинается не с пресс-релиза, а с инфоповодов, людей, кейсов, конфликтов рынка и материалов, которые хочется обсуждать.',
  'kontent-dlya-promyshlennoj-vystavki': 'Промышленная выставка может стать месяцем публикаций, если заранее продумать съёмки, интервью, закулисье, демонстрации и материалы после события.',
  'meropriyatie-kak-infopovod': 'Мероприятие становится инфоповодом, когда его проектируют для камеры: с нужными кадрами, интервью, постами, кульминациями и дальнейшим распространением.',
  'marketing-stroitelnoj-kompanii': 'Маркетинг строительной компании должен показывать объекты, сроки, людей, технику, этапы и доверие, а не только красивые рендеры.',
  'marketing-dobyvayushchej-kompanii': 'Маркетинг добывающей компании работает сильнее без глянца: через технику, смены, маршруты, безопасность, HR-контент и реальную среду.',
  'blogery-dlya-promyshlennoj-kompanii': 'Блогеры для промышленной компании помогают говорить с рынком через людей, которым верят: амбассадоров, экспертов, сотрудников и узнаваемые лица бренда.',
}

function walk(value, fn) {
  if (Array.isArray(value)) return value.map(item => walk(item, fn))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, walk(item, fn)]))
  }
  return typeof value === 'string' ? fn(value) : value
}

function normalizeText(text) {
  return text
    .replace(/\bB2b\b/g, 'B2B')
    .replace(/\bb2b\b/g, 'B2B')
    .replace(/hybrid production/g, 'гибридный продакшн')
    .replace(/industrial video/g, 'industrial-видео')
    .replace(/production(?=[-\s])/g, 'продакшн')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/,\./g, '.')
    .replace(/\s+-\s+/g, ' — ')
}

let articleCount = 0

for (const [slug, description] of Object.entries(articleDescriptions)) {
  const doc = adminGetBySlug('posts', slug)
  if (!doc) continue

  const seo = doc.seo ? walk(doc.seo, normalizeText) : {}
  seo.metaDescription = description
  if (Array.isArray(seo.jsonLd)) {
    seo.jsonLd = walk(seo.jsonLd, value => normalizeText(value === doc.excerpt ? description : value))
  }

  adminUpsert('posts', {
    ...doc,
    excerpt: description,
    body: normalizeText(doc.body || ''),
    seo,
  })
  articleCount++
}

const caseFixes = {
  alabuga: {
    solution: text => normalizeText(text),
  },
  'bashkirskiy-kirpich': {
    solution: text => normalizeText(text),
  },
  birdsbuild: {
    solution: text => normalizeText(text),
  },
  ekopark: {
    whatWorked: list => (list || []).map(item => normalizeText(item)),
    insight: text => normalizeText(text).replace(/в их жизу и боль/g, 'в их реальные ситуации и боли'),
  },
  'kpd-development': {
    solution: text => normalizeText(text),
  },
  'np-dalnego-vostoka': {
    solution: text => normalizeText(text),
  },
  ogrk: {
    task: text => normalizeText(text),
    solution: text => normalizeText(text),
  },
  'ooo-farfor-franchayzing': {
    task: text => normalizeText(text),
  },
  'ooo-vostochnaya-gornorudnaya-kompaniya': {
    solution: text => normalizeText(text),
  },
  'rybflot-forgrupp': {
    solution: text => normalizeText(text),
  },
  termy: {
    solution: text => normalizeText(text).replace(/видос-экскурсия/g, 'ролик-экскурсия'),
  },
  wasserjet: {
    task: text => normalizeText(text),
    insight: text => normalizeText(text).replace(/через жизу и боль/g, 'через реальные ситуации и боли'),
  },
}

let caseCount = 0

for (const [slug, fields] of Object.entries(caseFixes)) {
  const doc = adminGetBySlug('cases', slug)
  if (!doc) continue
  const next = { ...doc }
  for (const [field, fix] of Object.entries(fields)) {
    next[field] = fix(doc[field])
  }
  adminUpsert('cases', next)
  caseCount++
}

getDb().pragma('wal_checkpoint(TRUNCATE)')

console.log(`Copy fixes applied: ${articleCount} articles, ${caseCount} cases`)
