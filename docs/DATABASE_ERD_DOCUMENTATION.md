# Dokumentasi Struktur Database - 7khi_ifter

Dokumentasi lengkap struktur database sistem tracking 7 kebiasaan baik untuk siswa.

---

## 📊 Entity Relationship Diagram (ERD)

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   users     │────1:1──│   students   │────M:1──│   classes   │
└─────────────┘         └──────────────┘         └─────────────┘
       │                       │                         │
       │                       │                         │
       │                  ┌────┴────┐              ┌────┴────┐
       │                  │         │              │         │
       │                  │    ┌────┴──────┐      │    ┌────┴────┐
       │                  │    │  biodata  │      │    │ teachers│
       │                  │    │  _siswa   │      │    └─────────┘
       │                  │    └───────────┘      │
       │                  │                       │
       1:1                M:N                     1:M
       │                  │                       │
┌──────┴───────┐   ┌─────┴──────┐         ┌─────┴─────┐
│   teachers   │   │   parents  │         │   users   │
└──────────────┘   └────────────┘         └───────────┘
                          │
                          │ M:N
                          │
                   ┌──────┴────────┐
                   │ parent_student│
                   └───────────────┘


┌──────────────┐         ┌────────────────────┐
│  activities  │────1:M──│ activity_submissions│
└──────────────┘         └────────────────────┘
                                  │
                                  │ 1:1
                         ┌────────┴─────────┐
                         │                  │
        ┌────────────────┴──────┬───────────┴──────────┬─────────────┐
        │                       │                      │             │
