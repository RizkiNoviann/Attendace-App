import { useCallback, useMemo } from "react"
import useApi from "./useApi"

export default function useAuth() {
  const api = useApi("auth")
  const login = useCallback((payload) => api.post("/auth/login", payload), [api])
  const logout = useCallback((token) => api.post("/auth/logout", {}, { token }), [api])
  const getProfile = useCallback((token) => api.get("/auth/profile", { token }), [api])

  return useMemo(
    () => ({
      login,
      logout,
      getProfile,
    }),
    [getProfile, login, logout],
  )
}
