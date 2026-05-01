export default function Navbar({
  onMenuClick,
  roleLabel,
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Buka sidebar"
          >
            Menu
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-700 text-sm font-bold text-white">
            {roleLabel}
          </span>
        </div>
      </div>
    </header>
  )
}
