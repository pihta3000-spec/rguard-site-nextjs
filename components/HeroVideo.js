export default function HeroVideo({ desktopSrc, mobileSrc, poster, label = '[ REC • LIVE ]' }) {
  return (
    <div className="flex justify-center lg:justify-end">
      <div className="w-full max-w-[360px]">
        <div className="relative aspect-[9/16] overflow-hidden"
          style={{ background: 'linear-gradient(180deg,#0d0d1a 0%,#0a0a14 100%)', border: '1px solid rgba(239,68,68,0.4)', clipPath: 'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))', boxShadow: '0 0 40px rgba(239,68,68,0.2)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.15) 3px,rgba(0,0,0,0.15) 4px)' }} />
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(239,68,68,0.6)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(239,68,68,0.6)' }} />
          <div className="absolute top-3 left-3 w-5 h-5" style={{ borderTop: '2px solid #ef4444', borderLeft: '2px solid #ef4444' }} />
          <div className="absolute top-3 right-3 w-5 h-5" style={{ borderTop: '2px solid #ef4444', borderRight: '2px solid #ef4444' }} />
          <div className="absolute bottom-3 left-3 w-5 h-5" style={{ borderBottom: '2px solid #ef4444', borderLeft: '2px solid #ef4444' }} />
          <div className="absolute bottom-3 right-3 w-5 h-5" style={{ borderBottom: '2px solid #ef4444', borderRight: '2px solid #ef4444' }} />
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={poster}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={mobileSrc} media="(max-width: 767px)" type="video/mp4" />
            <source src={desktopSrc} type="video/mp4" />
          </video>
          <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(transparent,#0a0a14)' }} />
          <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-10">
            <div className="font-mono-terminal text-red-500 text-xs tracking-[3px] flicker">{label}</div>
            <div className="w-2 h-2 rounded-full bg-red-500 flicker" style={{ boxShadow: '0 0 6px #ef4444' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
