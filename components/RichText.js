// Презентационный рендер rich-text (HTML). Санитизация уже сделана в lib/db.js
// (сервер-сайд), сюда приходит безопасный HTML. Стили — класс .rich-content в globals.css.

export default function RichText({ html, className = '' }) {
  if (!html) return null
  return (
    <div
      className={`rich-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
