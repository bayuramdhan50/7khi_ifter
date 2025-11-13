# Setup Role-Based Authentication

## Yang Sudah Dibuat

### 1. Database Migration
- File: `database/migrations/2025_01_13_000000_add_role_to_users_table.php`
- Menambahkan kolom `role` dengan enum values: `siswa`, `orangtua`, `guru`, `admin`

### 2. User Model Updates
- File: `app/Models/User.php`
- Menambahkan konstanta role
- Menambahkan helper methods: `hasRole()`, `isSiswa()`, `isOrangtua()`, `isGuru()`, `isAdmin()`

### 3. Middleware
- File: `app/Http/Middleware/CheckRole.php`
- Middleware untuk mengecek role user
- Sudah didaftarkan di `bootstrap/app.php` dengan alias `role`

### 4. Login Redirect Logic
- File: `app/Providers/FortifyServiceProvider.php`
- User akan diarahkan ke dashboard sesuai role setelah login

### 5. Controllers
- `app/Http/Controllers/Siswa/DashboardController.php`
- `app/Http/Controllers/Orangtua/DashboardController.php`
- `app/Http/Controllers/Guru/DashboardController.php`
- `app/Http/Controllers/Admin/DashboardController.php`

### 6. Routes
- File: `routes/web.php`
- Routes untuk setiap role dengan middleware protection

### 7. Dashboard Pages
- `resources/js/pages/siswa/dashboard.tsx` - Dashboard lengkap dengan kalender dan kegiatan
- `resources/js/pages/orangtua/dashboard.tsx` - Placeholder
- `resources/js/pages/guru/dashboard.tsx` - Placeholder
- `resources/js/pages/admin/dashboard.tsx` - Placeholder

### 8. Database Seeder
- File: `database/seeders/DatabaseSeeder.php`
- Membuat 4 user test dengan role berbeda

## Cara Menjalankan

### 1. Pastikan PHP OpenSSL sudah diaktifkan
```powershell
# Copy php.ini
Copy-Item "D:\AB DOWNLOAD\PHP\php.ini-development" "D:\AB DOWNLOAD\PHP\php.ini"

# Edit php.ini dan uncomment:
# extension=openssl
# extension_dir = "D:\AB DOWNLOAD\PHP\ext"

# Restart terminal dan verifikasi
php -m | Select-String openssl
```

### 2. Install Dependencies
```powershell
cd 'D:\Aji Katab\KULIAH\SEMESTER 7\INFORMATIKA TERAPAN\PROYEK\7khi_ifter'
composer install
npm install
```

### 3. Setup Environment
```powershell
# Jika .env belum ada
copy .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Setup Database
```powershell
# Buat database di MySQL dengan nama: 7khi_ifter
# Atau sesuaikan DB_DATABASE di file .env

# Run migrations
php artisan migrate

# Run seeder untuk membuat user test
php artisan db:seed
```

### 5. Build Frontend Assets
```powershell
# Development
npm run dev

# Atau production build
npm run build
```

### 6. Start Laravel Server
```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

## Test Users

Setelah menjalankan seeder, Anda dapat login dengan:

| Role      | Email                  | Password  | Dashboard URL              |
|-----------|------------------------|-----------|----------------------------|
| Siswa     | siswa@example.com      | password  | /siswa/dashboard          |
| Orangtua  | orangtua@example.com   | password  | /orangtua/dashboard       |
| Guru      | guru@example.com       | password  | /guru/dashboard           |
| Admin     | admin@example.com      | password  | /admin/dashboard          |

## Dashboard Siswa Features

Dashboard siswa yang sudah dibuat mencakup:
- 7 Kegiatan dengan icon dan badge (Bangun Pagi, Berbakti, Berolahraga, dll)
- Calendar dengan date picker
- Month/Year navigation
- Responsive design
- Gradient background matching desain

## Next Steps

Dashboard untuk role lain (Orangtua, Guru, Admin) masih placeholder. Anda bisa mengembangkan sesuai kebutuhan dengan pattern yang sama seperti dashboard siswa.
