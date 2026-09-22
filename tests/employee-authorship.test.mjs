import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import ExcelJS from 'exceljs'
import { articleSchema, profileSchema, personSchema, jsonLdText, withoutArticleSchema } from '../lib/authorSchema.js'

fs.mkdirSync('data', { recursive: true })
const dir = fs.mkdtempSync(path.resolve('data', 'authorship-test-'))
process.env.DB_PATH = path.join(dir, 'content.db')
const oldDb = new Database(process.env.DB_PATH)
oldDb.exec(fs.readFileSync('lib/schema.sql', 'utf8'))
oldDb.prepare('INSERT INTO posts (_id, title, slug, body) VALUES (?, ?, ?, ?)').run('old-post', 'Old title', 'old-post', '<p>Original</p>')
oldDb.close()
const db = await import('../lib/db.js')
const { importWorkbook } = await import('../lib/importSheet.js')

const employee = { _id: 'employee-test', name: 'Тестовый автор', slug: 'test-author', jobTitle: 'Редактор',
  photo: '/test.jpg', description: 'Тестовое описание', bio: '<p>Опыт</p>', published: false,
  expertise: ['Видео'], credentials: [{ name: 'Квалификация', url: 'https://example.com/credential' }],
  sameAs: ['https://example.com/profile'], publications: [{ title: 'Материал', url: 'https://example.com/article', publisher: 'Издание' }] }

test('migration, publication, relations, import, schema and safe legacy writes', async () => {
  assert.equal((await db.getPost('old-post')).body, '<p>Original</p>')
  assert.equal((await db.getPost('old-post')).author, null)
  db.adminUpsert('employees', employee)
  assert.equal(db.getEmployee('test-author'), null)
  assert.deepEqual(db.getEmployees(), [])
  const old = db.adminGet('posts', 'old-post')
  db.adminUpsert('posts', { ...old, authorId: employee._id })
  assert.equal((await db.getPost('old-post')).author, null)
  db.adminUpsert('employees', { ...employee, published: true })
  assert.equal((await db.getPost('old-post')).author.name, employee.name)
  assert.equal(db.getPostsByAuthor(employee._id).length, 1)
  assert.throws(() => db.adminDelete('employees', employee._id), /Сотрудник указан автором/)
  assert.throws(() => db.adminUpsert('posts', { ...old, authorId: 'unknown' }), /не найден/)
  db.adminUpsert('posts', { _id: 'old-post', slug: 'old-post', title: 'Changed title' })
  assert.equal(db.adminGet('posts', 'old-post').authorId, employee._id)
  db.adminUpsert('employees', { ...employee, published: true, slug: 'renamed-author' })
  const post = await db.getPost('old-post')
  assert.equal(post.author.slug, 'renamed-author')
  const graph = profileSchema(post.author, db.getPostsByAuthor(employee._id))
  assert.equal(graph.mainEntity['@id'], articleSchema(post).author['@id'])
  assert.equal(graph.hasPart.length, 2)
  const interview = profileSchema({ ...post.author, publications: [{ title: 'Interview', url: 'https://example.com/interview', relation: 'about' }] }, [])
  assert.equal(interview.hasPart[0].author, undefined)
  assert.equal(interview.hasPart[0].about['@id'], graph.mainEntity['@id'])
  assert.equal(graph.hasPart[1].author['@id'], graph.mainEntity['@id'])
  assert.deepEqual(graph.mainEntity.sameAs, employee.sameAs)
  assert.ok(!jsonLdText({ x: '</script><script>alert(1)</script>' }).includes('<'))
  assert.equal(articleSchema({ title: 'Unassigned', slug: 'none' }).author, undefined)
  assert.equal(personSchema({ ...post.author, photo: '' }).image, undefined)
  assert.equal(withoutArticleSchema([{ '@graph': [{ '@type': 'BlogPosting' }, { '@type': 'BreadcrumbList' }] }])[0]['@graph'].length, 1)

  const wb = new ExcelJS.Workbook()
  const sheet = wb.addWorksheet('СТАТЬИ')
  sheet.addRow(['Заголовок', 'Slug', 'authorSlug'])
  sheet.addRow(['Updated', 'old-post', ''])
  sheet.addRow(['New post', 'new-post', 'renamed-author'])
  sheet.addRow(['Bad post', 'bad-post', 'does-not-exist'])
  const result = importWorkbook(wb)
  assert.equal(result.byType.posts.updated, 1)
  assert.equal(result.byType.posts.created, 1)
  assert.equal(result.warnings.length, 1)
  assert.equal(db.adminGet('posts', 'old-post').authorId, employee._id)
  assert.equal((await db.getPost('new-post')).author._id, employee._id)
  assert.equal(await db.getPost('bad-post'), null)
  db.adminUpsert('employees', { ...employee, published: false })
  assert.equal((await db.getPost('new-post')).author, null)
  assert.throws(() => db.adminUpsert('employees', { ...employee, published: true, photo: '' }), /Для публикации/)
  assert.throws(() => db.adminUpsert('employees', { ...employee, sameAs: ['javascript:alert(1)'] }), /http/)
})

test.after(() => { db.getDb().close(); delete globalThis.__rguardDb })
