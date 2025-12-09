# History Database Integration - Activities 2-7

## Overview
Semua halaman history untuk activities 2-7 telah diupdate untuk menampilkan data dari database, bukan lagi menggunakan mock data.

## Changes Made

### Backend Changes (app/Http/Controllers/Siswa/DashboardController.php)

#### Updated Methods:
1. **berolahragaHistory()** - Line ~202
2. **gemarBelajarHistory()** - Line ~248
3. **makanSehatHistory()** - Line ~294
4. **bermasyarakatHistory()** - Line ~340
5. **tidurCepatHistory()** - Line ~386
6. **beribadahHistory()** - Line ~135

#### Pattern Applied:
```php
public function activityHistory(): Response
{
    $activity = Activity::where('title', 'LIKE', '%ActivityName%')->firstOrFail();

    /** @var \App\Models\User $user */
    $user = auth()->user();
    $student = Student::where('user_id', $user->id)->firstOrFail();

    // Get all submissions for this activity
    $submissions = ActivitySubmission::with('details')
        ->where('student_id', $student->id)
        ->where('activity_id', $activity->id)
        ->orderBy('date', 'desc')
        ->get()
        ->map(function ($submission) {
            // Format the details as key-value pairs
            $details = [];
            foreach ($submission->details as $detail) {
                $details[$detail->field_name] = [
                    'label' => $detail->field_label,
                    'is_checked' => $detail->is_checked,
                    'value' => $detail->field_value,
                ];
            }

            return [
                'id' => $submission->id,
                'date' => $submission->date->format('Y-m-d'),
                'time' => $submission->time,
                'photo' => $submission->photo,
                'status' => $submission->status,
                'approved_by' => $submission->approved_by,
                'approved_at' => $submission->approved_at,
                'details' => $details,
            ];
        });

    return Inertia::render('siswa/activities/history/activity-history', [
        'activity' => $activity,
        'submissions' => $submissions,
    ]);
}
```

### Frontend Changes

#### Updated Files:
1. `resources/js/pages/siswa/activities/history/berolahraga-history.tsx`
2. `resources/js/pages/siswa/activities/history/gemar-belajar-history.tsx`
3. `resources/js/pages/siswa/activities/history/makan-sehat-history.tsx`
4. `resources/js/pages/siswa/activities/history/bermasyarakat-history.tsx`
5. `resources/js/pages/siswa/activities/history/tidur-cepat-history.tsx`
6. `resources/js/pages/siswa/activities/history/beribadah-muslim-history.tsx`
7. `resources/js/pages/siswa/activities/history/beribadah-nonmuslim-history.tsx`

#### Pattern Applied:

##### 1. Added TypeScript Interfaces:
```typescript
interface ActivityDetail {
    label: string;
    is_checked: boolean;
    value: string | null;
}

interface Submission {
    id: number;
    date: string;
    time: string;
    photo: string | null;
    status: string;
    approved_by: number | null;
    approved_at: string | null;
    details: {
        [key: string]: ActivityDetail;
    };
}

interface ActivityHistoryProps {
    auth: { user: { name: string; email: string; role: string; } };
    activity: Activity;
    submissions: Submission[];  // Added this prop
}
```

##### 2. Added Submission Lookup:
```typescript
// Create a map of submissions by date for quick lookup
const submissionsByDate = useMemo(() => {
    const map: { [key: string]: Submission } = {};
    submissions.forEach(submission => {
        map[submission.date] = submission;
    });
    return map;
}, [submissions]);

// Get submission for a specific day
const getSubmissionForDay = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateKey = `${year}-${month}-${dayStr}`;
    return submissionsByDate[dateKey];
};
```

##### 3. Replaced Mock Data with Real Data:
```typescript
// BEFORE (Mock Data):
const getCheckedActivities = (day: number) => ({
    activity1: day % 2 === 0,
    activity2: day % 3 === 0,
});

// AFTER (Real Data):
const getCheckedActivities = (day: number) => {
    const submission = getSubmissionForDay(day);
    if (!submission) {
        return {
            activity1: false,
            activity2: false,
        };
    }

    return {
        activity1: submission.details.activity1?.is_checked || false,
        activity2: submission.details.activity2?.is_checked || false,
    };
};
```

##### 4. Added Photo Preview Modal:
```typescript
const [showPhotoModal, setShowPhotoModal] = useState(false);
const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

const handlePhotoClick = (photo: string) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
};

// Modal JSX
{showPhotoModal && selectedPhoto && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
         onClick={() => setShowPhotoModal(false)}>
        <div className="bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-auto" 
             onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold">Bukti Foto</h3>
                <button onClick={() => setShowPhotoModal(false)}>X</button>
            </div>
            <div className="p-4">
                <img src={`/storage/${selectedPhoto}`} alt="Bukti Foto" />
            </div>
        </div>
    </div>
)}
```

