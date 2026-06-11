// Единая модель контента: описывает поля каждого типа для админ-форм и для CRUD в lib/db.js.
// Имена полей строго совпадают со схемой Sanity / колонками SQLite (важно для импорта таблицы).
//
// kind: text | textarea | richtext | number | boolean | slug | select | image | url
//       | imageList | tags | objectList | refList | seo
// json:true  → колонка хранит JSON-строку (массивы/объекты)
// slugFrom   → из какого поля автогенерить slug

export const SERVICE_OPTIONS = [
  { value: 'viral', label: 'Вирусные видеоролики' },
  { value: 'production', label: 'Продюсирование и СММ' },
  { value: 'corporate', label: 'Корпоративные фильмы' },
  { value: 'ai-content', label: 'ИИ контент' },
]

export const POST_CATEGORY_OPTIONS = [
  { value: 'viral', label: 'Вирусный контент' },
  { value: 'cases', label: 'Кейсы' },
  { value: 'tools', label: 'Инструменты' },
  { value: 'trends', label: 'Тренды' },
]

export const MODELS = {
  cases: {
    table: 'cases',
    labelSingular: 'Кейс',
    labelPlural: 'Кейсы',
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Название', kind: 'text', required: true },
      { name: 'slug', label: 'URL (slug)', kind: 'slug', slugFrom: 'title', required: true },
      { name: 'service', label: 'Категория', kind: 'select', options: SERVICE_OPTIONS },
      { name: 'accent', label: 'Тег / акцент', kind: 'text' },
      { name: 'shortText', label: 'Краткое описание', kind: 'textarea' },
      { name: 'task', label: 'Задача', kind: 'textarea' },
      { name: 'solution', label: 'Решение', kind: 'textarea' },
      { name: 'metrics', label: 'Метрики', kind: 'objectList', json: true,
        item: [{ name: 'value', label: 'Значение' }, { name: 'label', label: 'Подпись' }] },
      { name: 'links', label: 'Ссылки на видео', kind: 'tags', json: true },
      { name: 'whatWorked', label: 'Что сработало', kind: 'tags', json: true },
      { name: 'featured', label: 'Показывать на главной', kind: 'boolean' },
      { name: 'order', label: 'Порядок', kind: 'number' },
    ],
  },

  posts: {
    table: 'posts',
    labelSingular: 'Статья',
    labelPlural: 'Статьи',
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Заголовок', kind: 'text', required: true },
      { name: 'slug', label: 'URL (slug)', kind: 'slug', slugFrom: 'title', required: true },
      { name: 'category', label: 'Категория', kind: 'select', options: POST_CATEGORY_OPTIONS, required: true },
      { name: 'publishedAt', label: 'Дата публикации', kind: 'datetime' },
      { name: 'coverImage', label: 'Обложка', kind: 'image' },
      { name: 'excerpt', label: 'Краткое описание', kind: 'textarea' },
      { name: 'body', label: 'Контент статьи', kind: 'richtext' },
      { name: 'seo', label: 'SEO', kind: 'seo', json: true },
      { name: 'relatedPosts', label: 'Похожие статьи', kind: 'refList', json: true, refType: 'posts' },
    ],
  },

  industries: {
    table: 'industries',
    labelSingular: 'Отрасль',
    labelPlural: 'Отрасли',
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Название отрасли', kind: 'text', required: true },
      { name: 'slug', label: 'URL (slug)', kind: 'slug', slugFrom: 'title', required: true },
      { name: 'icon', label: 'Иконка (emoji/символ)', kind: 'text' },
      { name: 'coverImage', label: 'Обложка', kind: 'image' },
      { name: 'shortDesc', label: 'Краткое описание (для карточки)', kind: 'textarea' },
      { name: 'body', label: 'Основной контент', kind: 'richtext' },
      { name: 'linkedServices', label: 'Связанные услуги', kind: 'objectList', json: true,
        item: [
          { name: 'title', label: 'Название услуги' },
          { name: 'pageId', label: 'ID страницы (viral, production, corporate, ai-content, scripts, concepts, events)' },
          { name: 'description', label: 'Описание для отрасли', textarea: true },
        ] },
      { name: 'seo', label: 'SEO', kind: 'seo', json: true },
      { name: 'order', label: 'Порядок', kind: 'number' },
    ],
  },

  bloggers: {
    table: 'bloggers',
    labelSingular: 'Блогер',
    labelPlural: 'Блогеры',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Имя', kind: 'text', required: true },
      { name: 'slug', label: 'URL (slug)', kind: 'slug', slugFrom: 'name', required: true },
      { name: 'desc', label: 'Короткое описание (для карточки)', kind: 'textarea' },
      { name: 'bio', label: 'Полное био', kind: 'richtext' },
      { name: 'photos', label: 'Фотографии', kind: 'imageList', json: true },
      { name: 'showreel', label: 'Шоурил (ссылка на видео)', kind: 'url' },
      { name: 'metrics', label: 'Метрики', kind: 'objectList', json: true,
        item: [{ name: 'value', label: 'Значение' }, { name: 'label', label: 'Подпись' }] },
      { name: 'socials', label: 'Социальные сети', kind: 'objectList', json: true,
        item: [{ name: 'label', label: 'Название (TikTok…)' }, { name: 'url', label: 'Ссылка' }] },
      { name: 'specializations', label: 'Специализации', kind: 'tags', json: true },
      { name: 'order', label: 'Порядок', kind: 'number' },
    ],
  },
}

export const TYPE_KEYS = Object.keys(MODELS)

// Транслитерация + slugify (кириллица → латиница)
const TRANSLIT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
}
export function slugify(input = '') {
  return String(input).toLowerCase().trim()
    .split('').map(c => (c in TRANSLIT ? TRANSLIT[c] : c)).join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}
