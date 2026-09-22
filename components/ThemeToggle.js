export default function ThemeToggle() {
  return <button type="button" data-theme-toggle className="theme-toggle" aria-label="Переключить светлую и тёмную тему" title="Переключить тему">
    <span className="theme-to-light"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg><span className="sr-only">Включить светлую тему</span></span>
    <span className="theme-to-dark"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z"/></svg><span className="sr-only">Включить тёмную тему</span></span>
  </button>
}
