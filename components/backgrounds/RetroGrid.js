// Synthwave-сетка, уходящая в перспективу и движущаяся на зрителя
// (аналог MagicUI «RetroGrid»), чистый CSS, без зависимостей. Тема — красный.
export default function RetroGrid() {
  return (
    <div className="retro" aria-hidden="true">
      <div className="retro__plane">
        <div className="retro__lines" />
      </div>
      <div className="retro__fade" />
      <style jsx>{`
        .retro { position: absolute; inset: 0; overflow: hidden; pointer-events: none; perspective: 220px; }
        .retro__plane { position: absolute; inset: 0; top: 35%; transform: rotateX(65deg); transform-origin: top center; }
        .retro__lines {
          position: absolute; left: -150%; right: -150%; top: 0; height: 350%;
          background-image:
            linear-gradient(to right, rgba(239,68,68,0.45) 1px, transparent 0),
            linear-gradient(to bottom, rgba(239,68,68,0.45) 1px, transparent 0);
          background-size: 64px 64px;
          animation: retro-move 6s linear infinite;
        }
        @keyframes retro-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(64px); }
        }
        /* затемнение к горизонту сверху и плавный низ */
        .retro__fade {
          position: absolute; inset: 0;
          background:
            linear-gradient(to bottom, #0a0a14 0%, transparent 28%, transparent 78%, #0a0a14 100%),
            radial-gradient(ellipse 70% 60% at 50% 70%, rgba(239,68,68,0.10), transparent 70%);
        }
        @media (prefers-reduced-motion: reduce) {
          .retro__lines { animation: none; }
        }
      `}</style>
    </div>
  )
}
