import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const srcDir = 'D:/Димон фото'
const outDir = 'D:/Димон фото/processed'
fs.mkdirSync(outDir, { recursive: true })

const files = fs.readdirSync(srcDir).filter(f => /\.(jpg|jpeg|webp|png)$/i.test(f))
console.log('Files:', files)

const targetW = 900, targetH = 1200 // 3:4
const ratio = targetW / targetH

for (const f of files) {
  const src = path.join(srcDir, f)
  const out = path.join(outDir, f.replace(/\.(jpg|jpeg|webp|png)$/i, '.jpg'))
  const meta = await sharp(src).metadata()
  console.log(`${f}: ${meta.width}x${meta.height}`)

  let cropW, cropH, left, top
  if (meta.width / meta.height > ratio) {
    // шире 3:4 — обрезаем по бокам
    cropH = meta.height
    cropW = Math.round(meta.height * ratio)
    left = Math.round((meta.width - cropW) / 2)
    top = 0
  } else {
    // выше 3:4 — обрезаем снизу, лицо сверху
    cropW = meta.width
    cropH = Math.round(meta.width / ratio)
    left = 0
    top = 0
  }

  await sharp(src)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(targetW, targetH)
    .jpeg({ quality: 88 })
    .toFile(out)
  console.log(` -> ${out}`)
}
console.log('Done!')
