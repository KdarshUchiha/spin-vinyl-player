import { Heart, ListPlus, Pause, Play, Plus, Share2 } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { shareTrack, useToast } from './Toast'

export default function TrackRow({ track, list, index, onAdd }) {
  const { currentTrack, isPlaying, playTrack, togglePlay, isFavorite, toggleFavorite, addToQueue } = usePlayer()
  const toast = useToast()
  const isCurrent = currentTrack?.id === track.id
  const showingPause = isCurrent && isPlaying

  const handleShare = (e) => {
    e.stopPropagation()
    shareTrack(track, toast)
  }
  const handleQueue = (e) => {
    e.stopPropagation()
    addToQueue(track)
    toast.show('Added to queue')
  }

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
      <div className={`track-row-source track-row-source--${track.source}`}>
        {track.source === 'audius' ? 'FULL' : track.source === 'youtube' ? 'YT' : '0:30'}
      </div>
      <button className="icon-btn" onClick={handleQueue} aria-label="Add to queue" title="Add to queue">
        <ListPlus size={18} />
      </button>
      <button
        className={`icon-btn ${isFavorite(track.id) ? 'icon-btn--active' : ''}`}
        onClick={() => toggleFavorite(track)}
        aria-label="Favorite"
      >
        <Heart size={18} fill={isFavorite(track.id) ? 'currentColor' : 'none'} />
      </button>
      <button className="icon-btn" onClick={handleShare} aria-label="Share" title="Share">
        <Share2 size={18} />
      </button>
      {onAdd && (
        <button className="icon-btn" onClick={() => onAdd(track)} aria-label="Add to playlist" title="Add to playlist">
          <Plus size={18} />
        </button>
      )}
    </div>
  )
}
