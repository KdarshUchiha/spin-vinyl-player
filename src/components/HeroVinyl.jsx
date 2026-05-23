import { useEffect, useRef, useState } from 'react'

export default function HeroVinyl() {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const onMove = (e) => {
      const w = window.innerWidth, h = window.innerHeight
      setTilt({
        x: (e.clientX / w - 0.5) * 24,
        y: (e.clientY / h - 0.5) * -24,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={ref}
      className="hero-vinyl"
      aria-hidden="true"
      style={{ transform: `translate(${tilt.x}px, ${tilt.y}px)` }}
    >
      <div className="hero-vinyl-disc">
        <span className="hero-vinyl-shine" />
        <span className="hero-vinyl-label" />
      </div>
      <div className="hero-vinyl-glow" />
    </div>
  )
}
