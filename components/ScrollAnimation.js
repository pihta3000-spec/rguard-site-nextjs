import ScrollSequence from './ScrollSequence'

export default function ScrollAnimation() {
  return (
    <ScrollSequence
      frameBase="/home-sequence"
      totalFrames={151}
      passes={3}
      canvasWidth={720}
      canvasHeight={720}
      speed={0.12}
      loadedOpacity={0.78}
      containerStyle={{
        top: 0,
        left: '-8%',
        width: '45vw',
        height: '100vh',
      }}
      canvasStyle={{
        width: '90%',
        height: 'auto',
        filter: 'drop-shadow(0 0 28px rgba(239,68,68,0.32))',
      }}
    />
  )
}
