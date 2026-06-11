import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import formidable from 'formidable'
import { assertAdminApi } from '@/lib/auth'

export const config = { api: { bodyParser: false, responseLimit: false } }

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')
const IMAGES = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/avif': '.avif', 'image/svg+xml': '.svg' }
const VIDEOS = { 'video/mp4': '.mp4', 'video/webm': '.webm', 'video/quicktime': '.mov', 'video/x-matroska': '.mkv' }
const ALLOWED = { ...IMAGES, ...VIDEOS }
const MAX = 300 * 1024 * 1024 // 300 МБ (видео). На VPS поднять client_max_body_size в nginx.

export default async function handler(req, res) {
  if (!(await assertAdminApi(req, res))) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  const form = formidable({ maxFileSize: MAX, keepExtensions: false })

  let files
  try {
    [, files] = await form.parse(req)
  } catch (e) {
    return res.status(400).json({ error: e?.code === 1009 ? 'Файл больше 300 МБ' : 'Ошибка загрузки' })
  }

  const f = files?.file?.[0]
  if (!f) return res.status(400).json({ error: 'Файл не передан' })

  const ext = ALLOWED[f.mimetype]
  if (!ext) {
    fs.unlink(f.filepath, () => {})
    return res.status(415).json({ error: 'Только изображения (jpg, png, webp, gif, avif, svg) и видео (mp4, webm, mov, mkv)' })
  }
  const kind = VIDEOS[f.mimetype] ? 'video' : 'image'

  const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`
  const dest = path.join(UPLOADS_DIR, name)
  try {
    fs.renameSync(f.filepath, dest)
  } catch {
    fs.copyFileSync(f.filepath, dest)
    fs.unlink(f.filepath, () => {})
  }
  return res.status(200).json({ url: `/uploads/${name}`, kind })
}
