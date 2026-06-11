// Какие публичные страницы перестроить после правки контента (on-demand ISR).
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
  for (const p of paths) {
    try { await res.revalidate(p) } catch (e) { console.warn('revalidate fail', p, e.message) }
  }
}
