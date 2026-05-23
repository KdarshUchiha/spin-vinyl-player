const LRCLIB = 'https://lrclib.net/api/get'

const cache = new Map()

function parseLRC(text) {
  if (!text) return null
  const lines = []
  for (const raw of text.split('\n')) {
    const m = raw.match(/^\[(\d+):(\d+(?:\.\d+)?)\](.*)$/)
    if (!m) continue
    const t = parseInt(m[1], 10) * 60 + parseFloat(m[2])
    const text = m[3].trim()
    if (text) lines.push({ time: t, text })
  }
  if (lines.length === 0) return null
  return lines.sort((a, b) => a.time - b.time)
}

export async function fetchLyrics(track) {
  if (!track) return { synced: null, plain: null }
  const key = `${track.artist}::${track.title}`
  if (cache.has(key)) return cache.get(key)
  try {
    const params = new URLSearchParams({
      artist_name: track.artist || '',
      track_name: track.title || '',
    })
    if (track.album) params.set('album_name', track.album)
    const res = await fetch(`${LRCLIB}?${params}`)
    if (!res.ok) throw new Error('not found')
    const json = await res.json()
    const synced = parseLRC(json.syncedLyrics)
    const plain = json.plainLyrics?.trim() || null
    const out = { synced, plain }
    cache.set(key, out)
    return out
  } catch {
    const out = { synced: null, plain: null }
    cache.set(key, out)
    return out
  }
}

export function findActiveLine(synced, time) {
  if (!synced || synced.length === 0) return -1
  let lo = 0, hi = synced.length - 1, ans = -1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (synced[mid].time <= time) { ans = mid; lo = mid + 1 }
    else hi = mid - 1
  }
  return ans
}
