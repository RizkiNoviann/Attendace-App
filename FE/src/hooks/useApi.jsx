import { useMemo } from "react"

const serviceBaseUrl = {
  auth: import.meta.env.VITE_AUTH_API_URL ?? "http://localhost:3001",
  employee: import.meta.env.VITE_EMPLOYEE_API_URL ?? "http://localhost:3002",
  attendance:
    import.meta.env.VITE_ATTENDANCE_API_URL ?? "http://localhost:3003",
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return response.json()
  }
  return null
}

function normalizeError(data, status) {
  if (!data) {
    return `Request gagal (${status})`
  }

  if (Array.isArray(data.message)) {
    return data.message.join(", ")
  }

  if (typeof data.message === "string") {
    return data.message
  }

  return `Request gagal (${status})`
}

export default function useApi(service = "auth") {
  const baseUrl = serviceBaseUrl[service] ?? serviceBaseUrl.auth

  return useMemo(() => {
    const request = async (method, endpoint, options = {}) => {
      const { body, token, headers } = options
      const hasBody = body !== undefined && body !== null
      const isFormData = body instanceof FormData

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
        body: hasBody ? (isFormData ? body : JSON.stringify(body)) : undefined,
      })

      const data = await parseResponse(response)
      if (!response.ok) {
        throw new Error(normalizeError(data, response.status))
      }

      return data
    }

    return {
      get: (endpoint, options) => request("GET", endpoint, options),
      post: (endpoint, body, options) =>
        request("POST", endpoint, { ...options, body }),
      put: (endpoint, body, options) =>
        request("PUT", endpoint, { ...options, body }),
      patch: (endpoint, body, options) =>
        request("PATCH", endpoint, { ...options, body }),
      remove: (endpoint, options) => request("DELETE", endpoint, options),
    }
  }, [baseUrl])
}
