import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dashboard } from '@/routes/siswa';
import { show as showActivity } from '@/routes/siswa/activity';
import { history } from '@/routes/siswa/activities/bangun-pagi';

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

interface BangunPagiDetailProps {
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
    currentDate: string; // Server date in YYYY-MM-DD format
}

export default function BangunPagiDetail({ auth, activity, nextActivity, previousActivity, photoCountThisMonth, photoUploadedToday, todaySubmission, currentDate }: BangunPagiDetailProps) {
    // Parse server date for display
    // Use local browser date to avoid timezone issues
    const localDate = new Date();
    const [currentMonth] = useState(localDate);
    const [selectedDate] = useState(localDate.getDate()); // No setter, read-only
    const [jamBangun, setJamBangun] = useState('');
    const [approvalOrangTua, setApprovalOrangTua] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmittingPhoto, setIsSubmittingPhoto] = useState(false);
    const [isSavingCheckbox, setIsSavingCheckbox] = useState(false);

    // Checkbox states
    const [membereskanTempat, setMembereskanTempat] = useState(false);
    const [mandi, setMandi] = useState(false);
    const [berpakaianRapi, setBerpakaianRapi] = useState(false);
    const [sarapan, setSarapan] = useState(false);

    // Check if jam bangun has already been submitted today
    const hasSubmittedTime = !!(todaySubmission && todaySubmission.time && todaySubmission.time.length > 0);

    // Load existing data when component mounts or todaySubmission changes
    useEffect(() => {
        if (todaySubmission) {
            // Load jam bangun from time field
            setJamBangun(todaySubmission.time || '');

            // Load checkbox states from details
            if (todaySubmission.details.membereskan_tempat_tidur) {
                setMembereskanTempat(todaySubmission.details.membereskan_tempat_tidur.is_checked);
            }
            if (todaySubmission.details.mandi) {
                setMandi(todaySubmission.details.mandi.is_checked);
            }
            if (todaySubmission.details.berpakaian_rapi) {
                setBerpakaianRapi(todaySubmission.details.berpakaian_rapi.is_checked);
            }
            if (todaySubmission.details.sarapan) {
                setSarapan(todaySubmission.details.sarapan.is_checked);
            }

            // Set approval status
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

    // Get test_date parameter from URL for testing
    const urlParams = new URLSearchParams(window.location.search);
    const testDate = urlParams.get('test_date');
    const isTestMode = !!testDate;

    // Auto-update handler for checkboxes
    const handleCheckboxChange = (checkboxName: string, newValue: boolean) => {
        console.log('Checkbox clicked:', checkboxName, 'New value:', newValue);
        console.log('isSavingCheckbox:', isSavingCheckbox);

        // Update local state first for immediate UI feedback
        let updatedMembereskan = membereskanTempat;
        let updatedMandi = mandi;
        let updatedBerpakaian = berpakaianRapi;
        let updatedSarapan = sarapan;

        switch (checkboxName) {
            case 'membereskan_tempat_tidur':
                setMembereskanTempat(newValue);
                updatedMembereskan = newValue;
                break;
            case 'mandi':
                setMandi(newValue);
                updatedMandi = newValue;
                break;
            case 'berpakaian_rapi':
                setBerpakaianRapi(newValue);
                updatedBerpakaian = newValue;
                break;
            case 'sarapan':
                setSarapan(newValue);
                updatedSarapan = newValue;
                break;
        }

        // Auto-save to backend
        setIsSavingCheckbox(true);

        const formData = new FormData();
        formData.append('activity_id', activity.id.toString());
        formData.append('date', currentDate);
        formData.append('membereskan_tempat_tidur', updatedMembereskan ? '1' : '0');
        formData.append('mandi', updatedMandi ? '1' : '0');
        formData.append('berpakaian_rapi', updatedBerpakaian ? '1' : '0');
        formData.append('sarapan', updatedSarapan ? '1' : '0');

        console.log('Sending data:', {
            membereskan_tempat_tidur: updatedMembereskan,
            mandi: updatedMandi,
            berpakaian_rapi: updatedBerpakaian,
            sarapan: updatedSarapan
        });

        router.post('/siswa/activities/bangun-pagi/submit', formData, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Checkbox saved successfully');
                setIsSavingCheckbox(false);
                // Reload data from server to get updated submission
                router.reload({ only: ['todaySubmission'] });
            },
            onError: (errors) => {
                console.error('Auto-save checkbox error:', errors);
                // Revert the checkbox state on error
                switch (checkboxName) {
                    case 'membereskan_tempat_tidur':
                        setMembereskanTempat(!newValue);
                        break;
                    case 'mandi':
                        setMandi(!newValue);
                        break;
                    case 'berpakaian_rapi':
                        setBerpakaianRapi(!newValue);
                        break;
                    case 'sarapan':
                        setSarapan(!newValue);
                        break;
                }
                alert('Gagal menyimpan checkbox. Silakan coba lagi.');
                setIsSavingCheckbox(false);
            },
        });
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

        // Include checkbox states to preserve them
        formData.append('membereskan_tempat_tidur', membereskanTempat ? '1' : '0');
        formData.append('mandi', mandi ? '1' : '0');
        formData.append('berpakaian_rapi', berpakaianRapi ? '1' : '0');
        formData.append('sarapan', sarapan ? '1' : '0');

        // Include time if exists
        if (jamBangun) {
            const timeWithSeconds = jamBangun.includes(':') && jamBangun.split(':').length === 2
                ? `${jamBangun}:00`
                : jamBangun;
            formData.append('time', timeWithSeconds);
        }

        console.log('Gagal mengupload foto:', {
            membereskan_tempat_tidur: membereskanTempat,
            mandi: mandi,
            berpakaian_rapi: berpakaianRapi,
            sarapan: sarapan
        });

        router.post('/siswa/activities/bangun-pagi/submit', formData, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Foto berhasil diupload!');
                setImage(null);
                setIsSubmittingPhoto(false);
                // Reload to get updated photo data
                router.reload({ only: ['photoUploadedToday', 'photoCountThisMonth', 'todaySubmission'] });
            },
            onError: (errors: any) => {
                console.error('Gagal mengupload foto:', errors);
                alert('Gagal mengupload foto. Silakan coba lagi.');
                setIsSubmittingPhoto(false);
            }
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!jamBangun) {
            alert('Mohon isi jam bangun terlebih dahulu');
            return;
        }

        setIsSubmitting(true);

        // Ensure time is in HH:mm:ss format
        const timeWithSeconds = jamBangun.includes(':') && jamBangun.split(':').length === 2
            ? `${jamBangun}:00`
            : jamBangun;

        const formData = new FormData();
        formData.append('activity_id', activity.id.toString());
        formData.append('date', currentDate);
        formData.append('time', timeWithSeconds);

        router.post('/siswa/activities/bangun-pagi/submit', formData, {
            preserveScroll: true,
            onSuccess: (page) => {
                alert('Jam bangun berhasil disimpan!');
                setIsSubmitting(false);
                // Reload data from server to get updated submission
                router.reload({ only: ['todaySubmission'] });
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
                alert('Gagal menyimpan jam bangun. Silakan coba lagi.');
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Kebiasaan ${activity.id}: ${activity.title.toUpperCase()}`} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-4 sm:py-8">
                <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
                    {/* Header with Navigation */}
                    <div className="flex flex-row items-center justify-center gap-3 mb-8 flex-wrap relative">
                        <Link
                            href={history.url()}
                            className="bg-gray-800 text-white hover:bg-gray-700 rounded-md px-5 sm:px-8 py-2 inline-block text-sm sm:text-base shadow-sm min-w-[90px] sm:min-w-[110px] text-center"
                        >
                            Riwayat
                        </Link>

                        <div className="absolute right-0">
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
                    </div>

                    {/* Test Mode Banner */}
                    {isTestMode && (
                        <div className="mb-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 text-center">
                            <p className="text-yellow-800 font-semibold text-sm">
                                🧪 MODE TEST: Menggunakan tanggal. {testDate}
                            </p>
                        </div>
                    )}

                    {/* Current Month Display (Read-only) */}
                    <div className="text-center mb-4 sm:mb-8">
                        <h2 className="text-lg sm:text-3xl font-bold text-blue-900">
                            Bulan : {monthNames[currentMonth.getMonth()]}
                        </h2>
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
                                        <div className="bg-blue-200 rounded-2xl p-6 w-full">
                                            <div className="w-full h-32 sm:h-40 bg-white rounded-lg flex items-center justify-center text-gray-400">
                                                <span className="text-4xl sm:text-5xl">☀️</span>
                                            </div>
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
                            {/* Date Display (Read-only) */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48 text-center sm:text-left">TANGGAL</label>
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-400">
                                        <span className="text-xl sm:text-2xl font-bold text-gray-700">
                                            {selectedDate}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Jam Bangun Input */}
                            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48 sm:pt-3">JAM BANGUN</label>
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                        <input
                                            type="time"
                                            value={jamBangun}
                                            onChange={(e) => setJamBangun(e.target.value)}
                                            readOnly={hasSubmittedTime}
                                            className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg text-gray-900 text-sm sm:text-base hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 read-only:bg-blue-50 read-only:cursor-default read-only:border-blue-300"
                                            required
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || !jamBangun || hasSubmittedTime}
                                            className="bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200 text-white px-6 sm:px-8 py-2 shadow-md hover:shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        >
                                            {hasSubmittedTime ? '✓ Terkirim' : (isSubmitting ? 'Menyimpan...' : 'Kirim')}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 italic">* Gunakan format 24 jam (contoh: 05:30 untuk jam 5 pagi, 17:30 untuk jam 5 sore)</p>
                                </div>
                            </div>

                            {/* Kegiatan Setelah Bangun Label */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-60">KEGIATAN SETELAH BANGUN</label>
                            </div>

                            {/* Checkbox 1: Membereskan Tempat Tidur */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">MEMBERESKAN TEMPAT TIDUR</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={membereskanTempat}
                                        onChange={(e) => handleCheckboxChange('membereskan_tempat_tidur', e.target.checked)}
                                        disabled={isSavingCheckbox || approvalOrangTua}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200 disabled:cursor-wait disabled:opacity-80 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Checkbox 2: Mandi */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">MANDI</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={mandi}
                                        onChange={(e) => handleCheckboxChange('mandi', e.target.checked)}
                                        disabled={isSavingCheckbox || approvalOrangTua}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200 disabled:cursor-wait disabled:opacity-80 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Checkbox 3: Berpakaian Rapi */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">BERPAKAIAN RAPI</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={berpakaianRapi}
                                        onChange={(e) => handleCheckboxChange('berpakaian_rapi', e.target.checked)}
                                        disabled={isSavingCheckbox || approvalOrangTua}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200 disabled:cursor-wait disabled:opacity-80 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Checkbox 4: Sarapan */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">SARAPAN</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={sarapan}
                                        onChange={(e) => handleCheckboxChange('sarapan', e.target.checked)}
                                        disabled={isSavingCheckbox || approvalOrangTua}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200 disabled:cursor-wait disabled:opacity-80 cursor-pointer"
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
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
