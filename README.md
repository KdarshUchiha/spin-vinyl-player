# Spin — Vinyl Music Player

A PWA music player with a spinning-vinyl UI. Searches free public APIs (iTunes Search and Audius), so no auth or paid keys are needed.

## Features

- Spinning vinyl that pauses with playback; tonearm lifts on pause
- Search across **iTunes** (30s previews of mainstream music) and **Audius** (full-length independent tracks) in one feed
- Play / pause / skip, queue, shuffle, repeat (off/all/one), volume, seek
- Favorites, custom playlists, recently played (all in localStorage)
- Now-Playing screen with full-bleed art-blur background
- Mini-player with rotating album-art puck
- Responsive: desktop (sidebar nav), tablet/mobile (bottom nav), TV (large screens with focus rings)
- Installable as a PWA (offline shell), deployable to GitHub Pages

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` — the workflow at `.github/workflows/deploy.yml` builds and publishes automatically.

`vite.config.js` uses `base: './'`, so the same build works at any sub-path (e.g. `username.github.io/vinyl-player/`).

## Tech

React 19 + Vite + plain CSS. No backend, no API keys, no tracking.
