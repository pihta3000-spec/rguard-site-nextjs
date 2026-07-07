import { useEffect, useRef, useState } from 'react'

const SEQUENCES = [
  { label: 'home', base: '/home-sequence', width: 720, height: 720, x: '7%', y: '9%', mobileX: '-10%', mobileY: '6%', size: 'clamp(170px, 18vw, 300px)', mobileSize: '210px', rotate: '-9deg', opacity: 0.78 },
  { label: 'production', base: '/production-sequence', width: 958, height: 540, x: '69%', y: '5%', mobileX: '48%', mobileY: '13%', size: 'clamp(320px, 31vw, 520px)', mobileSize: '300px', rotate: '6deg', opacity: 0.86 },
  { label: 'viral', base: '/viral-sequence', width: 900, height: 674, x: '38%', y: '17%', mobileX: '18%', mobileY: '34%', size: 'clamp(250px, 25vw, 430px)', mobileSize: '250px', rotate: '-3deg', opacity: 0.84 },
  { label: 'scripts', base: '/scripts-sequence', width: 900, height: 507, x: '2%', y: '63%', mobileX: '-18%', mobileY: '62%', size: 'clamp(310px, 30vw, 520px)', mobileSize: '290px', rotate: '5deg', opacity: 0.82 },
  { label: 'concepts', base: '/concepts-sequence', width: 900, height: 900, x: '76%', y: '55%', mobileX: '58%', mobileY: '55%', size: 'clamp(210px, 22vw, 360px)', mobileSize: '230px', rotate: '-8deg', opacity: 0.8 },
  { label: 'events', base: '/events-sequence', width: 900, height: 507, x: '35%', y: '78%', mobileX: '22%', mobileY: '82%', size: 'clamp(320px, 32vw, 540px)', mobileSize: '300px', rotate: '4deg', opacity: 0.82 },
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
  const loadedRef = useRef(false)
  const activeRef = useRef(false)
  const frameRef = useRef(0)
  const directionRef = useRef(1)
  const rafRef = useRef(null)
  const lastTickRef = useRef(0)
  const touchTimerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const img = new window.Image()
    img.src = `${sequence.base}/001.webp`
    img.onload = () => {
      framesRef.current[0] = img
      setReady(true)
      const canvas = canvasRef.current
      if (canvas) drawContain(canvas.getContext('2d'), img, canvas.width, canvas.height)
    }
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.clearTimeout(touchTimerRef.current)
    }
  }, [sequence.base])

  const loadFrames = () => {
    if (loadedRef.current) return
    loadedRef.current = true
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
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
      const maxFrame = TOTAL_FRAMES - 1
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
    setPlaying(true)
    loadFrames()
    cancelAnimationFrame(rafRef.current)
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
      className={`brief-sequence-tile ${playing ? 'is-playing' : ''}`}
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
        '--desktop-x': sequence.x,
        '--desktop-y': sequence.y,
        '--mobile-x': sequence.mobileX,
        '--mobile-y': sequence.mobileY,
        '--tile-width': sequence.size,
        '--mobile-width': sequence.mobileSize,
        '--tile-rotate': sequence.rotate,
        '--tile-opacity': ready ? sequence.opacity : 0,
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
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg,rgba(10,10,20,0.88),rgba(10,10,20,0.48) 44%,rgba(10,10,20,0.84))' }} />
      <style jsx>{`
        .brief-sequence-tile {
          position: absolute;
          left: var(--mobile-x);
          top: var(--mobile-y);
          width: var(--mobile-width);
          pointer-events: auto;
          cursor: pointer;
          opacity: calc(var(--tile-opacity) * 0.72);
          transform: rotate(var(--tile-rotate)) scale(1);
          transform-origin: center;
          transition: opacity 0.35s ease, filter 0.35s ease, transform 0.35s ease;
          filter: brightness(1.12) saturate(1.22) drop-shadow(0 0 28px rgba(239, 68, 68, 0.32));
          -webkit-tap-highlight-color: transparent;
        }

        .brief-sequence-tile.is-playing {
          opacity: 0.98;
          transform: rotate(var(--tile-rotate)) scale(1.045);
          filter: brightness(1.32) saturate(1.42) drop-shadow(0 0 42px rgba(239, 68, 68, 0.48));
        }

        @media (min-width: 768px) {
          .brief-sequence-tile {
            left: var(--desktop-x);
            top: var(--desktop-y);
            width: var(--tile-width);
            opacity: var(--tile-opacity);
          }
        }
      `}</style>
    </div>
  )
}
