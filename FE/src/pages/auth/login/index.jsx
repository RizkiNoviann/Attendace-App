import AppLink from "../../../components/AppLink"

export default function LoginPage({ navigate }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    navigate("/user/dashboard")
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
                Entry awal aplikasi diarahkan ke halaman login sesuai kebutuhan.
              </p>
            </div>
            <div className="rounded-xl border border-white/25 bg-white/10 p-4 text-sm">
              <p className="font-semibold">Demo akses cepat:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <AppLink
                  to="/user/dashboard"
                  navigate={navigate}
                  className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  User Dashboard
                </AppLink>
                <AppLink
                  to="/admin/dashboard"
                  navigate={navigate}
                  className="rounded-md border border-white/60 px-3 py-2 text-xs font-semibold hover:bg-white/10"
                >
                  Admin Dashboard
                </AppLink>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Login
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Masukkan akun untuk masuk ke halaman user atau admin.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Email
                </span>
                <input
                  type="email"
                  required
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
                  placeholder="********"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-lg bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
              >
                Login
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
