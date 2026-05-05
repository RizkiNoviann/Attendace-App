import { useCallback, useEffect, useMemo, useState } from "react"
import useAuth from "./hooks/useAuth"
import LoginPage from "./pages/auth/login"
import AdminAccountManagementPage from "./pages/dashboard/admin/account"
import AdminDashboardPage from "./pages/dashboard/admin"
import UserDashboardPage from "./pages/dashboard/user"

const routes = {
  "/": LoginPage,
  "/login": LoginPage,
  "/user/dashboard": UserDashboardPage,
  "/admin/dashboard": AdminDashboardPage,
  "/admin/account-management": AdminAccountManagementPage,
}

const sessionStorageKey = "attendance-app-session"

function getStoredSession() {
  try {
    const value = window.localStorage.getItem(sessionStorageKey)
    if (!value) {
      return null
    }
    return JSON.parse(value)
  } catch {
    return null
  }
}

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname || "/")
  const [session, setSession] = useState(() => getStoredSession())
  const [isLoadingSession, setIsLoadingSession] = useState(false)

  const { getProfile, logout } = useAuth()

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || "/")
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    if (session) {
      window.localStorage.setItem(sessionStorageKey, JSON.stringify(session))
      return
    }

    window.localStorage.removeItem(sessionStorageKey)
  }, [session])

  useEffect(() => {
    if (!session?.token || session?.user) {
      return
    }

    let isActive = true
    setIsLoadingSession(true)

    getProfile(session.token)
      .then((response) => {
        if (!isActive) {
          return
        }

        if (!response?.user) {
          setSession(null)
          return
        }

        setSession({
          token: session.token,
          user: response.user,
        })
      })
      .catch(() => {
        if (isActive) {
          setSession(null)
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingSession(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [getProfile, session])

  const navigate = useCallback(
    (to) => {
      if (to === path) {
        return
      }

      window.history.pushState({}, "", to)
      setPath(to)
      window.scrollTo(0, 0)
    },
    [path],
  )

  const resolvedPath = useMemo(() => {
    const isAuthenticated = Boolean(session?.token && session?.user)
    const role = session?.user?.role

    if (!isAuthenticated) {
      return "/login"
    }

    if (path === "/" || path === "/login") {
      return role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard"
    }

    if (!routes[path]) {
      return role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard"
    }

    if (path.startsWith("/admin") && role !== "ADMIN") {
      return "/user/dashboard"
    }

    return path
  }, [path, session])

  useEffect(() => {
    if (path === resolvedPath) {
      return
    }

    window.history.replaceState({}, "", resolvedPath)
    setPath(resolvedPath)
  }, [path, resolvedPath])

  const handleLoginSuccess = useCallback((response) => {
    if (!response?.accessToken || !response?.user) {
      return
    }

    setSession({
      token: response.accessToken,
      user: response.user,
    })

    const targetPath =
      response.user.role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard"
    window.history.pushState({}, "", targetPath)
    setPath(targetPath)
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      if (session?.token) {
        await logout(session.token)
      }
    } catch {
      // Ignore logout request error, local session should still be cleared.
    } finally {
      setSession(null)
      window.history.pushState({}, "", "/login")
      setPath("/login")
    }
  }, [logout, session?.token])

  const CurrentPage = routes[resolvedPath] ?? LoginPage

  if (isLoadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-600">
        Memuat sesi...
      </div>
    )
  }

  return (
    <CurrentPage
      currentPath={resolvedPath}
      navigate={navigate}
      authToken={session?.token ?? ""}
      authUser={session?.user ?? null}
      onLoginSuccess={handleLoginSuccess}
      onLogout={handleLogout}
    />
  )
}
