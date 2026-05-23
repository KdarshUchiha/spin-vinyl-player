// Unified track shape:
// { id, title, artist, album, artwork, preview, duration, source }

const ITUNES_BASE = 'https://itunes.apple.com/search'
const AUDIUS_HOST_DISCOVERY = 'https://api.audius.co'

let audiusHost = null

async function getAudiusHost() {
  if (audiusHost) return audiusHost
  try {
    const res = await fetch(AUDIUS_HOST_DISCOVERY)
    const json = await res.json()
    audiusHost = json.data?.[0] || 'https://discoveryprovider.audius.co'
  } catch {
    audiusHost = 'https://discoveryprovider.audius.co'
  }
  return audiusHost
}

function upsizeItunesArt(url, size = 600) {
  if (!url) return ''
  return url.replace(/\/\d+x\d+bb\.(jpg|png)$/, `/${size}x${size}bb.$1`)
}

export async function searchITunes(query, limit = 25, offset = 0) {
  if (!query) return []
  const url = `${ITUNES_BASE}?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}&offset=${offset}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('iTunes search failed')
  const json = await res.json()
  return (json.results || []).map((r) => ({
    id: `itunes-${r.trackId}`,
    title: r.trackName,
    artist: r.artistName,
    album: r.collectionName,
    artwork: upsizeItunesArt(r.artworkUrl100, 600),
    preview: r.previewUrl,
    duration: 30,
    source: 'itunes',
    fullDuration: r.trackTimeMillis ? r.trackTimeMillis / 1000 : 30,
  }))
}

export async function searchAudius(query, limit = 25) {
  if (!query) return []
  const host = await getAudiusHost()
  const url = `${host}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=VinylPlayer`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Audius search failed')
  const json = await res.json()
  return (json.data || []).slice(0, limit).map((t) => ({
    id: `audius-${t.id}`,
    title: t.title,
    artist: t.user?.name || t.user?.handle || 'Unknown',
    album: t.album || '',
    artwork: t.artwork?.['480x480'] || t.artwork?.['150x150'] || '',
    preview: `${host}/v1/tracks/${t.id}/stream?app_name=VinylPlayer`,
    duration: t.duration || 0,
    source: 'audius',
    fullDuration: t.duration || 0,
  }))
}

export async function searchAll(query, offset = 0) {
  const { searchYouTube } = await import('./youtube')
  const [a, b, c] = await Promise.allSettled([
    searchITunes(query, 20, offset),
    offset === 0 ? searchAudius(query, 15) : Promise.resolve([]),
    offset === 0 ? searchYouTube(query, 15) : Promise.resolve([]),
  ])
  const arr = []
  if (a.status === 'fulfilled') arr.push(...a.value)
  if (b.status === 'fulfilled') arr.push(...b.value)
  if (c.status === 'fulfilled') arr.push(...c.value)
  return arr
}

export async function getTrendingAudius(limit = 20) {
  try {
    const host = await getAudiusHost()
    const url = `${host}/v1/tracks/trending?app_name=VinylPlayer`
    const res = await fetch(url)
    if (!res.ok) return []
    const json = await res.json()
    return (json.data || []).slice(0, limit).map((t) => ({
      id: `audius-${t.id}`,
      title: t.title,
      artist: t.user?.name || t.user?.handle || 'Unknown',
      album: t.album || '',
      artwork: t.artwork?.['480x480'] || t.artwork?.['150x150'] || '',
      preview: `${host}/v1/tracks/${t.id}/stream?app_name=VinylPlayer`,
      duration: t.duration || 0,
      source: 'audius',
      fullDuration: t.duration || 0,
    }))
  } catch {
    return []
  }
}

export async function getTrendingITunes() {
  // iTunes has no "trending" endpoint without auth — use a curated genre seed
  const seeds = ['top hits', 'pop', 'rock', 'hip hop', 'indie', 'electronic']
  const term = seeds[Math.floor(Math.random() * seeds.length)]
  return searchITunes(term, 20)
}
