import { useMemo, useState } from 'react'
import { House, User } from 'lucide-react'
import AdminAttendanceListModal from '../../../components/AdminAttendanceListModal'
import AttendanceCalendar from '../../../components/AttendanceCalendar'
import DashboardLayout from '../../../components/DashboardLayout'

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: House },
  { path: '/admin/account-management', label: 'User Management', icon: User },
]

const adminAttendanceByDate = {
  '2026-05-01': [
    {
      name: 'Rizki Novian',
      division: 'Digital Product',
      time: '08:05',
      imageUrl: '/favicon.svg',
    },
    {
      name: 'Siti Aminah',
      division: 'Human Resources',
      time: '08:14',
      imageUrl: '',
    },
  ],
  '2026-05-02': [
    {
      name: 'Aditya Pratama',
      division: 'Teknologi Informasi',
      time: '08:01',
      imageUrl: '',
    },
  ],
  '2026-05-06': [
    {
      name: 'Dewi Lestari',
      division: 'Keuangan',
      time: '08:20',
      imageUrl: '/favicon.svg',
    },
    {
      name: 'Budi Santoso',
      division: 'Marketing',
      time: '08:16',
      imageUrl: '',
    },
  ],
}

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function AdminDashboardPage({ currentPath, navigate }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const calendarRecords = useMemo(
    () =>
      Object.keys(adminAttendanceByDate).reduce((result, dateKey) => {
        result[dateKey] = { presence: 'Hadir' }
        return result
      }, {}),
    [],
  )

  const selectedAttendances = selectedDate
    ? adminAttendanceByDate[toDateKey(selectedDate)] ?? []
    : []

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  return (
    <DashboardLayout
      roleLabel="AD"
      links={adminLinks}
      currentPath={currentPath}
      navigate={navigate}
    >
      <AttendanceCalendar
        records={calendarRecords}
        selectedDate={selectedDate}
        onDateClick={handleDateClick}
      />

      <AdminAttendanceListModal
        isOpen={isModalOpen}
        date={selectedDate}
        attendances={selectedAttendances}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  )
}
