import { ChevronDown, Heart, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import Vinyl from '../components/Vinyl'

function fmt(s) {
  if (!s || !isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function NowPlaying({ onClose }) {
  const {
    currentTrack, isPlaying, progress, duration,
    togglePlay, playNext, playPrev, seek,
    volume, setVolume, shuffle, setShuffle, repeat, setRepeat,
    isFavorite, toggleFavorite,
  } = usePlayer()

  if (!currentTrack) return null

  const cycleRepeat = () => {
    setRepeat(repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off')
  }

  return (
    <div className="now-playing" style={{ '--art': `url(${currentTrack.artwork})` }}>
      <div className="np-bg" />
      <div className="np-content">
        <header className="np-header">
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <ChevronDown size={26} />
          </button>
          <div className="np-header-meta">
            <div className="np-eyebrow">Now playing</div>
            <div className="np-source">{currentTrack.source === 'audius' ? 'Audius · full track' : 'iTunes · 30s preview'}</div>
          </div>
          <button
            className={`icon-btn ${isFavorite(currentTrack.id) ? 'icon-btn--active' : ''}`}
            onClick={() => toggleFavorite(currentTrack)}
            aria-label="Favorite"
          >
            <Heart size={22} fill={isFavorite(currentTrack.id) ? 'currentColor' : 'none'} />
          </button>
        </header>

        <div className="np-vinyl-wrap">
          <Vinyl size={Math.min(420, typeof window !== 'undefined' ? window.innerWidth - 80 : 320)} />
        </div>

        <div className="np-meta">
          <div className="np-title">{currentTrack.title}</div>
          <div className="np-artist">{currentTrack.artist}</div>
        </div>

        <div className="np-seek">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={progress}
            onChange={(e) => seek(parseFloat(e.target.value))}
          />
          <div className="np-times">
            <span>{fmt(progress)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        <div className="np-controls">
          <button
            className={`icon-btn ${shuffle ? 'icon-btn--active' : ''}`}
            onClick={() => setShuffle(!shuffle)}
            aria-label="Shuffle"
          ><Shuffle size={20} /></button>
          <button className="icon-btn" onClick={playPrev} aria-label="Previous">
            <SkipBack size={26} fill="currentColor" />
          </button>
          <button className="np-play" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
          </button>
          <button className="icon-btn" onClick={playNext} aria-label="Next">
            <SkipForward size={26} fill="currentColor" />
          </button>
          <button
            className={`icon-btn ${repeat !== 'off' ? 'icon-btn--active' : ''}`}
            onClick={cycleRepeat}
            aria-label="Repeat"
          >
            {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>

        <div className="np-volume">
          <Volume2 size={18} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}
