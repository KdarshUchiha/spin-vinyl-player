import { Code2, Disc3, Globe, Heart, Keyboard, Music, Sparkles, Zap } from 'lucide-react'

const TECH = [
  { name: 'React 19',     note: 'UI + hooks',                tag: 'frontend' },
  { name: 'Vite',         note: 'Bundler + dev server',      tag: 'frontend' },
  { name: 'Framer Motion',note: 'Page + element animation',  tag: 'frontend' },
  { name: 'Web Audio API',note: 'AnalyserNode + EQ filters', tag: 'audio'    },
  { name: 'Media Session',note: 'Lock-screen controls',      tag: 'audio'    },
  { name: 'iTunes Search',note: '30s previews, no auth',     tag: 'data'     },
  { name: 'Audius',       note: 'Full streams, no auth',     tag: 'data'     },
  { name: 'LRCLib',       note: 'Synced lyrics',             tag: 'data'     },
  { name: 'Service Worker',note:'PWA + offline shell',       tag: 'platform' },
  { name: 'GitHub Actions',note:'Auto-deploy to Pages',      tag: 'platform' },
]

const HIGHLIGHTS = [
  { icon: <Sparkles size={18} />, title: 'Album-art-aware theming',
    desc: 'A custom canvas-based color extractor pulls the dominant tones from each cover and re-tints the entire UI in real time.' },
  { icon: <Zap size={18} />,      title: 'Real audio visualizer',
    desc: 'AnalyserNode reads live FFT data; 32 log-scaled bars animate at 60fps via requestAnimationFrame.' },
  { icon: <Music size={18} />,    title: 'Synced lyrics',
    desc: 'LRCLib for timestamps, with a search-and-binary-find scroll that follows playback line by line.' },
  { icon: <Keyboard size={18} />, title: 'Full keyboard + media keys',
    desc: 'Space, J/K, F, S, R, /, N, Esc — plus OS-level Bluetooth and lock-screen controls via Media Session API.' },
]

const NEXT = [
  'OAuth-gated Spotify Web API for full mainstream playback',
  'Drag-reorder for playlists (already done for queue)',
  'Listening-history charts (top tracks/artists per week)',
  'Cross-device sync via a tiny Cloudflare Workers backend',
  'Crossfade between tracks (Web Audio gain ramping)',
]

export default function About() {
  return (
    <div className="screen about">
      <header className="about-hero">
        <div className="about-hero-disc">
          <Disc3 size={48} />
        </div>
        <h1>Spin</h1>
        <p className="about-tag">A vinyl-themed music player. Built as a portfolio piece, runs anywhere a browser does.</p>
        <div className="about-hero-actions">
          <a className="btn-primary about-btn" href="https://github.com/KdarshUchiha/spin-vinyl-player" target="_blank" rel="noopener noreferrer">
            <Code2 size={16} /> Source on GitHub
          </a>
          <a className="about-btn about-btn--ghost" href="https://kdarshuchiha.github.io/spin-vinyl-player/" target="_blank" rel="noopener noreferrer">
            <Globe size={16} /> Live site
          </a>
        </div>
      </header>

      <section className="about-section">
        <h2>What makes it interesting</h2>
        <div className="highlights">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="highlight">
              <div className="highlight-icon">{h.icon}</div>
              <div>
                <div className="highlight-title">{h.title}</div>
                <div className="highlight-desc">{h.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>Tech stack</h2>
        <div className="tech-grid">
          {TECH.map((t) => (
            <div key={t.name} className={`tech tech--${t.tag}`}>
              <div className="tech-name">{t.name}</div>
              <div className="tech-note">{t.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>Keyboard shortcuts</h2>
        <div className="keys-grid">
          <Key keys="Space" desc="Play / pause" />
          <Key keys="←  →"  desc="Seek 5s" />
          <Key keys="↑  ↓"  desc="Volume" />
          <Key keys="J  K"  desc="Previous / next track" />
          <Key keys="F"     desc="Favorite current track" />
          <Key keys="S"     desc="Toggle shuffle" />
          <Key keys="R"     desc="Cycle repeat" />
          <Key keys="N"     desc="Open / close Now Playing" />
          <Key keys="/"     desc="Focus search" />
          <Key keys="Esc"   desc="Close overlay" />
        </div>
      </section>

      <section className="about-section">
        <h2>What I'd build next</h2>
        <ul className="next-list">
          {NEXT.map((n) => <li key={n}>{n}</li>)}
        </ul>
      </section>

      <footer className="about-footer">
        <p>
          Made with <Heart size={14} fill="currentColor" style={{ color: 'var(--theme-primary)', verticalAlign: 'middle' }} /> by{' '}
          <a href="https://github.com/KdarshUchiha" target="_blank" rel="noopener noreferrer">@KdarshUchiha</a>.
        </p>
        <p className="about-fineprint">
          Music data from iTunes Search and Audius. Lyrics from LRCLib. No auth, no tracking, no cookies. localStorage only.
        </p>
      </footer>
    </div>
  )
}

function Key({ keys, desc }) {
  return (
    <div className="key-row">
      <kbd>{keys}</kbd>
      <span>{desc}</span>
    </div>
  )
}
