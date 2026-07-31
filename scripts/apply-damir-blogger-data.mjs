import { adminGetBySlug, adminUpsert, getDb } from '../lib/db.js'

const existing = adminGetBySlug('bloggers', 'damir')

if (!existing) {
  throw new Error('Damir blogger profile was not found')
}

adminUpsert('bloggers', {
  ...existing,
  metrics: [
    { _key: 'm1', value: '1M+', label: 'подписчиков' },
    { _key: 'm2', value: '500M+', label: 'просмотров' },
    { _key: 'm3', value: '5', label: 'площадок' },
  ],
  socials: [
    { _key: 's1', label: 'Instagram', url: 'https://www.instagram.com/damir_ilgamovich' },
    { _key: 's2', label: 'MAX', url: 'https://max.ru/damir_ilgamovich' },
    { _key: 's3', label: 'Telegram', url: 'https://t.me/damir_ilgamovich' },
    { _key: 's4', label: 'VK Clips', url: 'https://vk.com/clips/damir_ilgamovich' },
    { _key: 's5', label: 'YouTube', url: 'https://youtube.com/@damir_ilgamovich' },
  ],
})

getDb().pragma('wal_checkpoint(TRUNCATE)')

console.log('Damir blogger profile applied')
