import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 151
const PASSES = 2
const FRAME_BASE = '/production-sequence'

export default function ProductionScrollAnimation() {
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const currentRef = useRef(0)
  const targetRef = useRef(0)
  const rafRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [desktop, setDesktop] = useState(false)

  useEffect(() => {
    const update = () => setDesktop(window.innerWidth >= 1024)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!desktop) return

    let cancelled = false
    let count = 0
    const frames = new Array(TOTAL_FRAMES).fill(null)

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image()
      const idx = i - 1
      img.src = `${FRAME_BASE}/${String(i).padStart(3, '0')}.webp`
      img.onload = () => {
        frames[idx] = img
        count += 1
        if (!cancelled && count === TOTAL_FRAMES) {
          framesRef.current = frames
          setLoaded(true)
          drawFrame(0)
        }
      }
      img.onerror = () => {
        count += 1
        if (!cancelled && count === TOTAL_FRAMES) {
          framesRef.current = frames
          setLoaded(true)
        }
      }
    }

    return () => { cancelled = true }
  }, [desktop])

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
    const speed = 0.11

    drawFrame(0)

    const loop = () => {
      const diff = targetRef.current - currentRef.current
      if (Math.abs(diff) > 0.1) {
        currentRef.current = lerp(currentRef.current, targetRef.current, speed)
        drawFrame(currentRef.current)
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [loaded])

  useEffect(() => {
    if (!loaded) return

    const onScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, scrolled / maxScroll))
      const segment = 1 / PASSES
      const passIdx = Math.min(Math.floor(progress / segment), PASSES - 1)
      const passProgress = (progress - passIdx * segment) / segment

      const frameIndex = passIdx % 2 === 0
        ? passProgress * (TOTAL_FRAMES - 1)
        : (1 - passProgress) * (TOTAL_FRAMES - 1)

      targetRef.current = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [loaded])

  if (!desktop) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: '50%',
        right: 'clamp(16px, 3vw, 56px)',
        width: 'clamp(300px, 30vw, 430px)',
        height: 'min(78vh, 720px)',
        transform: 'translateY(-50%)',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        width={958}
        height={540}
        style={{
          width: 'min(78vh, 720px)',
          maxWidth: 'none',
          height: 'auto',
          opacity: loaded ? 0.85 : 0,
          filter: 'drop-shadow(0 0 30px rgba(239,68,68,0.34))',
          transform: 'rotate(90deg)',
          transformOrigin: 'center',
          transition: 'opacity 0.35s ease',
        }}
      />
    </div>
  )
}
