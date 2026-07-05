import { useEffect, useState } from 'react'

export default function DesktopOnly({ children, minWidth = 1024 }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${minWidth}px)`)
    const update = () => setReady(media.matches)

    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [minWidth])

  return ready ? children : null
}
