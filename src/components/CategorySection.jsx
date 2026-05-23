import { useEffect, useMemo, useState } from 'react'
import { fetchCategoryReleases } from '../api/youtube'
import { applySourceFilter, usePlayer } from '../context/PlayerContext'
import { useReveal } from '../hooks/useReveal'

export default function CategorySection({ categoryKey, title, subtitle }) {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [ref, shown] = useReveal({ threshold: 0.05 })
  const { sourceFilter, playTrack } = usePlayer()
  const [fetched, setFetched] = useState(false)

  // Lazy: only fetch when section scrolls into view
  useEffect(() => {
    if (!shown || fetched) return
    setFetched(true)
    let alive = true
    fetchCategoryReleases(categoryKey, 14).then((t) => {
      if (alive) { setTracks(t); setLoading(false) }
    })
    return () => { alive = false }
  }, [shown, fetched, categoryKey])

  const filtered = useMemo(() => applySourceFilter(tracks, sourceFilter), [tracks, sourceFilter])

  return (
    <section ref={ref} className={`section reveal ${shown ? 'reveal--in' : ''}`}>
      <div className="section-head">
        <h2 className="section-title">{title}</h2>
        {subtitle && <span className="section-sub">{subtitle}</span>}
      </div>
      {!shown ? <div style={{ height: 220 }} /> :
       loading ? <Skeleton /> : <CardRow tracks={filtered} onPlay={(t) => playTrack(t, filtered)} />}
    </section>
  )
}

function CardRow({ tracks, onPlay }) {
  if (!tracks.length) return <div className="muted">No new releases right now (or proxy hiccup — try refreshing).</div>
  return (
    <div className="card-row">
      {tracks.map((t, i) => (
        <button
          key={t.id}
          className="card"
          style={{ '--card-delay': `${Math.min(i * 0.04, 0.4)}s` }}
          onClick={() => onPlay(t)}
        >
          <div className="card-art">
            {t.artwork ? <img src={t.artwork} alt="" loading="lazy" /> : <div className="card-art-fallback" />}
            <div className="card-play">▶</div>
            <span className={`card-badge card-badge--${t.source}`}>YT</span>
          </div>
          <div className="card-title">{t.title}</div>
          <div className="card-sub">{t.artist}</div>
        </button>
      ))}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="card-row">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card card--skeleton">
          <div className="card-art"><span className="shimmer" /></div>
          <div className="card-title"><span className="shimmer" /></div>
          <div className="card-sub"><span className="shimmer" /></div>
        </div>
      ))}
    </div>
  )
}
