import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { caseSchema, profileSchema, jsonLdText } from '../lib/authorSchema.js'

fs.mkdirSync('data', { recursive: true })
process.env.DB_PATH = path.join(fs.mkdtempSync(path.resolve('data', 'case-expertise-test-')), 'content.db')
const db = await import('../lib/db.js')
const { revalidatePaths } = await import('../lib/revalidate.js')

test('all existing and future cases use the published Roman profile without changing import fields', async () => {
  db.adminUpsert('cases', { _id: 'case-one', slug: 'one', title: 'Первый', shortText: 'Описание' })
  assert.equal((await db.getCase('one')).expert, null)
  const employee = { _id: db.CASE_EXPERT_ID, slug: 'roman-sergeev', name: 'Сергеев Роман Викторович',
    jobTitle: 'Соучредитель', photo: '/employees/roman-sergeev.png', description: '17 лет опыта',
    bio: '<p>Опыт</p>', expertise: ['Маркетинг'], published: true }
  db.adminUpsert('employees', employee)
  db.adminUpsert('cases', { _id: 'case-two', slug: 'two', title: 'Второй' })
  for (const slug of ['one', 'two']) assert.equal((await db.getCase(slug)).expert._id, employee._id)
  assert.equal((await db.getCasesByExpert(employee._id)).length, 2)
  assert.deepEqual(await db.getCasesByExpert('employee-damir-vakhitov'), [])
  assert.ok((await db.getCases()).every(item => !('expert' in item)))
  assert.equal(await db.getCase('missing'), null)
  db.adminUpsert('employees', { ...employee, slug: 'renamed-roman' })
  const item = await db.getCase('one')
  const schema = caseSchema(item)
  assert.equal(schema.contributor.url, 'https://rguard.ru/team/renamed-roman')
  assert.equal(schema.contributor['@type'], 'Person')
  assert.equal(schema.author, undefined)
  const profile = profileSchema(item.expert, [], await db.getCasesByExpert(employee._id))
  assert.equal(profile.hasPart[0].contributor['@id'], schema.contributor['@id'])
  assert.equal(profile.hasPart.find(p => p.url.endsWith('/one'))['@id'], schema['@id'])
  assert.ok(!jsonLdText(caseSchema({ ...item, title: '</script>' })).includes('</script>'))
  const paths = []
  await revalidatePaths({ revalidate: async p => paths.push(p) }, 'employees', 'renamed-roman')
  assert.ok(paths.includes('/cases/one') && paths.includes('/cases/two'))
  db.adminUpsert('employees', { ...employee, published: false })
  assert.equal((await db.getCase('one')).expert, null)
  assert.equal(caseSchema(await db.getCase('one')).contributor, undefined)
  assert.deepEqual(await db.getCasesByExpert(employee._id), [])
})

test.after(() => { db.getDb().close(); delete globalThis.__rguardDb })
