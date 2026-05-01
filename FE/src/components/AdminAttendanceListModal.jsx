import { useMemo } from "react"
import { X } from "lucide-react"

function toDateLabel(date) {
  if (!date) {
    return ""
  }

  const value = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)

  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default function AdminAttendanceListModal({
  isOpen,
  date,
  attendances,
  onClose,
}) {
  const dateLabel = useMemo(() => toDateLabel(date), [date])

  if (!isOpen || !date) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Tutup modal daftar absen"
      />

      <section className="relative z-10 w-full max-w-3xl rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Daftar Absen Harian
            </h2>
            <p className="mt-1 text-sm text-slate-500">{dateLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </header>

        <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
          {attendances.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              Belum ada user yang absen pada tanggal ini.
            </p>
          ) : (
            <div className="space-y-3">
              {attendances.map((attendance) => (
                <article
                  key={`${attendance.name}-${attendance.time}`}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="grid gap-2 sm:grid-cols-3">
                    <p className="text-sm">
                      <span className="font-semibold text-slate-900">
                        Nama:
                      </span>{" "}
                      <span className="text-slate-700">{attendance.name}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-slate-900">
                        Divisi:
                      </span>{" "}
                      <span className="text-slate-700">
                        {attendance.division}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-slate-900">
                        Jam absen:
                      </span>{" "}
                      <span className="text-slate-700">{attendance.time}</span>
                    </p>
                  </div>

                  <div className="mt-3">
                    <p className="mb-2 text-sm font-semibold text-slate-900">
                      Image:
                    </p>
                    {attendance.imageUrl ? (
                      <img
                        src={attendance.imageUrl}
                        alt={`Absen ${attendance.name}`}
                        className="h-28 w-28 rounded-md border border-slate-200 object-cover"
                      />
                    ) : (
                      <p className="text-sm text-slate-500">Tidak ada image.</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
