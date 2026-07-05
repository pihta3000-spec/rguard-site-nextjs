import Head from 'next/head'

// Рендерит все SEO-теги из готового объекта (см. lib/pageSeo.js mergeSeo).
// Используется на статических страницах вместо инлайнового <Head>.
export default function Seo({ seo }) {
  if (!seo) return null
  const { title, description, keywords, canonical, robots, og = {}, twitter = {}, jsonLd = [] } = seo
  const ogImageType = /\.png($|\?)/i.test(og.image || '') ? 'image/png' : /\.jpe?g($|\?)/i.test(og.image || '') ? 'image/jpeg' : null
  const twitterImageAlt = twitter.title || og.title || title
  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {robots && <meta name="robots" content={robots} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content={og.type || 'website'} />
      {og.title && <meta property="og:title" content={og.title} />}
      {og.description && <meta property="og:description" content={og.description} />}
      {og.image && <meta property="og:image" content={og.image} />}
      {og.image && <meta property="og:image:secure_url" content={og.image} />}
      {ogImageType && <meta property="og:image:type" content={ogImageType} />}
      {og.image && <meta property="og:image:width" content="1200" />}
      {og.image && <meta property="og:image:height" content="630" />}
      {og.image && <meta property="og:image:alt" content={og.title || title} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {og.siteName && <meta property="og:site_name" content={og.siteName} />}
      <meta property="og:locale" content="ru_RU" />

      {/* Twitter / X */}
      <meta name="twitter:card" content={twitter.card || 'summary_large_image'} />
      {twitter.title && <meta name="twitter:title" content={twitter.title} />}
      {twitter.description && <meta name="twitter:description" content={twitter.description} />}
      {twitter.image && <meta name="twitter:image" content={twitter.image} />}
      {twitter.image && <meta name="twitter:image:alt" content={twitterImageAlt} />}

      {/* JSON-LD структурированные данные */}
      {jsonLd.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </Head>
  )
}
