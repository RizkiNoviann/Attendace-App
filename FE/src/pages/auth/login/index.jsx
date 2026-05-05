import { useState } from "react"
import useAuth from "../../../hooks/useAuth"

export default function LoginPage({ onLoginSuccess }) {
  const { login } = useAuth()

  const [form, setForm] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await login(form)
      onLoginSuccess?.(response)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Login gagal. Coba lagi.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 sm:p-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-2">
          <section className="flex flex-col justify-between gap-6 bg-gradient-to-br from-red-700 to-red-900 p-6 text-white sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-100">
                Attendance App
              </p>
              <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
                Selamat datang, silakan login untuk lanjut ke dashboard.
              </h1>
              <p className="mt-3 text-sm text-red-100 sm:text-base">
                Akun user dibuat oleh admin dari halaman account management.
              </p>
            </div>
            <div className="rounded-xl border border-white/25 bg-white/10 p-4 text-sm">
              <p className="font-semibold">Akun test:</p>
              <div className="mt-3 space-y-1 text-red-100">
                <p>User: user@gmail.com / user123</p>
                <p>Admin: admindexa@gmail.com / admindexa123</p>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Login</h2>
            <p className="mt-1 text-sm text-slate-500">
              Masukkan email dan password akun yang sudah dibuat admin.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                  placeholder="nama@email.com"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Password
                </span>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      password: event.target.value,
                    }))
                  }
                  placeholder="********"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </label>

              {error && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Memproses..." : "Login"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
