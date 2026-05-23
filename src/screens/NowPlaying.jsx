import { useEffect, useState } from 'react'
import {
  ChevronDown, Disc3, Gauge, Heart, ListMusic, Mic2, Moon, Pause, Play,
  Repeat, Repeat1, Share2, Shuffle, SkipBack, SkipForward, Sliders, Volume2,
} from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import Vinyl from '../components/Vinyl'
import Visualizer from '../components/Visualizer'
import QueuePanel from '../components/QueuePanel'
import Lyrics from '../components/Lyrics'
import { shareTrack, useToast } from '../components/Toast'

function fmt(s) {
  if (!s || !isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]
const SLEEP_OPTIONS = [
  { label: 'Off', mins: 0 },
  { label: '5 min', mins: 5 },
  { label: '15 min', mins: 15 },
  { label: '30 min', mins: 30 },
  { label: '60 min', mins: 60 },
]
const EQ_OPTIONS = [
  { key: 'off', label: 'Off' },
  { key: 'bass', label: 'Bass Boost' },
  { key: 'vocal', label: 'Vocal' },
  { key: 'treble', label: 'Treble' },
  { key: 'lounge', label: 'Lounge' },
]

export default function NowPlaying({ onClose }) {
  const {
    currentTrack, isPlaying, progress, duration,
    togglePlay, playNext, playPrev, seek,
    volume, setVolume, shuffle, setShuffle, repeat, setRepeat,
    speed, setSpeed, sleepEndsAt, setSleepIn,
    eqPreset, setEqPreset,
    isFavorite, toggleFavorite,
  } = usePlayer()
  const toast = useToast()

  const [openMenu, setOpenMenu] = useState(null)
  const [queueOpen, setQueueOpen] = useState(false)
  const [view, setView] = useState('vinyl') // 'vinyl' | 'lyrics'
  const [vinylSize, setVinylSize] = useState(320)

  useEffect(() => {
    const calc = () => setVinylSize(Math.min(380, window.innerWidth - 80))
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  if (!currentTrack) return null

  const cycleRepeat = () => {
    setRepeat(repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off')
  }

  const sleepRemaining = sleepEndsAt ? Math.max(0, Math.ceil((sleepEndsAt - Date.now()) / 60000)) : null

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
            <div className="np-source">
              {currentTrack.source === 'audius' ? 'Audius · full track' : 'iTunes · 30s preview'}
            </div>
          </div>
          <div className="np-header-right">
            <button
              className="icon-btn"
              onClick={() => shareTrack(currentTrack, toast)}
              aria-label="Share"
              title="Share"
            >
              <Share2 size={20} />
            </button>
            <button
              className={`icon-btn ${isFavorite(currentTrack.id) ? 'icon-btn--active' : ''}`}
              onClick={() => toggleFavorite(currentTrack)}
              aria-label="Favorite"
            >
              <Heart size={22} fill={isFavorite(currentTrack.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
        </header>

        <div className="np-view-toggle">
          <button
            className={`np-view-btn ${view === 'vinyl' ? 'np-view-btn--active' : ''}`}
            onClick={() => setView('vinyl')}
          ><Disc3 size={14} /> Vinyl</button>
          <button
            className={`np-view-btn ${view === 'lyrics' ? 'np-view-btn--active' : ''}`}
            onClick={() => setView('lyrics')}
          ><Mic2 size={14} /> Lyrics</button>
        </div>

        {view === 'vinyl' ? (
          <div className="np-vinyl-wrap">
            <Vinyl size={vinylSize} />
          </div>
        ) : (
          <div className="np-lyrics-wrap">
            <Lyrics />
          </div>
        )}

        <div className="np-meta">
          <div className="np-title">{currentTrack.title}</div>
          <div className="np-artist">{currentTrack.artist}</div>
        </div>

        <Visualizer />

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
            <span>-{fmt((duration || 0) - progress)}</span>
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

        <div className="np-extras">
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

          <div className="np-extra-buttons">
            <Pop
              label={`${speed}x`}
              icon={<Gauge size={16} />}
              active={speed !== 1}
              open={openMenu === 'speed'}
              onClick={() => setOpenMenu(openMenu === 'speed' ? null : 'speed')}
            >
              {SPEEDS.map((s) => (
                <button key={s} className={`pop-item ${speed === s ? 'pop-item--active' : ''}`}
                  onClick={() => { setSpeed(s); setOpenMenu(null) }}>{s}x</button>
              ))}
            </Pop>

            <Pop
              label={EQ_OPTIONS.find((o) => o.key === eqPreset)?.label || 'EQ'}
              icon={<Sliders size={16} />}
              active={eqPreset !== 'off'}
              open={openMenu === 'eq'}
              onClick={() => setOpenMenu(openMenu === 'eq' ? null : 'eq')}
            >
              {EQ_OPTIONS.map((o) => (
                <button key={o.key} className={`pop-item ${eqPreset === o.key ? 'pop-item--active' : ''}`}
                  onClick={() => { setEqPreset(o.key); setOpenMenu(null) }}>{o.label}</button>
              ))}
            </Pop>

            <Pop
              label={sleepRemaining ? `${sleepRemaining}m` : 'Sleep'}
              icon={<Moon size={16} />}
              active={!!sleepEndsAt}
              open={openMenu === 'sleep'}
              onClick={() => setOpenMenu(openMenu === 'sleep' ? null : 'sleep')}
            >
              {SLEEP_OPTIONS.map((o) => (
                <button key={o.label} className={`pop-item ${(o.mins === 0 && !sleepEndsAt) ? 'pop-item--active' : ''}`}
                  onClick={() => { setSleepIn(o.mins > 0 ? o.mins : 0); setOpenMenu(null) }}>{o.label}</button>
              ))}
            </Pop>

            <button className="np-extra-btn" onClick={() => setQueueOpen(true)} aria-label="Queue">
              <ListMusic size={16} />
              <span>Queue</span>
            </button>
          </div>
        </div>
      </div>

      <QueuePanel open={queueOpen} onClose={() => setQueueOpen(false)} />
    </div>
  )
}

function Pop({ label, icon, active, open, onClick, children }) {
  return (
    <div className="pop-wrap">
      <button className={`np-extra-btn ${active ? 'np-extra-btn--active' : ''}`} onClick={onClick}>
        {icon}<span>{label}</span>
      </button>
      {open && <div className="pop">{children}</div>}
    </div>
  )
}
