import { useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 150
const pad = (n) => String(n).padStart(3, '0')
const frameSrc = (i) => `/cases-astro/frame-${pad(i)}.webp`

// Декоративная скролл-анимация (астрообъект, вращение) — зеркальный аналог
// ShipScrollSequence: появляется справа от контента, прогоняется по той же
// схеме (lerp прогресса + кросс-фейд кадров). Вертикально смещена относительно
// корабля, чтобы не идти строго по одной линии (визуальная асимметрия).
export default function AstroScrollSequence({ targetRef }) {
  const [tick, setTick] = useState(0)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)

  const targetProgress = useRef(0)
  const smoothProgress = useRef(0)
  const rafId = useRef(null)

  useEffect(() => {
    // Ждём полной предзагрузки кадров перед стартом — на проде сеть медленнее
    // диска, и показ ещё не загруженного кадра во время скролла дёргает анимацию.
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
      className="hidden 2xl:block fixed right-0 top-0 h-screen pointer-events-none z-0"
      style={{
        width: 'clamp(260px, calc((100vw - 1180px) / 2), 560px)',
        opacity: visible && ready ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* смещение вниз ~22vh — асимметрия относительно корабля слева;
          картинка крупнее контейнера (156%) и растёт от правого края к центру —
          контейнер decorative/pointer-events:none, лёгкий заход на контент допустим */}
      <div className="relative w-full h-full flex items-start justify-end pr-2" style={{ paddingTop: '22vh', overflow: 'visible' }}>
        <div className="relative" style={{ width: '156%' }}>
          <img
            src={frameSrc(idx)}
            alt=""
            width={360}
            height={360}
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
            width={360}
            height={360}
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
