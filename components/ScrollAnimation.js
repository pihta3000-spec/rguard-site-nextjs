import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 151

export default function ScrollAnimation() {
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const rafRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [canvasOpacity, setCanvasOpacity] = useState(0)

  // Preload all frames
  useEffect(() => {
    let count = 0
    const frames = new Array(TOTAL_FRAMES).fill(null)

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image()
      img.src = `/frames/${String(i).padStart(3, '0')}.webp`
      const idx = i - 1
      img.onload = () => {
        frames[idx] = img
        count++
        if (count === TOTAL_FRAMES) {
          framesRef.current = frames
          setLoaded(true)
          draw(0)
        }
      }
      img.onerror = () => { count++; if (count === TOTAL_FRAMES) { framesRef.current = frames; setLoaded(true) } }
    }
  }, [])

  function draw(frameIndex) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const frame = framesRef.current[frameIndex]
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (frame) ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
  }

  // Scroll listener
  useEffect(() => {
    if (!loaded) return

    const onScroll = () => {
      const scrolled = window.scrollY
      const totalScroll = window.innerHeight * 3
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll))
      const frameIndex = Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1)
      draw(frameIndex)

      // Плавное исчезновение в последние 10% анимации
      if (progress >= 0.9) {
        const fadeOut = 1 - (progress - 0.9) / 0.1
        setCanvasOpacity(0.45 * fadeOut)
      } else {
        setCanvasOpacity(0.45)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [loaded])

  return (
    <div
      style={{
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
      }}
    >
      <canvas
        ref={canvasRef}
        width={720}
        height={720}
        style={{
          width: '90%',
          height: 'auto',
          opacity: loaded ? canvasOpacity : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
    </div>
  )
}
