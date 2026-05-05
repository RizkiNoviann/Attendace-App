# Attendance App - Panduan Menjalankan Project (Local)

Panduan ini untuk menjalankan project dari awal, mulai dari clone repository sampai aplikasi bisa diakses.

## 1. Kebutuhan di Laptop Lokal

Pastikan sudah terpasang:

1. **Git**
2. **Node.js** (disarankan versi LTS, minimal 20.x) + **npm**
3. **Docker Desktop** (wajib, untuk MySQL container)
4. Terminal (PowerShell / CMD / Terminal bawaan VS Code)

## 2. Clone Repository

Ganti URL di bawah dengan URL repository GitHub Anda:

```bash
git clone <URL_REPOSITORY_GITHUB_ANDA>
cd Attendace-App
```

## 3. Setup Backend (Folder `BE`)

Masuk ke folder backend:

```bash
cd BE
```

### 3.1 Buat file `.env` dari `.env.example`

**PowerShell (Windows):**

```powershell
Copy-Item .env.example .env
```

### 3.2 Install dependency backend

```bash
npm install
```

### 3.3 Jalankan database MySQL via Docker

```bash
docker compose up -d
```

### 3.4 Generate Prisma + push schema + seed data

```bash
npm run db:setup
```

### 3.5 Jalankan semua service backend sekaligus

```bash
npm run start:all:dev
```

Perintah ini akan menjalankan:

- `auth-service` (port 3001)
- `employee-service` (port 3002)
- `attendance-service` (port 3003)

## 4. Setup Frontend (Folder `FE`)

Buka terminal baru, lalu:

```bash
cd FE
```

### 4.1 Buat file `.env` dari `.env.example`

**PowerShell (Windows):**

```powershell
Copy-Item .env.example .env
```

### 4.2 Install dependency frontend

```bash
npm install
```

### 4.3 Jalankan frontend

```bash
npm run dev
```

Frontend default berjalan di:

`http://localhost:5173`

## 5. Akun Login Testing

### User

- Email: `user@gmail.com`
- Password: `user123`

### Admin

- Email: `admindexa@gmail.com`
- Password: `admindexa123`

## 6. Cara Stop Project

1. Hentikan proses frontend dan backend di terminal (`Ctrl + C`)
2. Matikan container database:

```bash
cd BE
docker compose down
```

## 7. Catatan Penting

- Jika port bentrok, matikan aplikasi lain yang memakai port `3001`, `3002`, `3003`, `3306`, atau `5173`.
- File upload absen disimpan di backend:
  - `BE/uploads/attendance`
