import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'

const PlayerContext = createContext(null)

const STORAGE_KEYS = {
  favorites: 'vp_favorites',
  playlists: 'vp_playlists',
  recent: 'vp_recent',
  volume: 'vp_volume',
}

function loadJSON(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export function PlayerProvider({ children }) {
  const audioRef = useRef(null)
  if (!audioRef.current && typeof Audio !== 'undefined') {
    audioRef.current = new Audio()
    audioRef.current.preload = 'metadata'
  }

  const [currentTrack, setCurrentTrack] = useState(null)
  const [queue, setQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(() => loadJSON(STORAGE_KEYS.volume, 0.8))
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState('off') // off | all | one
  const [favorites, setFavorites] = useState(() => loadJSON(STORAGE_KEYS.favorites, []))
  const [playlists, setPlaylists] = useState(() => loadJSON(STORAGE_KEYS.playlists, []))
  const [recent, setRecent] = useState(() => loadJSON(STORAGE_KEYS.recent, []))

  // persist
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites)) }, [favorites])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.playlists, JSON.stringify(playlists)) }, [playlists])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(recent)) }, [recent])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.volume, JSON.stringify(volume)) }, [volume])

  // audio element wiring
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress(audio.currentTime)
    const onMeta = () => setDuration(audio.duration || 0)
    const onEnd = () => handleEnded()
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  })

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const playTrack = useCallback((track, list = null) => {
    if (!track) return
    const audio = audioRef.current
    if (!audio) return
    if (list) {
      setQueue(list)
      setQueueIndex(list.findIndex((t) => t.id === track.id))
    } else {
      setQueue([track])
      setQueueIndex(0)
    }
    setCurrentTrack(track)
    audio.src = track.preview
    audio.play().catch(() => {})
    setRecent((prev) => [track, ...prev.filter((t) => t.id !== track.id)].slice(0, 30))
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }, [currentTrack])

  const seek = useCallback((seconds) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = seconds
    setProgress(seconds)
  }, [])

  const playNext = useCallback(() => {
    if (queue.length === 0) return
    let nextIdx
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length)
    } else {
      nextIdx = queueIndex + 1
      if (nextIdx >= queue.length) {
        if (repeat === 'all') nextIdx = 0
        else { setIsPlaying(false); return }
      }
    }
    const next = queue[nextIdx]
    setQueueIndex(nextIdx)
    setCurrentTrack(next)
    const audio = audioRef.current
    if (audio && next) {
      audio.src = next.preview
      audio.play().catch(() => {})
      setRecent((prev) => [next, ...prev.filter((t) => t.id !== next.id)].slice(0, 30))
    }
  }, [queue, queueIndex, shuffle, repeat])

  const playPrev = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.currentTime > 3) { audio.currentTime = 0; return }
    if (queueIndex <= 0) { audio.currentTime = 0; return }
    const idx = queueIndex - 1
    const prev = queue[idx]
    setQueueIndex(idx)
    setCurrentTrack(prev)
    audio.src = prev.preview
    audio.play().catch(() => {})
  }, [queue, queueIndex])

  const handleEnded = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (repeat === 'one') {
      audio.currentTime = 0
      audio.play().catch(() => {})
      return
    }
    playNext()
  }, [repeat, playNext])

  const toggleFavorite = useCallback((track) => {
    setFavorites((prev) =>
      prev.find((t) => t.id === track.id)
        ? prev.filter((t) => t.id !== track.id)
        : [track, ...prev]
    )
  }, [])

  const isFavorite = useCallback((id) => favorites.some((t) => t.id === id), [favorites])

  const createPlaylist = useCallback((name) => {
    const pl = { id: `pl-${Date.now()}`, name, tracks: [] }
    setPlaylists((prev) => [pl, ...prev])
    return pl
  }, [])

  const deletePlaylist = useCallback((id) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const addToPlaylist = useCallback((playlistId, track) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId && !p.tracks.find((t) => t.id === track.id)
          ? { ...p, tracks: [...p.tracks, track] }
          : p
      )
    )
  }, [])

  const removeFromPlaylist = useCallback((playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) }
          : p
      )
    )
  }, [])

  const value = useMemo(() => ({
    currentTrack, queue, queueIndex, isPlaying, progress, duration, volume,
    shuffle, repeat, favorites, playlists, recent,
    playTrack, togglePlay, seek, playNext, playPrev,
    setVolume, setShuffle, setRepeat,
    toggleFavorite, isFavorite,
    createPlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist,
  }), [
    currentTrack, queue, queueIndex, isPlaying, progress, duration, volume,
    shuffle, repeat, favorites, playlists, recent,
    playTrack, togglePlay, seek, playNext, playPrev,
    toggleFavorite, isFavorite,
    createPlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist,
  ])

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider')
  return ctx
}
