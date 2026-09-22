import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { themeBootstrap } from '../lib/theme.js'
import { reorderBloggers } from '../lib/bloggerOrder.js'

test('theme bootstrap: saved preference, default, denied storage, admin isolation', () => {
  for (const [saved, pathname, denied, expected] of [
    ['light','/',false,'light'],['dark','/',false,'dark'],[null,'/',false,'dark'],
    ['bogus','/',false,'dark'],['light','/',true,'dark'],['light','/panel-rg7x',false,'dark'],
  ]) {
    const root = { dataset: {} }
    vm.runInNewContext(themeBootstrap, { document: {documentElement: root, querySelector: () => ({setAttribute(){}})},
      location: {pathname}, localStorage: {getItem: () => {if(denied) throw Error('denied');return saved}} })
    assert.equal(root.dataset.theme, expected)
  }
})
test('Denis fourth, Semen fifth; every other blogger retains relative position', () => {
  const rows = ['damir','dima','ramil','rais','natasha','nadir','denis-sundukov','semen-molokanov','maxim','egor'].map(slug=>({slug}))
  const next = reorderBloggers(rows)
  assert.deepEqual(next.map(r=>r.slug), ['damir','dima','ramil','denis-sundukov','semen-molokanov','rais','natasha','nadir','maxim','egor'])
  assert.deepEqual(reorderBloggers(next), next)
})
