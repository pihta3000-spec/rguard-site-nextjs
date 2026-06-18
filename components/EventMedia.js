import { useState, useEffect, useCallback } from 'react'

// Галерея фото с лайтбоксом (стрелки + Esc + клик по фону закрывает)
export function PhotoGallery({ photos }) {
  const [index, setIndex] = useState(null)
  const open = index !== null

  const close = useCallback(() => setIndex(null), [])
  const prev = useCallback(() => setIndex(i => (i + photos.length - 1) % photos.length), [photos.length])
  const next = useCallback(() => setIndex(i => (i + 1) % photos.length), [photos.length])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, close, prev, next])

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((src, i) => (
          <button
            key={src}
            onClick={() => setIndex(i)}
            className="relative overflow-hidden group"
            style={{ aspectRatio: '4/3', border: '1px solid rgba(239,68,68,0.15)', background: '#0a0a14' }}
          >
            <img
              src={src}
              alt={`Фото с мероприятия ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {open && (
        <div
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(3,3,8,0.94)', backdropFilter: 'blur(4px)' }}
        >
          <button onClick={close} className="absolute top-5 right-6 text-zinc-300 hover:text-white" style={{ fontSize: 32, lineHeight: 1 }} aria-label="Закрыть">×</button>
          <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-3 md:left-8 text-zinc-300 hover:text-white select-none" style={{ fontSize: 44, lineHeight: 1 }} aria-label="Назад">‹</button>
          <img
            src={photos[index]}
            alt={`Фото с мероприятия ${index + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[90vw] object-contain"
            style={{ border: '1px solid rgba(239,68,68,0.25)' }}
          />
          <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-3 md:right-8 text-zinc-300 hover:text-white select-none" style={{ fontSize: 44, lineHeight: 1 }} aria-label="Вперёд">›</button>
          <div className="absolute bottom-5 left-0 right-0 text-center text-zinc-400 font-mono-terminal text-sm">{index + 1} / {photos.length}</div>
        </div>
      )}
    </>
  )
}

// Стена вертикальных видео — проигрываются по нажатию (одно за раз)
export function VideoWall({ videos }) {
  const [playing, setPlaying] = useState(null)
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((v, i) => (
        <div
          key={v.src}
          className="relative overflow-hidden"
          style={{ aspectRatio: '9/16', border: '1px solid rgba(239,68,68,0.18)', background: '#05050c' }}
        >
          {playing === i ? (
            <video
              src={v.src}
              poster={v.poster}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <button onClick={() => setPlaying(i)} className="absolute inset-0 w-full h-full group" aria-label="Воспроизвести видео">
              <img src={v.poster} alt="" loading="lazy" className="w-full h-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center transition" style={{ background: 'rgba(0,0,0,0.28)' }}>
                <span className="flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110" style={{ width: 60, height: 60, background: 'rgba(239,68,68,0.92)', boxShadow: '0 0 24px rgba(239,68,68,0.5)' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
                </span>
              </span>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
