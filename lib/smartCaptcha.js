// Server-only validation: never accept a lead on provider errors or missing configuration.
export async function verifySmartCaptcha(token, { secret = process.env.SMARTCAPTCHA_SERVER_KEY, request = fetch } = {}) {
  if (typeof token !== 'string' || !token.trim() || token.length > 8192) {
    return { status: 400, error: 'Подтвердите, что вы не робот.' }
  }
  if (!secret) return { status: 503, error: 'Проверка защиты временно недоступна. Попробуйте позже.' }
  try {
    const response = await request('https://smartcaptcha.cloud.yandex.ru/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, token }),
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) throw new Error('Validation unavailable')
    const result = await response.json()
    if (result.status === 'ok' && ['rguard.ru', 'www.rguard.ru'].includes(result.host)) return null
    return { status: 400, error: 'Проверка не пройдена или устарела. Пройдите капчу ещё раз.' }
  } catch {
    return { status: 503, error: 'Не удалось проверить капчу. Попробуйте ещё раз.' }
  }
}