┌───────┴────────┐   ┌──────────┴──────┐   ┌──────────┴───────┐   ...
│ bangun_pagi    │   │ beribadah       │   │ makan_sehat      │
│ _details       │   │ _details        │   │ _details         │
└────────────────┘   └─────────────────┘   └──────────────────┘
```

---

## 🗂️ Tabel Utama

### 1. **users** - Tabel Pengguna
Menyimpan informasi semua user sistem (admin, guru, siswa, orang tua).

**Kolom:**
- `id` - ID pengguna
- `name` - Nama lengkap
- `email` - Email (unique)
- `username` - Username untuk login (unique)
- `password` - Password terenkripsi
- `role` - Peran: 'admin', 'teacher', 'student', 'parent'
- `religion` - Agama: 'muslim', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu'
- `email_verified_at` - Waktu verifikasi email
- `remember_token` - Token remember me
- `two_factor_secret` - Secret 2FA
- `two_factor_recovery_codes` - Kode recovery 2FA
- `created_at`, `updated_at` - Timestamp

**Relasi:**
- 1:1 dengan `students` (jika role = student)
- 1:1 dengan `teachers` (jika role = teacher)
- 1:1 dengan `parents` (jika role = parent)

---

### 2. **classes** - Tabel Kelas
Menyimpan informasi kelas di sekolah.

**Kolom:**
- `id` - ID kelas
- `name` - Nama kelas (contoh: "X IPA 1")
- `teacher_id` - ID guru wali kelas (FK ke teachers)
- `created_at`, `updated_at` - Timestamp

**Relasi:**
- M:1 dengan `teachers` (wali kelas)
- 1:M dengan `students` (siswa dalam kelas)

---

### 3. **students** - Tabel Siswa
Menyimpan informasi siswa.

**Kolom:**
- `id` - ID siswa
- `user_id` - ID user (FK ke users)
- `nis` - Nomor Induk Siswa (unique)
- `class_id` - ID kelas (FK ke classes)
- `created_at`, `updated_at` - Timestamp

**Relasi:**
- 1:1 dengan `users`
- M:1 dengan `classes`
- 1:1 dengan `biodata_siswa`
- M:N dengan `parents` (melalui parent_student)
- 1:M dengan `activity_submissions`

---

### 4. **teachers** - Tabel Guru
Menyimpan informasi guru.

**Kolom:**
- `id` - ID guru
- `user_id` - ID user (FK ke users)
- `nip` - Nomor Induk Pegawai (unique)
- `created_at`, `updated_at` - Timestamp

**Relasi:**
- 1:1 dengan `users`
- 1:M dengan `classes` (sebagai wali kelas)

---

### 5. **parents** - Tabel Orang Tua
Menyimpan informasi orang tua siswa.

**Kolom:**
- `id` - ID orang tua
- `user_id` - ID user (FK ke users)
- `phone` - Nomor telepon
- `created_at`, `updated_at` - Timestamp

**Relasi:**
- 1:1 dengan `users`
- M:N dengan `students` (melalui parent_student)

---

### 6. **parent_student** - Tabel Pivot
Menghubungkan orang tua dengan siswa (many-to-many).

**Kolom:**
- `id` - ID
- `parent_id` - ID orang tua (FK ke parents)
- `student_id` - ID siswa (FK ke students)
- `created_at`, `updated_at` - Timestamp

---

### 7. **biodata_siswa** - Tabel Biodata Siswa
Menyimpan informasi tambahan siswa.

**Kolom:**
- `id` - ID biodata
- `student_id` - ID siswa (FK ke students, unique)
- `hobi` - Hobi siswa
- `cita_cita` - Cita-cita
- `makanan_kesukaan` - Makanan kesukaan
- `minuman_kesukaan` - Minuman kesukaan
- `hewan_kesukaan` - Hewan kesukaan
- `sesuatu_tidak_suka` - Hal yang tidak disukai
- `created_at`, `updated_at` - Timestamp

**Relasi:**
- 1:1 dengan `students`

---

## 📝 Tabel Aktivitas

### 8. **activities** - Tabel Kegiatan/Kebiasaan
Master data 7 kebiasaan baik.

**Kolom:**
- `id` - ID kegiatan
- `title` - Judul kegiatan
- `icon` - Icon kegiatan
- `color` - Warna tema
- `order` - Urutan tampilan
- `created_at`, `updated_at` - Timestamp

**Data:**
1. Bangun Pagi
2. Beribadah (Muslim/Non-Muslim)
3. Makan Sehat
4. Berolahraga
5. Gemar Belajar
6. Bermasyarakat
7. Tidur Cepat

**Relasi:**
- 1:M dengan `activity_submissions`

---

### 9. **activity_submissions** - Tabel Pengiriman Kegiatan
Menyimpan data pengiriman kegiatan harian siswa (parent table).

**Kolom:**
- `id` - ID submission
- `student_id` - ID siswa (FK ke students)
- `activity_id` - ID kegiatan (FK ke activities)
- `date` - Tanggal kegiatan
- `time` - Waktu input (untuk kegiatan dengan waktu)
- `photo` - Path foto kegiatan (1 foto per bulan)
- `status` - Status: 'pending', 'approved', 'rejected'
- `approved_by` - ID yang approve (FK ke users/teachers)
- `approved_at` - Waktu approve
- `created_at`, `updated_at` - Timestamp

**Index:**
- Unique: (student_id, activity_id, date) - Satu kegiatan per hari per siswa

**Relasi:**
- M:1 dengan `students`
- M:1 dengan `activities`
- 1:1 dengan detail tables (berdasarkan activity_id)

---

## 🔍 Tabel Detail Kegiatan

Setiap kegiatan memiliki tabel detail tersendiri untuk menyimpan informasi spesifik.

### 10. **bangun_pagi_details** - Detail Bangun Pagi
**Kolom:**
- `id` - ID detail
- `submission_id` - ID submission (FK ke activity_submissions)
- `wake_up_time` - Jam Bangun (time)
- `tidy_bed` - Membereskan Tempat Tidur (boolean)
- `mandi` - Mandi (boolean)
- `berpakaian_rapi` - Berpakaian Rapi (boolean)
- `sarapan` - Sarapan (boolean)
- `created_at`, `updated_at` - Timestamp

---

### 11. **beribadah_details** - Detail Beribadah
**Kolom:**
- `id` - ID detail
- `submission_id` - ID submission (FK ke activity_submissions)

**Untuk Muslim:**
- `subuh` - Sholat Subuh (boolean)
- `dzuhur` - Sholat Dzuhur (boolean)
- `ashar` - Sholat Ashar (boolean)
- `maghrib` - Sholat Maghrib (boolean)
- `isya` - Sholat Isya (boolean)
- `mengaji` - Mengaji (boolean)
- `berdoa` - Berdoa (boolean)
- `bersedekah` - Bersedekah (boolean)

**Untuk Non-Muslim:**
- `doa_pagi` - Doa Pagi (boolean)
- `baca_firman` - Baca Firman (boolean)
- `renungan` - Renungan (boolean)
- `doa_malam` - Doa Malam (boolean)
- `ibadah_bersama` - Ibadah Bersama (boolean)
- `lainnya` - Lainnya (boolean)

- `created_at`, `updated_at` - Timestamp

**Catatan:** Tabel ini digunakan untuk semua agama, field yang tidak relevan dibiarkan kosong.

---

### 12. **makan_sehat_details** - Detail Makan Sehat
**Kolom:**
- `id` - ID detail
- `submission_id` - ID submission (FK ke activity_submissions)
- `karbohidrat` - Jenis karbohidrat (string)
- `protein` - Jenis protein (string)
- `sayur` - Jenis sayuran (string)
- `buah` - Jenis buah (string)
- `created_at`, `updated_at` - Timestamp

---

### 13. **berolahraga_details** - Detail Berolahraga
**Kolom:**
- `id` - ID detail
- `submission_id` - ID submission (FK ke activity_submissions)
- `exercise_type` - Jenis olahraga (string)
- `waktu_berolahraga` - Durasi: "10 Menit", "20 Menit", "30 Menit" (string)
- `created_at`, `updated_at` - Timestamp

---

### 14. **gemar_belajar_details** - Detail Gemar Belajar
**Kolom:**
- `id` - ID detail
- `submission_id` - ID submission (FK ke activity_submissions)
- `study_type` - Jenis belajar (comma separated): "Gemar Belajar,Ekstrakurikuler,..." (text)
- `created_at`, `updated_at` - Timestamp

**Pilihan:**
- Gemar Belajar
- Ekstrakurikuler
- Bimbingan Belajar
- Mengerjakan Tugas
- Lainnya

---

### 15. **bermasyarakat_details** - Detail Bermasyarakat
**Kolom:**
- `id` - ID detail
- `submission_id` - ID submission (FK ke activity_submissions)
- `tarka` - Tarka (boolean)
- `kerja_bakti` - Kerja Bakti (boolean)
- `gotong_royong` - Gotong Royong (boolean)
- `lainnya` - Lainnya (boolean)
- `created_at`, `updated_at` - Timestamp

---

### 16. **tidur_cepat_details** - Detail Tidur Cepat
**Kolom:**
- `id` - ID detail
- `submission_id` - ID submission (FK ke activity_submissions)
- `sleep_time` - Jam Tidur (time)
- `created_at`, `updated_at` - Timestamp

---

## 📊 Tabel Tracking

### 17. **progress_tracking** - Tracking Progress Siswa
Menyimpan progress bulanan siswa untuk monitoring.

**Kolom:**
- `id` - ID tracking
- `student_id` - ID siswa (FK ke students)
- `month` - Bulan (1-12)
- `year` - Tahun
- `completed_activities` - Jumlah kegiatan selesai
- `total_activities` - Total kegiatan
- `completion_percentage` - Persentase penyelesaian
- `created_at`, `updated_at` - Timestamp

---

## 🔐 Tabel Keamanan

### 18. **cache** - Cache Data
**Kolom:**
- `key` - Cache key (unique)
- `value` - Cache value
- `expiration` - Waktu kadaluarsa

---

### 19. **cache_locks** - Lock untuk Cache
**Kolom:**
- `key` - Lock key (unique)
- `owner` - Owner
- `expiration` - Waktu kadaluarsa

---

### 20. **sessions** - Session Management
**Kolom:**
- `id` - Session ID (unique)
- `user_id` - ID user
- `ip_address` - IP address
- `user_agent` - User agent
- `payload` - Session data
- `last_activity` - Waktu aktivitas terakhir

---

### 21. **jobs** - Queue Jobs
**Kolom:**
- `id` - Job ID
- `queue` - Nama queue
- `payload` - Job payload
- `attempts` - Jumlah percobaan
- `reserved_at` - Waktu reserved
- `available_at` - Waktu tersedia
- `created_at` - Timestamp

---

### 22. **job_batches** - Batch Jobs
**Kolom:**
- `id` - Batch ID
- `name` - Nama batch
- `total_jobs` - Total jobs
- `pending_jobs` - Jobs pending
- `failed_jobs` - Jobs gagal
- `failed_job_ids` - ID jobs gagal
- `options` - Options
- `cancelled_at` - Waktu dibatalkan
- `created_at`, `finished_at` - Timestamp

---

### 23. **failed_jobs** - Jobs Gagal
**Kolom:**
- `id` - ID
- `uuid` - UUID (unique)
- `connection` - Koneksi
- `queue` - Queue
- `payload` - Payload
- `exception` - Exception detail
- `failed_at` - Timestamp

---

### 24. **password_reset_tokens** - Token Reset Password
**Kolom:**
- `email` - Email (primary key)
- `token` - Reset token
- `created_at` - Timestamp

---

### 25. **migrations** - Riwayat Migration
**Kolom:**
- `id` - ID
- `migration` - Nama file migration
- `batch` - Batch number

---

## 🔄 Alur Data Sistem

### 1. **Alur Registrasi & Login**
```
User Register → users (role: student)
            ↓
         students (user_id, nis, class_id)
            ↓
      biodata_siswa (student_id, ...)
