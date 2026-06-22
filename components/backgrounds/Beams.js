// Анимированные неоновые лучи света (аналог Aceternity «Background Beams»),
// самодостаточно на CSS, без зависимостей. Тема — красный неон RGUARD.
export default function Beams({ count = 14 }) {
  const beams = Array.from({ length: count }, (_, i) => {
    const left = ((i + 0.5) / count) * 100
    return {
      left,
      delay: -(i * 0.8 + (i % 3) * 0.4),
      dur: 4.5 + (i % 5),
      h: 35 + (i % 4) * 12,
      op: 0.25 + (i % 3) * 0.18,
      w: i % 5 === 0 ? 2 : 1,
    }
  })
  return (
    <div className="beams" aria-hidden="true">
      {beams.map((b, i) => (
        <span
          key={i}
          className="beam"
          style={{
            left: `${b.left}%`,
            width: `${b.w}px`,
            height: `${b.h}%`,
            opacity: b.op,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
          }}
        />
      ))}
      <div className="beams__glow" />
      <style jsx>{`
        .beams { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .beam {
          position: absolute;
          top: -45%;
          background: linear-gradient(to bottom, transparent, #ef4444, transparent);
          filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.8));
          animation-name: beam-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes beam-fall {
          0% { transform: translateY(-60%); }
          100% { transform: translateY(320%); }
        }
        .beams__glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 40%, rgba(239,68,68,0.12), transparent 70%);
        }
        @media (prefers-reduced-motion: reduce) {
          .beam { animation: none; opacity: 0.18; }
        }
      `}</style>
    </div>
  )
}
