import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'

const PlayerContext = createContext(null)

const STORAGE_KEYS = {
  favorites: 'vp_favorites',
  playlists: 'vp_playlists',
  recent: 'vp_recent',
  volume: 'vp_volume',
  source: 'vp_source',
  plays: 'vp_plays',
  eq: 'vp_eq',
}

const EQ_PRESETS = {
  off:    [0, 0, 0, 0, 0],
  bass:   [8, 5, 0, 0, 0],
  vocal:  [-2, 0, 4, 3, -1],
  treble: [0, 0, 0, 4, 6],
  lounge: [4, 2, 0, 2, 4],
}
const EQ_FREQS = [60, 250, 1000, 4000, 12000]

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
  const audioCtxRef = useRef(null)
  const sourceNodeRef = useRef(null)
  const analyserRef = useRef(null)
  const filtersRef = useRef([])
  const corsFailedRef = useRef(new Set())

  if (!audioRef.current && typeof Audio !== 'undefined') {
    audioRef.current = new Audio()
    audioRef.current.preload = 'metadata'
    audioRef.current.crossOrigin = 'anonymous'
  }

  const [currentTrack, setCurrentTrack] = useState(null)
  const [queue, setQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(() => loadJSON(STORAGE_KEYS.volume, 0.8))
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState('off')
  const [speed, setSpeed] = useState(1)
  const [favorites, setFavorites] = useState(() => loadJSON(STORAGE_KEYS.favorites, []))
  const [playlists, setPlaylists] = useState(() => loadJSON(STORAGE_KEYS.playlists, []))
  const [recent, setRecent] = useState(() => loadJSON(STORAGE_KEYS.recent, []))
  const [sourceFilter, setSourceFilter] = useState(() => loadJSON(STORAGE_KEYS.source, 'all'))
  const [playCounts, setPlayCounts] = useState(() => loadJSON(STORAGE_KEYS.plays, {}))
  const [sleepEndsAt, setSleepEndsAt] = useState(null)
  const [eqPreset, setEqPreset] = useState(() => loadJSON(STORAGE_KEYS.eq, 'off'))
  const [analyserReady, setAnalyserReady] = useState(false)

  // persist
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites)) }, [favorites])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.playlists, JSON.stringify(playlists)) }, [playlists])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(recent)) }, [recent])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.volume, JSON.stringify(volume)) }, [volume])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.source, JSON.stringify(sourceFilter)) }, [sourceFilter])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.plays, JSON.stringify(playCounts)) }, [playCounts])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.eq, JSON.stringify(eqPreset)) }, [eqPreset])

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed
  }, [speed])

  const ensureAudioGraph = useCallback(() => {
    if (audioCtxRef.current) return audioCtxRef.current
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return null
      const ctx = new Ctx()
      const src = ctx.createMediaElementSource(audioRef.current)
      const filters = EQ_FREQS.map((freq, i) => {
        const f = ctx.createBiquadFilter()
        f.type = i === 0 ? 'lowshelf' : i === EQ_FREQS.length - 1 ? 'highshelf' : 'peaking'
        f.frequency.value = freq
        f.Q.value = 1
        f.gain.value = 0
        return f
      })
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 128
      analyser.smoothingTimeConstant = 0.78
      // chain: src → filters → analyser → destination
      let node = src
      filters.forEach((f) => { node.connect(f); node = f })
      node.connect(analyser)
      analyser.connect(ctx.destination)
      audioCtxRef.current = ctx
      sourceNodeRef.current = src
      filtersRef.current = filters
      analyserRef.current = analyser
      setAnalyserReady(true)
      return ctx
    } catch {
      return null
    }
  }, [])

  // apply EQ when preset changes or graph is created
  useEffect(() => {
    const filters = filtersRef.current
    const gains = EQ_PRESETS[eqPreset] || EQ_PRESETS.off
    filters.forEach((f, i) => {
      const target = gains[i] || 0
      try {
        f.gain.setTargetAtTime(target, audioCtxRef.current?.currentTime || 0, 0.05)
      } catch {
        f.gain.value = target
      }
    })
  }, [eqPreset, analyserReady])

  // sleep timer
  useEffect(() => {
    if (!sleepEndsAt) return
    const ms = sleepEndsAt - Date.now()
    if (ms <= 0) { audioRef.current?.pause(); setSleepEndsAt(null); return }
    const t = setTimeout(() => { audioRef.current?.pause(); setSleepEndsAt(null) }, ms)
    return () => clearTimeout(t)
  }, [sleepEndsAt])

  // audio element wiring
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress(audio.currentTime)
    const onMeta = () => setDuration(audio.duration || 0)
    const onEnd = () => handleEnded()
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onError = () => {
      // CORS or load failure — retry without crossOrigin if not yet retried
      const t = currentTrack
      if (!t || corsFailedRef.current.has(t.preview)) return
      corsFailedRef.current.add(t.preview)
      audio.crossOrigin = null
      audio.src = t.preview
      audio.play().catch(() => {})
    }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
    }
  })

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const bumpRecent = useCallback((track) => {
    setRecent((prev) => [track, ...prev.filter((t) => t.id !== track.id)].slice(0, 50))
    setPlayCounts((prev) => ({ ...prev, [track.id]: (prev[track.id] || 0) + 1 }))
  }, [])

  const loadAndPlay = useCallback((track) => {
    const audio = audioRef.current
    if (!audio || !track) return
    // restore CORS attempt unless we already know this URL fails CORS
    audio.crossOrigin = corsFailedRef.current.has(track.preview) ? null : 'anonymous'
    audio.src = track.preview
    audio.playbackRate = speed
    ensureAudioGraph()
    audioCtxRef.current?.resume?.()
    audio.play().catch(() => {})
    bumpRecent(track)
  }, [speed, ensureAudioGraph, bumpRecent])

  const playTrack = useCallback((track, list = null) => {
    if (!track) return
    if (list) {
      setQueue(list)
      setQueueIndex(list.findIndex((t) => t.id === track.id))
    } else {
      setQueue([track])
      setQueueIndex(0)
    }
    setCurrentTrack(track)
    loadAndPlay(track)
  }, [loadAndPlay])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    audioCtxRef.current?.resume?.()
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
    loadAndPlay(next)
  }, [queue, queueIndex, shuffle, repeat, loadAndPlay])

  const playPrev = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.currentTime > 3) { audio.currentTime = 0; return }
    if (queueIndex <= 0) { audio.currentTime = 0; return }
    const idx = queueIndex - 1
    const prev = queue[idx]
    setQueueIndex(idx)
    setCurrentTrack(prev)
    loadAndPlay(prev)
  }, [queue, queueIndex, loadAndPlay])

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

  const jumpToQueueIndex = useCallback((idx) => {
    if (idx < 0 || idx >= queue.length) return
    const t = queue[idx]
    setQueueIndex(idx)
    setCurrentTrack(t)
    loadAndPlay(t)
  }, [queue, loadAndPlay])

  const addToQueue = useCallback((track) => {
    setQueue((prev) => prev.find((t) => t.id === track.id) ? prev : [...prev, track])
  }, [])

  const removeFromQueue = useCallback((idx) => {
    setQueue((prev) => prev.filter((_, i) => i !== idx))
    setQueueIndex((q) => idx < q ? q - 1 : q)
  }, [])

  const clearQueue = useCallback(() => {
    setQueue(currentTrack ? [currentTrack] : [])
    setQueueIndex(currentTrack ? 0 : -1)
  }, [currentTrack])

  const reorderQueue = useCallback((from, to) => {
    if (from === to) return
    setQueue((prev) => {
      const next = prev.slice()
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
    setQueueIndex((q) => {
      if (q === from) return to
      if (from < q && to >= q) return q - 1
      if (from > q && to <= q) return q + 1
      return q
    })
  }, [])

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

  const setSleepIn = useCallback((minutes) => {
    if (!minutes) { setSleepEndsAt(null); return }
    setSleepEndsAt(Date.now() + minutes * 60 * 1000)
  }, [])

  const value = useMemo(() => ({
    currentTrack, queue, queueIndex, isPlaying, progress, duration, volume,
    shuffle, repeat, speed, favorites, playlists, recent,
    sourceFilter, playCounts, sleepEndsAt, eqPreset, analyserRef, analyserReady,
    playTrack, togglePlay, seek, playNext, playPrev, jumpToQueueIndex,
    addToQueue, removeFromQueue, clearQueue, reorderQueue,
    setVolume, setShuffle, setRepeat, setSpeed, setSourceFilter, setSleepIn, setEqPreset,
    toggleFavorite, isFavorite,
    createPlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist,
  }), [
    currentTrack, queue, queueIndex, isPlaying, progress, duration, volume,
    shuffle, repeat, speed, favorites, playlists, recent,
    sourceFilter, playCounts, sleepEndsAt, eqPreset, analyserReady,
    playTrack, togglePlay, seek, playNext, playPrev, jumpToQueueIndex,
    addToQueue, removeFromQueue, clearQueue, reorderQueue,
    setSleepIn,
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

export function applySourceFilter(tracks, filter) {
  if (filter === 'preview') return tracks.filter((t) => t.source === 'itunes')
  if (filter === 'full') return tracks.filter((t) => t.source === 'audius')
  return tracks
}

export { EQ_PRESETS }
