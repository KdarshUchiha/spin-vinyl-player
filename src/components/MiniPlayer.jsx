import { useState } from 'react'
import { ListMusic, Pause, Play, SkipForward } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import QueuePanel from './QueuePanel'

export default function MiniPlayer({ onExpand }) {
  const { currentTrack, isPlaying, togglePlay, playNext, progress, duration, queue } = usePlayer()
  const [queueOpen, setQueueOpen] = useState(false)
  if (!currentTrack) return null
  const pct = duration ? (progress / duration) * 100 : 0

  return (
    <>
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
          <span className={`mini-badge mini-badge--${currentTrack.source}`}>
            {currentTrack.source === 'audius' ? 'FULL' : '0:30'}
          </span>
        </button>
        <div className="mini-controls">
          <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
          </button>
          <button onClick={playNext} aria-label="Next">
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button
            className="mini-queue-btn"
            onClick={() => setQueueOpen(true)}
            aria-label="Queue"
            title="Queue"
          >
            <ListMusic size={20} />
            {queue.length > 1 && <span className="mini-queue-dot">{queue.length}</span>}
          </button>
        </div>
      </div>
      <QueuePanel open={queueOpen} onClose={() => setQueueOpen(false)} />
    </>
  )
}
