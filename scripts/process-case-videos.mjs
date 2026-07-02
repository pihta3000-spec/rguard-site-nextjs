// Extracts case video zip archives, creates web MP4s and poster frames.
// Usage:
//   CASE_VIDEO_SOURCE="D:/Видео для кейсов" node scripts/process-case-videos.mjs
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path
const ffprobe = require('@ffprobe-installer/ffprobe').path
const yauzl = require('yauzl')

const sourceRoot = process.env.CASE_VIDEO_SOURCE || 'D:/Видео для кейсов'
const workRoot = path.join(process.cwd(), '.case-video-work')
const outRoot = path.join(process.cwd(), 'public', 'cases-videos')
const frameRoot = path.join(process.cwd(), 'public', 'cases-video-frames')
const manifestPath = path.join(process.cwd(), 'scripts', 'cases-videos-data.json')

const folderToSlug = new Map([
  ['BirdsBuild', 'birdsbuild'],
  ['Devon', 'devon'],
  ['WASSERJET', 'wasserjet'],
  ['Алабуга', 'alabuga'],
  ['АртРоял Детейлинг', 'artroyal-deteyling'],
  ['Башкирский кирпич', 'bashkirskiy-kirpich'],
  ['Везувий', 'vezuviy'],
  ['Виктория (магнитка)', 'viktoriya-magnitka'],
  ['КПД Девелопмент', 'kpd-development'],
  ['НП Дальнего Востока', 'np-dalnego-vostoka'],
  ['ОГРК', 'ogrk'],
  ['ООО «ТехноНИКОЛЬ', 'ooo-tehnonikol'],
  ['ООО «Фарфор Франчайзинг»', 'ooo-farfor-franchayzing'],
  ['ООО Восточная Горнорудная Компания', 'ooo-vostochnaya-gornorudnaya-kompaniya'],
  ['ООО Лакокрасочный завод Деоль', 'ooo-lakokrasochnyy-zavod-deol'],
  ['Петроинжиниринг', 'petro-engineering'],
  ['Пивмастер', 'pivmaster'],
  ['РМК', 'rmk'],
  ['Ростелеком', 'rostelekom'],
  ['РыбФлот-ФорГрупп', 'rybflot-forgrupp'],
  ['Сервис интегратор', 'servis-integrator'],
  ['Сибур (Нижнекамскнефтехим)', 'sibur-nizhnekamskneftehim'],
  ['Термы', 'termy'],
  ['Экопарк', 'ekopark'],
  ['ЭталонТрансСервис', 'etalontransservis'],
])

const videoExt = new Set(['.mp4', '.mov', '.m4v'])

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: opts.stdio || 'pipe', encoding: opts.encoding || 'utf8' })
  if (res.status !== 0) {
    const err = [res.stderr, res.stdout].filter(Boolean).join('\n').trim()
    throw new Error(`${cmd} failed (${res.status}): ${err}`)
  }
  return res.stdout || ''
}

function safeName(name, index) {
  const base = String(name).split(/[\\/]/).filter(Boolean).pop() || `video-${index}`
  const clean = base.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_').replace(/\s+/g, ' ').trim()
  return `${String(index).padStart(3, '0')}-${clean || `video-${index}`}`
}

function extractZip(zip, dest) {
  fs.mkdirSync(dest, { recursive: true })
  return new Promise((resolve, reject) => {
    yauzl.open(zip, { lazyEntries: true }, (openErr, archive) => {
      if (openErr) return reject(openErr)
      let index = 0

      archive.readEntry()
      archive.on('entry', (entry) => {
        if (/\/$/.test(entry.fileName)) {
          archive.readEntry()
          return
        }

        const out = path.join(dest, safeName(entry.fileName, ++index))
        archive.openReadStream(entry, (streamErr, readStream) => {
          if (streamErr) return reject(streamErr)
          const writeStream = fs.createWriteStream(out)
          readStream.pipe(writeStream)
          writeStream.on('error', reject)
          writeStream.on('finish', () => archive.readEntry())
        })
      })
      archive.on('end', resolve)
      archive.on('error', reject)
    })
  })
}

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

function probeDuration(file) {
  const raw = run(ffprobe, [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    file,
  ]).trim()
  const duration = Number(raw)
  return Number.isFinite(duration) && duration > 0 ? duration : 8
}

