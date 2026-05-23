import { useEffect, useRef, useState } from 'react'

export function useReveal({ threshold = 0.12, once = true } = {}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || (once && shown)) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          if (once) obs.disconnect()
        } else if (!once) {
          setShown(false)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, once, shown])
  return [ref, shown]
}
