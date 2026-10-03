import { useEffect, useRef, useState } from 'react'

// Public widget key; the private server key is only read in lib/smartCaptcha.js.
const SITE_KEY = 'ysc1_B42qJfsoCmAEkmz9ruCRhiBcqJPpYW9T9zVwtFLFb1a12fa7'
let loading
function loadWidget() {
  if (window.smartCaptcha) return Promise.resolve(window.smartCaptcha)
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      const timer = setTimeout(fail, 15000)
      function fail() {
        clearTimeout(timer)
        script.remove()
        delete window.rguardCaptchaLoaded
        loading = null
        reject(new Error('Captcha unavailable'))
      }
      window.rguardCaptchaLoaded = () => {
        clearTimeout(timer)
        delete window.rguardCaptchaLoaded
        resolve(window.smartCaptcha)
      }
      script.src = 'https://smartcaptcha.cloud.yandex.ru/captcha.js?render=onload&onload=rguardCaptchaLoaded'
      script.async = true
      script.onerror = fail
      document.head.appendChild(script)
    })
  }
  return loading
}

export default function SmartCaptcha({ onToken }) {
  const container = useRef(null)
  const callback = useRef(onToken)
  callback.current = onToken
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState('loading')
  useEffect(() => {
    let disposed = false
    let widget
    let api
    let unsubscribe
    callback.current('')
    const start = async () => {
      observer?.disconnect()
      setState('loading')
      try {
        api = await loadWidget()
        if (disposed) return
        widget = api.render(container.current, { sitekey: SITE_KEY, hl: 'ru', callback: token => callback.current(token) })
        unsubscribe = api.subscribe(widget, 'token-expired', () => callback.current(''))
        setState('ready')
      } catch {
        if (!disposed) setState('error')
      }
    }
    const observer = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) start() }, { rootMargin: '150px' })
      : null
    if (observer) observer.observe(container.current)
    else start()
    return () => {
      disposed = true
      observer?.disconnect()
      unsubscribe?.()
      if (widget !== undefined) api.destroy(widget)
      callback.current('')
    }
  }, [attempt])
  return <div>
    <div ref={container} style={{ minHeight: 100 }} />
    {state === 'loading' && <p role="status" className="text-sm text-zinc-400">Загрузка проверки «Я не робот»…</p>}
    {state === 'error' && <p role="alert" className="text-sm text-red-400">Не удалось загрузить капчу. <button type="button" className="underline" onClick={() => setAttempt(a => a + 1)}>Повторить</button></p>}
  </div>
}
