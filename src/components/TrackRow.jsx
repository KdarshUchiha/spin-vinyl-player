import { Heart, Play, Pause, Plus } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

export default function TrackRow({ track, list, index, onAdd }) {
  const { currentTrack, isPlaying, playTrack, togglePlay, isFavorite, toggleFavorite } = usePlayer()
  const isCurrent = currentTrack?.id === track.id
  const showingPause = isCurrent && isPlaying

  return (
    <div className={`track-row ${isCurrent ? 'track-row--current' : ''}`}>
      <div className="track-row-index">
        <span className="track-row-num">{index + 1}</span>
        <button
          className="track-row-play"
          onClick={() => (isCurrent ? togglePlay() : playTrack(track, list))}
          aria-label={showingPause ? 'Pause' : 'Play'}
        >
          {showingPause ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>
      <img className="track-row-art" src={track.artwork} alt="" loading="lazy" />
      <div className="track-row-meta">
        <div className="track-row-title">{track.title}</div>
        <div className="track-row-sub">{track.artist}{track.album ? ` · ${track.album}` : ''}</div>
      </div>
      <div className="track-row-source">{track.source === 'audius' ? 'FULL' : '0:30'}</div>
      <button
        className={`icon-btn ${isFavorite(track.id) ? 'icon-btn--active' : ''}`}
        onClick={() => toggleFavorite(track)}
        aria-label="Favorite"
      >
        <Heart size={18} fill={isFavorite(track.id) ? 'currentColor' : 'none'} />
      </button>
      {onAdd && (
        <button className="icon-btn" onClick={() => onAdd(track)} aria-label="Add to playlist">
          <Plus size={18} />
        </button>
      )}
    </div>
  )
}
