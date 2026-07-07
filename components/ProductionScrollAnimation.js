import ScrollSequence from './ScrollSequence'

export default function ProductionScrollAnimation() {
  return (
    <ScrollSequence
      frameBase="/production-sequence"
      totalFrames={151}
      passes={2}
      canvasWidth={958}
      canvasHeight={540}
      containerStyle={{
        top: '50%',
        right: 'clamp(16px, 3vw, 56px)',
        width: 'clamp(300px, 30vw, 430px)',
        height: 'min(78vh, 720px)',
        transform: 'translateY(-50%)',
      }}
      canvasStyle={{
        width: 'min(78vh, 720px)',
        maxWidth: 'none',
        height: 'auto',
        transform: 'rotate(90deg)',
        transformOrigin: 'center',
      }}
    />
  )
}
