import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { verifySmartCaptcha } from '../lib/smartCaptcha.js'

test('missing/invalid tokens and missing secret fail closed without network', async () => {
  const request = () => { throw new Error('must not call') }
  for (const token of [undefined, '', {}, 'x'.repeat(8193)]) {
    assert.equal((await verifySmartCaptcha(token, { secret: 'test', request })).status, 400)
  }
  assert.equal((await verifySmartCaptcha('token', { secret: '', request })).status, 503)
})
test('only verified production domain tokens are accepted', async () => {
  for (const host of ['rguard.ru', 'www.rguard.ru', 'evil.ru', '', undefined]) {
    const result = await verifySmartCaptcha('token', { secret: 'test', request: async (url, init) => {
      assert.equal(url, 'https://smartcaptcha.cloud.yandex.ru/validate')
      assert.equal(init.body.get('secret'), 'test')
      assert.equal(init.body.get('token'), 'token')
      return { ok: true, json: async () => ({ status: 'ok', host }) }
    } })
    assert.equal(result === null, ['rguard.ru', 'www.rguard.ru'].includes(host))
  }
})
test('invalid tokens, provider failure and timeout cannot bypass captcha', async () => {
  for (const request of [
    async () => ({ ok: true, json: async () => ({ status: 'failed' }) }),
    async () => ({ ok: false }),
    async () => { throw new Error('timeout') },
    async () => ({ ok: true, json: async () => { throw new Error('invalid JSON') } }),
  ]) assert.ok(await verifySmartCaptcha('token', { secret: 'test', request }))
})

test('both handlers reject before CRM/email; valid requests preserve lead payloads', async () => {
  const originalFetch = globalThis.fetch
  const originalKey = process.env.RESEND_API_KEY
  process.env.RESEND_API_KEY = 're_test'
  try {
    for (const form of ['contact', 'brief']) {
      let source = await readFile(new URL(`../pages/api/${form}.js`, import.meta.url), 'utf8')
      source = source.replace(/^import .*$/gm, '')
      const prelude = `
        const calls = [];
        class Resend { emails = { send: async () => { calls.push('email') } } }
        const sendLeadToRguardApp = async data => { calls.push(data.form) };
        const verifySmartCaptcha = async token => token === 'valid' ? null : {status:400,error:'Captcha required'};
        const STEPS = {}; const ROOT_ID = 'root'; const TASK_LABELS = {};
        export {calls};
      `
      const mod = await import(`data:text/javascript;base64,${Buffer.from(prelude + source).toString('base64')}`)
      const webhooks = []
      globalThis.fetch = async (url, init) => { webhooks.push(JSON.parse(init.body)); return { ok: true } }
      const body = form === 'contact' ? { contact: '+70000000000', company: 'test' } : { answers: {}, contacts: { phone: '+70000000000' } }
      const res = { status(code) { this.code = code; return this }, json(data) { this.data = data; return this } }
      await mod.default({ method: 'POST', body, headers: {} }, res)
      assert.equal(res.code, 400)
      assert.deepEqual(mod.calls, [])
      assert.deepEqual(webhooks, [])
      await mod.default({ method: 'POST', body: { ...body, captchaToken: 'valid' }, headers: { referer: 'https://rguard.ru/brief' } }, res)
      assert.equal(res.code, 200)
      assert.deepEqual(mod.calls, [form, 'email'])
      assert.equal(webhooks.length, 1)
      assert.equal(webhooks[0].page, 'https://rguard.ru/brief')
      assert.equal('captchaToken' in webhooks[0], false)
    }
  } finally {
    globalThis.fetch = originalFetch
    if (originalKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = originalKey
  }
})
