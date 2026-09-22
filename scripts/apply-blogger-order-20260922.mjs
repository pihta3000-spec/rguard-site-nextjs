import { getDb } from '../lib/db.js'
import { reorderBloggers } from '../lib/bloggerOrder.js'
const db = getDb()
const before = db.prepare('SELECT _id, slug, "order" FROM bloggers ORDER BY "order" ASC').all()
const after = reorderBloggers(before)
if (after.some((row, i) => row.order !== i + 1)) {
  await db.backup(`${db.name}.before-blogger-order-${Date.now()}.bak`)
  db.transaction(() => after.forEach((row, i) => db.prepare('UPDATE bloggers SET "order" = ? WHERE _id = ?').run(i + 1, row._id)))()
}
console.log(after.map((row, i) => `${i + 1}. ${row.slug}`).join('\n'))
db.close()
