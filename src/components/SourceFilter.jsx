import { Disc3, Globe, Timer, Video } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

const OPTIONS = [
  { key: 'all',     label: 'All',      icon: Globe,   hint: 'Mix all sources' },
  { key: 'preview', label: 'Previews', icon: Timer,   hint: '30-second iTunes clips' },
  { key: 'full',    label: 'Audius',   icon: Disc3,   hint: 'Full Audius tracks' },
  { key: 'youtube', label: 'YouTube',  icon: Video,   hint: 'Full YouTube videos' },
]

export default function SourceFilter({ size = 'md' }) {
  const { sourceFilter, setSourceFilter } = usePlayer()
  return (
    <div className={`source-filter source-filter--${size}`} role="tablist">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon
        const active = sourceFilter === opt.key
        return (
          <button
            key={opt.key}
            role="tab"
            aria-selected={active}
            className={`source-opt ${active ? 'source-opt--active' : ''}`}
            onClick={() => setSourceFilter(opt.key)}
            title={opt.hint}
          >
            <Icon size={size === 'sm' ? 14 : 16} />
            <span>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
