import { useCallback, useEffect, useMemo, useRef, useState } from "react"

function createInitialForm(data) {
  return {
    presence: data?.presence ?? "Hadir",
    uploadedImageName: data?.uploadedImageName ?? "",
    capturedImageName: data?.capturedImageName ?? "",
    capturedImageDataUrl: data?.capturedImageDataUrl ?? "",
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

export default function AttendanceModal({
  isOpen,
  date,
  initialData,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(createInitialForm(initialData))
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState("")

  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsCameraOpen(false)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      stopCamera()
      return
    }

    setForm(createInitialForm(initialData))
    setCameraError("")
  }, [isOpen, initialData, stopCamera])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        stopCamera()
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, stopCamera])

  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  const dateLabel = useMemo(() => formatDateLabel(date), [date])

  if (!isOpen || !date) {
    return null
  }

  const handleClose = () => {
    stopCamera()
    onClose()
  }

  const handleOpenCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Browser tidak mendukung akses kamera langsung.")
      return
    }

    try {
      stopCamera()

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setCameraError("")
      setIsCameraOpen(true)
    } catch {
      setCameraError(
        "Kamera tidak bisa dibuka. Pastikan izin kamera aktif dan akses menggunakan HTTPS atau localhost.",
      )
    }
  }

  const handleCapturePhoto = () => {
    const videoElement = videoRef.current
    if (!videoElement || !videoElement.videoWidth || !videoElement.videoHeight) {
      setCameraError("Gagal mengambil foto. Coba buka kamera lagi.")
      return
    }

    const canvas = document.createElement("canvas")
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight

    const context = canvas.getContext("2d")
    if (!context) {
      setCameraError("Gagal memproses hasil foto.")
      return
    }

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
    const imageName = `capture-${Date.now()}.jpg`

    setForm((previous) => ({
      ...previous,
      capturedImageName: imageName,
      capturedImageDataUrl: imageDataUrl,
    }))

    setCameraError("")
    stopCamera()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    stopCamera()

    onSave({
      presence: "Hadir",
      uploadedImageName: form.uploadedImageName,
      capturedImageName: form.capturedImageName,
      capturedImageDataUrl: form.capturedImageDataUrl,
    })
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
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  uploadedImageName: event.target.files?.[0]?.name ?? "",
                }))
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />
            {form.uploadedImageName && (
              <p className="text-xs text-slate-500">
                File dipilih: {form.uploadedImageName}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-slate-900">
                Ambil foto secara langsung (opsional)
              </span>
              <button
                type="button"
                onClick={handleOpenCamera}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Buka Kamera
              </button>
            </div>

            {isCameraOpen && (
              <div className="overflow-hidden rounded-lg border border-slate-300 bg-slate-900">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="max-h-72 w-full object-cover"
                />
                <div className="flex items-center justify-end gap-2 border-t border-slate-700 bg-slate-900 p-3">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="rounded-md border border-slate-500 px-3 py-1.5 text-sm font-semibold text-slate-100 hover:bg-slate-800"
                  >
                    Tutup Kamera
                  </button>
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className="rounded-md bg-red-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-800"
                  >
                    Ambil Foto
                  </button>
                </div>
              </div>
            )}

            {form.capturedImageDataUrl && !isCameraOpen && (
              <div className="rounded-lg border border-slate-300 p-3">
                <img
                  src={form.capturedImageDataUrl}
                  alt="Hasil foto"
                  className="max-h-56 w-full rounded-md object-cover"
                />
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-500">{form.capturedImageName}</p>
                  <button
                    type="button"
                    onClick={handleOpenCamera}
                    className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Ambil Ulang
                  </button>
                </div>
              </div>
            )}

            {cameraError && <p className="text-xs text-red-600">{cameraError}</p>}
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

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
            >
              Simpan Absen
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
