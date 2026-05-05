# Attendance App Backend (Microservices)

Backend ini memakai **NestJS + Prisma + MySQL** dengan 3 service dan 3 database terpisah:

- `auth-service` → `auth_db`
- `employee-service` → `employee_db`
- `attendance-service` → `attendance_db`

Semua database berjalan di **satu container MySQL**.

## 1. Jalankan MySQL Docker

```bash
docker compose up -d
```

`docker-compose.yml` akan membuat:

- container `attendance-app-mysql`
- database `auth_db`, `employee_db`, `attendance_db`

## 2. Setup environment

Copy `.env.example` menjadi `.env`, lalu sesuaikan jika perlu.

## 3. Install dependencies

```bash
npm install
```

## 4. Generate Prisma client + push schema + seed

```bash
npm run db:setup
```

## 5. Jalankan service

Di terminal terpisah:

```bash
npm run start:auth:dev
npm run start:employee:dev
npm run start:attendance:dev
```

## Endpoint utama

### Auth Service (`http://localhost:3001`)

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/profile`
- `POST /auth/accounts` (internal sync from employee-service)
- `PUT /auth/accounts/:employeeId` (internal sync from employee-service)
- `DELETE /auth/accounts/:employeeId` (internal sync from employee-service)

### Employee Service (`http://localhost:3002`)

- `GET /employees` (admin only)
- `POST /employees` (admin only, untuk tambah akun)
- `PUT /employees/:id` (admin only, untuk ubah akun)
- `DELETE /employees/:id` (admin only, untuk hapus akun)

### Attendance Service (`http://localhost:3003`)

- `GET /attendance?date=YYYY-MM-DD`
- `POST /attendance` (multipart/form-data, field file image: `image`, opsional)

## Penyimpanan image absen

Image upload dan hasil foto kamera sama-sama disimpan di folder:

`BE/uploads/attendance`

Path image yang dikembalikan API berbentuk:

`/uploads/attendance/<nama-file>`

## Akun test login

### User

- Nama: `User Test`
- Email: `user@gmail.com`
- Password: `user123`
- Divisi: `IT`
- Posisi: `Frontend Dev`

### Admin

- Nama: `Admin`
- Email: `admindexa@gmail.com`
- Password: `admindexa123`
- Divisi: `admin`
- Posisi: `admin`
