import { useEffect, useMemo, useState } from 'react'
import { Home as HomeIcon, Info, Library, Search as SearchIcon, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { PlayerProvider, usePlayer } from './context/PlayerContext'
import { useArtworkPalette } from './hooks/useArtworkPalette'
import { useMediaSession } from './hooks/useMediaSession'
import { useHotkeys } from './hooks/useHotkeys'
import { ToastProvider } from './components/Toast'
import OnboardingTour from './components/OnboardingTour'
import Home from './screens/Home'
import Search from './screens/Search'
import LibraryScreen from './screens/Library'
import About from './screens/About'
import NowPlaying from './screens/NowPlaying'
import MiniPlayer from './components/MiniPlayer'
import './app.css'

function Shell() {
  const [route, setRoute] = useState('home')
  const [npOpen, setNpOpen] = useState(false)
  const [addingTrack, setAddingTrack] = useState(null)
  const player = usePlayer()
  const { playlists, addToPlaylist, currentTrack, isPlaying, progress, duration,
    togglePlay, playNext, playPrev, seek, toggleFavorite, setShuffle, shuffle, setRepeat, repeat, setVolume, volume } = player
  const palette = useArtworkPalette(currentTrack?.artwork)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--theme-primary', palette.primary)
    root.style.setProperty('--theme-secondary', palette.secondary)
    root.style.setProperty('--theme-dark', palette.dark)
  }, [palette])

  useMediaSession({
    track: currentTrack,
    isPlaying, progress, duration,
    onPlay: () => togglePlay(),
    onPause: () => togglePlay(),
    onNext: playNext,
    onPrev: playPrev,
    onSeek: seek,
  })

  const hotkeys = useMemo(() => ({
    ' ': () => togglePlay(),
    ArrowLeft: () => seek(Math.max(0, progress - 5)),
    ArrowRight: () => seek(Math.min(duration || progress + 5, progress + 5)),
    ArrowUp: () => setVolume(Math.min(1, volume + 0.05)),
    ArrowDown: () => setVolume(Math.max(0, volume - 0.05)),
    j: () => playPrev(),
    k: () => playNext(),
    f: () => currentTrack && toggleFavorite(currentTrack),
    s: () => setShuffle(!shuffle),
    r: () => setRepeat(repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off'),
    n: () => setNpOpen((v) => !v),
    '/': () => setRoute('search'),
    Escape: () => setNpOpen(false),
    escape: () => setNpOpen(false),
  }), [togglePlay, seek, progress, duration, volume, setVolume, playPrev, playNext, currentTrack, toggleFavorite, shuffle, setShuffle, repeat, setRepeat])
  useHotkeys(hotkeys)

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-disc" />
          <div className="brand-name">Spin</div>
        </div>
        <nav className="nav">
          <NavBtn icon={<HomeIcon size={20} />} active={route === 'home'} onClick={() => setRoute('home')}>Home</NavBtn>
          <NavBtn icon={<SearchIcon size={20} />} active={route === 'search'} onClick={() => setRoute('search')}>Search</NavBtn>
          <NavBtn icon={<Library size={20} />} active={route === 'library'} onClick={() => setRoute('library')}>Library</NavBtn>
          <NavBtn icon={<Info size={20} />} active={route === 'about'} onClick={() => setRoute('about')}>About</NavBtn>
        </nav>
        <div className="sidebar-footer">
          <small>Built by <a href="https://github.com/KdarshUchiha" target="_blank" rel="noopener noreferrer">@KdarshUchiha</a></small>
        </div>
      </aside>

      <main className="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          >
            {route === 'home' && <Home />}
            {route === 'search' && <Search onAdd={(t) => setAddingTrack(t)} />}
            {route === 'library' && <LibraryScreen />}
            {route === 'about' && <About />}
          </motion.div>
        </AnimatePresence>
      </main>

      <MiniPlayer onExpand={() => setNpOpen(true)} />

      <AnimatePresence>
        {npOpen && (
          <motion.div
            key="np"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
          >
            <NowPlaying onClose={() => setNpOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="bottom-nav">
        <BottomBtn icon={<HomeIcon size={22} />} active={route === 'home'} onClick={() => setRoute('home')}>Home</BottomBtn>
        <BottomBtn icon={<SearchIcon size={22} />} active={route === 'search'} onClick={() => setRoute('search')}>Search</BottomBtn>
        <BottomBtn icon={<Library size={22} />} active={route === 'library'} onClick={() => setRoute('library')}>Library</BottomBtn>
        <BottomBtn icon={<Info size={22} />} active={route === 'about'} onClick={() => setRoute('about')}>About</BottomBtn>
      </nav>

      <OnboardingTour />

      {addingTrack && (
        <div className="modal-bg" onClick={() => setAddingTrack(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add to playlist</h3>
              <button className="icon-btn" onClick={() => setAddingTrack(null)}><X size={18} /></button>
            </div>
            {playlists.length === 0 && <div className="muted">Create a playlist in Library first.</div>}
            <div className="modal-list">
              {playlists.map((p) => (
                <button key={p.id} className="modal-item" onClick={() => { addToPlaylist(p.id, addingTrack); setAddingTrack(null) }}>
                  <span>{p.name}</span>
                  <span className="muted">{p.tracks.length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function NavBtn({ icon, active, onClick, children }) {
  return (
    <button className={`nav-btn ${active ? 'nav-btn--active' : ''}`} onClick={onClick}>
      {icon}<span>{children}</span>
    </button>
  )
}
function BottomBtn({ icon, active, onClick, children }) {
  return (
    <button className={`bnav-btn ${active ? 'bnav-btn--active' : ''}`} onClick={onClick}>
      {icon}<span>{children}</span>
    </button>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <PlayerProvider>
        <Shell />
      </PlayerProvider>
    </ToastProvider>
  )
}
