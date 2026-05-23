import { useEffect, useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { searchAll } from '../api/music'
import TrackRow from '../components/TrackRow'

export default function Search({ onAdd }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q.trim()) { setResults([]); return }
    let alive = true
    setLoading(true)
    const t = setTimeout(() => {
      searchAll(q).then((r) => { if (alive) { setResults(r); setLoading(false) } })
    }, 300)
    return () => { alive = false; clearTimeout(t) }
  }, [q])

  return (
    <div className="screen">
      <div className="search-bar">
        <SearchIcon size={20} />
        <input
          autoFocus
          placeholder="Songs, artists, albums…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {loading && <div className="muted">Searching…</div>}
      {!loading && q && results.length === 0 && <div className="muted">No results.</div>}
      <div className="track-list">
        {results.map((t, i) => (
          <TrackRow key={t.id} track={t} list={results} index={i} onAdd={onAdd} />
        ))}
      </div>
      {!q && (
        <div className="search-empty">
          <h2>Search across two free sources</h2>
          <p>iTunes (30-second previews of mainstream music) and Audius (full-length independent tracks). Both blended into one feed.</p>
        </div>
      )}
    </div>
  )
}
