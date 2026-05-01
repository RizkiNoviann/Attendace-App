import AppLink from "./AppLink"
import { X } from "lucide-react"

export default function Sidebar({
  links,
  currentPath,
  navigate,
  isOpen,
  onClose,
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white p-4 shadow-lg transition-transform duration-200 lg:translate-x-0 lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-red-700">Dexa Group</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Tutup sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = currentPath === link.path
          const Icon = link.icon

          return (
            <AppLink
              key={link.path}
              to={link.path}
              navigate={navigate}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-red-50 text-red-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {Icon && <Icon size={18} className="shrink-0" />}
              {link.label}
            </AppLink>
          )
        })}
      </nav>

      <AppLink
        to="/login"
        navigate={navigate}
        onClick={onClose}
        className="mt-6 inline-flex rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        Logout
      </AppLink>
    </aside>
  )
}
