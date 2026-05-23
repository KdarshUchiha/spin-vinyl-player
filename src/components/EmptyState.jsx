const SVGS = {
  favorites: (
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="es-h" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--theme-primary, #ff5e8a)"/>
          <stop offset="100%" stopColor="var(--theme-secondary, #d4a24a)"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="80" r="55" fill="rgba(255,255,255,0.04)"/>
      <path d="M100 115 C70 95 60 78 60 65 a18 18 0 0 1 36 -8 a18 18 0 0 1 36 8 c0 13 -10 30 -32 50z"
            fill="url(#es-h)" opacity="0.9"/>
      <circle cx="58" cy="38" r="3" fill="var(--theme-primary, #ff5e8a)" opacity="0.5"/>
      <circle cx="148" cy="50" r="2.5" fill="var(--theme-secondary, #d4a24a)" opacity="0.6"/>
      <circle cx="160" cy="110" r="2" fill="var(--theme-primary, #ff5e8a)" opacity="0.4"/>
      <circle cx="40" cy="120" r="2" fill="var(--theme-secondary, #d4a24a)" opacity="0.5"/>
    </svg>
  ),
  playlists: (
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="es-p" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--theme-primary, #ff5e8a)"/>
          <stop offset="100%" stopColor="var(--theme-secondary, #d4a24a)"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="80" r="55" fill="rgba(255,255,255,0.04)"/>
      <rect x="55" y="55" width="80" height="8" rx="4" fill="rgba(255,255,255,0.18)"/>
      <rect x="55" y="73" width="65" height="8" rx="4" fill="rgba(255,255,255,0.13)"/>
      <rect x="55" y="91" width="72" height="8" rx="4" fill="rgba(255,255,255,0.10)"/>
      <circle cx="138" cy="100" r="14" fill="url(#es-p)"/>
      <path d="M134 95 L134 105 L143 100 z" fill="#fff"/>
    </svg>
  ),
  recent: (
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="es-r" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--theme-primary, #ff5e8a)"/>
          <stop offset="100%" stopColor="var(--theme-secondary, #d4a24a)"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="80" r="55" fill="rgba(255,255,255,0.04)"/>
      <circle cx="100" cy="80" r="40" fill="none" stroke="url(#es-r)" strokeWidth="3"/>
      <line x1="100" y1="80" x2="100" y2="55" stroke="url(#es-r)" strokeWidth="3" strokeLinecap="round"/>
      <line x1="100" y1="80" x2="118" y2="92" stroke="url(#es-r)" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="100" cy="80" r="3" fill="url(#es-r)"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="es-s" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--theme-primary, #ff5e8a)"/>
          <stop offset="100%" stopColor="var(--theme-secondary, #d4a24a)"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="80" r="55" fill="rgba(255,255,255,0.04)"/>
      <circle cx="90" cy="70" r="22" fill="none" stroke="url(#es-s)" strokeWidth="3.5"/>
      <line x1="107" y1="87" x2="125" y2="105" stroke="url(#es-s)" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="86" cy="66" r="3" fill="rgba(255,255,255,0.4)"/>
      <circle cx="94" cy="66" r="2" fill="rgba(255,255,255,0.3)"/>
    </svg>
  ),
}

export default function EmptyState({ icon = 'favorites', title, message, action }) {
  return (
    <div className="empty">
      <div className="empty-art">{SVGS[icon] || SVGS.favorites}</div>
      <h3 className="empty-title">{title}</h3>
      {message && <p className="empty-msg">{message}</p>}
      {action}
    </div>
  )
}
