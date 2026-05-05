import { useState } from "react"
import { House, User } from "lucide-react"
import AdminAttendanceListModal from "../../../components/AdminAttendanceListModal"
import AttendanceCalendar from "../../../components/AttendanceCalendar"
import DashboardLayout from "../../../components/DashboardLayout"
import useAttendance from "../../../hooks/useAttendance"

const adminLinks = [
  { path: "/admin/dashboard", label: "Dashboard", icon: House },
  { path: "/admin/account-management", label: "User Management", icon: User },
]
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
    return "AD"
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
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

export default function AdminDashboardPage({
  currentPath,
  navigate,
  authUser,
  onLogout,
}) {
  const { getAttendances } = useAttendance()
  const [selectedDate, setSelectedDate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingAttendances, setIsLoadingAttendances] = useState(false)
  const [selectedAttendances, setSelectedAttendances] = useState([])

  const handleDateClick = async (date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
    setIsLoadingAttendances(true)

    try {
      const response = await getAttendances(toDateKey(date))
      const mapped = (response?.data ?? []).map((attendance) => ({
        name: attendance.employeeName,
        division: attendance.division,
        time: attendance.checkInTime,
        imageUrl: resolveImageUrl(attendance.imageUrl),
      }))
      setSelectedAttendances(mapped)
    } catch {
      setSelectedAttendances([])
    } finally {
      setIsLoadingAttendances(false)
    }
  }

  return (
    <DashboardLayout
      roleLabel={getInitials(authUser?.name)}
      links={adminLinks}
      currentPath={currentPath}
      navigate={navigate}
      onLogout={onLogout}
    >
      <AttendanceCalendar
        records={{}}
        selectedDate={selectedDate}
        onDateClick={handleDateClick}
        showStatus={false}
        title="Kalender Monitoring Absensi"
      />

      <AdminAttendanceListModal
        isOpen={isModalOpen}
        date={selectedDate}
        attendances={selectedAttendances}
        isLoading={isLoadingAttendances}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  )
}
