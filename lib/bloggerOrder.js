// Move only the two requested profiles; retain all other relative positions.
export function reorderBloggers(rows) {
  const slugs = ['denis-sundukov', 'semen-molokanov']
  const moved = slugs.map(slug => rows.find(row => row.slug === slug))
  if (moved.some(row => !row)) throw new Error('Не найдены Денис или Семён')
  const rest = rows.filter(row => !slugs.includes(row.slug))
  return [...rest.slice(0, 3), ...moved, ...rest.slice(3)]
}
