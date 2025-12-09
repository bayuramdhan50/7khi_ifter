# Database Structure - Separate Activity Details Tables

## Overview
Tabel `activity_details` yang sebelumnya menyimpan semua detail dari 7 kebiasaan telah dipisahkan menjadi 7 tabel terpisah untuk optimasi performa dan kemudahan maintenance.

## New Tables Structure

### 1. bangun_pagi_details
**Kolom:**
- `id` - Primary key
- `submission_id` - Foreign key ke activity_submissions
- `wake_up_time` - Waktu bangun (time)
- `tidy_bed` - Membereskan tempat tidur (boolean)
- `open_window` - Membuka jendela (boolean)
- `morning_prayer` - Berdoa pagi (boolean)
- `tidy_room` - Merapikan kamar (boolean)
- `sleep_duration` - Durasi tidur dalam menit (integer)

### 2. berolahraga_details
**Kolom:**
- `id` - Primary key
- `submission_id` - Foreign key ke activity_submissions
- `exercise_type` - Jenis olahraga (string)
- `exercise_time` - Waktu olahraga (time)
- `exercise_duration` - Durasi olahraga dalam menit (integer)
- `repetition` - Jumlah repetisi (integer)

### 3. beribadah_details
**Kolom:**
- `id` - Primary key
- `submission_id` - Foreign key ke activity_submissions
- **Untuk Muslim:**
  - `subuh`, `dzuhur`, `ashar`, `maghrib`, `isya` (boolean)
  - `mengaji`, `berdoa`, `bersedekah`, `lainnya` (boolean)
- **Untuk Non-Muslim:**
  - `doa_pagi`, `baca_firman`, `renungan` (boolean)
  - `doa_malam`, `ibadah_bersama` (boolean)

### 4. gemar_belajar_details
**Kolom:**
- `id` - Primary key
- `submission_id` - Foreign key ke activity_submissions
- `subject` - Mata pelajaran (string)
- `study_time` - Waktu belajar (time)
- `study_duration` - Durasi belajar dalam menit (integer)
- `study_type` - Jenis kegiatan belajar (string)

### 5. makan_sehat_details
**Kolom:**
- `id` - Primary key
- `submission_id` - Foreign key ke activity_submissions
- **Sarapan:**
  - `breakfast`, `breakfast_menu`, `breakfast_time`
- **Makan Siang:**
  - `lunch`, `lunch_menu`, `lunch_time`
- **Makan Malam:**
  - `dinner`, `dinner_menu`, `dinner_time`
- **Lainnya:**
  - `water_glasses` - Jumlah gelas air (integer)
  - `fruits`, `vegetables` (boolean)

### 6. bermasyarakat_details
**Kolom:**
- `id` - Primary key
- `submission_id` - Foreign key ke activity_submissions
- `activity_type` - Jenis kegiatan sosial (string)
- `activity_description` - Deskripsi kegiatan (text)
- `activity_duration` - Durasi dalam menit (integer)
- `with_whom` - Dengan siapa (string)

### 7. tidur_cepat_details
**Kolom:**
- `id` - Primary key
- `submission_id` - Foreign key ke activity_submissions
- `sleep_time` - Waktu tidur (time)
- `brush_teeth` - Gosok gigi (boolean)
- `wash_face` - Cuci muka (boolean)
- `change_clothes` - Ganti baju (boolean)
- `prayer_before_sleep` - Berdoa sebelum tidur (boolean)
- `turn_off_gadget` - Matikan gadget (boolean)
- `tidy_bed_before_sleep` - Rapikan tempat tidur (boolean)

## Models

Setiap tabel memiliki model Eloquent:
- `BangunPagiDetail`
- `BerolahragaDetail`
- `BeribadahDetail`
- `GemarBelajarDetail`
- `MakanSehatDetail`
- `BermasyarakatDetail`
- `TidurCepatDetail`

## Relationships

### ActivitySubmission Model
```php
$submission->bangunPagiDetail()
$submission->berolahragaDetail()
$submission->beribadahDetail()
$submission->gemarBelajarDetail()
$submission->makanSehatDetail()
$submission->bermasyarakatDetail()
$submission->tidurCepatDetail()
```

### Detail Models (hasOne)
Setiap detail model memiliki relationship ke `ActivitySubmission`:
```php
$detail->submission()
```

## Benefits

✅ **Performance:** Query lebih cepat dengan index yang lebih efisien
✅ **Maintainability:** Lebih mudah maintenance per kebiasaan
✅ **Scalability:** Lebih mudah di-scale dan di-optimize
✅ **Clarity:** Struktur data lebih jelas dan spesifik
✅ **Flexibility:** Bisa customize sesuai kebutuhan masing-masing kebiasaan

## Migration Status

- ✅ Migration tabel baru: `2025_12_05_041505_create_separate_activity_details_tables.php`
- ✅ Migration data: `2025_12_05_042036_migrate_data_to_separate_detail_tables.php`
- ⚠️  Tabel lama `activity_details` masih ada (untuk backup/rollback jika diperlukan)

## Next Steps

**Update aplikasi untuk menggunakan tabel baru:**
1. Update Controller untuk save/retrieve dari tabel baru
2. Update seeder jika ada
3. Test semua fitur activity submission
4. Setelah yakin stabil, bisa drop tabel `activity_details` lama

## Rollback

Jika ada masalah dan perlu rollback:
```bash
php artisan migrate:rollback --step=2
```

Ini akan menghapus tabel baru dan data migration.
