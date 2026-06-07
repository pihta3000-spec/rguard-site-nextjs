import { useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 150
const pad = (n) => String(n).padStart(3, '0')
const frameSrc = (i) => `/cases-ship/frame-${pad(i)}.webp`

// Декоративная скролл-анимация: последовательность кадров переключается
// в зависимости от прогресса прокрутки родительской секции.
// Располагается слева за пределами центральной колонки контента и не влияет
// на её раскладку (position: fixed, pointer-events: none, скрыта на узких экранах).
//
// Плавность достигается двумя приёмами:
//  1) прогресс скролла плавно «догоняется» (lerp) в непрерывном rAF-цикле,
//     а не дискретно прыгает по событию scroll;
//  2) между соседними кадрами делается кросс-фейд по дробной части индекса —
//     визуально получается межкадровая интерполяция без доп. рендера.
export default function ShipScrollSequence({ targetRef }) {
  const [tick, setTick] = useState(0)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)

  const targetProgress = useRef(0)
  const smoothProgress = useRef(0)
  const rafId = useRef(null)

  useEffect(() => {
    // Предзагрузка ВСЕХ кадров и ожидание её завершения перед стартом анимации.
    // На локалке кадры читаются с диска мгновенно, поэтому дёрганий не было —
    // но на проде (загрузка по сети) показ ещё не загруженного кадра во время
    // скролла даёт визуальные рывки. Поэтому держим анимацию скрытой, пока
    // все кадры не окажутся в кэше браузера.
    let cancelled = false
    const loaders = []
    for (let i = 0; i < FRAME_COUNT; i++) {
      loaders.push(
        new Promise((resolve) => {
          const img = new Image()
          img.onload = resolve
          img.onerror = resolve
          img.src = frameSrc(i)
        })
      )
    }
    Promise.all(loaders).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const el = targetRef?.current
    if (!el) return

    const computeProgress = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const total = rect.height + vh
      const passed = vh - rect.top
      return Math.min(1, Math.max(0, passed / total))
    }

    const onScroll = () => {
      targetProgress.current = computeProgress()
    }

    const loop = () => {
      const cur = smoothProgress.current
      const target = targetProgress.current
      const next = cur + (target - cur) * 0.12
      smoothProgress.current = Math.abs(next - target) < 0.0008 ? target : next

      setVisible(smoothProgress.current > 0.001 && smoothProgress.current < 0.999)
      setTick((t) => (t + 1) % 1000000)

      rafId.current = requestAnimationFrame(loop)
    }

    onScroll()
    smoothProgress.current = targetProgress.current
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    rafId.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [targetRef])

  const exact = smoothProgress.current * (FRAME_COUNT - 1)
  const idx = Math.floor(exact)
  const frac = exact - idx
  const idxNext = Math.min(FRAME_COUNT - 1, idx + 1)

  return (
    <div
      aria-hidden="true"
      className="hidden 2xl:block fixed left-0 top-0 h-screen pointer-events-none z-0"
      style={{
        width: 'clamp(280px, calc((100vw - 1180px) / 2), 640px)',
        opacity: visible && ready ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      <div className="relative w-full h-full flex items-center justify-end pr-2">
        <div className="relative" style={{ width: '100%' }}>
          <img
            src={frameSrc(idx)}
            alt=""
            width={480}
            height={480}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 0 32px rgba(239,68,68,0.28))',
            }}
          />
          <img
            src={frameSrc(idxNext)}
            alt=""
            width={480}
            height={480}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: 'auto',
              display: 'block',
              opacity: frac,
              filter: 'drop-shadow(0 0 32px rgba(239,68,68,0.28))',
            }}
          />
        </div>
      </div>
    </div>
  )
}
