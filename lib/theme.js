export const THEME_KEY = 'rguard-theme'
// Delegated handler is installed in head, before deferred React bundles.
export const themeInteraction = `document.addEventListener('click',function(e){if(!e.target.closest||!e.target.closest('[data-theme-toggle]'))return;var t=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='light'?'#f7f7f5':'#0a0a14');try{localStorage.setItem('rguard-theme',t)}catch(e){}});`
export const validTheme = value => value === 'light' ? 'light' : 'dark'
export function applyTheme(theme) {
  document.documentElement.dataset.theme = validTheme(theme)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f7f7f5' : '#0a0a14')
}
// Runs before the first paint. Storage can be unavailable in private browsers.
export const themeBootstrap = `(function(){var t='dark';try{t=localStorage.getItem('${THEME_KEY}')==='light'?'light':'dark'}catch(e){}if(location.pathname.indexOf('/panel-rg7x')===0)t='dark';document.documentElement.dataset.theme=t;document.querySelector('meta[name="theme-color"]').setAttribute('content',t==='light'?'#f7f7f5':'#0a0a14')})()`
