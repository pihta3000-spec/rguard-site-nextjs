import ScrollSequence from './ScrollSequence'

const SEQUENCES = {
  viral: {
    frameBase: '/viral-sequence',
    canvasWidth: 900,
    canvasHeight: 674,
    width: 'clamp(540px, 52vw, 840px)',
  },
  scripts: {
    frameBase: '/scripts-sequence',
    canvasWidth: 900,
    canvasHeight: 507,
    width: 'clamp(570px, 57vw, 930px)',
  },
  concepts: {
    frameBase: '/concepts-sequence',
    canvasWidth: 900,
    canvasHeight: 900,
    width: 'clamp(480px, 48vw, 780px)',
  },
  events: {
    frameBase: '/events-sequence',
    canvasWidth: 900,
    canvasHeight: 507,
    width: 'clamp(570px, 57vw, 930px)',
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
      loadedOpacity={0.95}
      containerStyle={{
        top: '50%',
        right: 'clamp(-120px, -6vw, -36px)',
        width: sequence.width,
        height: 'min(90vh, 900px)',
        transform: 'translateY(-50%)',
      }}
      canvasStyle={{
        width: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        filter: 'brightness(1.18) saturate(1.18) drop-shadow(0 0 42px rgba(239,68,68,0.52))',
      }}
    />
  )
}
