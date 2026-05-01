import DashboardLayout from '../../../components/DashboardLayout'
import { House, User } from 'lucide-react'

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: House },
  { path: '/admin/account-management', label: 'User Management', icon: User },
]

const users = [
  {
    name: 'Aditya Pratama',
    email: 'aditya.p@university.ac.id',
    division: 'Teknologi Informasi',
    position: 'Frontend Dev',
    period: 'Jan - Jun 2024',
    status: 'Aktif',
  },
  {
    name: 'Siti Aminah',
    email: 'siti.aminah@portal.com',
    division: 'Human Resources',
    position: 'Talent Acquisition',
    period: 'Mar - Aug 2024',
    status: 'Pending',
  },
  {
    name: 'Budi Santoso',
    email: 'budi.san@outlook.com',
    division: 'Marketing',
    position: 'Socmed Specialist',
    period: 'Jan - Jun 2024',
    status: 'Aktif',
  },
  {
    name: 'Dewi Lestari',
    email: 'dewi.l@univ-jakarta.id',
    division: 'Keuangan',
    position: 'Data Analyst',
    period: 'Feb - Jul 2024',
    status: 'Nonaktif',
  },
]

function statusBadge(status) {
  if (status === 'Aktif') {
    return 'bg-emerald-100 text-emerald-700'
  }
  if (status === 'Pending') {
    return 'bg-amber-100 text-amber-700'
  }
  return 'bg-slate-200 text-slate-700'
}

export default function AdminAccountManagementPage({ currentPath, navigate }) {
  return (
    <DashboardLayout
      roleLabel="AD"
      links={adminLinks}
      currentPath={currentPath}
      navigate={navigate}
    >
      <div className="space-y-6">
        <section>
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total Akun
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">1,284</p>
          </article>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Daftar Akun Internship
              </h2>
              <p className="text-sm text-slate-500">
                Data user dibuat responsive untuk mobile dan desktop.
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Tambah Akun
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 sm:px-5">Nama</th>
                  <th className="px-4 py-3 sm:px-5">Email</th>
                  <th className="px-4 py-3 sm:px-5">Divisi</th>
                  <th className="px-4 py-3 sm:px-5">Posisi</th>
                  <th className="px-4 py-3 sm:px-5">Periode</th>
                  <th className="px-4 py-3 sm:px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.email} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900 sm:px-5">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600 sm:px-5">{user.email}</td>
                    <td className="px-4 py-3 text-slate-600 sm:px-5">
                      {user.division}
                    </td>
                    <td className="px-4 py-3 text-slate-600 sm:px-5">
                      {user.position}
                    </td>
                    <td className="px-4 py-3 text-slate-600 sm:px-5">{user.period}</td>
                    <td className="px-4 py-3 sm:px-5">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
