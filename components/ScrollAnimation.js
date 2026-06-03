import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 151

export default function ScrollAnimation({ containerRef }) {
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const currentFrameRef = useRef(0)
  const [loaded, setLoaded] = useState(false)

  // Preload all frames
  useEffect(() => {
    let loadedCount = 0
    const frames = new Array(TOTAL_FRAMES)

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image()
      img.src = `/frames/${String(i).padStart(3, '0')}.webp`
      img.onload = () => {
        loadedCount++
        frames[i - 1] = img
        if (loadedCount === TOTAL_FRAMES) {
          framesRef.current = frames
          setLoaded(true)
          drawFrame(0)
        }
      }
      img.onerror = () => { loadedCount++; frames[i - 1] = null }
    }
  }, [])

  function drawFrame(index) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const frame = framesRef.current[index]
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (frame) ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
  }

  // Scroll handler
  useEffect(() => {
    if (!loaded) return

    const onScroll = () => {
      const container = containerRef?.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const containerHeight = container.offsetHeight
      const viewH = window.innerHeight

      // Progress 0→1 через весь scroll-контейнер
      const progress = Math.max(0, Math.min(1,
        (-rect.top) / (containerHeight - viewH)
      ))

      const frameIndex = Math.min(
        Math.floor(progress * TOTAL_FRAMES),
        TOTAL_FRAMES - 1
      )

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex
        drawFrame(frameIndex)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [loaded, containerRef])

  return (
    <canvas
      ref={canvasRef}
      width={720}
      height={720}
      style={{
        position: 'sticky',
        top: '10vh',
        width: '45vw',
        maxWidth: '600px',
        height: 'auto',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }}
    />
  )
}
