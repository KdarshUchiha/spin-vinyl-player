import { useEffect, useMemo, useState } from 'react'
import { getTrendingAudius, getTrendingITunes, searchITunes, searchAudius } from '../api/music'
import { fetchGlobalNewReleases, fetchIndianNewReleases } from '../api/youtube'
import { CATEGORIES } from '../api/yt-channels'
import TrackRow from '../components/TrackRow'
import SourceFilter from '../components/SourceFilter'
import HeroVinyl from '../components/HeroVinyl'
import CategorySection from '../components/CategorySection'
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
  { label: 'Bollywood', query: 'bollywood new song',hue: 350 },
  { label: 'Punjabi',   query: 'punjabi new song',  hue: 25 },
  { label: 'Tamil',     query: 'tamil song',        hue: 10 },
  { label: 'Telugu',    query: 'telugu song',       hue: 60 },
  { label: 'R&B',       query: 'r&b soul',          hue: 270 },
  { label: 'Workout',   query: 'workout pump',      hue: 350 },
  { label: 'Chill',     query: 'chill ambient',     hue: 200 },
  { label: 'Throwback', query: '80s 90s greatest',  hue: 130 },
]

// Order matters — lazy sections load as user scrolls
const CATEGORY_ORDER = [
  'globalPop',
  'bollywood',
  'punjabi',
  'southIndia',
  'hipHop',
  'kpop',
  'electronic',
  'classics',
  'oldIsGoldIndia',
  'latin',
  'indieAlt',
  'marathiBengali',
  'lofi',
]

export default function Home() {
  const [trending, setTrending] = useState([])
  const [hits, setHits] = useState([])
  const [globalReleases, setGlobalReleases] = useState([])
  const [indianReleases, setIndianReleases] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeGenre, setActiveGenre] = useState(null)
  const [genreLoading, setGenreLoading] = useState(false)
  const [genreTracks, setGenreTracks] = useState([])
  const { recent, sourceFilter, playTrack } = usePlayer()

  useEffect(() => {
    let alive = true
    setLoading(true)
    // Eager-load only the high-priority feeds; the rest lazy-load on scroll
    Promise.all([
      getTrendingAudius(20),
      getTrendingITunes(),
      fetchGlobalNewReleases(20),
      fetchIndianNewReleases(20),
    ]).then(([a, b, g, i]) => {
      if (!alive) return
      setTrending(a); setHits(b); setGlobalReleases(g); setIndianReleases(i)
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
  const filteredGlobal = useMemo(() => applySourceFilter(globalReleases, sourceFilter), [globalReleases, sourceFilter])
  const filteredIndian = useMemo(() => applySourceFilter(indianReleases, sourceFilter), [indianReleases, sourceFilter])

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

      <RevealSection title="🌍 Fresh from global pop" subtitle="Live from major artist YouTube channels">
        {loading && globalReleases.length === 0 ? <Skeleton /> : (
          <CardRow tracks={filteredGlobal} onPlay={(t) => playTrack(t, filteredGlobal)} />
        )}
      </RevealSection>

      <RevealSection title="🇮🇳 Fresh from India" subtitle="T-Series, Sony India, Saregama, Bollywood, Punjabi & more">
        {loading && indianReleases.length === 0 ? <Skeleton /> : (
          <CardRow tracks={filteredIndian} onPlay={(t) => playTrack(t, filteredIndian)} />
        )}
      </RevealSection>

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

      {/* Lazy-loaded category sections, in order */}
      {CATEGORY_ORDER.map((key) => {
        const cat = CATEGORIES[key]
        if (!cat) return null
        return (
          <CategorySection
            key={key}
            categoryKey={key}
            title={cat.title}
            subtitle={`${cat.channels.length} channels`}
          />
        )
      })}

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
              {t.source === 'audius' ? 'FULL' : t.source === 'youtube' ? 'YT' : '0:30'}
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
