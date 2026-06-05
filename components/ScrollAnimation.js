import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 151
const PASSES = 3  // вперёд → назад → вперёд

export default function ScrollAnimation() {
  const canvasRef  = useRef(null)
  const framesRef  = useRef([])
  const currentRef = useRef(0)   // текущий отображаемый кадр (дробный)
  const targetRef  = useRef(0)   // целевой кадр по скроллу
  const rafRef     = useRef(null)
  const [loaded, setLoaded] = useState(false)

  // Preload
  useEffect(() => {
    let count = 0
    const frames = new Array(TOTAL_FRAMES).fill(null)
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image()
      img.src = `/frames/${String(i).padStart(3, '0')}.webp`
      const idx = i - 1
      img.onload  = () => { frames[idx] = img; if (++count === TOTAL_FRAMES) { framesRef.current = frames; setLoaded(true) } }
      img.onerror = () => { if (++count === TOTAL_FRAMES) { framesRef.current = frames; setLoaded(true) } }
    }
  }, [])

  function drawFrame(idx) {
    const canvas = canvasRef.current
    if (!canvas) return
    const frame = framesRef.current[Math.round(idx)]
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (frame) ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
  }

  // RAF loop — плавная интерполяция к target
  useEffect(() => {
    if (!loaded) return

    const lerp = (a, b, t) => a + (b - a) * t
    const SPEED = 0.12  // скорость догонки (0.05=очень медленно, 0.2=быстро)

    const loop = () => {
      const diff = targetRef.current - currentRef.current
      if (Math.abs(diff) > 0.1) {
        currentRef.current = lerp(currentRef.current, targetRef.current, SPEED)
        drawFrame(currentRef.current)
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [loaded])

  // Scroll → target frame
  useEffect(() => {
    if (!loaded) return

    const onScroll = () => {
      const scrolled  = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress  = Math.max(0, Math.min(1, scrolled / maxScroll))

      // 3 прохода пинг-понг по всей длине страницы
      const segment     = 1 / PASSES
      const passIdx     = Math.min(Math.floor(progress / segment), PASSES - 1)
      const passProgress = (progress - passIdx * segment) / segment

      let frameIndex
      if (passIdx % 2 === 0) {
        frameIndex = passProgress * (TOTAL_FRAMES - 1)
      } else {
        frameIndex = (1 - passProgress) * (TOTAL_FRAMES - 1)
      }

      targetRef.current = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [loaded])

  if (typeof window !== 'undefined' && window.innerWidth < 1024) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: '-8%',
      width: '45vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <canvas
        ref={canvasRef}
        width={720}
        height={720}
        style={{
          width: '90%',
          height: 'auto',
          opacity: loaded ? 0.9 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  )
}
