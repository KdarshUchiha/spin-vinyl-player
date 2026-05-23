import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Disc3, Keyboard, ListMusic, Sparkles, X } from 'lucide-react'

const KEY = 'vp_onboarded'

const STEPS = [
  {
    icon: <Disc3 size={28} />,
    title: 'Drop the needle',
    body: 'Tap any track on Home or in Search and the vinyl spins. The whole UI re-tints to match the album art.',
  },
  {
    icon: <Sparkles size={28} />,
    title: 'Two free music sources',
    body: 'iTunes for 30-second previews of mainstream music, Audius for full indie tracks. Toggle between them at the top of Home.',
  },
  {
    icon: <ListMusic size={28} />,
    title: 'Build a queue',
    body: 'Hit the queue icon on any track to add it. Drag rows to reorder. Open the queue from the mini-player or Now Playing.',
  },
  {
    icon: <Keyboard size={28} />,
    title: 'Keyboard friendly',
    body: 'Space to play/pause, J/K for prev/next, F to favorite, / to search. Lock-screen and Bluetooth media keys work too.',
  },
]

export default function OnboardingTour() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem(KEY)) {
      const t = setTimeout(() => setOpen(true), 600)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(KEY, '1')
    setOpen(false)
  }

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else dismiss()
  }

  const current = STEPS[step]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="onboard-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismiss}
        >
          <motion.div
            className="onboard"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 30, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          >
            <button className="onboard-close" onClick={dismiss} aria-label="Skip">
              <X size={18} />
            </button>
            <div className="onboard-icon">{current.icon}</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="onboard-title">{current.title}</h3>
                <p className="onboard-body">{current.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="onboard-dots">
              {STEPS.map((_, i) => (
                <span key={i} className={`onboard-dot ${i === step ? 'onboard-dot--active' : ''}`} />
              ))}
            </div>
            <div className="onboard-actions">
              <button className="onboard-skip" onClick={dismiss}>Skip tour</button>
              <button className="btn-primary onboard-next" onClick={next}>
                {step < STEPS.length - 1 ? <>Next <ChevronRight size={16} /></> : 'Start spinning'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
