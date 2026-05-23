import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const show = useCallback((message, opts = {}) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, ...opts }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), opts.duration || 2400)
  }, [])
  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="toast-host" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className="toast"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

export async function shareTrack(track, toast) {
  const url = window.location.href
  const text = `Listen to "${track.title}" by ${track.artist}`
  try {
    if (navigator.share) {
      await navigator.share({ title: track.title, text, url })
      return
    }
  } catch (e) {
    if (e?.name === 'AbortError') return
  }
  try {
    await navigator.clipboard.writeText(`${text} — ${url}`)
    toast?.show('Link copied to clipboard')
  } catch {
    toast?.show('Could not copy link')
  }
}
