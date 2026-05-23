import { useEffect } from 'react'

export function useMediaSession({ track, isPlaying, progress, duration, onPlay, onPause, onNext, onPrev, onSeek }) {
  useEffect(() => {
    if (!('mediaSession' in navigator) || !track) return
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: track.title || '',
        artist: track.artist || '',
        album: track.album || '',
        artwork: track.artwork ? [
          { src: track.artwork, sizes: '96x96', type: 'image/jpeg' },
          { src: track.artwork, sizes: '256x256', type: 'image/jpeg' },
          { src: track.artwork, sizes: '512x512', type: 'image/jpeg' },
        ] : [],
      })
    } catch {}
  }, [track])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'
  }, [isPlaying])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    const set = (action, handler) => {
      try { navigator.mediaSession.setActionHandler(action, handler) } catch {}
    }
    set('play', () => onPlay?.())
    set('pause', () => onPause?.())
    set('previoustrack', () => onPrev?.())
    set('nexttrack', () => onNext?.())
    set('seekto', (d) => { if (typeof d.seekTime === 'number') onSeek?.(d.seekTime) })
    set('seekbackward', (d) => onSeek?.(Math.max(0, progress - (d.seekOffset || 10))))
    set('seekforward', (d) => onSeek?.(Math.min(duration, progress + (d.seekOffset || 10))))
    return () => {
      ;['play', 'pause', 'previoustrack', 'nexttrack', 'seekto', 'seekbackward', 'seekforward'].forEach((a) => set(a, null))
    }
  }, [onPlay, onPause, onNext, onPrev, onSeek, progress, duration])

  useEffect(() => {
    if (!('mediaSession' in navigator) || !duration || !isFinite(duration)) return
    try {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate: 1,
        position: Math.min(progress, duration),
      })
    } catch {}
  }, [progress, duration])
}
