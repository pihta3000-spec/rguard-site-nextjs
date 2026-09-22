export const THEME_KEY = 'rguard-theme'
export const validTheme = value => value === 'light' ? 'light' : 'dark'
export function applyTheme(theme) {
  document.documentElement.dataset.theme = validTheme(theme)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f7f7f5' : '#0a0a14')
}
// Runs before the first paint. Storage can be unavailable in private browsers.
export const themeBootstrap = `(function(){var t='dark';try{t=localStorage.getItem('${THEME_KEY}')==='light'?'light':'dark'}catch(e){}if(location.pathname.indexOf('/panel-rg7x')===0)t='dark';document.documentElement.dataset.theme=t;document.querySelector('meta[name="theme-color"]').setAttribute('content',t==='light'?'#f7f7f5':'#0a0a14')})()`
