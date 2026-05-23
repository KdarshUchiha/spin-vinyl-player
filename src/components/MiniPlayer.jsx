import { Pause, Play, SkipForward } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

export default function MiniPlayer({ onExpand }) {
  const { currentTrack, isPlaying, togglePlay, playNext, progress, duration } = usePlayer()
  if (!currentTrack) return null
  const pct = duration ? (progress / duration) * 100 : 0

  return (
    <div className="mini">
      <div className="mini-progress" style={{ width: `${pct}%` }} />
      <button className="mini-main" onClick={onExpand}>
        <div className={`mini-art ${isPlaying ? 'spin-slow' : ''}`}>
          <img src={currentTrack.artwork} alt="" />
        </div>
        <div className="mini-meta">
          <div className="mini-title">{currentTrack.title}</div>
          <div className="mini-artist">{currentTrack.artist}</div>
        </div>
      </button>
      <div className="mini-controls">
        <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
        </button>
        <button onClick={playNext} aria-label="Next">
          <SkipForward size={20} fill="currentColor" />
        </button>
      </div>
    </div>
  )
}
