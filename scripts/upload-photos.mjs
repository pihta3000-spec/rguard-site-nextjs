import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const client = createClient({
  projectId: 'y9ptramm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const outDir = 'D:/Димон фото/processed'
const files = fs.readdirSync(outDir).filter(f => f.endsWith('.jpg'))
console.log('Uploading:', files)

// Найти блогера
const blogger = await client.fetch(`*[_type == "blogger"] { _id, name, slug }`)
console.log('All bloggers:', blogger.map(b => `${b.name} (${b.slug?.current})`))

const dima = blogger.find(b => b.name?.toLowerCase().includes('хрисан') || b.name?.toLowerCase().includes('дима') || b.slug?.current?.includes('khri') || b.slug?.current?.includes('dima'))
if (!dima) {
  console.log('Blogger not found! Available:', blogger)
  process.exit(1)
}
console.log('Found blogger:', dima.name, dima._id)

// Загрузить фото
const assetIds = []
for (const f of files) {
  const filePath = path.join(outDir, f)
  const buf = fs.readFileSync(filePath)
  console.log(`Uploading ${f}...`)
  const asset = await client.assets.upload('image', buf, { filename: f, contentType: 'image/jpeg' })
  console.log(` -> asset: ${asset._id}`)
  assetIds.push(asset._id)
}

// Прикрепить к блогеру
const photoRefs = assetIds.map((id, i) => ({
  _type: 'image',
  _key: `photo_${Date.now()}_${i}`,
  asset: { _type: 'reference', _ref: id }
}))

await client.patch(dima._id).set({ photos: photoRefs }).commit()
console.log('Done! Photos attached to', dima.name)
