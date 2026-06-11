import fs from 'node:fs'
import formidable from 'formidable'
import ExcelJS from 'exceljs'
import { assertAdminApi } from '@/lib/auth'
import { importWorkbook } from '@/lib/importSheet'
import { revalidatePaths } from '@/lib/revalidate'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (!(await assertAdminApi(req, res))) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const form = formidable({ maxFileSize: 25 * 1024 * 1024 })
  let files
  try { [, files] = await form.parse(req) }
  catch { return res.status(400).json({ error: 'Не удалось прочитать файл' }) }

  const f = files?.file?.[0]
  if (!f) return res.status(400).json({ error: 'Файл не передан' })
  const name = (f.originalFilename || '').toLowerCase()
  if (!name.endsWith('.xlsx')) {
    fs.unlink(f.filepath, () => {})
    return res.status(415).json({ error: 'Нужен файл .xlsx (Google Таблицы → Скачать → Microsoft Excel)' })
  }

  let summary
  try {
    const wb = new ExcelJS.Workbook()
    await wb.xlsx.readFile(f.filepath)
    summary = importWorkbook(wb)
  } catch (e) {
    console.error('Import error:', e)
    return res.status(500).json({ error: 'Ошибка разбора таблицы: ' + e.message })
  } finally {
    fs.unlink(f.filepath, () => {})
  }

  // Перестроить публичные страницы (списки + главная). Slug-страницы догонят по ISR.
  for (const type of Object.keys(summary.byType)) await revalidatePaths(res, type, null)

  return res.status(200).json({ ok: true, summary })
}
