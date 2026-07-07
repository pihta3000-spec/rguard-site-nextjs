import { useEffect, useRef, useState } from 'react'

const SEQUENCES = [
  { label: 'home', base: '/home-sequence', width: 720, height: 720, x: '4%', y: '15%', mobileX: '-24%', mobileY: '8%', size: 'clamp(150px, 15vw, 250px)', mobileSize: '160px', rotate: '-10deg', opacity: 0.8 },
  { label: 'production', base: '/production-sequence', width: 958, height: 540, x: '76%', y: '12%', mobileX: '54%', mobileY: '9%', size: 'clamp(230px, 23vw, 380px)', mobileSize: '210px', rotate: '7deg', opacity: 0.84 },
  { label: 'viral', base: '/viral-sequence', width: 900, height: 674, x: '17%', y: '71%', mobileX: '-10%', mobileY: '39%', size: 'clamp(190px, 20vw, 330px)', mobileSize: '190px', rotate: '5deg', opacity: 0.82 },
  { label: 'scripts', base: '/scripts-sequence', width: 900, height: 507, x: '0%', y: '50%', mobileX: '47%', mobileY: '43%', size: 'clamp(250px, 25vw, 430px)', mobileSize: '220px', rotate: '-4deg', opacity: 0.78 },
  { label: 'concepts', base: '/concepts-sequence', width: 900, height: 900, x: '82%', y: '55%', mobileX: '-18%', mobileY: '75%', size: 'clamp(170px, 17vw, 290px)', mobileSize: '170px', rotate: '-8deg', opacity: 0.8 },
  { label: 'events', base: '/events-sequence', width: 900, height: 507, x: '71%', y: '78%', mobileX: '42%', mobileY: '76%', size: 'clamp(240px, 24vw, 410px)', mobileSize: '210px', rotate: '4deg', opacity: 0.8 },
]

const TOTAL_FRAMES = 151

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
  const loadingRef = useRef(false)
  const activeRef = useRef(false)
  const frameRef = useRef(0)
  const directionRef = useRef(1)
  const rafRef = useRef(null)
  const lastTickRef = useRef(0)
  const touchTimerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [desktop, setDesktop] = useState(false)

  useEffect(() => {
    const update = () => setDesktop(window.innerWidth >= 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const loadFrames = () => {
    if (loadingRef.current) return
    loadingRef.current = true

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image()
      const idx = i - 1
      img.src = `${sequence.base}/${String(i).padStart(3, '0')}.webp`
      img.onload = () => {
        framesRef.current[idx] = img
        if (idx === 0) {
          setReady(true)
          const canvas = canvasRef.current
          if (canvas) drawContain(canvas.getContext('2d'), img, canvas.width, canvas.height)
        }
      }
    }
  }

  useEffect(() => {
    loadFrames()
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.clearTimeout(touchTimerRef.current)
    }
  }, [sequence.base])

  const getFrame = (index) => {
    const rounded = Math.round(index)
    if (framesRef.current[rounded]) return framesRef.current[rounded]

    for (let i = rounded - 1; i >= 0; i--) {
      if (framesRef.current[i]) return framesRef.current[i]
    }

    return framesRef.current[0]
  }

  const animate = (time) => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (time - lastTickRef.current > 38) {
      lastTickRef.current = time
      const maxFrame = TOTAL_FRAMES - 1
      const next = frameRef.current + directionRef.current
      if (next >= maxFrame || next <= 0) directionRef.current *= -1
      frameRef.current = Math.max(0, Math.min(maxFrame, next))
      const frame = getFrame(frameRef.current)
      drawContain(canvas.getContext('2d'), frame, canvas.width, canvas.height)
    }

    if (activeRef.current) {
      rafRef.current = requestAnimationFrame(animate)
      return
    }

    if (frameRef.current > 0) {
      frameRef.current = Math.max(0, frameRef.current - 3)
      const frame = getFrame(frameRef.current)
      drawContain(canvas.getContext('2d'), frame, canvas.width, canvas.height)
      rafRef.current = requestAnimationFrame(animate)
    }
  }

  const start = () => {
    activeRef.current = true
    setPlaying(true)
    cancelAnimationFrame(rafRef.current)
    lastTickRef.current = 0
    rafRef.current = requestAnimationFrame(animate)
  }

  const stop = () => {
    activeRef.current = false
    setPlaying(false)
  }

  const playOnTap = () => {
    start()
    window.clearTimeout(touchTimerRef.current)
    touchTimerRef.current = window.setTimeout(stop, 2800)
  }

  return (
    <div
      className="brief-sequence-tile"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') start()
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') stop()
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== 'mouse') playOnTap()
      }}
      style={{
        position: 'absolute',
        left: desktop ? sequence.x : sequence.mobileX,
        top: desktop ? sequence.y : sequence.mobileY,
        width: desktop ? sequence.size : sequence.mobileSize,
        pointerEvents: 'auto',
        cursor: 'pointer',
        opacity: ready ? (playing ? 0.98 : sequence.opacity * (desktop ? 1 : 0.72)) : 0,
        transform: `rotate(${sequence.rotate}) scale(${playing ? 1.045 : 1})`,
        transformOrigin: 'center',
        transition: 'opacity 0.35s ease, filter 0.35s ease, transform 0.35s ease',
        filter: playing
          ? 'brightness(1.32) saturate(1.42) drop-shadow(0 0 42px rgba(239, 68, 68, 0.48))'
          : 'brightness(1.12) saturate(1.22) drop-shadow(0 0 28px rgba(239, 68, 68, 0.32))',
        zIndex: 1,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <canvas ref={canvasRef} width={sequence.width} height={sequence.height} className="w-full h-auto" />
    </div>
  )
}

export default function BriefSequenceBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 52% 36%, rgba(239,68,68,0.13), transparent 42%)' }} />
      {SEQUENCES.map(sequence => <SequenceTile key={sequence.label} sequence={sequence} />)}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg,rgba(10,10,20,0.74),rgba(10,10,20,0.38) 42%,rgba(10,10,20,0.72))' }} />
    </div>
  )
}
