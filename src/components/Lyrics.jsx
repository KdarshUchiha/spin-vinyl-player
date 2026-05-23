import { useEffect, useRef, useState } from 'react'
import { fetchLyrics, findActiveLine } from '../api/lyrics'
import { usePlayer } from '../context/PlayerContext'

export default function Lyrics() {
  const { currentTrack, progress, seek } = usePlayer()
  const [data, setData] = useState({ synced: null, plain: null })
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)
  const activeRef = useRef(-1)

  useEffect(() => {
    if (!currentTrack) return
    let alive = true
    setLoading(true)
    fetchLyrics(currentTrack).then((d) => {
      if (alive) { setData(d); setLoading(false) }
    })
    return () => { alive = false }
  }, [currentTrack?.id])

  useEffect(() => {
    if (!data.synced) return
    const idx = findActiveLine(data.synced, progress)
    if (idx === activeRef.current) return
    activeRef.current = idx
    const el = containerRef.current?.querySelector(`[data-idx="${idx}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [progress, data.synced])

  if (loading) return <div className="lyrics-state">Looking for lyrics…</div>
  if (!data.synced && !data.plain) {
    return <div className="lyrics-state">No lyrics found for this track.</div>
  }

  if (data.synced) {
    const activeIdx = findActiveLine(data.synced, progress)
    return (
      <div ref={containerRef} className="lyrics lyrics--synced">
        {data.synced.map((line, i) => {
          const state = i < activeIdx ? 'past' : i === activeIdx ? 'active' : 'future'
          return (
            <button
              key={i}
              data-idx={i}
              className={`lyrics-line lyrics-line--${state}`}
              onClick={() => seek(line.time)}
            >
              {line.text}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="lyrics lyrics--plain">
      {data.plain.split('\n').map((line, i) => (
        <p key={i} className="lyrics-line lyrics-line--plain">{line}</p>
      ))}
    </div>
  )
}
