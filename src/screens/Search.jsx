import { useEffect, useMemo, useRef, useState } from 'react'
import { Search as SearchIcon, X } from 'lucide-react'
import { searchAll } from '../api/music'
import TrackRow from '../components/TrackRow'
import SourceFilter from '../components/SourceFilter'
import EmptyState from '../components/EmptyState'
import { applySourceFilter, usePlayer } from '../context/PlayerContext'

const SUGGESTIONS = ['The Weeknd', 'Tame Impala', 'lofi study', 'Bad Bunny', 'Dua Lipa', 'house mix', 'Adele']
const PAGE_SIZE = 20

export default function Search({ onAdd }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const sentinelRef = useRef(null)
  const seenIds = useRef(new Set())
  const { sourceFilter } = usePlayer()

  // initial search (debounced)
  useEffect(() => {
    if (!q.trim()) {
      setResults([]); setHasMore(false); setOffset(0); seenIds.current = new Set()
      return
    }
    let alive = true
    setLoading(true)
    seenIds.current = new Set()
    const t = setTimeout(() => {
      searchAll(q, 0).then((r) => {
        if (!alive) return
        r.forEach((t) => seenIds.current.add(t.id))
        setResults(r)
        setOffset(r.filter((t) => t.source === 'itunes').length)
        setHasMore(r.length >= PAGE_SIZE)
        setLoading(false)
      })
    }, 300)
    return () => { alive = false; clearTimeout(t) }
  }, [q])

  // pagination via IntersectionObserver
  useEffect(() => {
    if (!hasMore || loading || loadingMore || !q.trim()) return
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoadingMore(true)
        searchAll(q, offset).then((more) => {
          const fresh = more.filter((t) => !seenIds.current.has(t.id))
          fresh.forEach((t) => seenIds.current.add(t.id))
          setResults((prev) => [...prev, ...fresh])
          setOffset((prev) => prev + fresh.filter((t) => t.source === 'itunes').length)
          setHasMore(fresh.length > 0)
          setLoadingMore(false)
        })
      }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, loading, loadingMore, q, offset])

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

      {hasMore && q && !loading && (
        <div ref={sentinelRef} className="infinite-sentinel">
          {loadingMore ? 'Loading more…' : ''}
        </div>
      )}

      {!q && (
        <EmptyState
          icon="search"
          title="Search across two free sources"
          message="iTunes for 30-second previews of mainstream music, Audius for full-length independent tracks. Pick your preference with the filter above."
          action={
            <div className="suggestion-row">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="chip" onClick={() => setQ(s)}>{s}</button>
              ))}
            </div>
          }
        />
      )}
    </div>
  )
}
