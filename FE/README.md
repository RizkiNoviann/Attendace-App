# Attendance App Frontend

Frontend menggunakan React + Tailwind.

## Setup

1. Copy `.env.example` ke `.env`
2. Pastikan backend service sudah jalan:
   - auth-service: `http://localhost:3001`
   - employee-service: `http://localhost:3002`
   - attendance-service: `http://localhost:3003`
3. Install dan jalankan:

```bash
npm install
npm run dev
```

## Hooks API

Struktur hook API:

- `src/hooks/useApi.jsx` → parent CRUD helper
- `src/hooks/useAuth.jsx` → login, logout, profile
- `src/hooks/useEmployee.jsx` → list/tambah/ubah/hapus akun
- `src/hooks/useAttendance.jsx` → list dan submit absen (support upload image)

## Popup komponen

- `src/components/Popup.jsx` dipakai untuk:
  - notifikasi sukses (absen, tambah akun, ubah akun, hapus akun)
  - konfirmasi logout
