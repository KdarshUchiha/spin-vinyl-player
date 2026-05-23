import { useState } from 'react'
import { Heart, ListMusic, Plus, Trash2, X } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import TrackRow from '../components/TrackRow'

export default function Library() {
  const { favorites, playlists, createPlaylist, deletePlaylist, removeFromPlaylist } = usePlayer()
  const [tab, setTab] = useState('favorites')
  const [openPl, setOpenPl] = useState(null)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  if (openPl) {
    const pl = playlists.find((p) => p.id === openPl)
    if (!pl) { setOpenPl(null); return null }
    return (
      <div className="screen">
        <button className="back-btn" onClick={() => setOpenPl(null)}>← Back</button>
        <h1 className="screen-title">{pl.name}</h1>
        <div className="muted">{pl.tracks.length} {pl.tracks.length === 1 ? 'track' : 'tracks'}</div>
        <div className="track-list" style={{ marginTop: 16 }}>
          {pl.tracks.map((t, i) => (
            <div key={t.id} className="row-with-action">
              <TrackRow track={t} list={pl.tracks} index={i} />
              <button className="icon-btn" onClick={() => removeFromPlaylist(pl.id, t.id)} aria-label="Remove">
                <X size={18} />
              </button>
            </div>
          ))}
          {pl.tracks.length === 0 && <div className="muted">Add tracks from Search.</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <h1 className="screen-title">Your library</h1>
      <div className="tabs">
        <button className={`tab ${tab === 'favorites' ? 'tab--active' : ''}`} onClick={() => setTab('favorites')}>
          <Heart size={16} /> Favorites ({favorites.length})
        </button>
        <button className={`tab ${tab === 'playlists' ? 'tab--active' : ''}`} onClick={() => setTab('playlists')}>
          <ListMusic size={16} /> Playlists ({playlists.length})
        </button>
      </div>

      {tab === 'favorites' && (
        <div className="track-list">
          {favorites.map((t, i) => <TrackRow key={t.id} track={t} list={favorites} index={i} />)}
          {favorites.length === 0 && <div className="muted">Tap the heart on any track to save it here.</div>}
        </div>
      )}

      {tab === 'playlists' && (
        <div className="playlists-grid">
          <button className="playlist-card playlist-card--new" onClick={() => setCreating(true)}>
            <Plus size={32} />
            <span>New playlist</span>
          </button>
          {playlists.map((pl) => (
            <div key={pl.id} className="playlist-card" onClick={() => setOpenPl(pl.id)}>
              <div className="playlist-art">
                {pl.tracks.slice(0, 4).map((t, i) => (
                  <img key={i} src={t.artwork} alt="" />
                ))}
                {pl.tracks.length === 0 && <div className="playlist-empty">♪</div>}
              </div>
              <div className="playlist-name">{pl.name}</div>
              <div className="playlist-count">{pl.tracks.length} tracks</div>
              <button
                className="playlist-del"
                onClick={(e) => { e.stopPropagation(); deletePlaylist(pl.id) }}
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <div className="modal-bg" onClick={() => setCreating(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>New playlist</h3>
            <input
              autoFocus
              placeholder="Playlist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  createPlaylist(name.trim()); setName(''); setCreating(false)
                }
              }}
            />
            <div className="modal-actions">
              <button onClick={() => setCreating(false)}>Cancel</button>
              <button
                className="btn-primary"
                disabled={!name.trim()}
                onClick={() => { createPlaylist(name.trim()); setName(''); setCreating(false) }}
              >Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
