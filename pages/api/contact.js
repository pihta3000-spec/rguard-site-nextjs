import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const TO = ['pihta3000@gmail.com', 'usmanov.radimjob@gmail.com']

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { company, contact, message, button } = req.body

  if (!contact) return res.status(400).json({ error: 'Телефон или Telegram обязателен' })

  try {
    await resend.emails.send({
      from: 'RGUARD Сайт <onboarding@resend.dev>',
      to: TO,
      subject: `Новая заявка с сайта — ${button || 'Форма обратной связи'}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a14;color:#e2e8f0;padding:32px;border:1px solid rgba(239,68,68,0.3);">
          <h2 style="color:#ef4444;margin:0 0 24px;font-size:22px;">Новая заявка с rguard.ru</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#94a3b8;width:180px;">Источник формы</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${button || '—'}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#94a3b8;">Компания</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${company || '—'}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#94a3b8;">Телефон / Telegram</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-weight:bold;color:#ef4444;">${contact}</td></tr>
            <tr><td style="padding:10px 0;color:#94a3b8;vertical-align:top;">Сообщение</td><td style="padding:10px 0;">${message || '—'}</td></tr>
          </table>
          <p style="margin:24px 0 0;color:#64748b;font-size:12px;">Письмо отправлено автоматически с сайта rguard.ru</p>
        </div>
      `,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Ошибка отправки' })
  }
}
