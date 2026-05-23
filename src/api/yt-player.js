// Singleton wrapper around the YouTube IFrame Player API.
// Loads the API on first use, mounts a tiny iframe in #yt-mount, and
// exposes a callback-based player surface that PlayerContext drives.

let apiLoadingPromise = null
let player = null
let playerReady = false
let pendingCommand = null
let lastListenerSet = null

function loadAPI() {
  if (apiLoadingPromise) return apiLoadingPromise
  apiLoadingPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) { resolve(window.YT); return }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    window.onYouTubeIframeAPIReady = () => resolve(window.YT)
  })
  return apiLoadingPromise
}

function ensureMount() {
  let el = document.getElementById('yt-mount')
  if (!el) {
    el = document.createElement('div')
    el.id = 'yt-mount'
    el.className = 'yt-mount'
    document.body.appendChild(el)
  }
  let inner = document.getElementById('yt-iframe-target')
  if (!inner) {
    inner = document.createElement('div')
    inner.id = 'yt-iframe-target'
    el.appendChild(inner)
  }
}

export async function createYTPlayer({ onReady, onState, onTime }) {
  await loadAPI()
  ensureMount()
  if (player) {
    lastListenerSet = { onReady, onState, onTime }
    return player
  }
  return new Promise((resolve) => {
    lastListenerSet = { onReady, onState, onTime }
    player = new window.YT.Player('yt-iframe-target', {
      width: 280,
      height: 158,
      playerVars: {
        autoplay: 0,
        controls: 1,
        playsinline: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          playerReady = true
          if (pendingCommand) {
            const { videoId, autoplay } = pendingCommand
            pendingCommand = null
            if (autoplay) player.loadVideoById(videoId)
            else player.cueVideoById(videoId)
          }
          lastListenerSet?.onReady?.()
          resolve(player)
        },
        onStateChange: (e) => {
          // -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
          lastListenerSet?.onState?.(e.data)
        },
        onError: () => {
          lastListenerSet?.onState?.(0) // treat as ended
        },
      },
    })
    // 250ms ticker for currentTime
    setInterval(() => {
      if (!player || !playerReady) return
      try {
        const t = player.getCurrentTime?.()
        const d = player.getDuration?.()
        if (typeof t === 'number') lastListenerSet?.onTime?.(t, d || 0)
      } catch {}
    }, 250)
  })
}

export function ytPlay(videoId) {
  if (!player || !playerReady) {
    pendingCommand = { videoId, autoplay: true }
    return
  }
  player.loadVideoById(videoId)
}
export function ytResume()  { if (player && playerReady) player.playVideo() }
export function ytPause()   { if (player && playerReady) player.pauseVideo() }
export function ytSeekTo(s) { if (player && playerReady) player.seekTo(s, true) }
export function ytSetVolume(v) { if (player && playerReady) player.setVolume(Math.round(v * 100)) }
export function ytSetRate(r)   { if (player && playerReady) player.setPlaybackRate(r) }
export function ytStop() { if (player && playerReady) { player.stopVideo() } }

export function getYTMount() {
  return document.getElementById('yt-mount')
}
