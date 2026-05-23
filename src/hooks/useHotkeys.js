import { useEffect } from 'react'

const TYPING = (el) => {
  if (!el) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable
}

export function useHotkeys(handlers) {
  useEffect(() => {
    const onKey = (e) => {
      if (TYPING(document.activeElement)) {
        if (e.key === 'Escape') handlers.escape?.(e)
        return
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const fn = handlers[e.key] || handlers[e.key.toLowerCase()]
      if (fn) {
        e.preventDefault()
        fn(e)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handlers])
}
