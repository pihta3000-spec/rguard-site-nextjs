// Какие публичные страницы перестроить после правки контента (on-demand ISR).
import { getPosts } from './db.js'
export function revalidateTargets(type, slug) {
  switch (type) {
    case 'cases':
      return ['/', '/cases', '/viral', '/production', '/corporate', '/ai-content']
    case 'posts':
      return ['/articles', slug && `/articles/${slug}`].filter(Boolean)
    case 'industries':
      return ['/industries', slug && `/industries/${slug}`].filter(Boolean)
    case 'bloggers':
      return ['/', '/bloggers', slug && `/bloggers/${slug}`].filter(Boolean)
    default:
      return []
  }
}

export async function revalidatePaths(res, type, slug) {
  const paths = revalidateTargets(type, slug)
  // Profile pages are SSR. Articles are ISR and may have nested category URLs.
  if (type === 'employees' || type === 'posts') {
    for (const post of await getPosts()) {
      if (type === 'employees' || !slug || post.slug === slug) paths.push(post.urlPath || `/articles/${post.slug}`)
    }
  }
  for (const p of new Set(paths)) {
    try { await res.revalidate(p) } catch (e) { console.warn('revalidate fail', p, e.message) }
  }
}
