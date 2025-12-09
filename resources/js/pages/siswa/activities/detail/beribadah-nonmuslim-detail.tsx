import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { dashboard } from '@/routes/siswa';
import { show as showActivity } from '@/routes/siswa/activity';

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

interface BeribadahNonmuslimDetailProps {
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

export default function BeribadahNonmuslimDetail({ auth, activity, nextActivity, previousActivity, photoCountThisMonth, photoUploadedToday, todaySubmission, currentDate }: BeribadahNonmuslimDetailProps) {
    // Parse server date to get current date info
    const serverDate = new Date(currentDate);
    const [currentMonth] = useState(serverDate); // No setter, read-only
    const [selectedDate] = useState(serverDate.getDate()); // No setter, read-only
    
    const [worshipActivities, setWorshipActivities] = useState({
        doaPagi: false,
        bacaFirman: false,
        renungan: false,
        doaMalam: false,
        ibadahBersama: false
    });
    const [approvalOrangTua, setApprovalOrangTua] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [isSubmittingPhoto, setIsSubmittingPhoto] = useState(false);

    // Load existing data when component mounts or todaySubmission changes
    useEffect(() => {
        if (todaySubmission?.details) {
            setWorshipActivities({
                doaPagi: todaySubmission.details.doa_pagi?.is_checked || false,
                bacaFirman: todaySubmission.details.baca_firman?.is_checked || false,
                renungan: todaySubmission.details.renungan?.is_checked || false,
                doaMalam: todaySubmission.details.doa_malam?.is_checked || false,
                ibadahBersama: todaySubmission.details.ibadah_bersama?.is_checked || false
            });
        }
    }, [todaySubmission]);

    const monthNames = [
        'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
        'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
    ];

    const worshipNames = [
        { key: 'doaPagi', label: 'DOA PAGI' },
        { key: 'bacaFirman', label: 'BACA FIRMAN' },
        { key: 'renungan', label: 'RENUNGAN' },
        { key: 'doaMalam', label: 'DOA MALAM' },
        { key: 'ibadahBersama', label: 'IBADAH BERSAMA' }
    ];

    const changeMonth = (direction: 'prev' | 'next') => {
        const newMonth = new Date(currentMonth);
        if (direction === 'prev') {
            newMonth.setMonth(newMonth.getMonth() - 1);
        } else {
            newMonth.setMonth(newMonth.getMonth() + 1);
        }
        setCurrentMonth(newMonth);
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

        // Use current date from server
        const dateString = currentDate;

        const formData = new FormData();
        formData.append('activity_id', activity.id.toString());
        formData.append('date', dateString);
        formData.append('doa_pagi', worshipActivities.doaPagi ? '1' : '0');
        formData.append('baca_firman', worshipActivities.bacaFirman ? '1' : '0');
        formData.append('renungan', worshipActivities.renungan ? '1' : '0');
        formData.append('doa_malam', worshipActivities.doaMalam ? '1' : '0');
        formData.append('ibadah_bersama', worshipActivities.ibadahBersama ? '1' : '0');
        formData.append('photo', image);

        router.post('/siswa/activities/submit', formData, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Foto berhasil diupload!');
                setIsSubmittingPhoto(false);
            },
            onError: (errors: any) => {
                console.error('Gagal mengupload foto:', errors);
                alert('Gagal mengupload foto. Silakan coba lagi.');
                setIsSubmittingPhoto(false);
            }
        });
    };

    const handleWorshipSubmit = (worshipKey: string, isChecked: boolean) => {
        setWorshipActivities(prev => ({
            ...prev,
            [worshipKey]: isChecked
        }));

        // Auto-submit ketika checkbox berubah
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        const formData = new FormData();
        formData.append('activity_id', activity.id.toString());
        formData.append('date', dateString);
        formData.append('doa_pagi', worshipKey === 'doaPagi' ? (isChecked ? '1' : '0') : (worshipActivities.doaPagi ? '1' : '0'));
        formData.append('baca_firman', worshipKey === 'bacaFirman' ? (isChecked ? '1' : '0') : (worshipActivities.bacaFirman ? '1' : '0'));
        formData.append('renungan', worshipKey === 'renungan' ? (isChecked ? '1' : '0') : (worshipActivities.renungan ? '1' : '0'));
        formData.append('doa_malam', worshipKey === 'doaMalam' ? (isChecked ? '1' : '0') : (worshipActivities.doaMalam ? '1' : '0'));
        formData.append('ibadah_bersama', worshipKey === 'ibadahBersama' ? (isChecked ? '1' : '0') : (worshipActivities.ibadahBersama ? '1' : '0'));

        if (image) {
            formData.append('photo', image);
        }

        router.post('/siswa/activities/submit', formData, {
            preserveScroll: true,
            preserveState: true,
            onError: (errors: any) => {
                console.error('Gagal menyimpan:', errors);
            }
        });
    };

    return (
        <AppLayout>
            <Head title={`Kebiasaan ${activity.id}: ${activity.title.toUpperCase()}`} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
                {/* Test Mode Banner */}
                {isTestMode && (
                    <div className="bg-yellow-500 text-black px-4 py-2 text-center font-semibold mb-4">
                        🧪 TEST MODE: Simulasi tanggal {testDate}
                    </div>
                )}
                
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header with Navigation */}
                    <div className="flex flex-row sm:flex-row items-center justify-center sm:justify-between gap-3 mb-8 flex-wrap">
                        <Link
                            href={previousActivity ? showActivity.url(previousActivity.id) : dashboard.url()}
                            className="bg-gray-800 text-white hover:bg-gray-700 rounded-md px-5 sm:px-8 py-2 inline-block text-sm sm:text-base shadow-sm min-w-[90px] sm:min-w-[110px] text-center"
                        >
                            ← Kembali
                        </Link>

                        <Link
                            href={`/siswa/activities/${activity.id}/beribadah/history`}
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

                    {/* Current Month Display (Read-only) */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">
                            Bulan : {monthNames[currentMonth.getMonth()]}
                        </h2>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-gray-800">
                        <h1 className="text-2xl font-bold text-blue-900 mb-8 text-center">
                            Kebiasaan {activity.id}: {activity.title.toUpperCase()}
                        </h1>

                        {/* Activity Icon Card */}
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                {/* <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10">
                                    <span className="text-white font-bold text-xl">{activity.id}</span>
                                </div> */}

                                <div className="bg-white rounded-3xl shadow-lg border-4 border-blue-900 overflow-hidden w-64">
                                    <div className={`${activity.color} p-8 flex items-center justify-center`}>
                                        <div className="bg-blue-200 rounded-2xl p-6 w-full">
                                            <div className="w-full h-32 bg-white rounded-lg flex items-center justify-center text-gray-400">
                                                <span className="text-5xl">✝️</span>
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
                        <form className="space-y-6">
                            {/* Date Input */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48 text-center sm:text-left">TANGGAL</label>
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-400">
                                        <span className="text-2xl font-bold text-gray-700">{selectedDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Worship Activities */}
                            {worshipNames.map((worship) => (
                                <div key={worship.key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">{worship.label}</label>
                                    <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                        <div className="flex items-center gap-2 flex-1">
                                            <input
                                                type="checkbox"
                                                checked={worshipActivities[worship.key as keyof typeof worshipActivities]}
                                                onChange={(e) => handleWorshipSubmit(worship.key, e.target.checked)}
                                                className="w-6 h-6 rounded border-2 border-gray-300 text-blue-500 hover:border-blue-400 transition-all duration-200 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span className="text-gray-600 text-sm sm:text-base">
                                                {worshipActivities[worship.key as keyof typeof worshipActivities] ? 'Sudah dikerjakan' : 'Belum dikerjakan'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Approval Toggle */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">APPROVAL ORANG TUA</label>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <button
                                        type="button"
                                        disabled
                                        className={`relative inline-flex h-8 w-16 sm:h-10 sm:w-20 items-center rounded-full transition-colors cursor-not-allowed opacity-60 ${approvalOrangTua ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-6 w-6 sm:h-8 sm:w-8 transform rounded-full bg-white transition-transform ${approvalOrangTua ? 'translate-x-9 sm:translate-x-11' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>

                                    {/* Image Upload */}
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
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
                                </div>
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
