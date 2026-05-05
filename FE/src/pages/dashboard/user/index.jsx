import { useEffect, useMemo, useState } from "react"
import { House } from "lucide-react"
import AdminAttendanceListModal from "../../../components/AdminAttendanceListModal"
import AttendanceCalendar from "../../../components/AttendanceCalendar"
import AttendanceModal from "../../../components/AttendanceModal"
import DashboardLayout from "../../../components/DashboardLayout"
import Popup from "../../../components/Popup"
import useAttendance from "../../../hooks/useAttendance"

const userLinks = [{ path: "/user/dashboard", label: "Dashboard", icon: House }]
const attendanceBaseUrl =
  import.meta.env.VITE_ATTENDANCE_API_URL ?? "http://localhost:3003"

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getInitials(name) {
  if (!name) {
    return "US"
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
}

function toTimeString(date = new Date()) {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

function resolveImageUrl(imageUrl) {
  if (!imageUrl) {
    return ""
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl
  }

  return `${attendanceBaseUrl}${imageUrl}`
}

function mapAttendanceToRecord(attendance) {
  const attendanceDate = new Date(attendance.attendanceDate)
  return {
    dateKey: toDateKey(attendanceDate),
    data: {
      name: attendance.employeeName,
      division: attendance.division,
      checkInTime: attendance.checkInTime,
      presence: "Hadir",
      imageUrl: resolveImageUrl(attendance.imageUrl),
      imageFileName:
        attendance.imageUrl?.split("/").pop() ?? "image-absen.jpg",
    },
  }
}

export default function UserDashboardPage({
  currentPath,
  navigate,
  authUser,
  onLogout,
}) {
  const { getAttendances, createAttendance } = useAttendance()
  const [attendanceRecords, setAttendanceRecords] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [isAttendanceDetailOpen, setIsAttendanceDetailOpen] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isActive = true
    setIsLoading(true)
    setError("")

    getAttendances()
      .then((response) => {
        if (!isActive) {
          return
        }

        const records = {}
        const rows = response?.data ?? []
        rows
          .filter((row) => row.employeeName === authUser?.name)
          .forEach((row) => {
            const { dateKey, data } = mapAttendanceToRecord(row)
            records[dateKey] = data
          })

        setAttendanceRecords(records)
      })
      .catch((requestError) => {
        if (!isActive) {
          return
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Gagal memuat data absen.",
        )
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [authUser?.name, getAttendances])

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
  const selectedAttendances = selectedRecord
    ? [
        {
          name: selectedRecord.name ?? authUser?.name ?? "-",
          division: selectedRecord.division ?? authUser?.division ?? "-",
          time: selectedRecord.checkInTime ?? "-",
          imageUrl: selectedRecord.imageUrl ?? "",
        },
      ]
    : []

  const handleDateClick = (date) => {
    const dateKey = toDateKey(date)
    const hasAttendance = Boolean(attendanceRecords[dateKey])

    setSelectedDate(date)
    setIsAttendanceModalOpen(!hasAttendance)
    setIsAttendanceDetailOpen(hasAttendance)
  }

  const handleSaveAttendance = async (payload) => {
    if (!selectedDate) {
      return
    }

    const attendanceDate = toDateKey(selectedDate)
    if (attendanceRecords[attendanceDate]) {
      throw new Error("Anda sudah absen di tanggal ini.")
    }

    const checkInTime = toTimeString()
    const formData = new FormData()
    formData.append("employeeName", authUser?.name ?? "User")
    formData.append("division", authUser?.division ?? "-")
    formData.append("checkInTime", checkInTime)
    formData.append("attendanceDate", attendanceDate)

    if (payload.imageFile) {
      formData.append("image", payload.imageFile)
    }

    const response = await createAttendance(formData)
    const savedAttendance = response?.data

    setAttendanceRecords((previous) => {
      if (!savedAttendance) {
        return {
          ...previous,
          [attendanceDate]: {
            name: authUser?.name ?? "User",
            division: authUser?.division ?? "-",
            checkInTime,
            presence: "Hadir",
            imageUrl: payload.imagePreviewUrl ?? "",
            imageFileName: payload.imageFileName ?? "",
          },
        }
      }

      const { dateKey, data } = mapAttendanceToRecord(savedAttendance)
      return {
        ...previous,
        [dateKey]: data,
      }
    })

    setIsAttendanceModalOpen(false)
    setIsPopupOpen(true)
  }

  return (
    <DashboardLayout
      roleLabel={getInitials(authUser?.name)}
      links={userLinks}
      currentPath={currentPath}
      navigate={navigate}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <section>
          <article className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-red-700">
              Selamat datang kembali, {authUser?.name ?? "User"}.
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Divisi</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {authUser?.division ?? "-"}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Posisi</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {authUser?.position ?? "-"}
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

        {error && (
          <section className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </section>
        )}

        {isLoading ? (
          <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
            Memuat data absen...
          </section>
        ) : (
          <AttendanceCalendar
            records={attendanceRecords}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
          />
        )}
      </div>

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        date={selectedDate}
        initialData={selectedRecord}
        onClose={() => setIsAttendanceModalOpen(false)}
        onSave={handleSaveAttendance}
      />

      <AdminAttendanceListModal
        isOpen={isAttendanceDetailOpen}
        date={selectedDate}
        attendances={selectedAttendances}
        isLoading={false}
        onClose={() => setIsAttendanceDetailOpen(false)}
      />

      <Popup
        isOpen={isPopupOpen}
        title="Absen berhasil"
        message="Data absen berhasil disimpan."
        confirmText="Tutup"
        onClose={() => setIsPopupOpen(false)}
      />
    </DashboardLayout>
  )
}
