import { useEffect, useState } from 'react'

const cache = new Map()

const FALLBACK = { primary: '#ff5e8a', secondary: '#d4a24a', dark: '#0a0610' }

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => {
    const v = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return Math.round(255 * v).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

async function extractFromUrl(url) {
  if (cache.has(url)) return cache.get(url)
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const size = 32
        const canvas = document.createElement('canvas')
        canvas.width = size; canvas.height = size
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, size, size)
        const data = ctx.getImageData(0, 0, size, size).data
        const buckets = new Map()
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3]
          if (a < 200) continue
          const { s, l } = rgbToHsl(r, g, b)
          if (l < 12 || l > 92) continue
          if (s < 18) continue
          // bucket by quantized HSL hue, weighted by saturation
          const h = Math.round(rgbToHsl(r, g, b).h / 12) * 12
          const key = `${h}-${Math.round(s / 20)}`
          const prev = buckets.get(key) || { count: 0, r: 0, g: 0, b: 0, weight: 0 }
          const w = (s / 50) * 1
          prev.count += 1
          prev.weight += w
          prev.r += r * w; prev.g += g * w; prev.b += b * w
          buckets.set(key, prev)
        }
        if (!buckets.size) { cache.set(url, FALLBACK); return resolve(FALLBACK) }
        const sorted = [...buckets.values()].sort((a, b) => b.weight - a.weight)
        const pick = (b) => {
          const r = Math.round(b.r / b.weight)
          const g = Math.round(b.g / b.weight)
          const bl = Math.round(b.b / b.weight)
          return { hex: rgbToHex(r, g, bl), hsl: rgbToHsl(r, g, bl) }
        }
        const a = pick(sorted[0])
        const b = sorted[1] ? pick(sorted[1]) : a
        // ensure primary is vivid enough
        let { h, s, l } = a.hsl
        if (s < 50) s = Math.min(80, s + 30)
        if (l < 30) l = 45
        if (l > 75) l = 60
        const primary = hslToHex(h, s, l)
        // secondary: complementary hue with similar treatment
        let h2 = b.hsl.h, s2 = b.hsl.s, l2 = b.hsl.l
        if (Math.abs(h2 - h) < 30) h2 = (h + 60) % 360
        if (s2 < 45) s2 = Math.min(80, s2 + 30)
        if (l2 < 30) l2 = 50
        if (l2 > 75) l2 = 60
        const secondary = hslToHex(h2, s2, l2)
        const dark = hslToHex(h, Math.min(60, s + 10), 8)
        const palette = { primary, secondary, dark, primaryHsl: { h, s, l } }
        cache.set(url, palette)
        resolve(palette)
      } catch {
        cache.set(url, FALLBACK)
        resolve(FALLBACK)
      }
    }
    img.onerror = () => { cache.set(url, FALLBACK); resolve(FALLBACK) }
    img.src = url
  })
}

export function useArtworkPalette(url) {
  const [palette, setPalette] = useState(() => (url && cache.get(url)) || FALLBACK)
  useEffect(() => {
    if (!url) { setPalette(FALLBACK); return }
    let alive = true
    extractFromUrl(url).then((p) => { if (alive) setPalette(p) })
    return () => { alive = false }
  }, [url])
  return palette
}
