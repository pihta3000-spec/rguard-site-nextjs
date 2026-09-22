import { SITE_ORIGIN } from './pageSeo.js'

export const employeePath = slug => `/team/${encodeURIComponent(slug)}`
export const articlePath = post => post.urlPath || `/articles/${post.slug}`
const absolute = path => new URL(path, SITE_ORIGIN).href
export const jsonLdText = value => JSON.stringify(value).replace(/</g, '\\u003c')
const date = value => value && !Number.isNaN(Date.parse(value)) ? new Date(value).toISOString() : undefined

export function personSchema(employee) {
  const url = absolute(employeePath(employee.slug))
  return {
    '@type': 'Person', '@id': `${url}#person`, name: employee.name, url,
    image: employee.photo ? absolute(employee.photo) : undefined,
    jobTitle: employee.jobTitle || undefined, description: employee.description || undefined,
    worksFor: { '@type': 'Organization', '@id': `${SITE_ORIGIN}/#organization`, name: 'RGUARD', url: SITE_ORIGIN },
    knowsAbout: employee.expertise?.length ? employee.expertise : undefined,
    sameAs: employee.sameAs?.length ? employee.sameAs : undefined,
    hasCredential: employee.credentials?.length ? employee.credentials.map(item => ({
      '@type': 'EducationalOccupationalCredential', name: item.name, url: item.url || undefined,
    })) : undefined,
  }
}

export function profileSchema(employee, posts) {
  const person = personSchema(employee)
  return {
    '@context': 'https://schema.org', '@type': 'ProfilePage',
    '@id': `${person.url}#profile`, url: person.url, name: employee.name,
    mainEntity: person,
    hasPart: [
      ...posts.map(post => ({ '@type': 'Article', headline: post.title, url: absolute(articlePath(post)), author: { '@id': person['@id'] } })),
      ...(employee.publications || []).map(item => ({ '@type': 'Article', headline: item.title, url: item.url,
        [item.relation === 'about' ? 'about' : 'author']: { '@id': person['@id'] }, publisher: item.publisher ? { '@type': 'Organization', name: item.publisher } : undefined })),
    ],
  }
}

export function articleSchema(post) {
  const url = absolute(articlePath(post))
  return {
    '@context': 'https://schema.org', '@type': 'Article', '@id': `${url}#article`,
    url, mainEntityOfPage: { '@type': 'WebPage', '@id': url }, headline: post.title,
    description: post.excerpt || undefined,
    image: post.coverImage ? absolute(post.coverImage) : undefined,
    datePublished: date(post.publishedAt),
    author: post.author ? personSchema(post.author) : undefined,
    publisher: { '@type': 'Organization', '@id': `${SITE_ORIGIN}/#organization`, name: 'RGUARD', url: SITE_ORIGIN },
  }
}

// Keep custom non-article markup, but prevent contradictory legacy author blocks.
export function withoutArticleSchema(items) {
  const articleTypes = new Set(['Article', 'BlogPosting', 'NewsArticle', 'TechArticle'])
  return (Array.isArray(items) ? items : []).flatMap(item => {
    if (!item || typeof item !== 'object') return []
    const types = Array.isArray(item['@type']) ? item['@type'] : [item['@type']]
    if (types.some(type => articleTypes.has(type))) return []
    return [{ ...item, ...(item['@graph'] ? { '@graph': withoutArticleSchema(item['@graph']) } : {}) }]
  })
}
