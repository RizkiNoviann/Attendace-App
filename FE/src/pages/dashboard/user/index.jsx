import { useMemo, useState } from "react"
import { House } from "lucide-react"
import AttendanceCalendar from "../../../components/AttendanceCalendar"
import AttendanceModal from "../../../components/AttendanceModal"
import DashboardLayout from "../../../components/DashboardLayout"

const userLinks = [{ path: "/user/dashboard", label: "Dashboard", icon: House }]

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function UserDashboardPage({ currentPath, navigate }) {
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    return {
      [toDateKey(yesterday)]: {
        presence: "Hadir",
        uploadedImageName: "laporan-harian.jpg",
        capturedImageName: "",
      },
    }
  })
  const [selectedDate, setSelectedDate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const attendanceValues = useMemo(
    () => Object.values(attendanceRecords),
    [attendanceRecords],
  )
  const submittedCount = attendanceValues.length
  const hadirCount = attendanceValues.filter(
    (record) => record.presence === "Hadir",
  ).length
  const attendanceRate =
    submittedCount === 0 ? 0 : Math.round((hadirCount / submittedCount) * 100)

  const summaryCards = [
    {
      title: "Absensi Terkirim",
      value: String(submittedCount),
      detail: "Total laporan harian yang sudah tersimpan.",
    },
    {
      title: "Rasio Kehadiran",
      value: `${attendanceRate}%`,
      detail: `${hadirCount} hari hadir dari ${submittedCount} laporan.`,
    },
  ]

  const selectedRecord = selectedDate
    ? attendanceRecords[toDateKey(selectedDate)]
    : null

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleSaveAttendance = (payload) => {
    if (!selectedDate) {
      return
    }

    const dateKey = toDateKey(selectedDate)
    setAttendanceRecords((previous) => ({
      ...previous,
      [dateKey]: payload,
    }))
    setIsModalOpen(false)
  }

  return (
    <DashboardLayout
      roleLabel="RN"
      links={userLinks}
      currentPath={currentPath}
      navigate={navigate}
    >
      <div className="space-y-6">
        <section>
          <article className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-red-700">
              Selamat datang kembali, Rizki Novian.
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Divisi</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Digital Product
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Posisi</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  IT Development
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Periode</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Jan - Jun 2024
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-4">
          {summaryCards.map((card) => (
            <article
              key={card.title}
              className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {card.title}
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {card.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{card.detail}</p>
            </article>
          ))}
        </section>

        <AttendanceCalendar
          records={attendanceRecords}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
        />
      </div>

      <AttendanceModal
        isOpen={isModalOpen}
        date={selectedDate}
        initialData={selectedRecord}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAttendance}
      />
    </DashboardLayout>
  )
}
