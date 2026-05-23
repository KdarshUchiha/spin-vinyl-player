import { useEffect, useState } from 'react'
import { Home as HomeIcon, Library, Search as SearchIcon, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { PlayerProvider, usePlayer } from './context/PlayerContext'
import { useArtworkPalette } from './hooks/useArtworkPalette'
import Home from './screens/Home'
import Search from './screens/Search'
import LibraryScreen from './screens/Library'
import NowPlaying from './screens/NowPlaying'
import MiniPlayer from './components/MiniPlayer'
import './app.css'

function Shell() {
  const [route, setRoute] = useState('home')
  const [npOpen, setNpOpen] = useState(false)
  const [addingTrack, setAddingTrack] = useState(null)
  const { playlists, addToPlaylist, currentTrack } = usePlayer()
  const palette = useArtworkPalette(currentTrack?.artwork)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--theme-primary', palette.primary)
    root.style.setProperty('--theme-secondary', palette.secondary)
    root.style.setProperty('--theme-dark', palette.dark)
  }, [palette])

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
        </nav>
        <div className="sidebar-footer">
          <small>Free preview · iTunes & Audius</small>
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
      </nav>

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
    <PlayerProvider>
      <Shell />
    </PlayerProvider>
  )
}
