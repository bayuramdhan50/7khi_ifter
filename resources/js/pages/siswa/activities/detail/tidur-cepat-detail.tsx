import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dashboard } from '@/routes/siswa';
import { show as showActivity } from '@/routes/siswa/activity';
import { history } from '@/routes/siswa/activities/tidur-cepat';

interface Activity {
    id: number;
    title: string;
    icon: string;
    color: string;
}

interface TidurCepatDetailProps {
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
    currentDate: string;
    todaySubmission?: {
        id: number;
        date: string;
        time: string;
        photo: string | null;
        status: string;
        details: {
            waktu_tidur?: { label: string; is_checked: boolean; value: string };
        };
    } | null;
}

export default function TidurCepatDetail({ auth, activity, nextActivity, previousActivity, photoCountThisMonth, photoUploadedToday, currentDate, todaySubmission }: TidurCepatDetailProps) {
    const { showSuccess, showError, showWarning } = useToast();
    // Parse server date
    // Use local browser date to avoid timezone issues
    const localDate = new Date();
    const [currentMonth] = useState(localDate);
    const [selectedDate] = useState(localDate.getDate());
    const [jamTidur, setJamTidur] = useState(todaySubmission?.details?.waktu_tidur?.value || '');
    const [approvalOrangTua, setApprovalOrangTua] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [isSubmittingPhoto, setIsSubmittingPhoto] = useState(false);

    // Check if time has already been submitted today
    const hasSubmittedTime = !!(todaySubmission?.details?.waktu_tidur?.value && todaySubmission.details.waktu_tidur.value.length > 0);

    // Update jamTidur state when todaySubmission changes (after photo upload)
    useEffect(() => {
        if (todaySubmission?.details?.waktu_tidur?.value) {
            setJamTidur(todaySubmission.details.waktu_tidur.value);
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!jamTidur) {
            showWarning('Mohon isi jam tidur');
            return;
        }

        const formData = new FormData();
        formData.append('activity_id', activity.id.toString());
        formData.append('date', currentDate);
        formData.append('jam_tidur', jamTidur);

        router.post('/siswa/activities/submit', formData, {
            preserveScroll: true,
            onSuccess: () => {
                showSuccess('Data berhasil disimpan!');
                router.reload({ only: ['todaySubmission'] });
            },
            onError: (errors: any) => {
                console.error('Gagal menyimpan data:', errors);
                showError('Gagal menyimpan data. Silakan coba lagi.');
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

        const formData = new FormData();
        formData.append('activity_id', activity.id.toString());
        formData.append('date', currentDate);
        formData.append('photo', image);

        // Include jam_tidur to preserve the time input
        if (jamTidur) {
            formData.append('jam_tidur', jamTidur);
        }

        router.post('/siswa/activities/submit', formData, {
            preserveScroll: true,
            onSuccess: () => {
                showSuccess('Foto berhasil diupload!');
                setImage(null);
                setIsSubmittingPhoto(false);
                router.reload({ only: ['photoUploadedToday', 'photoCountThisMonth', 'todaySubmission'] });
            },
            onError: (errors: any) => {
                console.error('Gagal mengupload foto:', errors);
                showError('Gagal mengupload foto. Silakan coba lagi.');
                setIsSubmittingPhoto(false);
            }
        });
    };

    return (
        <AppLayout>
            <Head title={`Kebiasaan ${activity.id}: ${activity.title.toUpperCase()}`} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-4 sm:py-8">
                <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
                    {/* Header with Navigation */}
                    <div className="flex flex-row items-center justify-center gap-3 mb-8 flex-wrap relative">
                        <div className="absolute left-0">
                            <Link
                                href={previousActivity ? showActivity.url(previousActivity.id) : dashboard.url()}
                                className="bg-gray-800 text-white hover:bg-gray-700 rounded-md px-5 sm:px-8 py-2 inline-block text-sm sm:text-base shadow-sm min-w-[90px] sm:min-w-[110px] text-center"
                            >
                                ← Kembali
                            </Link>
                        </div>

                        <Link
                            href={history.url()}
                            className="bg-gray-800 text-white hover:bg-gray-700 rounded-md px-5 sm:px-8 py-2 inline-block text-sm sm:text-base shadow-sm min-w-[90px] sm:min-w-[110px] text-center"
                        >
                            Riwayat
                        </Link>
                    </div>

                    {/* Month Display */}
                    <div className="flex items-center justify-center mb-4 sm:mb-8">
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
                                        <div className="bg-blue-200 rounded-2xl p-6 w-full flex items-center justify-center">
                                            <span className="text-6xl">{activity.icon}</span>
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
                            {/* Date Input */}
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

                            {/* Jam Tidur Input */}
                            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48 sm:pt-3">JAM TIDUR</label>
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                        <input
                                            type="time"
                                            value={jamTidur}
                                            onChange={(e) => setJamTidur(e.target.value)}
                                            disabled={hasSubmittedTime}
                                            className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg text-gray-900 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        />
                                        <Button
                                            type="submit"
                                            disabled={hasSubmittedTime || !jamTidur}
                                            className="bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200 text-white px-6 sm:px-8 py-2 shadow-md hover:shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        >
                                            {hasSubmittedTime ? '✓ Terkirim' : 'Kirim'}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 italic">* Gunakan format 24 jam (contoh: 21:00 untuk jam 9 malam, 22:30 untuk jam 10.30 malam)</p>
                                </div>
                            </div>

                            {/* Approval Toggle */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">APPROVAL ORANG TUA</label>
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

                        {/* Upload Foto Section - Separate from form */}
                        <div className="mt-6 pt-6 border-t-2 border-gray-200">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Upload Foto Kegiatan</h3>

                            {photoUploadedToday ? (
                                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold text-green-800">✓ Foto sudah diupload</p>
                                            <p className="text-sm text-green-600">Anda sudah mengupload foto untuk hari ini</p>
                                        </div>
                                    </div>
                                </div>
                            ) : photoCountThisMonth >= 1 ? (
                                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-6 h-6 text-orange-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold text-orange-800">Batas Upload Tercapai</p>
                                            <p className="text-sm text-orange-600">Anda sudah mengupload foto untuk bulan ini</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handlePhotoSubmit}>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        {/* Preview Section */}
                                        <div className="flex-shrink-0">
                                            <label className="cursor-pointer block">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                    disabled={isSubmittingPhoto}
                                                />
                                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all duration-200">
                                                    {image ? (
                                                        <img
                                                            src={URL.createObjectURL(image)}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="text-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <p className="text-xs text-gray-500 mt-1">Pilih Foto</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                        </div>

                                        {/* Upload Button Section */}
                                        <div className="flex-1 w-full">
                                            <Button
                                                type="submit"
                                                disabled={!image || isSubmittingPhoto}
                                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                                            >
                                                {isSubmittingPhoto ? 'Mengupload...' : 'Upload Foto'}
                                            </Button>
                                            {image && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    File: {image.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
