export default function Modal({ open, onClose, title, children, footer }) {
    if (!open) return null
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative card w-full max-w-lg">
          <div className="text-lg font-semibold">{title}</div>
          <div className="mt-3">{children}</div>
          <div className="mt-4 flex items-center justify-end gap-2">{footer}</div>
        </div>
      </div>
    )
  }
  