import { useCallback, useMemo } from "react"
import useApi from "./useApi"

export default function useEmployee() {
  const api = useApi("employee")
  const getEmployees = useCallback((token) => api.get("/employees", { token }), [api])
  const createEmployee = useCallback(
    (payload, token) => api.post("/employees", payload, { token }),
    [api],
  )
  const updateEmployee = useCallback(
    (id, payload, token) => api.put(`/employees/${id}`, payload, { token }),
    [api],
  )
  const deleteEmployee = useCallback(
    (id, token) => api.remove(`/employees/${id}`, { token }),
    [api],
  )

  return useMemo(
    () => ({
      getEmployees,
      createEmployee,
      updateEmployee,
      deleteEmployee,
    }),
    [createEmployee, deleteEmployee, getEmployees, updateEmployee],
  )
}
