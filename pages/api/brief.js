import { Resend } from 'resend'
import { STEPS, ROOT_ID, TASK_LABELS } from '../../lib/briefSteps'

const resend = new Resend(process.env.RESEND_API_KEY)

const TO = ['pihta3000@gmail.com', 'usmanov.radimjob@gmail.com']

function answerLabel(stepId, value) {
  const step = STEPS[stepId]
  if (!step || !step.options) return value
  const find = (v) => step.options.find(o => o.value === v)?.label || v
  return Array.isArray(value) ? value.map(find).join(', ') : find(value)
}

function buildAnswersRows(answers) {
  const rows = []
  for (const [stepId, value] of Object.entries(answers)) {
    const step = STEPS[stepId]
    if (!step) continue
    const question = stepId === ROOT_ID ? step.question : step.question
    rows.push({ question, answer: answerLabel(stepId, value) })
  }
  return rows
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { answers, contacts } = req.body || {}

  if (!answers || !contacts) return res.status(400).json({ error: 'Некорректные данные' })
  if (!contacts.phone || !contacts.phone.trim()) return res.status(400).json({ error: 'Телефон обязателен' })

  try {
    const taskLabel = TASK_LABELS[answers[ROOT_ID]] || '—'
    const answerRows = buildAnswersRows(answers)

    const answersHtml = answerRows.map(r => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#94a3b8;width:300px;vertical-align:top;">${r.question}</td>
        <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${r.answer}</td>
      </tr>
    `).join('')

    const contactsHtml = `
      <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#94a3b8;width:300px;">Название компании</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${contacts.company || '—'}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#94a3b8;">Город</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${contacts.city || '—'}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#94a3b8;vertical-align:top;">Род деятельности</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${contacts.activity || '—'}</td></tr>
      <tr><td style="padding:10px 0;color:#94a3b8;">Телефон</td><td style="padding:10px 0;font-weight:bold;color:#ef4444;">${contacts.phone}</td></tr>
    `

    await resend.emails.send({
      from: 'RGUARD Сайт <onboarding@resend.dev>',
      to: TO,
      subject: `Новый бриф с сайта — ${taskLabel}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;background:#0a0a14;color:#e2e8f0;padding:32px;border:1px solid rgba(239,68,68,0.3);">
          <h2 style="color:#ef4444;margin:0 0 8px;font-size:22px;">Новый бриф с rguard.ru</h2>
          <p style="color:#94a3b8;margin:0 0 24px;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Задача: ${taskLabel}</p>

          <h3 style="color:#fca5a5;font-size:15px;margin:0 0 12px;">Ответы по брифу</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">${answersHtml}</table>

          <h3 style="color:#fca5a5;font-size:15px;margin:0 0 12px;">Контактные данные</h3>
          <table style="width:100%;border-collapse:collapse;">${contactsHtml}</table>

          <p style="margin:24px 0 0;color:#64748b;font-size:12px;">Письмо отправлено автоматически с сайта rguard.ru (форма «Заполнить бриф»)</p>
        </div>
      `,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Ошибка отправки' })
  }
}
