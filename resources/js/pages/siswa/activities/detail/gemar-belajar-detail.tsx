import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dashboard } from '@/routes/siswa';
import { show as showActivity } from '@/routes/siswa/activity';
import { history } from '@/routes/siswa/activities/gemar-belajar';

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
        value?: string | null;
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

interface GemarBelajarDetailProps {
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

export default function GemarBelajarDetail({ auth, activity, nextActivity, previousActivity, photoCountThisMonth, photoUploadedToday, todaySubmission, currentDate }: GemarBelajarDetailProps) {
    // Parse server date for display
    const serverDate = new Date(currentDate);
    const [currentMonth] = useState(serverDate); // No setter, read-only
    const [selectedDate] = useState(serverDate.getDate()); // No setter, read-only
    const [gemarBelajar, setGemarBelajar] = useState(false);
    const [approvalOrangTua, setApprovalOrangTua] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [isSubmittingPhoto, setIsSubmittingPhoto] = useState(false);
    // Flag to indicate checkbox save in progress
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ekstrakurikuler, setEkstrakurikuler] = useState(false);
    const [bimbinganBelajar, setBimbinganBelajar] = useState(false);
    const [mengerjakanTugas, setMengerjakanTugas] = useState(false);
    const [lainnya, setLainnya] = useState(false);

    // Load existing data from todaySubmission
    useEffect(() => {
        if (todaySubmission?.details) {
            const details = todaySubmission.details;
            setGemarBelajar(details.gemar_belajar?.is_checked || false);
            setEkstrakurikuler(details.ekstrakurikuler?.is_checked || false);
            setBimbinganBelajar(details.bimbingan_belajar?.is_checked || false);
            setMengerjakanTugas(details.mengerjakan_tugas?.is_checked || false);
            setLainnya(details.lainnya?.is_checked || false);
        }

        if (todaySubmission) {
            setApprovalOrangTua(todaySubmission.status === 'approved');
        }
    }, [todaySubmission]);

    // Sync approval state from backend (so student view updates when parent approves)
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

    // Auto-update function for checkboxes
    const handleCheckboxChange = (field: string, checked: boolean, setter: (value: boolean) => void) => {
        // Update local variables immediately to avoid stale state
        const updatedGemarBelajar = field === 'gemar_belajar' ? checked : gemarBelajar;
        const updatedEkstrakurikuler = field === 'ekstrakurikuler' ? checked : ekstrakurikuler;
        const updatedBimbinganBelajar = field === 'bimbingan_belajar' ? checked : bimbinganBelajar;
        const updatedMengerjakanTugas = field === 'mengerjakan_tugas' ? checked : mengerjakanTugas;
        const updatedLainnya = field === 'lainnya' ? checked : lainnya;

        // Update state
        setter(checked);

        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        const formData = new FormData();
        formData.append('activity_id', activity.id.toString());
        formData.append('date', dateString);

        // Use updated local variables instead of state
        formData.append('gemar_belajar', updatedGemarBelajar ? '1' : '0');
        formData.append('ekstrakurikuler', updatedEkstrakurikuler ? '1' : '0');
        formData.append('bimbingan_belajar', updatedBimbinganBelajar ? '1' : '0');
        formData.append('mengerjakan_tugas', updatedMengerjakanTugas ? '1' : '0');
        formData.append('lainnya', updatedLainnya ? '1' : '0');

        router.post('/siswa/activities/submit', formData, {
            preserveScroll: true,
            preserveState: true,
            onBefore: () => setIsSubmitting(true),
            onFinish: () => setIsSubmitting(false),
            onError: (errors: any) => {
                console.error('Gagal menyimpan:', errors);
                setter(!checked); // Rollback on error
            }
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handlePhotoSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!image) {
            alert('Mohon pilih foto terlebih dahulu');
            return;
        }

        setIsSubmittingPhoto(true);

        const formData = new FormData();
        formData.append('activity_id', activity.id.toString());
        formData.append('date', currentDate);
        formData.append('photo', image);

        // Include checkbox values to preserve them
        formData.append('gemar_belajar', gemarBelajar ? '1' : '0');
        formData.append('ekstrakurikuler', ekstrakurikuler ? '1' : '0');
        formData.append('bimbingan_belajar', bimbinganBelajar ? '1' : '0');
        formData.append('mengerjakan_tugas', mengerjakanTugas ? '1' : '0');
        formData.append('lainnya', lainnya ? '1' : '0');

        router.post('/siswa/activities/submit', formData, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Foto berhasil diupload!');
                setImage(null);
                setIsSubmittingPhoto(false);
                router.reload({ only: ['todaySubmission', 'photoUploadedToday', 'photoCountThisMonth'] });
            },
            onError: (errors: any) => {
                console.error('Gagal mengupload foto:', errors);
                alert('Gagal mengupload foto. Silakan coba lagi.');
                setIsSubmittingPhoto(false);
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            tanggal: selectedDate,
            gemarBelajar,
            approvalOrangTua,
            image
        });
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
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 border-2 sm:border-4 border-gray-800">
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
                                            <svg className="w-24 h-24 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="font-bold text-gray-800">{activity.title}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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

                            {/* Kegiatan Belajar Input */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">KEGIATAN BELAJAR</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={gemarBelajar}
                                        onChange={(e) => handleCheckboxChange('gemar_belajar', e.target.checked, setGemarBelajar)}
                                        disabled={isSubmitting || approvalOrangTua}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Jenis Kegiatan Belajar Label */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-60">JENIS KEGIATAN BELAJAR</label>
                            </div>

                            {/* Ekstrakurikuler */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">EKSTRAKURIKULER</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={ekstrakurikuler}
                                        onChange={(e) => handleCheckboxChange('ekstrakurikuler', e.target.checked, setEkstrakurikuler)}
                                        disabled={isSubmitting || approvalOrangTua}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Bimbingan Belajar */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">BIMBINGAN BELAJAR</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={bimbinganBelajar}
                                        onChange={(e) => handleCheckboxChange('bimbingan_belajar', e.target.checked, setBimbinganBelajar)}
                                        disabled={isSubmitting || approvalOrangTua}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Mengerjakan Tugas */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">MENGERJAKAN TUGAS</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={mengerjakanTugas}
                                        onChange={(e) => handleCheckboxChange('mengerjakan_tugas', e.target.checked, setMengerjakanTugas)}
                                        disabled={isSubmitting || approvalOrangTua}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Lainnya */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">LAINNYA</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={lainnya}
                                        onChange={(e) => handleCheckboxChange('lainnya', e.target.checked, setLainnya)}
                                        disabled={isSubmitting || approvalOrangTua}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Approval Toggle */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">APPROVAL ORANG TUA</label>
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
                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-4">Upload Foto Kegiatan</h3>
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
                                                <p className="text-sm font-semibold text-orange-800">Batas Upload Foto Tercapai</p>
                                                <p className="text-xs text-orange-700 mt-1">
                                                    Anda sudah mengupload {photoCountThisMonth} foto bulan ini. Maksimal 1 foto per bulan untuk kegiatan ini.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <label className="cursor-pointer flex-shrink-0">
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
                                                    <div className="text-center px-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-xs text-gray-500 block">Pilih Foto</span>
                                                    </div>
                                                )}
                                            </div>
                                        </label>

                                        <div className="flex-1 w-full">
                                            <Button
                                                type="button"
                                                onClick={handlePhotoSubmit}
                                                disabled={!image || isSubmittingPhoto}
                                                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
                                            >
                                                {isSubmittingPhoto ? 'Mengupload...' : 'Upload Foto'}
                                            </Button>
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
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
