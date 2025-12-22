import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dashboard } from '@/routes/siswa';
import { show as showActivity } from '@/routes/siswa/activity';
import { history } from '@/routes/siswa/activities/berolahraga';

interface Activity {
    id: number;
    title: string;
    icon: string;
    color: string;
}

interface SubmissionDetails {
    [key: string]: {
        label: string;
        is_checked: boolean;
        value: string | null;
    };
}

interface TodaySubmission {
    id: number;
    date: string;
    time: string;
    photo: string | null;
    status: string;
    details: SubmissionDetails;
}

interface BerolahragaDetailProps {
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
    photoCountThisMonth: number;
    photoUploadedToday: boolean;
    todaySubmission: TodaySubmission | null;
    currentDate: string;
}

export default function BerolahragaDetail({ auth, activity, nextActivity, previousActivity, photoCountThisMonth, photoUploadedToday, todaySubmission, currentDate }: BerolahragaDetailProps) {
    const { showSuccess, showError, showWarning } = useToast();
    // Use local browser date to avoid timezone issues
    // Server date is only used for initial data loading, not for submission
    const localDate = new Date();
    const [currentMonth] = useState(localDate); // No setter, read-only
    const [selectedDate] = useState(localDate.getDate()); // No setter, read-only
    const [berolahraga, setBerolahraga] = useState(false);
    const [approvalOrangTua, setApprovalOrangTua] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [isSubmittingPhoto, setIsSubmittingPhoto] = useState(false);
    // Flag untuk menyatakan checkbox sedang disimpan
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Lock dropdown jika sudah ada value di todaySubmission (terpisah untuk masing-masing field)
    const isWaktuLocked = !!todaySubmission?.details?.waktu_berolahraga?.value;
    const isExerciseTypeLocked = !!todaySubmission?.details?.exercise_type?.value;

    // Dropdown state for exercise duration
    const [waktuBerolahraga, setWaktuBerolahraga] = useState('');
    // Dropdown state for exercise type
    const [exerciseType, setExerciseType] = useState('');

    // Load existing data from todaySubmission
    useEffect(() => {
        if (todaySubmission?.details?.waktu_berolahraga) {
            const waktu = todaySubmission.details.waktu_berolahraga.value;
            if (waktu) {
                setWaktuBerolahraga(waktu);
                setBerolahraga(true); // Auto-check checkbox jika ada waktu
            }
        }

        if (todaySubmission?.details?.exercise_type) {
            const jenis = todaySubmission.details.exercise_type.value;
            if (jenis) {
                setExerciseType(jenis);
                setBerolahraga(true); // Auto-check checkbox jika ada jenis olahraga
            }
        }

        if (todaySubmission) {
            setApprovalOrangTua(todaySubmission.status === 'approved');
        }
    }, [todaySubmission]);

    // Sync approval state so student view updates when parent approves
    useEffect(() => {
        if (todaySubmission && todaySubmission.status === 'approved') {
            setApprovalOrangTua(true);
        } else {
            setApprovalOrangTua(false);
        }
    }, [todaySubmission]);

    const monthNames = [
        'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
        'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
    ];

    // Auto-save checkbox handler dengan sinkronisasi ke waktu_berolahraga
    const handleCheckboxChange = (field: string, value: boolean, setter: (val: boolean) => void) => {
        const updatedValue = value;
        setter(updatedValue);

        // Jika checkbox unchecked, reset waktu berolahraga dan jenis olahraga
        if (!updatedValue) {
            setWaktuBerolahraga('');
            setExerciseType('');
        }

        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        const formData = new FormData();
        formData.append('activity_id', activity.id.toString());
        formData.append('date', dateString);
        formData.append('berolahraga', updatedValue ? '1' : '0');
        formData.append('waktu_berolahraga', updatedValue ? waktuBerolahraga : '');
        formData.append('exercise_type', updatedValue ? exerciseType : '');

        router.post('/siswa/activities/submit', formData, {
            preserveScroll: true,
            preserveState: true,
            onBefore: () => setIsSubmitting(true),
            onFinish: () => setIsSubmitting(false),
            onError: (errors: any) => {
                console.error('Gagal menyimpan:', errors);
                setIsSubmitting(false);
            }
        });
    };

    // Handler untuk dropdown waktu berolahraga
    const handleWaktuChange = (value: string) => {
        setWaktuBerolahraga(value);

        // Auto-check checkbox ketika dropdown dipilih
        if (value) {
            setBerolahraga(true);
        }

        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        const formData = new FormData();
        formData.append('activity_id', activity.id.toString());
        formData.append('date', dateString);
        formData.append('berolahraga', value ? '1' : '0'); // Auto-check jika ada value
        formData.append('waktu_berolahraga', value);
        formData.append('exercise_type', exerciseType);

        router.post('/siswa/activities/submit', formData, {
            preserveScroll: true,
            preserveState: true,
            onBefore: () => setIsSubmitting(true),
            onFinish: () => setIsSubmitting(false),
            onError: (errors: any) => {
                console.error('Gagal menyimpan:', errors);
                setIsSubmitting(false);
            }
        });
    };

    // Handler untuk jenis olahraga
    const handleExerciseTypeChange = (value: string) => {
        setExerciseType(value);

        // Auto-check checkbox ketika dropdown dipilih
        if (value) {
            setBerolahraga(true);
        }

        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        const formData = new FormData();
        formData.append('activity_id', activity.id.toString());
        formData.append('date', dateString);
        formData.append('berolahraga', value ? '1' : '0'); // Auto-check jika ada value
        formData.append('waktu_berolahraga', waktuBerolahraga);
        formData.append('exercise_type', value);

        router.post('/siswa/activities/submit', formData, {
            preserveScroll: true,
            preserveState: true,
            onBefore: () => setIsSubmitting(true),
            onFinish: () => setIsSubmitting(false),
            onError: (errors: any) => {
                console.error('Gagal menyimpan:', errors);
                setIsSubmitting(false);
            }
        });
    };

    const handlePhotoSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!image) {
            showWarning('Mohon pilih foto terlebih dahulu');
            return;
        }

        setIsSubmittingPhoto(true);

        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        const formData = new FormData();
        formData.append('activity_id', activity.id.toString());
        formData.append('date', dateString);
        formData.append('photo', image);
        // Include checkbox, waktu dan jenis olahraga agar tidak hilang saat upload foto
        formData.append('berolahraga', berolahraga ? '1' : '0');
        formData.append('waktu_berolahraga', waktuBerolahraga);
        formData.append('exercise_type', exerciseType);

        router.post('/siswa/activities/submit', formData, {
            preserveScroll: true,
            onSuccess: () => {
                showSuccess('Foto berhasil diupload!');
                setImage(null);
                setIsSubmittingPhoto(false);
            },
            onError: (errors: any) => {
                console.error('Gagal mengupload foto:', errors);
                showError('Gagal mengupload foto. Silakan coba lagi.');
                setIsSubmittingPhoto(false);
            }
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const maxSize = 200 * 1024; // 200KB in bytes

            if (file.size > maxSize) {
                showError(`Ukuran file terlalu besar! Maksimal 200KB. File Anda: ${(file.size / 1024).toFixed(2)}KB`);
                e.target.value = ''; // Reset input
                return;
            }

            setImage(file);
        }
    };



    return (
        <AppLayout>
            <Head title={`Kebiasaan ${activity.id}: ${activity.title.toUpperCase()}`} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-4 sm:py-8">
                <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
                    {/* Header with Navigation */}
                    <div className="flex flex-row sm:flex-row items-center justify-center sm:justify-between gap-3 mb-8 flex-wrap">
                        <Link
                            href={previousActivity ? showActivity.url(previousActivity.id) : dashboard.url()}
                            className="bg-gray-800 text-white hover:bg-gray-700 rounded-md px-5 sm:px-8 py-2 inline-block text-sm sm:text-base shadow-sm min-w-[90px] sm:min-w-[110px] text-center"
                        >
                            ← Kembali
                        </Link>

                        <Link
                            href={history.url()}
                            className="bg-gray-800 text-white hover:bg-gray-700 rounded-md px-5 sm:px-8 py-2 inline-block text-sm sm:text-base shadow-sm min-w-[90px] sm:min-w-[110px] text-center"
                        >
                            Riwayat
                        </Link>

                        {nextActivity ? (
                            <Link
                                href={showActivity.url(nextActivity.id)}
                                className="bg-gray-800 text-white hover:bg-gray-700 rounded-md px-5 sm:px-8 py-2 inline-block text-sm sm:text-base shadow-sm min-w-[90px] sm:min-w-[110px] text-center"
                            >
                                Lanjut →
                            </Link>
                        ) : (
                            <button
                                type="button"
                                disabled
                                className="bg-gray-400 text-white rounded-md px-6 py-2 cursor-not-allowed opacity-50 min-w-[90px] sm:min-w-[110px]"
                            >
                                Lanjut →
                            </button>
                        )}
                    </div>

                    {/* Month Display (Read-only) */}
                    <div className="flex items-center justify-center gap-3 sm:gap-8 mb-4 sm:mb-8">
                        <div className="text-center">
                            <h2 className="text-lg sm:text-3xl font-bold text-blue-900">
                                Bulan : {monthNames[currentMonth.getMonth()]}
                            </h2>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8">
                        <h1 className="text-base sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-8 text-center">
                            Kebiasaan {activity.id}: {activity.title.toUpperCase()}
                        </h1>

                        {/* Activity Icon Card */}
                        <div className="flex justify-center mb-4 sm:mb-8">
                            <div className="relative">
                                {/* <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center border-2 sm:border-4 border-white shadow-lg z-10">
                                    <span className="text-white font-bold text-sm sm:text-xl">{activity.id}</span>
                                </div> */}

                                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border-2 sm:border-4 border-blue-900 overflow-hidden w-48 sm:w-64">
                                    <div className={`${activity.color} p-8 flex items-center justify-center`}>
                                        <div className="bg-blue-200 rounded-2xl p-6 w-full flex items-center justify-center min-h-[150px]">
                                            <span className="text-6xl">🏃‍♂️</span>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="font-bold text-gray-800">{activity.title}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form tanpa onSubmit karena sudah auto-save */}
                        <div className="space-y-4 sm:space-y-6">
                            {/* Date Input (Read-only) */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48 text-center sm:text-left">TANGGAL</label>
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-300">
                                        <input
                                            type="text"
                                            value={selectedDate}
                                            readOnly
                                            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl sm:text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none cursor-default"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48 text-left">KEGIATAN OLAHRAGA</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={berolahraga}
                                        onChange={(e) => handleCheckboxChange('berolahraga', e.target.checked, setBerolahraga)}
                                        disabled={isSubmitting || approvalOrangTua}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Waktu Berolahraga Dropdown */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48 text-left">WAKTU BEROLAHRAGA</label>
                                <select
                                    value={waktuBerolahraga}
                                    onChange={(e) => handleWaktuChange(e.target.value)}
                                    disabled={isWaktuLocked || !berolahraga}
                                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm sm:text-base hover:border-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">Pilih Durasi</option>
                                    <option value="10">10 Menit</option>
                                    <option value="20">20 Menit</option>
                                    <option value="30">30 Menit</option>
                                    <option value="30+">&gt; 30 Menit</option>
                                </select>
                            </div>

                            {/* Jenis Olahraga Dropdown */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48 text-left">JENIS OLAHRAGA</label>
                                <div className="flex-1">
                                    <select
                                        value={exerciseType}
                                        onChange={(e) => handleExerciseTypeChange(e.target.value)}
                                        disabled={isExerciseTypeLocked}
                                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm sm:text-base hover:border-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Pilih Jenis Olahraga</option>
                                        <option value="lari">Lari</option>
                                        <option value="senam">Senam/Zumba</option>
                                        <option value="futsal">Futsal/Sepak Bola</option>
                                        <option value="basket">Basket</option>
                                        <option value="voli">Voli</option>
                                        <option value="renang">Renang</option>
                                        <option value="jalan_cepat">Jalan Cepat</option>
                                        <option value="karate">Karate/Silat</option>
                                        <option value="lainnya">Lainnya</option>
                                        <option value="tidak_ada">Tidak ada</option>
                                    </select>
                                    {!isExerciseTypeLocked && !berolahraga && (
                                        <p className="text-xs text-gray-500 mt-1">Memilih jenis olahraga akan otomatis mencentang kegiatan olahraga.</p>
                                    )}
                                </div>
                            </div>

                            {/* Approval Toggle */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48 text-left">APPROVAL ORANG TUA</label>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <button
                                        type="button"
                                        disabled
                                        className={`relative inline-flex h-8 w-16 sm:h-10 sm:w-20 items-center rounded-full transition-colors cursor-not-allowed opacity-100 ${approvalOrangTua ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-6 w-6 sm:h-8 sm:w-8 transform rounded-full bg-white transition-transform ${approvalOrangTua ? 'translate-x-9 sm:translate-x-11' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Photo Upload Section */}
                            <div className="border-t-2 border-gray-200 pt-6 mt-6">
                                <h3 className="font-semibold text-gray-800 text-lg mb-4">Upload Foto Kegiatan</h3>
                                {photoUploadedToday ? (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-green-800">✓ Foto sudah diupload</p>
                                                <p className="text-xs text-green-700 mt-1">
                                                    Anda sudah mengupload foto untuk hari ini.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : photoCountThisMonth >= 1 ? (
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
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <label className="cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-200 hover:border-blue-400 transition-all duration-200">
                                                {image ? (
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="text-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-xs text-gray-500">Pilih Foto</span>
                                                    </div>
                                                )}
                                            </div>
                                        </label>

                                        <div className="flex-1">
                                            {image && (
                                                <div className="mb-2">
                                                    <p className="text-sm text-gray-600">File: {image.name}</p>
                                                    <p className="text-xs text-gray-500">Ukuran: {(image.size / 1024).toFixed(2)} KB</p>
                                                </div>
                                            )}

                                            <Button
                                                type="button"
                                                onClick={handlePhotoSubmit}
                                                disabled={!image || isSubmittingPhoto}
                                                className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-white px-6 py-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                            >
                                                {isSubmittingPhoto ? 'Mengupload...' : 'Upload Foto'}
                                            </Button>
                                            <p className="text-xs text-gray-500 mt-2 text-center">Maksimal ukuran foto: 200KB</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Timestamp */}
                            <div className="text-center sm:text-right text-xs sm:text-sm text-gray-500">
                                {new Date().toLocaleString('id-ID', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
