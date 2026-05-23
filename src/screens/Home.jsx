import { useEffect, useState } from 'react'
import { getTrendingAudius, getTrendingITunes } from '../api/music'
import TrackRow from '../components/TrackRow'
import { usePlayer } from '../context/PlayerContext'

export default function Home() {
  const [trending, setTrending] = useState([])
  const [hits, setHits] = useState([])
  const [loading, setLoading] = useState(true)
  const { recent } = usePlayer()

  useEffect(() => {
    let alive = true
    Promise.all([getTrendingAudius(12), getTrendingITunes()]).then(([a, b]) => {
      if (!alive) return
      setTrending(a)
      setHits(b)
      setLoading(false)
    })
    return () => { alive = false }
  }, [])

  return (
    <div className="screen">
      <header className="screen-hero">
        <h1>Tonight's<br /><span className="hero-accent">spin</span></h1>
        <p>Drop the needle on something new.</p>
      </header>

      {recent.length > 0 && (
        <Section title="Recently played">
          <CardRow tracks={recent.slice(0, 10)} />
        </Section>
      )}

      <Section title="Trending on Audius">
        {loading ? <Skeleton /> : <CardRow tracks={trending} />}
      </Section>

      <Section title="Hot picks">
        {loading ? <Skeleton /> : (
          <div className="track-list">
            {hits.map((t, i) => <TrackRow key={t.id} track={t} list={hits} index={i} />)}
          </div>
        )}
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  )
}

function CardRow({ tracks }) {
  const { playTrack } = usePlayer()
  return (
    <div className="card-row">
      {tracks.map((t) => (
        <button key={t.id} className="card" onClick={() => playTrack(t, tracks)}>
          <div className="card-art">
            {t.artwork ? <img src={t.artwork} alt="" loading="lazy" /> : <div className="card-art-fallback" />}
            <div className="card-play">▶</div>
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
          <div className="card-art" />
          <div className="card-title" />
          <div className="card-sub" />
        </div>
      ))}
    </div>
  )
}
