// src/components/Modal.jsx
import { createPortal } from 'react-dom'

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null

  const modal = (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : 'Dialog'}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Content */}
      <div className="relative z-[10001] card w-full max-w-lg">
        {title && <div className="text-lg font-semibold">{title}</div>}
        <div className="mt-3">{children}</div>
        {footer && (
          <div className="mt-4 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  // Render above any map panes/stacking contexts
  return createPortal(modal, document.body)
}