function outputName(slug, index) {
  return `${slug}-${String(index + 1).padStart(2, '0')}.mp4`
}

function transcode(input, output) {
  fs.mkdirSync(path.dirname(output), { recursive: true })
  run(ffmpeg, [
    '-y',
    '-i', input,
    '-map', '0:v:0',
    '-map', '0:a?',
    '-vf', 'scale=w=if(gt(iw\\,ih)\\,960\\,540):h=-2',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '32',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-c:a', 'aac',
    '-b:a', '96k',
    output,
  ])
}

async function frameScore(file) {
  const { data, info } = await sharp(file).resize(96, 96, { fit: 'inside' }).raw().toBuffer({ resolveWithObject: true })
  let sum = 0
  const lum = []
  for (let i = 0; i < data.length; i += info.channels) {
    const y = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722
    lum.push(y)
    sum += y
  }
  const mean = sum / lum.length
  const variance = lum.reduce((acc, y) => acc + (y - mean) ** 2, 0) / lum.length
  return Math.sqrt(variance) * 2 + Math.min(mean, 210) * 0.35
}

async function makePoster(video, slug) {
  const duration = probeDuration(video)
  const samples = [0.2, 0.35, 0.5, 0.65, 0.8].map(p => Math.max(0.6, duration * p))
  const tmp = path.join(workRoot, 'frames', slug)
  fs.mkdirSync(tmp, { recursive: true })

  let best = null
  for (const [i, time] of samples.entries()) {
    const jpg = path.join(tmp, `${i}.jpg`)
    run(ffmpeg, ['-y', '-ss', String(time), '-i', video, '-frames:v', '1', '-q:v', '2', jpg])
    if (!fs.existsSync(jpg) || fs.statSync(jpg).size < 1000) continue
    const score = await frameScore(jpg)
    if (!best || score > best.score) best = { jpg, score }
  }

  if (!best) return null
  fs.mkdirSync(frameRoot, { recursive: true })
  const out = path.join(frameRoot, `${slug}.webp`)
  await sharp(best.jpg).rotate().resize(820, 1180, { fit: 'inside' }).webp({ quality: 84 }).toFile(out)
  return `/cases-video-frames/${slug}.webp`
}

fs.rmSync(workRoot, { recursive: true, force: true })
fs.mkdirSync(workRoot, { recursive: true })
fs.mkdirSync(outRoot, { recursive: true })
fs.mkdirSync(frameRoot, { recursive: true })

const manifest = []
const folders = fs.readdirSync(sourceRoot, { withFileTypes: true }).filter(d => d.isDirectory())

for (const folder of folders) {
  const slug = folderToSlug.get(folder.name)
  if (!slug) {
    console.warn(`skip unknown folder: ${folder.name}`)
    continue
  }

  const folderPath = path.join(sourceRoot, folder.name)
  const zips = fs.readdirSync(folderPath).filter(name => name.toLowerCase().endsWith('.zip'))
  const extractDir = path.join(workRoot, 'extract', slug)
  for (const zip of zips) await extractZip(path.join(folderPath, zip), extractDir)

  const inputs = walk(extractDir)
    .filter(file => videoExt.has(path.extname(file).toLowerCase()))
    .sort((a, b) => fs.statSync(a).size - fs.statSync(b).size)

  const caseDir = path.join(outRoot, slug)
  fs.rmSync(caseDir, { recursive: true, force: true })
  fs.mkdirSync(caseDir, { recursive: true })

  const links = []
  for (const [i, input] of inputs.entries()) {
    const out = path.join(caseDir, outputName(slug, i))
    console.log(`${slug}: ${i + 1}/${inputs.length} ${path.basename(input)} -> ${path.relative(process.cwd(), out)}`)
    transcode(input, out)
    links.push(`/cases-videos/${slug}/${path.basename(out)}`)
  }

  const poster = links.length
    ? await makePoster(path.join(process.cwd(), 'public', links[0].replace(/^\//, '')), slug)
    : null

  manifest.push({ slug, title: slug === 'kpd-development' ? 'Prime Development' : undefined, links, poster })
  fs.rmSync(extractDir, { recursive: true, force: true })
}

manifest.sort((a, b) => a.slug.localeCompare(b.slug))
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`Wrote ${manifestPath}`)
