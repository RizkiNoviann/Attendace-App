import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

export default function DashboardLayout({
  roleLabel,
  links,
  currentPath,
  navigate,
  children,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [currentPath])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Tutup sidebar overlay"
        />
      )}

      <Sidebar
        links={links}
        currentPath={currentPath}
        navigate={navigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:pl-72">
        <Navbar
          roleLabel={roleLabel}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
