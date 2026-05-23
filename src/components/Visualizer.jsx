import { usePlayer } from '../context/PlayerContext'

export default function Visualizer({ bars = 24 }) {
  const { isPlaying } = usePlayer()
  return (
    <div className={`viz ${isPlaying ? 'viz--play' : ''}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="viz-bar"
          style={{
            animationDelay: `${(i % 6) * 0.08}s`,
            height: `${30 + ((i * 13) % 60)}%`,
          }}
        />
      ))}
    </div>
  )
}
