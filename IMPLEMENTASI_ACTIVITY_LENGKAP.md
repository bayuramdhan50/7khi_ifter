# Implementasi Lengkap: Kegiatan 2-6 dengan Database & Upload Foto

## Status Implementasi

✅ **Kegiatan 1 - Bangun Pagi**: SELESAI (sudah lengkap)
✅ **Kegiatan 2 - Berolahraga**: SELESAI (baru saja selesai)
⏳ **Kegiatan 3 - Gemar Belajar**: Perlu implementasi
⏳ **Kegiatan 4 - Makan Sehat**: Perlu implementasi  
⏳ **Kegiatan 5 - Bermasyarakat**: Perlu implementasi
⏳ **Kegiatan 6 - Tidur Cepat**: Perlu implementasi

## Backend (SUDAH SELESAI SEMUA)

✅ Method universal `submitActivity()` sudah dibuat
✅ Route `/siswa/activities/submit` sudah ditambahkan
✅ Validasi foto 1 per bulan sudah ada
✅ PhotoCountThisMonth sudah ditambahkan ke semua detail controllers

## Field Mapping Per Activity

### Kegiatan 3: Gemar Belajar
**File**: `gemar-belajar-detail.tsx`
**Fields**:
- `ekstrakurikuler` (checkbox)
- `bimbingan_belajar` (checkbox)
- `mengerjakan_tugas` (checkbox)
- `lainnya` (checkbox)

### Kegiatan 4: Makan Sehat  
**File**: `makan-sehat-detail.tsx`
**Fields**:
- `karbohidrat` (dropdown: Nasi, Roti, Kentang, Mie, Singkong, Ubi, Lainnya, Tidak Ada)
- `protein` (dropdown: Ayam, Ikan, Daging, Telur, Tempe, Tahu, Lainnya, Tidak Ada)
- `sayur` (dropdown: Bayam, Kangkung, Wortel, Brokoli, Kol, Tomat, Lainnya, Tidak Ada)
- `buah` (dropdown: Pisang, Apel, Jeruk, Pepaya, Semangka, Mangga, Lainnya, Tidak Ada)

### Kegiatan 5: Bermasyarakat
**File**: `bermasyarakat-detail.tsx`
**Perlu dicek fields yang ada di file**

### Kegiatan 6: Tidur Cepat
**File**: `tidur-cepat-detail.tsx`  
**Perlu dicek fields yang ada di file**

---

## Template Implementasi Frontend (Ikuti untuk setiap activity)

### 1. Update Interface Props

```typescript
interface ActivityDetailProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    activity: Activity;
    nextActivity?: Activity | null;
    previousActivity?: Activity | null;
    photoCountThisMonth: number;  // TAMBAHKAN INI
}
```

### 2. Update Component Function

```typescript
export default function ActivityDetail({ 
    auth, 
    activity, 
    nextActivity, 
    previousActivity, 
    photoCountThisMonth  // TAMBAHKAN INI
}: ActivityDetailProps) {
```

### 3. Tambah State isSubmitting

```typescript
const [isSubmitting, setIsSubmitting] = useState(false);
```

### 4. Update Import

```typescript
import { Head, Link, router } from '@inertiajs/react';  // Tambahkan router
```

### 5. Update handleSubmit Function

**Untuk Gemar Belajar**:
```typescript
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const formData = new FormData();
    formData.append('activity_id', activity.id.toString());
    formData.append('date', dateString);
    formData.append('ekstrakurikuler', ekstrakurikuler ? '1' : '0');
    formData.append('bimbingan_belajar', bimbinganBelajar ? '1' : '0');
    formData.append('mengerjakan_tugas', mengerjakanTugas ? '1' : '0');
    formData.append('lainnya', lainnya ? '1' : '0');
    
    if (image) {
        formData.append('photo', image);
    }

    router.post('/siswa/activities/submit', formData, {
        onSuccess: () => {
            alert('Kegiatan berhasil disimpan!');
            // Reset form
            setEkstrakurikuler(false);
            setBimbinganBelajar(false);
            setMengerjakanTugas(false);
            setLainnya(false);
            setImage(null);
        },
        onError: (errors: any) => {
            alert('Gagal menyimpan: ' + (errors.photo || errors.error || 'Terjadi kesalahan'));
        },
        onFinish: () => {
            setIsSubmitting(false);
        }
    });
};
```

**Untuk Makan Sehat**:
```typescript
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nutrition.karbohidrat || !nutrition.protein || !nutrition.sayur || !nutrition.buah) {
        alert('Mohon lengkapi semua nutrisi');
        return;
    }

    setIsSubmitting(true);

    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const formData = new FormData();
    formData.append('activity_id', activity.id.toString());
    formData.append('date', dateString);
    formData.append('karbohidrat', nutrition.karbohidrat);
    formData.append('protein', nutrition.protein);
    formData.append('sayur', nutrition.sayur);
    formData.append('buah', nutrition.buah);
    
    if (image) {
        formData.append('photo', image);
    }

    router.post('/siswa/activities/submit', formData, {
        onSuccess: () => {
            alert('Kegiatan berhasil disimpan!');
            // Reset form
            setNutrition({
                karbohidrat: '',
                protein: '',
                sayur: '',
                buah: ''
            });
            setImage(null);
        },
        onError: (errors: any) => {
            alert('Gagal menyimpan: ' + (errors.photo || errors.error || 'Terjadi kesalahan'));
        },
        onFinish: () => {
            setIsSubmitting(false);
        }
    });
};
```

