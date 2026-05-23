import { usePlayer } from '../context/PlayerContext'
import { useArtworkPalette } from '../hooks/useArtworkPalette'

export default function Vinyl({ size = 320 }) {
  const { currentTrack, isPlaying } = usePlayer()
  const palette = useArtworkPalette(currentTrack?.artwork)
  const art = currentTrack?.artwork

  const style = {
    width: size,
    height: size,
    '--vinyl-primary': palette.primary,
    '--vinyl-secondary': palette.secondary,
  }

  return (
    <div className="vinyl-stage" style={style}>
      <div className={`vinyl ${isPlaying ? 'spin' : ''}`}>
        <div className="vinyl-grooves" />
        <div className="vinyl-grooves vinyl-grooves--2" />
        <div className="vinyl-grooves vinyl-grooves--3" />
        <div className="vinyl-tint" />
        <div className="vinyl-shine" />
        <div className="vinyl-label">
          {art ? (
            <img src={art} alt="" draggable={false} />
          ) : (
            <div className="vinyl-label-empty">
              <span></span>
            </div>
          )}
          <div className="vinyl-hole" />
        </div>
      </div>
      <div className={`tonearm ${isPlaying ? 'tonearm--down' : ''}`}>
        <div className="tonearm-base" />
        <div className="tonearm-arm" />
        <div className="tonearm-head" />
      </div>
    </div>
  )
}
