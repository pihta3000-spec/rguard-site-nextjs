// Разовый патч данных кейсов: удалить дубль + переразбить «Что сработало».
// Только БД (без git/сборки). Запуск: node scripts/fix-cases-data.mjs
import { adminGetBySlug, adminUpsert, adminDelete, adminList } from '../lib/db.js'

const DELETE = ['petroinzhiniring']

// Переразбитые «Что сработало» (по смыслу — один пункт на карточку). Текст сохранён близко к исходному.
const WHAT_WORKED = {
  'petro-engineering': ['Про вахту до нас еще никто так не рассказывал.', 'Мы применили принцип Негатив в Позитив', 'Результаты ошеломили даже нас самих.'],
  'rostelekom': ['Харизма', 'Захват и удержание', 'Нестандартные сценарные решения', 'Вовлечение жителей города в создание контента'],
  'sibur-nizhnekamskneftehim': ['Харизма', 'Захват и удержание', 'Сработал наш принцип вирусности: позитив в негатив'],
  'wasserjet': ['Сам по себе товар — это ноу-хау', 'Такие товары достаточно поместить в кадр, чтобы получить эффект'],
  'bashkirskiy-kirpich': ['Необычная для этой тематики подача', 'Разнообразие сценариев'],
  'vezuviy': ['Необычная подача товара', 'Абсурдное сравнение'],
  'ooo-tehnonikol': ['Актуальность', 'Точное подмечалово', 'Отличный отыгрыш женского персонажа'],
  'servis-integrator': ['Максимально широкая тема', 'Принцип мнемотехники'],
  'etalontransservis': ['Необычная подача вахтовой работы', 'Пародия на передачу «В мире животных»'],
  'ekopark': ['Продажи не напрямую в лоб, а через привлечение внимания главной движущей силы рынка недвижимости — риелторов'],
  'pivmaster': ['Негатив в позитив', 'Харизма', 'Захват и удержание', 'Подача пивной тематики не напрямую, а через сопутствующие ощущения'],
}

let deleted = 0
for (const slug of DELETE) {
  const doc = adminGetBySlug('cases', slug)
  if (doc) { adminDelete('cases', doc._id); deleted++; console.log('удалён:', slug) }
}

let patched = 0
for (const [slug, ww] of Object.entries(WHAT_WORKED)) {
  const doc = adminGetBySlug('cases', slug)
  if (!doc) { console.log('НЕ найден:', slug); continue }
  adminUpsert('cases', { ...doc, whatWorked: ww, _id: doc._id })
  patched++
}
console.log(`Удалено: ${deleted}, обновлено whatWorked: ${patched}, всего кейсов: ${adminList('cases').length}`)
