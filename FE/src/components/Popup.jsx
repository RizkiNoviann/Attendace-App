import { CheckCircle2, TriangleAlert, X } from "lucide-react"

export default function Popup({
  isOpen,
  title,
  message,
  type = "success",
  confirmText = "OK",
  cancelText = "Batal",
  onConfirm,
  onClose,
  confirmVariant = "primary",
}) {
  if (!isOpen) {
    return null
  }

  const isConfirm = type === "confirm"
  const confirmButtonClass =
    confirmVariant === "danger"
      ? "bg-red-700 text-white hover:bg-red-800"
      : "bg-slate-900 text-white hover:bg-slate-800"

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Tutup popup"
      />

      <section className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            {isConfirm ? (
              <TriangleAlert className="text-amber-500" size={20} />
            ) : (
              <CheckCircle2 className="text-emerald-600" size={20} />
            )}
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </header>

        <div className="px-5 py-4 text-sm text-slate-600">{message}</div>

        <footer className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
          {isConfirm && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm ?? onClose}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </footer>
      </section>
    </div>
  )
}
