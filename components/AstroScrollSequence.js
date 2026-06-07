import { useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 150
const pad = (n) => String(n).padStart(3, '0')
const frameSrc = (i) => `/cases-astro/frame-${pad(i)}.webp`

// Декоративная скролл-анимация (астрообъект, вращение) — зеркальный аналог
// ShipScrollSequence: появляется справа от контента, со смещением вниз
// (асимметрия относительно корабля слева). Архитектура — canvas + drawImage,
// без React re-render в rAF-цикле (см. комментарии в ShipScrollSequence.js).
export default function AstroScrollSequence({ targetRef }) {
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const currentRef = useRef(0)
  const targetIdxRef = useRef(0)
  const rafRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let count = 0
    const frames = new Array(FRAME_COUNT).fill(null)
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image()
      img.src = frameSrc(i)
      img.onload = () => {
        frames[i] = img
        if (++count === FRAME_COUNT) {
          framesRef.current = frames
          setLoaded(true)
          drawFrame(0)
        }
      }
      img.onerror = () => {
        if (++count === FRAME_COUNT) {
          framesRef.current = frames
          setLoaded(true)
        }
      }
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

  useEffect(() => {
    if (!loaded) return

    const lerp = (a, b, t) => a + (b - a) * t
    const SPEED = 0.12

    const loop = () => {
      const diff = targetIdxRef.current - currentRef.current
      if (Math.abs(diff) > 0.05) {
        currentRef.current = lerp(currentRef.current, targetIdxRef.current, SPEED)
        drawFrame(currentRef.current)
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [loaded])

  useEffect(() => {
    if (!loaded) return
    const el = targetRef?.current
    if (!el) return

    let top = 0
    let height = 0

    const measure = () => {
      const rect = el.getBoundingClientRect()
      top = rect.top + window.scrollY
      height = rect.height
    }

    const onScroll = () => {
      const vh = window.innerHeight || 1
      const total = height + vh
      const passed = window.scrollY + vh - top
      const progress = Math.min(1, Math.max(0, passed / total))

      targetIdxRef.current = progress * (FRAME_COUNT - 1)
      setVisible(progress > 0.001 && progress < 0.999)
    }

    measure()
    onScroll()

    const onResize = () => { measure(); onScroll() }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [loaded, targetRef])

  return (
    <div
      aria-hidden="true"
      className="hidden 2xl:block fixed right-0 top-0 h-screen pointer-events-none z-0"
      style={{
        width: 'clamp(260px, calc((100vw - 1180px) / 2), 560px)',
        opacity: visible && loaded ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* смещение вниз ~22vh — асимметрия относительно корабля слева;
          картинка крупнее контейнера (156%) и растёт от правого края к центру —
          контейнер decorative/pointer-events:none, лёгкий заход на контент допустим */}
      <div className="relative w-full h-full flex items-start justify-end pr-2" style={{ paddingTop: '22vh', overflow: 'visible' }}>
        <div className="relative" style={{ width: '156%' }}>
          <canvas
            ref={canvasRef}
            width={720}
            height={720}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 0 32px rgba(239,68,68,0.28))',
            }}
          />
        </div>
      </div>
    </div>
  )
}
