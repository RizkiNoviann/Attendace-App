import { useCallback, useEffect, useState } from "react"
import { House, Pencil, Trash2, User, X } from "lucide-react"
import DashboardLayout from "../../../components/DashboardLayout"
import Popup from "../../../components/Popup"
import useEmployee from "../../../hooks/useEmployee"

const adminLinks = [
  { path: "/admin/dashboard", label: "Dashboard", icon: House },
  { path: "/admin/account-management", label: "User Management", icon: User },
]

const initialForm = {
  name: "",
  email: "",
  password: "",
  division: "",
  position: "",
  role: "USER",
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

export default function AdminAccountManagementPage({
  currentPath,
  navigate,
  authToken,
  authUser,
  onLogout,
}) {
  const { getEmployees, createEmployee, updateEmployee, deleteEmployee } =
    useEmployee()

  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formMode, setFormMode] = useState("create")
  const [editingUserId, setEditingUserId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [submitError, setSubmitError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [successPopup, setSuccessPopup] = useState({
    isOpen: false,
    title: "",
    message: "",
  })

  const showSuccessPopup = (title, message) => {
    setSuccessPopup({
      isOpen: true,
      title,
      message,
    })
  }

  const closeSuccessPopup = () => {
    setSuccessPopup({
      isOpen: false,
      title: "",
      message: "",
    })
  }

  const loadEmployees = useCallback(async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await getEmployees(authToken)
      setUsers(response?.data ?? [])
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Gagal memuat data akun.",
      )
    } finally {
      setIsLoading(false)
    }
  }, [authToken, getEmployees])

  useEffect(() => {
    if (!authToken) {
      return
    }
    loadEmployees()
  }, [authToken, loadEmployees])

  const handleOpenCreateModal = () => {
    setFormMode("create")
    setEditingUserId(null)
    setForm(initialForm)
    setSubmitError("")
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (user) => {
    setFormMode("edit")
    setEditingUserId(user.id)
    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
      password: user.password ?? "",
      division: user.division ?? "",
      position: user.position ?? "",
      role: user.role ?? "USER",
    })
    setSubmitError("")
    setIsModalOpen(true)
  }

  const handleSubmitAccount = async (event) => {
    event.preventDefault()
    setSubmitError("")
    setIsSubmitting(true)

    try {
      if (formMode === "edit" && editingUserId) {
        const response = await updateEmployee(editingUserId, form, authToken)
        const updatedUser = response?.data

        if (updatedUser) {
          setUsers((previous) =>
            previous.map((user) =>
              user.id === editingUserId ? updatedUser : user,
            ),
          )
        }

        setIsModalOpen(false)
        showSuccessPopup("Berhasil", "Akun berhasil diubah.")
      } else {
        const response = await createEmployee(form, authToken)
        const createdUser = response?.data

        if (createdUser) {
          setUsers((previous) => [createdUser, ...previous])
        }

        setIsModalOpen(false)
        showSuccessPopup("Berhasil", "Akun berhasil ditambahkan.")
      }

      setForm(initialForm)
      setEditingUserId(null)
      setFormMode("create")
    } catch (requestError) {
      setSubmitError(
        requestError instanceof Error
          ? requestError.message
          : formMode === "edit"
            ? "Gagal mengubah akun."
            : "Gagal menambahkan akun.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) {
      return
    }

    setIsDeleting(true)
    setError("")

    try {
      await deleteEmployee(deleteTarget.id, authToken)
      setUsers((previous) =>
        previous.filter((user) => user.id !== deleteTarget.id),
      )
      setDeleteTarget(null)
      showSuccessPopup("Berhasil", "Akun berhasil dihapus.")
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Gagal menghapus akun.",
      )
    } finally {
      setIsDeleting(false)
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
      <div className="space-y-6">
        <section>
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total Akun
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {users.length.toLocaleString("id-ID")}
            </p>
          </article>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Daftar Akun Internship
              </h2>
              <p className="text-sm text-slate-500">
                Data akun diambil dari employee service.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Tambah Akun
            </button>
          </div>

          {error && (
            <div className="border-b border-slate-200 bg-red-50 px-5 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 sm:px-5">Nama</th>
                  <th className="px-4 py-3 sm:px-5">Email</th>
                  <th className="px-4 py-3 sm:px-5">Password</th>
                  <th className="px-4 py-3 sm:px-5">Divisi</th>
                  <th className="px-4 py-3 sm:px-5">Posisi</th>
                  <th className="px-4 py-3 sm:px-5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                      Memuat data akun...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                      Belum ada akun.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id ?? user.email} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900 sm:px-5">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600 sm:px-5">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-slate-600 sm:px-5">
                        {user.password}
                      </td>
                      <td className="px-4 py-3 text-slate-600 sm:px-5">
                        {user.division}
                      </td>
                      <td className="px-4 py-3 text-slate-600 sm:px-5">
                        {user.position}
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            aria-label={`Edit ${user.name}`}
                            onClick={() => handleOpenEditModal(user)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="rounded-md p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                            aria-label={`Hapus ${user.name}`}
                            onClick={() => setDeleteTarget(user)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
            aria-label="Tutup modal akun"
          />

          <section className="relative z-10 w-full max-w-xl rounded-xl bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {formMode === "edit" ? "Ubah Akun" : "Tambah Akun"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </header>

            <form onSubmit={handleSubmitAccount} className="space-y-4 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Nama</span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        name: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>

                <label className="space-y-1">
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
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Password</span>
                  <input
                    type="text"
                    required
                    value={form.password}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        password: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Divisi</span>
                  <input
                    required
                    value={form.division}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        division: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Posisi</span>
                  <input
                    required
                    value={form.position}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        position: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Role</span>
                  <select
                    value={form.role}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        role: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </label>
              </div>

              {submitError && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {submitError}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting
                    ? "Menyimpan..."
                    : formMode === "edit"
                      ? "Simpan Perubahan"
                      : "Simpan Akun"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <Popup
        isOpen={Boolean(deleteTarget)}
        type="confirm"
        title="Konfirmasi hapus akun"
        message={`Apakah anda yakin ingin menghapus akun ${deleteTarget?.name ?? ""}?`}
        confirmText={isDeleting ? "Menghapus..." : "Ya, Hapus"}
        cancelText="Batal"
        confirmVariant="danger"
        onClose={() => {
          if (!isDeleting) {
            setDeleteTarget(null)
          }
        }}
        onConfirm={handleConfirmDelete}
      />

      <Popup
        isOpen={successPopup.isOpen}
        title={successPopup.title}
        message={successPopup.message}
        confirmText="Tutup"
        onClose={closeSuccessPopup}
      />
    </DashboardLayout>
  )
}
