# Activity Update Plan

Karena terlalu banyak file yang perlu diupdate secara manual, saya akan fokus membuat satu implementasi lengkap untuk **Berolahraga** sebagai contoh, kemudian Anda bisa mengikuti pola yang sama untuk activity lainnya.

## Yang Sudah Selesai:
✅ Backend universal submit method (`submitActivity`)
✅ Route untuk submit universal (`/siswa/activities/submit`)
✅ PhotoCountThisMonth sudah ditambahkan ke semua detail controllers
✅ Validasi foto 1 per bulan di backend

## Yang Perlu Dilakukan Per Activity:

### Untuk setiap file detail (gemar-belajar, makan-sehat, bermasyarakat, tidur-cepat):

1. **Tambah Props Interface**:
```typescript
photoCountThisMonth: number;
```

2. **Update Props Destructuring**:
```typescript
export default function ActivityDetail({ auth, activity, nextActivity, previousActivity, photoCountThisMonth })
```

3. **Tambah State**:
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);
```

4. **Update handleSubmit**:
```typescript
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fieldYangWajib) {
        alert('Mohon isi field yang diperlukan');
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
    
    // Tambahkan semua field sesuai activity
    formData.append('field_name', field_value);
    
    if (image) {
        formData.append('photo', image);
    }

    router.post('/siswa/activities/submit', formData, {
        onSuccess: () => {
            alert('Kegiatan berhasil disimpan!');
            // Reset form
        },
        onError: (errors) => {
            alert('Gagal menyimpan: ' + (errors.photo || errors.error || 'Terjadi kesalahan'));
        },
        onFinish: () => {
            setIsSubmitting(false);
        }
    });
};
```

5. **Update Image Upload Section** (sama seperti bangun-pagi):
```typescript
<div className="flex flex-col gap-2">
    <label className={`cursor-pointer ${photoCountThisMonth >= 1 && !image ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={photoCountThisMonth >= 1 && !image}
        />
        // ... icon upload
    </label>
    {photoCountThisMonth >= 1 && !image && (
        <span className="text-xs text-orange-600 font-medium">
            Sudah upload foto bulan ini
        </span>
    )}
</div>
```

6. **Tambah Warning Banner** (sebelum timestamp):
```typescript
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
```

7. **Tambah Submit Button** di form (biasanya setelah field terakhir sebelum approval):
```typescript
<Button
    type="submit"
    disabled={isSubmitting || !requiredField}
    className="w-full bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200 text-white px-6 sm:px-8 py-2 shadow-md hover:shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
>
    {isSubmitting ? 'Menyimpan...' : 'Submit'}
</Button>
```

8. **Import router dari Inertia**:
```typescript
import { Head, Link, router } from '@inertiajs/react';
```

## Field Mapping Per Activity:

### Berolahraga:
- berolahraga (checkbox)
- waktu_berolahraga (dropdown: 10, 20, 30, 30+)

### Gemar Belajar:
- ekstrakurikuler (checkbox)
- bimbingan_belajar (checkbox)
- mengerjakan_tugas (checkbox)
- lainnya (checkbox)

### Makan Sehat:
- karbohidrat (dropdown)
- protein (dropdown)
- sayur (dropdown)
- buah (dropdown)

### Bermasyarakat:
- Field perlu dicek di file

### Tidur Cepat:
- waktu_tidur (time input)
- Field lain perlu dicek

Saya akan implementasi lengkap untuk Berolahraga sebagai contoh.
