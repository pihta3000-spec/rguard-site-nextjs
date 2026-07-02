const cx = (...parts) => parts.filter(Boolean).join(' ')

export default function HeroTitle({
  as: Tag = 'h1',
  accent,
  before = [],
  lines = [],
  after = [],
  variant = 'signal',
  className = '',
}) {
  const beforeLines = Array.isArray(before) ? before : [before]
  const afterLines = Array.isArray(after) ? after : [after]
  const legacyAfterLines = Array.isArray(lines) ? lines : [lines]
  const rest = afterLines.filter(Boolean).length > 0 ? afterLines : legacyAfterLines

  return (
    <Tag className={cx('hero-title', `hero-title--${variant}`, className)}>
      {beforeLines.filter(Boolean).map((line, index) => (
        <span key={`before-${index}-${line}`} className="hero-title-rest">{line}</span>
      ))}
      <span className="glitch-hero hero-title-main">{accent}</span>
      {rest.filter(Boolean).map((line, index) => (
        <span key={`after-${index}-${line}`} className="hero-title-rest">{line}</span>
      ))}
    </Tag>
  )
}