##### 5. Display Real Status and Data:
```typescript
// In mobile and desktop views
const submission = getSubmissionForDay(day);
const fieldValue = submission?.details.field_name?.value || '';
const isApproved = submission?.status === 'approved';
const hasPhoto = !!submission?.photo;

// Show actual data
<div className="text-sm font-semibold">
    {fieldValue ? `${fieldValue}` : '-'}
</div>

// Show approval status
<div className={isApproved ? 'bg-green-500' : 'bg-gray-300'}>
    {/* Toggle switch */}
</div>

// Show photo if available
{hasPhoto && (
    <button onClick={() => handlePhotoClick(submission.photo!)}>
        Lihat Foto
    </button>
)}
```

### Special Handling for Beribadah Activities

#### Muslim Prayer History:
- Added `getPrayerStatus()` function to check individual prayers (Subuh, Dzuhur, Ashar, Maghrib, Isya)
- Displays checkboxes for prayer times from submission details
- Shows other activities: mengaji, berdoa, bersedekah, lainnya

#### Non-Muslim Worship History:
- Displays worship activities: doa_pagi, baca_firman, persekutuan, pelayanan, lainnya
- Uses same submission lookup pattern

## Backup Files Created

Old files with mock data have been backed up with `-old.tsx` suffix:
- `berolahraga-history-old.tsx`
- `gemar-belajar-history-old.tsx`
- `makan-sehat-history-old.tsx`
- `bermasyarakat-history-old.tsx`
- `tidur-cepat-history-old.tsx`

## Data Flow

1. **User loads history page** → Controller fetches submissions from database
2. **Submissions processed** → Details formatted as key-value pairs
3. **Data sent to frontend** → Inertia renders component with submissions prop
4. **Frontend displays data** → Uses submissionsByDate map for O(1) lookup
5. **User clicks day** → getSubmissionForDay() returns that day's submission
6. **Display details** → Shows time, status, field values, photo if available

## Field Name Mapping

Each activity has specific field names stored in `activity_details` table:

| Activity | Field Names |
|----------|-------------|
| Berolahraga | `waktu_berolahraga` |
| Gemar Belajar | `durasi_belajar` |
| Makan Sehat | `jenis_makanan` |
| Bermasyarakat | `kegiatan_sosial` |
| Tidur Cepat | `waktu_tidur` |
| Beribadah Muslim | `subuh`, `dzuhur`, `ashar`, `maghrib`, `isya`, `mengaji`, `berdoa`, `bersedekah`, `lainnya` |
| Beribadah Non-Muslim | `doa_pagi`, `baca_firman`, `persekutuan`, `pelayanan`, `lainnya` |

## Testing Checklist

✅ Backend methods return submissions with details
✅ Frontend receives submissions prop correctly
✅ Submission lookup by date works (O(1) performance)
✅ Field values display correctly
✅ Approval status shows accurate state
✅ Photo modal opens and displays images
✅ Empty days show as blank/unchecked
✅ Build completes without errors (53.58s)
✅ All history pages load without TypeScript errors

## Build Results

```
✓ built in 53.58s
- berolahraga-history-U2YgYEix.js: 17.25 kB (gzip: 5.36 kB)
- gemar-belajar-history-CPdZhyuC.js: 17.24 kB (gzip: 5.36 kB)
- makan-sehat-history-DoJEOq0o.js: 17.24 kB (gzip: 5.36 kB)
- bermasyarakat-history-DtkikV2b.js: 17.24 kB (gzip: 5.37 kB)
- tidur-cepat-history-GijV7knG.js: 17.23 kB (gzip: 5.35 kB)
- beribadah-muslim-history-B-aQ4Gnm.js: 20.91 kB (gzip: 6.09 kB)
- beribadah-nonmuslim-history-CrbqUZGn.js: 17.67 kB (gzip: 5.25 kB)
```

## Next Steps (Future Enhancements)

1. Add filtering by approval status
2. Add export functionality (PDF/Excel)
3. Add monthly summary statistics
4. Add comparison between months
5. Add teacher/parent approval workflow UI

## Notes

- All history pages now follow the same pattern as `bangun-pagi-history.tsx`
- Photo storage uses junction link at `public/storage` → `storage/app/public`
- Photos are accessed via `/storage/{photo_path}` URL
- Each submission can have multiple activity details (one-to-many relationship)
- Submissions are ordered by date descending (newest first)
- Empty/null values display as '-' in the UI

## References

- Base Pattern: `bangun-pagi-history.tsx` (24.53 kB)
- Backend Controller: `DashboardController.php`
- Database Tables: `activity_submissions`, `activity_details`
- Models: `ActivitySubmission`, `ActivityDetail`
