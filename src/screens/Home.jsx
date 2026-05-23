import { useEffect, useMemo, useState } from 'react'
import { getTrendingAudius, getTrendingITunes, searchITunes, searchAudius } from '../api/music'
import TrackRow from '../components/TrackRow'
import SourceFilter from '../components/SourceFilter'
import HeroVinyl from '../components/HeroVinyl'
import { applySourceFilter, usePlayer } from '../context/PlayerContext'
import { useReveal } from '../hooks/useReveal'

const GENRES = [
  { label: 'Lo-fi',     query: 'lofi beats',        hue: 220 },
  { label: 'Indie',     query: 'indie',             hue: 290 },
  { label: 'Hip-hop',   query: 'hip hop',           hue: 30 },
  { label: 'Rock',      query: 'rock',              hue: 0 },
  { label: 'Electronic',query: 'electronic',        hue: 180 },
  { label: 'Jazz',      query: 'jazz',              hue: 50 },
  { label: 'Classical', query: 'classical',         hue: 320 },
  { label: 'Latin',     query: 'latin',             hue: 15 },
  { label: 'R&B',       query: 'r&b soul',          hue: 270 },
  { label: 'Workout',   query: 'workout pump',      hue: 350 },
  { label: 'Chill',     query: 'chill ambient',     hue: 200 },
  { label: 'Throwback', query: '80s 90s greatest',  hue: 130 },
]

export default function Home() {
  const [trending, setTrending] = useState([])
  const [hits, setHits] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeGenre, setActiveGenre] = useState(null)
  const [genreLoading, setGenreLoading] = useState(false)
  const [genreTracks, setGenreTracks] = useState([])
  const { recent, sourceFilter, playTrack } = usePlayer()

  useEffect(() => {
    let alive = true
    setLoading(true)
    Promise.all([getTrendingAudius(20), getTrendingITunes()]).then(([a, b]) => {
      if (!alive) return
      setTrending(a)
      setHits(b)
      setLoading(false)
    })
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (!activeGenre) return
    let alive = true
    setGenreLoading(true)
    Promise.all([
      searchITunes(activeGenre.query, 16),
      searchAudius(activeGenre.query, 16),
    ]).then(([a, b]) => {
      if (!alive) return
      const merged = []
      const max = Math.max(a.length, b.length)
      for (let i = 0; i < max; i++) {
        if (a[i]) merged.push(a[i])
        if (b[i]) merged.push(b[i])
      }
      setGenreTracks(merged)
      setGenreLoading(false)
    })
    return () => { alive = false }
  }, [activeGenre])

  const filteredTrending = useMemo(() => applySourceFilter(trending, sourceFilter), [trending, sourceFilter])
  const filteredHits = useMemo(() => applySourceFilter(hits, sourceFilter), [hits, sourceFilter])
  const filteredRecent = useMemo(() => applySourceFilter(recent, sourceFilter), [recent, sourceFilter])
  const filteredGenre = useMemo(() => applySourceFilter(genreTracks, sourceFilter), [genreTracks, sourceFilter])

  return (
    <div className="screen">
      <header className="screen-hero">
        <HeroVinyl />
        <h1>Tonight's<br /><span className="hero-accent">spin</span></h1>
        <p>Drop the needle on something new — pick what you want to hear.</p>
        <div className="hero-filter">
          <SourceFilter />
        </div>
      </header>

      <RevealSection title="Pick a vibe">
        <div className="chip-row">
          {GENRES.map((g) => (
            <button
              key={g.label}
              className={`chip ${activeGenre?.label === g.label ? 'chip--active' : ''}`}
              style={{ '--chip-hue': g.hue }}
              onClick={() => setActiveGenre(activeGenre?.label === g.label ? null : g)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </RevealSection>

      {activeGenre && (
        <RevealSection title={`${activeGenre.label} picks`}>
          {genreLoading ? <Skeleton /> : <CardRow tracks={filteredGenre.slice(0, 12)} onPlay={(t) => playTrack(t, filteredGenre)} />}
        </RevealSection>
      )}

      {filteredRecent.length > 0 && (
        <RevealSection title="Recently played">
          <CardRow tracks={filteredRecent.slice(0, 10)} onPlay={(t) => playTrack(t, filteredRecent)} />
        </RevealSection>
      )}

      <RevealSection title="Trending on Audius" subtitle="Full-length tracks · indie & decentralized">
        {loading ? <Skeleton /> : <CardRow tracks={filteredTrending} onPlay={(t) => playTrack(t, filteredTrending)} />}
      </RevealSection>

      <RevealSection title="Hot picks" subtitle="Mainstream music · 30s previews">
        {loading ? <Skeleton /> : (
          <div className="track-list">
            {filteredHits.map((t, i) => <TrackRow key={t.id} track={t} list={filteredHits} index={i} />)}
            {filteredHits.length === 0 && <div className="muted">No tracks match your source filter.</div>}
          </div>
        )}
      </RevealSection>
    </div>
  )
}

function RevealSection({ title, subtitle, children }) {
  const [ref, shown] = useReveal()
  return (
    <section ref={ref} className={`section reveal ${shown ? 'reveal--in' : ''}`}>
      <div className="section-head">
        <h2 className="section-title">{title}</h2>
        {subtitle && <span className="section-sub">{subtitle}</span>}
      </div>
      {children}
    </section>
  )
}

function CardRow({ tracks, onPlay }) {
  if (!tracks.length) return <div className="muted">Nothing here for this filter.</div>
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
            <span className={`card-badge card-badge--${t.source}`}>
              {t.source === 'audius' ? 'FULL' : '0:30'}
            </span>
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
