import Head from 'next/head'

const SITE_ORIGIN = 'https://rguard.ru'
const DEFAULT_IMAGE = '/og-default.png'

export function absoluteUrl(url) {
  if (!url) return `${SITE_ORIGIN}${DEFAULT_IMAGE}`
  if (/^https?:\/\//i.test(url)) return url
  return `${SITE_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`
}

function messengerSafeImage(image) {
  if (!image || /\.webp($|\?)/i.test(image)) return absoluteUrl(DEFAULT_IMAGE)
  return absoluteUrl(image)
}

function imageType(url) {
  if (/\.png($|\?)/i.test(url)) return 'image/png'
  if (/\.jpe?g($|\?)/i.test(url)) return 'image/jpeg'
  return null
}

export default function SocialMeta({
  title,
  description,
  url,
  image,
  type = 'website',
  siteName = 'RGUARD',
}) {
  const canonical = absoluteUrl(url)
  const previewImage = messengerSafeImage(image)
  const typeValue = imageType(previewImage)
  const isDefaultImage = previewImage.endsWith(DEFAULT_IMAGE)

  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:image" content={previewImage} />
      <meta property="og:image:secure_url" content={previewImage} />
      {typeValue && <meta property="og:image:type" content={typeValue} />}
      {isDefaultImage && <meta property="og:image:width" content="1200" />}
      {isDefaultImage && <meta property="og:image:height" content="630" />}
      <meta property="og:image:alt" content={title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={previewImage} />
      <meta name="twitter:image:alt" content={title} />
    </Head>
  )
}
