import { useEffect, useMemo, useState } from "react"

function createInitialForm(data) {
  return {
    presence: data?.presence ?? "Hadir",
    imagePreviewUrl: data?.imagePreviewUrl ?? data?.imageUrl ?? "",
    imageFileName: data?.imageFileName ?? "",
    uploadFile: null,
  }
}

function formatDateLabel(date) {
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

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result ?? "")
    reader.onerror = () => reject(new Error("Gagal membaca file image."))
    reader.readAsDataURL(file)
  })
}

export default function AttendanceModal({
  isOpen,
  date,
  initialData,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(createInitialForm(initialData))
  const [submitError, setSubmitError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setForm(createInitialForm(initialData))
    setSubmitError("")
    setIsSubmitting(false)
  }, [isOpen, initialData])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isSubmitting, onClose])

  const dateLabel = useMemo(() => formatDateLabel(date), [date])

  if (!isOpen || !date) {
    return null
  }

  const handleClose = () => {
    if (isSubmitting) {
      return
    }
    onClose()
  }

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const previewUrl = await fileToDataUrl(file)
      setForm((previous) => ({
        ...previous,
        imagePreviewUrl: previewUrl,
        imageFileName: file.name,
        uploadFile: file,
      }))
    } catch {
      setSubmitError("Gagal memproses file image.")
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError("")
    setIsSubmitting(true)

    try {
      await onSave({
        presence: "Hadir",
        imageFile: form.uploadFile ?? null,
        imageFileName: form.imageFileName,
        imagePreviewUrl: form.imagePreviewUrl,
      })
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Gagal menyimpan data absen.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={handleClose}
        aria-label="Tutup modal"
      />

      <section className="relative z-10 w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-2xl font-medium text-slate-900">
              Tambah Laporan Harian
            </h2>
            <p className="mt-1 text-sm text-slate-500">{dateLabel}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md px-3 py-2 text-lg font-semibold text-slate-700 hover:bg-slate-100"
            aria-label="Tutup"
          >
            X
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 px-5 py-5 sm:px-6 sm:py-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="upload-image"
              className="text-base font-medium text-slate-900"
            >
              Upload file image (opsional)
            </label>
            <input
              id="upload-image"
              type="file"
              accept="image/*"
              onChange={handleUploadImage}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />
            {form.uploadFile && (
              <p className="text-xs text-slate-500">
                File dipilih: {form.imageFileName}
              </p>
            )}
            {form.imagePreviewUrl && (
              <div className="rounded-lg border border-slate-300 p-3">
                <img
                  src={form.imagePreviewUrl}
                  alt="Preview image absen"
                  className="max-h-56 w-full rounded-md object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <span className="text-base font-medium text-slate-900">
              Kehadiran
            </span>
            <label className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800">
              <input
                type="radio"
                name="presence"
                value="Hadir"
                checked={form.presence === "Hadir"}
                onChange={() =>
                  setForm((previous) => ({
                    ...previous,
                    presence: "Hadir",
                  }))
                }
                className="h-4 w-4 accent-red-700"
              />
              Hadir
            </label>
          </div>

          {submitError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Absen"}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
