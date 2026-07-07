import ScrollSequence from './ScrollSequence'

const SEQUENCES = {
  viral: {
    frameBase: '/viral-sequence',
    canvasWidth: 900,
    canvasHeight: 674,
    width: 'clamp(360px, 35vw, 560px)',
  },
  scripts: {
    frameBase: '/scripts-sequence',
    canvasWidth: 900,
    canvasHeight: 507,
    width: 'clamp(380px, 38vw, 620px)',
  },
  concepts: {
    frameBase: '/concepts-sequence',
    canvasWidth: 900,
    canvasHeight: 900,
    width: 'clamp(320px, 32vw, 520px)',
  },
  events: {
    frameBase: '/events-sequence',
    canvasWidth: 900,
    canvasHeight: 507,
    width: 'clamp(380px, 38vw, 620px)',
  },
}

export default function ServiceScrollAnimation({ variant }) {
  const sequence = SEQUENCES[variant]
  if (!sequence) return null

  return (
    <ScrollSequence
      frameBase={sequence.frameBase}
      totalFrames={151}
      passes={2}
      canvasWidth={sequence.canvasWidth}
      canvasHeight={sequence.canvasHeight}
      loadedOpacity={0.85}
      containerStyle={{
        top: '50%',
        right: 'clamp(12px, 2vw, 40px)',
        width: sequence.width,
        height: 'min(78vh, 720px)',
        transform: 'translateY(-50%)',
      }}
      canvasStyle={{
        width: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        filter: 'drop-shadow(0 0 32px rgba(239,68,68,0.38))',
      }}
    />
  )
}
