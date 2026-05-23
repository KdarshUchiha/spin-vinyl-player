import { useEffect, useRef } from 'react'
import { usePlayer } from '../context/PlayerContext'

const BAR_COUNT = 32

export default function Visualizer() {
  const { isPlaying, analyserRef, analyserReady } = usePlayer()
  const wrapRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const bars = wrap.querySelectorAll('.viz-bar')
    if (!analyserReady || !analyserRef?.current || !isPlaying) {
      bars.forEach((b) => { b.style.transform = '' })
      return
    }
    const analyser = analyserRef.current
    const buf = new Uint8Array(analyser.frequencyBinCount)
    const tick = () => {
      analyser.getByteFrequencyData(buf)
      // map bins to bars (log-ish)
      for (let i = 0; i < BAR_COUNT; i++) {
        const idx = Math.floor(Math.pow(i / BAR_COUNT, 1.6) * buf.length)
        const v = buf[idx] / 255
        const scale = 0.15 + v * 1.4
        bars[i].style.transform = `scaleY(${scale})`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying, analyserReady, analyserRef])

  return (
    <div ref={wrapRef} className={`viz ${isPlaying ? 'viz--play' : ''} ${analyserReady ? 'viz--live' : ''}`} aria-hidden="true">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <span
          key={i}
          className="viz-bar"
          style={{
            animationDelay: `${(i % 6) * 0.08}s`,
          }}
        />
      ))}
    </div>
  )
}
