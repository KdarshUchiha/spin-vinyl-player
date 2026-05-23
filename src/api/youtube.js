import { GLOBAL_LABELS, INDIAN_LABELS } from './yt-channels'

// CORS proxies — public, free, best-effort. We try them in order.
const CORS_PROXIES = [
  (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
]

// Invidious instances for search + metadata. List rotates as instances go up/down.
const INVIDIOUS_INSTANCES = [
  'https://invidious.privacyredirect.com',
  'https://yewtu.be',
  'https://invidious.fdn.fr',
  'https://invidious.protokolla.fi',
]

const RSS_CACHE_KEY = 'vp_yt_rss_cache_v1'
const RSS_CACHE_TTL_MS = 30 * 60 * 1000 // 30 min

function loadCache() {
  try { return JSON.parse(localStorage.getItem(RSS_CACHE_KEY) || '{}') } catch { return {} }
}
function saveCache(c) {
  try { localStorage.setItem(RSS_CACHE_KEY, JSON.stringify(c)) } catch {}
}

async function fetchWithProxies(url, asText = true) {
  for (const wrap of CORS_PROXIES) {
    try {
      const res = await fetch(wrap(url), { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue
      return asText ? await res.text() : await res.json()
    } catch {}
  }
  throw new Error('all proxies failed')
}

function parseRSS(xml, channelName) {
  const out = []
  // Robust enough for YouTube's xml — extract entries
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g
  let m
  while ((m = entryRe.exec(xml))) {
    const entry = m[1]
    const pick = (tag) => {
      const r = entry.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`))
      return r ? r[1].trim() : ''
    }
    const id = pick('yt:videoId')
    if (!id) continue
    const title = pick('title')
    const author = pick('name') || channelName
    const published = pick('published')
    // media:thumbnail tag has src attribute (no closing tag)
    const thumbMatch = entry.match(/<media:thumbnail[^>]*url="([^"]+)"/)
    const thumb = thumbMatch ? thumbMatch[1] : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    out.push({ id, title, author, published, thumb })
  }
  return out
}

function videoToTrack(v) {
  // strip "(Official Video)" / "[Official Music Video]" / "(Lyric Video)" noise
  const cleaned = v.title
    .replace(/\s*[\(\[][^\)\]]*(official|video|lyric|audio|hd|hq|teaser|m\/?v|mv)[^\)\]]*[\)\]]\s*/gi, '')
    .replace(/\s+\|\s.*$/, '')
    .trim()
  // try to split "Artist - Title" if present
  let title = cleaned, artist = v.author
  const dashSplit = cleaned.match(/^(.+?)\s+[\-–—]\s+(.+)$/)
  if (dashSplit) { artist = dashSplit[1].trim(); title = dashSplit[2].trim() }
  return {
    id: `youtube-${v.id}`,
    youtubeId: v.id,
    title,
    artist,
    album: v.author,
    artwork: v.thumb,
    preview: '', // unused; YT player consumes youtubeId
    duration: 0,
    fullDuration: 0,
    source: 'youtube',
    publishedAt: v.published,
  }
}

export async function fetchChannelLatest(channelId, channelName) {
  const cache = loadCache()
  const hit = cache[channelId]
  if (hit && Date.now() - hit.at < RSS_CACHE_TTL_MS) {
    return hit.tracks
  }
  try {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    const xml = await fetchWithProxies(url, true)
    const videos = parseRSS(xml, channelName).slice(0, 10)
    const tracks = videos.map(videoToTrack)
    cache[channelId] = { at: Date.now(), tracks }
    saveCache(cache)
    return tracks
  } catch {
    return hit?.tracks || []
  }
}

async function fetchManyChannels(channels) {
  const results = await Promise.allSettled(
    channels.map((c) => fetchChannelLatest(c.id, c.name))
  )
  const all = []
  for (const r of results) {
    if (r.status === 'fulfilled') all.push(...r.value)
  }
  // sort newest first
  all.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  // dedupe by youtubeId
  const seen = new Set()
  return all.filter((t) => {
    if (seen.has(t.youtubeId)) return false
    seen.add(t.youtubeId)
    return true
  })
}

export async function fetchGlobalNewReleases(limit = 24) {
  const all = await fetchManyChannels(GLOBAL_LABELS)
  return all.slice(0, limit)
}

export async function fetchIndianNewReleases(limit = 24) {
  const all = await fetchManyChannels(INDIAN_LABELS)
  return all.slice(0, limit)
}

// ---- Search via Invidious ----

export async function searchYouTube(query, limit = 20) {
  if (!query) return []
  for (const host of INVIDIOUS_INSTANCES) {
    try {
      const url = `${host}/api/v1/search?type=video&q=${encodeURIComponent(query)}`
      const res = await fetch(url, { signal: AbortSignal.timeout(7000) })
      if (!res.ok) continue
      const json = await res.json()
      return json.slice(0, limit).map((v) => videoToTrack({
        id: v.videoId,
        title: v.title || '',
        author: v.author || '',
        published: v.publishedText || '',
        thumb: v.videoThumbnails?.find((t) => t.quality === 'medium')?.url
            || v.videoThumbnails?.[0]?.url
            || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
      }))
    } catch {}
  }
  return []
}
