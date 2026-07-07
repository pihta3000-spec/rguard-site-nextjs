import { useEffect, useRef, useState } from 'react'

export default function ScrollSequence({
  frameBase,
  totalFrames = 151,
  passes = 2,
  canvasWidth = 720,
  canvasHeight = 720,
  desktopMinWidth = 1024,
  containerStyle,
  canvasStyle,
  imageFit = 'contain',
  loadedOpacity = 0.85,
  speed = 0.11,
}) {
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const currentRef = useRef(0)
  const targetRef = useRef(0)
  const rafRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [desktop, setDesktop] = useState(false)

  useEffect(() => {
    const update = () => setDesktop(window.innerWidth >= desktopMinWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [desktopMinWidth])

  useEffect(() => {
    if (!desktop) return undefined

    let cancelled = false
    let count = 0
    const frames = new Array(totalFrames).fill(null)

    for (let i = 1; i <= totalFrames; i++) {
      const img = new window.Image()
      const idx = i - 1
      img.src = `${frameBase}/${String(i).padStart(3, '0')}.webp`
      img.onload = () => {
        frames[idx] = img
        count += 1
        if (!cancelled && count === totalFrames) {
          framesRef.current = frames
          setLoaded(true)
          drawFrame(0)
        }
      }
      img.onerror = () => {
        count += 1
        if (!cancelled && count === totalFrames) {
          framesRef.current = frames
          setLoaded(true)
        }
      }
    }

    return () => { cancelled = true }
  }, [desktop, frameBase, totalFrames])

  function drawFrame(idx) {
    const canvas = canvasRef.current
    if (!canvas) return

    const frame = framesRef.current[Math.round(idx)]
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (!frame) return

    if (imageFit === 'cover') {
      const scale = Math.max(canvas.width / frame.naturalWidth, canvas.height / frame.naturalHeight)
      const width = frame.naturalWidth * scale
      const height = frame.naturalHeight * scale
      ctx.drawImage(frame, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
      return
    }

    const scale = Math.min(canvas.width / frame.naturalWidth, canvas.height / frame.naturalHeight)
    const width = frame.naturalWidth * scale
    const height = frame.naturalHeight * scale
    ctx.drawImage(frame, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
  }

  useEffect(() => {
    if (!loaded) return undefined

    const lerp = (a, b, t) => a + (b - a) * t
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
  }, [loaded, speed])

  useEffect(() => {
    if (!loaded) return undefined

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0
      const segment = 1 / passes
      const passIdx = Math.min(Math.floor(progress / segment), passes - 1)
      const passProgress = (progress - passIdx * segment) / segment

      const frameIndex = passIdx % 2 === 0
        ? passProgress * (totalFrames - 1)
        : (1 - passProgress) * (totalFrames - 1)

      targetRef.current = Math.max(0, Math.min(totalFrames - 1, frameIndex))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [loaded, passes, totalFrames])

  if (!desktop) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...containerStyle,
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          width: '100%',
          height: 'auto',
          opacity: loaded ? loadedOpacity : 0,
          filter: 'drop-shadow(0 0 30px rgba(239,68,68,0.34))',
          transition: 'opacity 0.35s ease',
          ...canvasStyle,
        }}
      />
    </div>
  )
}
