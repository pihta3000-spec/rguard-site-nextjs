import { useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 150
const pad = (n) => String(n).padStart(3, '0')
const frameSrc = (i) => `/cases-ship/frame-${pad(i)}.webp`

// Декоративная скролл-анимация: последовательность кадров рисуется на <canvas>
// в зависимости от прогресса прокрутки родительской секции.
// Архитектура скопирована с проверенного ScrollAnimation.js (главная страница):
//  - кадры рисуются через ctx.drawImage — без создания/переключения DOM-узлов
//    и без перерисовки React на каждый кадр (никаких setState в rAF-цикле);
//  - прогресс скролла плавно «догоняется» (lerp) в непрерывном rAF-цикле;
//  - позиция секции кэшируется и обновляется только по scroll/resize редко,
//    без принудительного layout (getBoundingClientRect) на каждом кадре.
export default function ShipScrollSequence({ targetRef }) {
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const currentRef = useRef(0)
  const targetIdxRef = useRef(0)
  const rafRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [visible, setVisible] = useState(false)

  // Preload — рисуем первый кадр, как только он готов
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

  // RAF-цикл: плавно догоняет целевой кадр и рисует его — никакого React re-render
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

  // Прогресс скролла относительно секции — позиция кэшируется,
  // пересчитывается только по scroll/resize (без layout-трешинга в rAF)
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
      className="hidden 2xl:block fixed left-0 top-0 h-screen pointer-events-none z-0"
      style={{
        width: 'clamp(280px, calc((100vw - 1180px) / 2), 640px)',
        opacity: visible && loaded ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      <div className="relative w-full h-full flex items-center justify-end pr-2">
        <canvas
          ref={canvasRef}
          width={800}
          height={800}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            filter: 'drop-shadow(0 0 32px rgba(239,68,68,0.28))',
          }}
        />
      </div>
    </div>
  )
}
