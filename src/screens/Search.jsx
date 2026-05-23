import { useEffect, useMemo, useState } from 'react'
import { Search as SearchIcon, X } from 'lucide-react'
import { searchAll } from '../api/music'
import TrackRow from '../components/TrackRow'
import SourceFilter from '../components/SourceFilter'
import { applySourceFilter, usePlayer } from '../context/PlayerContext'

const SUGGESTIONS = ['The Weeknd', 'Tame Impala', 'lofi study', 'Bad Bunny', 'Dua Lipa', 'house mix', 'Adele']

export default function Search({ onAdd }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const { sourceFilter } = usePlayer()

  useEffect(() => {
    if (!q.trim()) { setResults([]); return }
    let alive = true
    setLoading(true)
    const t = setTimeout(() => {
      searchAll(q).then((r) => { if (alive) { setResults(r); setLoading(false) } })
    }, 300)
    return () => { alive = false; clearTimeout(t) }
  }, [q])

  const filtered = useMemo(() => applySourceFilter(results, sourceFilter), [results, sourceFilter])
  const previewCount = results.filter((r) => r.source === 'itunes').length
  const fullCount = results.filter((r) => r.source === 'audius').length

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
        {q && (
          <button className="icon-btn" onClick={() => setQ('')} aria-label="Clear">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="search-tools">
        <SourceFilter />
        {results.length > 0 && (
          <div className="search-counts">
            <span><b>{previewCount}</b> previews · <b>{fullCount}</b> full tracks</span>
          </div>
        )}
      </div>

      {loading && <div className="muted">Searching…</div>}
      {!loading && q && filtered.length === 0 && (
        <div className="muted">No results match your source filter.</div>
      )}

      <div className="track-list">
        {filtered.map((t, i) => (
          <TrackRow key={t.id} track={t} list={filtered} index={i} onAdd={onAdd} />
        ))}
      </div>

      {!q && (
        <div className="search-empty">
          <h2>Search across two free sources</h2>
          <p>iTunes (30-second previews of mainstream music) and Audius (full-length independent tracks). Pick your preference with the filter above.</p>
          <div className="suggestion-row">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chip" onClick={() => setQ(s)}>{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
