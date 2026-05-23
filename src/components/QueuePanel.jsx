import { useState } from 'react'
import { GripVertical, ListMusic, Trash2, X } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

export default function QueuePanel({ open, onClose }) {
  const { queue, queueIndex, jumpToQueueIndex, removeFromQueue, clearQueue, currentTrack, reorderQueue } = usePlayer()
  const [dragFrom, setDragFrom] = useState(null)
  const [dragOver, setDragOver] = useState(null)

  const onDrop = (to) => {
    if (dragFrom != null && to != null && dragFrom !== to) {
      reorderQueue(dragFrom, to)
    }
    setDragFrom(null); setDragOver(null)
  }

  return (
    <>
      <div className={`queue-overlay ${open ? 'queue-overlay--show' : ''}`} onClick={onClose} />
      <aside className={`queue-panel ${open ? 'queue-panel--open' : ''}`} aria-hidden={!open}>
        <header className="queue-head">
          <div className="queue-head-title">
            <ListMusic size={20} />
            <h3>Queue</h3>
            <span className="queue-count">{queue.length}</span>
          </div>
          <div className="queue-head-actions">
            {queue.length > 1 && (
              <button className="icon-btn" onClick={clearQueue} title="Clear" aria-label="Clear queue">
                <Trash2 size={18} />
              </button>
            )}
            <button className="icon-btn" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </header>

        {currentTrack && (
          <div className="queue-section">
            <div className="queue-label">Now playing</div>
            <QueueRow track={currentTrack} active />
          </div>
        )}

        <div className="queue-section">
          <div className="queue-label">Up next</div>
          {queue.slice(queueIndex + 1).length === 0 && (
            <div className="muted" style={{ padding: '8px 4px' }}>
              Add songs from anywhere with the queue button.
            </div>
          )}
          {queue.slice(queueIndex + 1).map((t, i) => {
            const realIdx = queueIndex + 1 + i
            return (
              <QueueRow
                key={`${t.id}-${realIdx}`}
                track={t}
                draggable
                isDragOver={dragOver === realIdx}
                onDragStart={() => setDragFrom(realIdx)}
                onDragOver={(e) => { e.preventDefault(); setDragOver(realIdx) }}
                onDragEnd={() => { setDragFrom(null); setDragOver(null) }}
                onDrop={() => onDrop(realIdx)}
                onPlay={() => jumpToQueueIndex(realIdx)}
                onRemove={() => removeFromQueue(realIdx)}
              />
            )
          })}
        </div>

        {queueIndex > 0 && (
          <div className="queue-section">
            <div className="queue-label">Played</div>
            {queue.slice(0, queueIndex).map((t, i) => (
              <QueueRow
                key={`${t.id}-played-${i}`}
                track={t}
                dim
                onPlay={() => jumpToQueueIndex(i)}
              />
            ))}
          </div>
        )}
      </aside>
    </>
  )
}

function QueueRow({ track, active, dim, draggable, isDragOver, onDragStart, onDragOver, onDragEnd, onDrop, onPlay, onRemove }) {
  return (
    <div
      className={`queue-row ${active ? 'queue-row--active' : ''} ${dim ? 'queue-row--dim' : ''} ${isDragOver ? 'queue-row--drag-over' : ''}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
    >
      {draggable && (
        <span className="queue-grip" aria-hidden="true">
          <GripVertical size={16} />
        </span>
      )}
      <button className="queue-row-main" onClick={onPlay} disabled={active}>
        <img src={track.artwork} alt="" />
        <div className="queue-row-meta">
          <div className="queue-row-title">{track.title}</div>
          <div className="queue-row-sub">{track.artist}</div>
        </div>
      </button>
      {onRemove && (
        <button className="icon-btn" onClick={onRemove} aria-label="Remove">
          <X size={16} />
        </button>
      )}
    </div>
  )
}
