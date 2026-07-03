const DEFAULT_LEADS_ENDPOINT = 'https://app.rguard.ru/api/integrations/leads'

export async function sendLeadToRguardApp(payload) {
  const secret = process.env.RGUARD_APP_LEADS_SECRET
  if (!secret) return

  const endpoint = process.env.RGUARD_APP_LEADS_URL || DEFAULT_LEADS_ENDPOINT
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-rguard-webhook-secret': secret,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`RGUARD app lead webhook failed: ${response.status} ${text}`)
  }
}

