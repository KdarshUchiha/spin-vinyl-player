import { usePlayer } from '../context/PlayerContext'

export default function Vinyl({ size = 320 }) {
  const { currentTrack, isPlaying } = usePlayer()
  const art = currentTrack?.artwork

  return (
    <div className="vinyl-stage" style={{ width: size, height: size }}>
      <div className={`vinyl ${isPlaying ? 'spin' : ''}`}>
        <div className="vinyl-grooves" />
        <div className="vinyl-grooves vinyl-grooves--2" />
        <div className="vinyl-grooves vinyl-grooves--3" />
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
