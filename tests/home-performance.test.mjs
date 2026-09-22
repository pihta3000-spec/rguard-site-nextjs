import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { homeData } from '../lib/homeData.js'

test('home sends only displayed cards, no full text or galleries', () => {
  const cases = Array.from({length:26}, (_,i)=>({id:String(i),title:'Case',featured:i%2===0,body:'large'}))
  const bloggers = Array.from({length:10},(_,i)=>({slug:String(i),name:'Name',bio:'large',photos:['one','two']}))
  const result=homeData(cases,bloggers)
  assert.deepEqual(result.cases.map(c=>c.id),['0','2','4','6'])
  assert.equal(result.bloggers.length,3)
  assert.deepEqual(result.bloggers[0].photos,['one'])
  assert.ok(!JSON.stringify(result).includes('large'))
})
test('no remote font CSS and no eager hero video source in markup', () => {
  const css=fs.readFileSync('styles/globals.css','utf8')
  assert.ok(!css.includes('fonts.googleapis.com'))
  assert.ok(css.includes('font-display: swap'))
  const video=fs.readFileSync('components/HeroVideo.js','utf8')
  assert.ok(!video.includes('<source'))
  assert.ok(!video.includes('autoPlay'))
  assert.ok(video.includes('IntersectionObserver'))
})
