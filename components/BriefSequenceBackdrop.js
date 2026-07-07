import { useEffect, useRef, useState } from 'react'

const SEQUENCES = [
  { label: 'home', base: '/home-sequence', width: 720, height: 720, x: '8%', y: '12%', size: 'clamp(150px, 17vw, 270px)' },
  { label: 'production', base: '/production-sequence', width: 958, height: 540, x: '72%', y: '8%', size: 'clamp(260px, 27vw, 440px)' },
  { label: 'viral', base: '/viral-sequence', width: 900, height: 674, x: '42%', y: '10%', size: 'clamp(210px, 23vw, 360px)' },
  { label: 'scripts', base: '/scripts-sequence', width: 900, height: 507, x: '6%', y: '68%', size: 'clamp(250px, 28vw, 430px)' },
  { label: 'concepts', base: '/concepts-sequence', width: 900, height: 900, x: '72%', y: '58%', size: 'clamp(170px, 20vw, 320px)' },
  { label: 'events', base: '/events-sequence', width: 900, height: 507, x: '38%', y: '72%', size: 'clamp(250px, 28vw, 430px)' },
]

function drawContain(ctx, img, width, height) {
  ctx.clearRect(0, 0, width, height)
  if (!img) return
  const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight)
  const drawWidth = img.naturalWidth * scale
  const drawHeight = img.naturalHeight * scale
  ctx.drawImage(img, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
}

function SequenceTile({ sequence }) {
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const loadedRef = useRef(false)
  const activeRef = useRef(false)
  const frameRef = useRef(0)
  const directionRef = useRef(1)
  const rafRef = useRef(null)
  const lastTickRef = useRef(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const img = new window.Image()
    img.src = `${sequence.base}/001.webp`
    img.onload = () => {
      framesRef.current[0] = img
      setReady(true)
      const canvas = canvasRef.current
      if (canvas) drawContain(canvas.getContext('2d'), img, canvas.width, canvas.height)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [sequence.base])

  const loadFrames = () => {
    if (loadedRef.current) return
    loadedRef.current = true
    for (let i = 2; i <= 151; i++) {
      const img = new window.Image()
      const idx = i - 1
      img.src = `${sequence.base}/${String(i).padStart(3, '0')}.webp`
      img.onload = () => { framesRef.current[idx] = img }
    }
  }

  const animate = (time) => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (time - lastTickRef.current > 38) {
      lastTickRef.current = time
      const maxFrame = 150
      const next = frameRef.current + directionRef.current
      if (next >= maxFrame || next <= 0) directionRef.current *= -1
      frameRef.current = Math.max(0, Math.min(maxFrame, next))
      const frame = framesRef.current[Math.round(frameRef.current)] || framesRef.current[0]
      drawContain(canvas.getContext('2d'), frame, canvas.width, canvas.height)
    }

    if (activeRef.current) {
      rafRef.current = requestAnimationFrame(animate)
      return
    }

    if (frameRef.current > 0) {
      frameRef.current = Math.max(0, frameRef.current - 3)
      const frame = framesRef.current[Math.round(frameRef.current)] || framesRef.current[0]
      drawContain(canvas.getContext('2d'), frame, canvas.width, canvas.height)
      rafRef.current = requestAnimationFrame(animate)
    }
  }

  const start = () => {
    activeRef.current = true
    loadFrames()
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(animate)
  }

  const stop = () => {
    activeRef.current = false
  }

  return (
    <div
      className="absolute hidden md:block"
      onMouseEnter={start}
      onMouseLeave={stop}
      style={{
        left: sequence.x,
        top: sequence.y,
        width: sequence.size,
        pointerEvents: 'auto',
        opacity: ready ? 0.82 : 0,
        transition: 'opacity 0.4s ease',
        filter: 'brightness(1.18) saturate(1.15) drop-shadow(0 0 34px rgba(239,68,68,0.34))',
      }}
    >
      <canvas ref={canvasRef} width={sequence.width} height={sequence.height} className="w-full h-auto" />
    </div>
  )
}

export default function BriefSequenceBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(239,68,68,0.12), transparent 46%)' }} />
      {SEQUENCES.map(sequence => <SequenceTile key={sequence.label} sequence={sequence} />)}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(10,10,20,0.9),rgba(10,10,20,0.58) 42%,rgba(10,10,20,0.86))' }} />
    </div>
  )
}
