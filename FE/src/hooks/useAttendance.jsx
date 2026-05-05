import { useCallback, useMemo } from "react"
import useApi from "./useApi"

export default function useAttendance() {
  const api = useApi("attendance")

  const getAttendances = useCallback(
    (date) => {
      const query = date ? `?date=${encodeURIComponent(date)}` : ""
      return api.get(`/attendance${query}`)
    },
    [api],
  )

  const createAttendance = useCallback(
    (payload) => api.post("/attendance", payload),
    [api],
  )

  return useMemo(
    () => ({
      getAttendances,
      createAttendance,
    }),
    [createAttendance, getAttendances],
  )
}
