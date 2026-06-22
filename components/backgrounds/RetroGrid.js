// Synthwave-«коридор»: две перспективные плоскости (пол + потолок) сходятся на
// горизонте в центре и движутся на зрителя — заполняет всю высоту. Чистый CSS.
export default function RetroGrid() {
  return (
    <div className="retro" aria-hidden="true">
      <div className="retro__floor"><div className="lines floor" /></div>
      <div className="retro__ceil"><div className="lines ceil" /></div>
      <div className="retro__horizon" />
      <div className="retro__vignette" />
      <style jsx>{`
        .retro { position: absolute; inset: 0; overflow: hidden; pointer-events: none; perspective: 320px; }
        .retro__floor, .retro__ceil { position: absolute; left: 0; right: 0; height: 50%; overflow: hidden; }
        .retro__floor { bottom: 0; transform-origin: top center; transform: rotateX(72deg); }
        .retro__ceil  { top: 0;    transform-origin: bottom center; transform: rotateX(-72deg); }
        .lines {
          position: absolute; left: -75%; right: -75%; top: -75%; bottom: -75%;
          background-image:
            linear-gradient(to right, rgba(239,68,68,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(239,68,68,0.5) 1px, transparent 1px);
          background-size: 64px 64px;
        }
        .floor { animation: grid-move 5s linear infinite; }
        .ceil  { animation: grid-move-rev 5s linear infinite; }
        @keyframes grid-move      { from { transform: translateY(-64px); } to { transform: translateY(0); } }
        @keyframes grid-move-rev  { from { transform: translateY(64px); }  to { transform: translateY(0); } }
        .retro__horizon {
          position: absolute; top: 50%; left: 0; right: 0; height: 2px; transform: translateY(-1px);
          background: linear-gradient(90deg, transparent, #ef4444, transparent);
          box-shadow: 0 0 60px 10px rgba(239,68,68,0.45);
        }
        .retro__vignette {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 55% 50% at 50% 50%, rgba(10,10,20,0.62), transparent 72%),
            radial-gradient(ellipse at center, transparent 35%, rgba(10,10,20,0.55) 100%);
        }
        @media (prefers-reduced-motion: reduce) {
          .floor, .ceil { animation: none; }
        }
      `}</style>
    </div>
  )
}
