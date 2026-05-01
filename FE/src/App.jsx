import { useCallback, useEffect, useState } from "react"
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

function App() {
  const [path, setPath] = useState(() => window.location.pathname || "/")

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || "/")
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

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

  const currentPath = routes[path] ? path : "/login"

  useEffect(() => {
    if (path !== currentPath) {
      window.history.replaceState({}, "", currentPath)
      setPath(currentPath)
    }
  }, [path, currentPath])

  const CurrentPage = routes[currentPath]

  return <CurrentPage currentPath={currentPath} navigate={navigate} />
}

export default App
