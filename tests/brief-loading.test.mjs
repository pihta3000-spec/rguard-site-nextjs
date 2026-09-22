import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

test('brief loads its form directly and gates optional decoration behind desktop viewport', () => {
  const page = fs.readFileSync('pages/brief.js', 'utf8')
  assert.match(page, /import BriefForm from/)
  assert.match(page, /<DesktopOnly minWidth=\{1024\}><BriefSequenceBackdrop/)
  const layout = fs.readFileSync('components/Layout.js', 'utf8')
  assert.match(layout, /briefOpen && !isBriefPage && <BriefModal/)
})

test('decoration initially loads stills; full sequence starts only on interaction with bounded concurrency', () => {
  const source = fs.readFileSync('components/BriefSequenceBackdrop.js', 'utf8')
  assert.match(source, /const start = \(\) => \{\s+loadFrames\(\)/)
  assert.ok(!source.includes('if (desktop) loadFrames()'))
  assert.match(source, /i < 4; i\+\+\) loadNext\(\)/)
  assert.match(source, /if \(!mountedRef.current \|\| next > TOTAL_FRAMES\) return/)
})

test('cookie storage failures are contained for both read and write', () => {
  const source = fs.readFileSync('components/CookieBanner.js', 'utf8')
  assert.match(source, /useState\(false\)/)
  assert.match(source, /try \{ setVisible\(!localStorage.getItem\('cookie_accepted'\)\) \}\s+catch/)
  assert.match(source, /try \{ localStorage.setItem\('cookie_accepted', '1'\) \} catch/)
})
