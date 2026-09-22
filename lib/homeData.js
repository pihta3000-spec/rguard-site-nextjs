export function homeData(cases = [], bloggers = []) {
  return {
    cases: cases.filter(c => c.featured).slice(0, 4).map(c => ({
      id: c.id, title: c.title, service: c.service || '', category: c.category || '',
      accent: c.accent || '', metrics: c.metrics || [], shortText: c.shortText || '',
      coverImage: c.coverImage || '', featured: true,
    })),
    bloggers: bloggers.slice(0, 3).map(b => ({
      slug: b.slug, name: b.name, desc: b.desc || '',
      photos: (b.photos || []).slice(0, 1), metrics: b.metrics || [],
    })),
  }
}
