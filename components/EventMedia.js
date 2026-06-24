import { useState, useEffect, useCallback, useRef } from 'react'

const GAP = 12 // px, совпадает с gap сетки

// Мобильная раскладка (2 колонки): модуль из 3 фото — широкий баннер + 2 вертикальных.
// Остаток (1-2 фото) раскладывается без дыр → устойчиво к любому числу фото.
function mobileLayout(n) {
  const out = []
  let i = 0, row = 1
  while (n - i >= 3) {
    out.push({ c: 1, r: row, cs: 2, rs: 1 })       // широкий баннер
    out.push({ c: 1, r: row + 1, cs: 1, rs: 2 })   // вертикаль
    out.push({ c: 2, r: row + 1, cs: 1, rs: 2 })   // вертикаль
    i += 3; row += 3
  }
  const rem = n - i
  if (rem === 1) out.push({ c: 1, r: row, cs: 2, rs: 1 })                              // на всю ширину
  else if (rem === 2) { out.push({ c: 1, r: row, cs: 1, rs: 1 }); out.push({ c: 2, r: row, cs: 1, rs: 1 }) } // два в ряд
  return out
}

// Галерея фото — «бенто» из ячеек разного размера. desktopLayout (4 колонки)
// передаётся пропом; ячейки квадратные за счёт измеренной ширины контейнера.
export function PhotoGallery({ photos, desktopLayout }) {
  const wrapRef = useRef(null)
  const [cols, setCols] = useState(4)
  const [cell, setCell] = useState(0)
  const [index, setIndex] = useState(null)
  const open = index !== null

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      const c = w >= 768 ? 4 : 2
      setCols(c)
      setCell((w - (c - 1) * GAP) / c)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const layout = cols === 4 ? desktopLayout : mobileLayout(photos.length)

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
      <div
        ref={wrapRef}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridAutoRows: cell ? `${cell}px` : 'auto',
          gap: GAP,
        }}
      >
        {photos.map((src, i) => {
          const L = layout[i] || { c: 1, r: 'auto', cs: 1, rs: 1 }
          return (
            <button
              key={src}
              onClick={() => setIndex(i)}
              className="relative overflow-hidden group"
              style={{
                gridColumn: `${L.c} / span ${L.cs}`,
                gridRow: `${L.r} / span ${L.rs}`,
                border: '1px solid rgba(239,68,68,0.15)',
                background: '#0a0a14',
              }}
            >
              <img
                src={src}
                alt={`Фото с мероприятия ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          )
        })}
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
