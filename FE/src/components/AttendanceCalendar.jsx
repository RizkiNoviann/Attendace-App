import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const dayLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function startOffsetInMonday(monthDate) {
  return (
    (new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay() + 6) %
    7
  )
}

function buildMonthCells(monthDate) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = startOffsetInMonday(monthDate)
  const lastIndex = offset + daysInMonth - 1
  const totalCells = lastIndex < 35 ? 35 : 42

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - offset + 1
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return null
    }
    return new Date(year, month, dayNumber)
  })
}

function statusDotClass(record) {
  if (!record) {
    return "border border-slate-400"
  }

  if (record.presence === "Hadir") {
    return "bg-emerald-500"
  }
  if (record.presence === "Izin") {
    return "bg-amber-500"
  }
  if (record.presence === "Sakit") {
    return "bg-sky-500"
  }
  return "bg-rose-500"
}

export default function AttendanceCalendar({
  records,
  selectedDate,
  onDateClick,
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("id-ID", {
        month: "long",
        year: "numeric",
      }).format(currentMonth),
    [currentMonth],
  )
  const monthCells = useMemo(
    () => buildMonthCells(currentMonth),
    [currentMonth],
  )
  const selectedDateKey = selectedDate ? toDateKey(selectedDate) : null
  const todayKey = toDateKey(new Date())

  const shiftMonth = (value) => {
    setCurrentMonth((previous) => {
      const shifted = new Date(previous)
      shifted.setMonth(previous.getMonth() + value)
      return new Date(shifted.getFullYear(), shifted.getMonth(), 1)
    })
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold text-slate-900">
        Kalender Laporan Harian
      </h2>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-lg text-slate-700 hover:bg-slate-50"
          aria-label="Bulan sebelumnya"
        >
          <ChevronLeft size={18} />
        </button>
        <p className="min-w-40 text-center text-2xl font-medium text-slate-800">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-lg text-slate-700 hover:bg-slate-50"
          aria-label="Bulan berikutnya"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[740px]">
          <div className="grid grid-cols-7 border-b border-slate-200 text-center">
            {dayLabels.map((label) => (
              <p
                key={label}
                className="py-3 text-lg font-medium text-slate-700"
              >
                {label}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {monthCells.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="h-20 border-b border-r border-slate-200 bg-slate-50/60"
                  />
                )
              }

              const dateKey = toDateKey(date)
              const record = records[dateKey]
              const isSelected = selectedDateKey === dateKey
              const isToday = todayKey === dateKey
              const isWeekend = date.getDay() === 0 || date.getDay() === 6

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => onDateClick(date)}
                  className={`h-20 border-b border-r border-slate-200 p-2 text-left transition ${
                    isWeekend ? "bg-slate-50/70" : "bg-white"
                  } ${isSelected ? "ring-2 ring-red-300 ring-inset" : "hover:bg-slate-50"}`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-2xl leading-none ${
                        isToday
                          ? "font-semibold text-red-700"
                          : "text-slate-500"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {record && (
                      <span className="rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        Isi
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <span
                      className={`inline-block h-3 w-3 rounded-full ${statusDotClass(record)}`}
                    />
                    <span>{record ? record.presence : "Belum"}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