```

### 2. **Alur Submit Kegiatan**
```
Siswa Login → Dashboard → Pilih Kegiatan
                              ↓
                    Cek Religion (untuk Beribadah)
                              ↓
                    Form Input Kegiatan
                              ↓
            activity_submissions (student_id, activity_id, date)
                              ↓
              Detail Table (bangun_pagi_details, dll)
```

### 3. **Alur Upload Foto**
```
Siswa di Form → Upload Foto → Validasi (1 foto/bulan)
                                    ↓
                          activity_submissions.photo
```

### 4. **Alur Approval**
```
Guru/Admin Login → Lihat Submissions → Approve/Reject
                                            ↓
                    activity_submissions (status, approved_by, approved_at)
```

### 5. **Alur Tracking Progress**
```
System Cron/Scheduler → Hitung Submissions per Bulan
                              ↓
                      progress_tracking (update)
```

---

## 🎯 Aturan Bisnis

### Submission Rules:
1. **Satu kegiatan per hari** - Unique constraint: (student_id, activity_id, date)
2. **Foto maksimal 1 per bulan** - Validasi di aplikasi
3. **Checkbox auto-save** - Update langsung ke detail table
4. **Time input lock** - Sekali input tidak bisa edit (untuk Bangun Pagi & Tidur Cepat)

### Religion-based Logic:
- **Muslim** → `beribadah_details` (subuh, dzuhur, ashar, maghrib, isya, mengaji, berdoa, bersedekah)
- **Kristen/Katolik/Hindu/Buddha/Konghucu** → `beribadah_details` (doa_pagi, baca_firman, renungan, doa_malam, ibadah_bersama)

### Photo Rules:
- Maksimal 1 foto per bulan per activity
- Stored di: `storage/app/public/activity-photos/`
- Path di DB: `activity-photos/filename.jpg`

---

## 📈 Perhitungan Progress

### Dashboard Percentage:
```
completionPercentage = (submissions_count / (days_in_month × 7)) × 100
```

### Completed Days:
```
completedDays = count(distinct dates with submissions)
```

---

## 🔍 Query Patterns

### Get Student Submissions:
```sql
SELECT s.*, d.*
FROM activity_submissions s
LEFT JOIN bangun_pagi_details d ON d.submission_id = s.id
WHERE s.student_id = ? 
  AND s.activity_id = ?
  AND s.date = ?
```

### Count Photos This Month:
```sql
SELECT COUNT(*)
FROM activity_submissions
WHERE student_id = ?
  AND activity_id = ?
  AND YEAR(date) = ?
  AND MONTH(date) = ?
  AND photo IS NOT NULL
  AND photo != ''
```

### Get History with Pagination:
```sql
SELECT s.*, d.*
FROM activity_submissions s
LEFT JOIN bangun_pagi_details d ON d.submission_id = s.id
WHERE s.student_id = ?
  AND s.activity_id = ?
ORDER BY s.date DESC
LIMIT ? OFFSET ?
```

---

## 📝 Catatan Penting

1. **Soft Deletes**: Tidak digunakan di sistem ini
2. **Timestamps**: Semua tabel memiliki `created_at` dan `updated_at`
3. **Foreign Keys**: Menggunakan `onDelete('cascade')` untuk data integrity
4. **Indexes**: 
   - Unique pada email, username, nis, nip
   - Index pada foreign keys
   - Composite unique pada (student_id, activity_id, date)

---

Dokumentasi ini dibuat: {{ date }}
Versi Database: 1.0
