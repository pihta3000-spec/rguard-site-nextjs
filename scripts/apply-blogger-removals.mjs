import { adminDelete, adminGetBySlug, getDb } from '../lib/db.js'

const slugsToRemove = ['robert', 'domhozyaika']
const removed = []

for (const slug of slugsToRemove) {
  const blogger = adminGetBySlug('bloggers', slug)
  if (!blogger) continue
  if (adminDelete('bloggers', blogger._id)) removed.push(slug)
}

getDb().pragma('wal_checkpoint(TRUNCATE)')

console.log(`Removed bloggers: ${removed.length ? removed.join(', ') : 'none'}`)