### 6. Tambah Submit Button

Tambahkan di field terakhir sebelum "APPROVAL ORANG TUA":

```typescript
<Button
    type="submit"
    disabled={isSubmitting || !fieldYangRequired}
    className="w-full bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200 text-white px-6 sm:px-8 py-2 shadow-md hover:shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
>
    {isSubmitting ? 'Menyimpan...' : 'Submit'}
</Button>
```

### 7. Update Image Upload Section

Ganti bagian image upload dengan:

```typescript
{/* Image Upload */}
<div className="flex flex-col gap-2">
    <label className={`cursor-pointer ${photoCountThisMonth >= 1 && !image ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={photoCountThisMonth >= 1 && !image}
        />
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
            {image ? (
                <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                />
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )}
        </div>
    </label>
    {photoCountThisMonth >= 1 && !image && (
        <span className="text-xs text-orange-600 font-medium">
            Sudah upload foto bulan ini
        </span>
    )}
</div>
```

### 8. Tambah Warning Banner

Tambahkan SEBELUM `{/* Timestamp */}`:

```typescript
{/* Warning Message */}
{photoCountThisMonth >= 1 && (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
                <p className="text-sm font-semibold text-orange-800">Batas Upload Foto</p>
                <p className="text-xs text-orange-700 mt-1">
                    Anda sudah mengupload foto untuk bulan ini. Maksimal 1 foto per bulan. Anda masih bisa mengisi data tanpa foto.
                </p>
            </div>
        </div>
    </div>
)}

{/* Timestamp */}
```

---

## Checklist Per Activity

### Gemar Belajar (`gemar-belajar-detail.tsx`)
- [ ] Tambah `photoCountThisMonth` di interface & props
- [ ] Tambah state `isSubmitting`
- [ ] Update import: tambahkan `router`  
- [ ] Update `handleSubmit` dengan FormData & router.post
- [ ] Tambah submit button
- [ ] Update image upload section dengan disabled state
- [ ] Tambah warning banner
- [ ] Test: Submit data, upload foto, test batas foto

### Makan Sehat (`makan-sehat-detail.tsx`)
- [ ] Tambah `photoCountThisMonth` di interface & props
- [ ] Tambah state `isSubmitting`
- [ ] Update import: tambahkan `router`
- [ ] Update `handleSubmit` dengan FormData & router.post
- [ ] Tambah submit button  
- [ ] Update image upload section dengan disabled state
- [ ] Tambah warning banner
- [ ] Test: Submit data, upload foto, test batas foto

### Bermasyarakat (`bermasyarakat-detail.tsx`)
- [ ] Cek fields yang ada
- [ ] Tambah `photoCountThisMonth` di interface & props
- [ ] Tambah state `isSubmitting`
- [ ] Update import: tambahkan `router`
- [ ] Update `handleSubmit` dengan FormData & router.post
- [ ] Tambah submit button
- [ ] Update image upload section dengan disabled state
- [ ] Tambah warning banner
- [ ] Test: Submit data, upload foto, test batas foto

### Tidur Cepat (`tidur-cepat-detail.tsx`)
- [ ] Cek fields yang ada
- [ ] Tambah `photoCountThisMonth` di interface & props
- [ ] Tambah state `isSubmitting`
- [ ] Update import: tambahkan `router`
- [ ] Update `handleSubmit` dengan FormData & router.post
- [ ] Tambah submit button
- [ ] Update image upload section dengan disabled state
- [ ] Tambah warning banner
- [ ] Test: Submit data, upload foto, test batas foto

---

## Testing Checklist

Untuk setiap activity, test:
1. ✅ Submit data tanpa foto → Harus berhasil
2. ✅ Submit data dengan foto → Harus berhasil
3. ✅ Submit foto kedua di bulan yang sama → Harus ditolak dengan error message
4. ✅ Data muncul di halaman riwayat
5. ✅ Foto bisa di-preview di halaman riwayat
6. ✅ Update data yang sudah ada → Harus berhasil

---

## Contoh Reference

Lihat file berikut sebagai contoh lengkap:
- `bangun-pagi-detail.tsx` - Implementasi lengkap dengan time input & checkboxes
- `berolahraga-detail.tsx` - Implementasi lengkap dengan checkbox & dropdown

## Command untuk Build

Setelah setiap perubahan, jalankan:
```bash
npm run build
```

## Troubleshooting

**Error: photoCountThisMonth is undefined**
→ Pastikan sudah ditambahkan di interface, props, dan controller backend

**Foto tidak ter-upload**
→ Cek console browser, pastikan FormData.append('photo', image) dipanggil

**Submit tidak bekerja**
→ Cek router.post menggunakan '/siswa/activities/submit' bukan route lain

**Warning tidak muncul**
→ Pastikan `{photoCountThisMonth >= 1 && (...)}` ditulis dengan benar
