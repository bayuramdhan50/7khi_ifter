import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
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

interface BeribadahMuslimDetailProps {
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

export default function BeribadahMuslimDetail({ auth, activity, nextActivity, previousActivity, photoCountThisMonth, photoUploadedToday, todaySubmission, currentDate }: BeribadahMuslimDetailProps) {
    // Parse server date for display
    const serverDate = new Date(currentDate);
    const [currentMonth] = useState(serverDate); // No setter, read-only
    const [selectedDate] = useState(serverDate.getDate()); // No setter, read-only
    const [prayers, setPrayers] = useState({
        subuh: false,
        dzuhur: false,
        ashar: false,
        maghrib: false,
        isya: false
    });
    const [approvalOrangTua, setApprovalOrangTua] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const infoTimer = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (infoTimer.current) {
                clearTimeout(infoTimer.current);
            }
        };
    }, []);
    const [image, setImage] = useState<File | null>(null);
    const [isSubmittingPhoto, setIsSubmittingPhoto] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mengaji, setMengaji] = useState(false);
    const [berdoa, setBerdoa] = useState(false);
    const [bersedekah, setBersedekah] = useState(false);
    const [lainnya, setLainnya] = useState(false);

    // Load existing data from todaySubmission
    useEffect(() => {
        if (todaySubmission?.details) {
            const details = todaySubmission.details;
            
            // Load prayer states
            setPrayers({
                subuh: details.subuh?.is_checked || false,
                dzuhur: details.dzuhur?.is_checked || false,
                ashar: details.ashar?.is_checked || false,
                maghrib: details.maghrib?.is_checked || false,
                isya: details.isya?.is_checked || false,
            });

            // Load activity states
            setMengaji(details.mengaji?.is_checked || false);
            setBerdoa(details.berdoa?.is_checked || false);
            setBersedekah(details.bersedekah?.is_checked || false);
            setLainnya(details.lainnya?.is_checked || false);
        }
    }, [todaySubmission]);

    const monthNames = [
        'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
        'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
    ];

    const prayerNames = [
        { key: 'subuh', label: 'Subuh' },
        { key: 'dzuhur', label: 'Dzuhur' },
        { key: 'ashar', label: 'Ashar' },
        { key: 'maghrib', label: 'Maghrib' },
        { key: 'isya', label: 'Isya' }
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handlePrayerChange = (prayerKey: string, checked: boolean) => {
        // Update local state
        setPrayers(prev => ({ ...prev, [prayerKey]: checked }));

        // Auto-submit to database
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('activity_id', activity.id.toString());
        formData.append('date', currentDate);
        
        // Send all prayer states
        formData.append('subuh', prayers.subuh || (prayerKey === 'subuh' && checked) ? '1' : '0');
        formData.append('dzuhur', prayers.dzuhur || (prayerKey === 'dzuhur' && checked) ? '1' : '0');
        formData.append('ashar', prayers.ashar || (prayerKey === 'ashar' && checked) ? '1' : '0');
        formData.append('maghrib', prayers.maghrib || (prayerKey === 'maghrib' && checked) ? '1' : '0');
        formData.append('isya', prayers.isya || (prayerKey === 'isya' && checked) ? '1' : '0');
        formData.append('mengaji', mengaji ? '1' : '0');
        formData.append('berdoa', berdoa ? '1' : '0');
        formData.append('bersedekah', bersedekah ? '1' : '0');
        formData.append('lainnya', lainnya ? '1' : '0');

        router.post('/siswa/activities/submit', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: (errors: any) => {
                console.error('Gagal menyimpan:', errors);
                setIsSubmitting(false);
                // Revert checkbox on error
                setPrayers(prev => ({ ...prev, [prayerKey]: !checked }));
            }
        });
    };

    const handleActivityChange = (activityKey: string, checked: boolean) => {
        // Update local state
        if (activityKey === 'mengaji') setMengaji(checked);
        else if (activityKey === 'berdoa') setBerdoa(checked);
        else if (activityKey === 'bersedekah') setBersedekah(checked);
        else if (activityKey === 'lainnya') setLainnya(checked);

        // Auto-submit to database
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('activity_id', activity.id.toString());
        formData.append('date', currentDate);
        
        // Send all states
        formData.append('subuh', prayers.subuh ? '1' : '0');
        formData.append('dzuhur', prayers.dzuhur ? '1' : '0');
        formData.append('ashar', prayers.ashar ? '1' : '0');
        formData.append('maghrib', prayers.maghrib ? '1' : '0');
        formData.append('isya', prayers.isya ? '1' : '0');
        formData.append('mengaji', (activityKey === 'mengaji' ? checked : mengaji) ? '1' : '0');
        formData.append('berdoa', (activityKey === 'berdoa' ? checked : berdoa) ? '1' : '0');
        formData.append('bersedekah', (activityKey === 'bersedekah' ? checked : bersedekah) ? '1' : '0');
        formData.append('lainnya', (activityKey === 'lainnya' ? checked : lainnya) ? '1' : '0');

        router.post('/siswa/activities/submit', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: (errors: any) => {
                console.error('Gagal menyimpan:', errors);
                setIsSubmitting(false);
                // Revert checkbox on error
                if (activityKey === 'mengaji') setMengaji(!checked);
                else if (activityKey === 'berdoa') setBerdoa(!checked);
                else if (activityKey === 'bersedekah') setBersedekah(!checked);
                else if (activityKey === 'lainnya') setLainnya(!checked);
            }
        });
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
        formData.append('subuh', prayers.subuh ? '1' : '0');
        formData.append('dzuhur', prayers.dzuhur ? '1' : '0');
        formData.append('ashar', prayers.ashar ? '1' : '0');
        formData.append('maghrib', prayers.maghrib ? '1' : '0');
        formData.append('isya', prayers.isya ? '1' : '0');
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

    return (
        <AppLayout>
            <Head title={`Kebiasaan ${activity.id}: ${activity.title.toUpperCase()}`} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
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

                    {/* Month Display - Read Only */}
                    <div className="flex items-center justify-center gap-6 sm:gap-8 mb-8 flex-wrap">
                        <div className="text-center">
                            <h2 className="text-xl sm:text-3xl font-bold text-blue-900 leading-tight">
                                Bulan : {monthNames[currentMonth.getMonth()]}
                            </h2>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-gray-800">
                        <h1 className="text-2xl font-bold text-blue-900 mb-8 text-center">
                            Kebiasaan {activity.id}: {activity.title.toUpperCase()}
                        </h1>

                        {/* Activity Icon Card */}
                        <div className="flex justify-center mb-8 px-2 sm:px-0">
                            <div className="relative">
                                {/* <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10">
                                    <span className="text-white font-bold text-xl">{activity.id}</span>
                                </div> */}

                                <div className="bg-white rounded-3xl shadow-lg border-4 border-blue-900 overflow-hidden w-48 sm:w-64 max-w-full">
                                    <div className={`${activity.color} p-6 sm:p-8 flex items-center justify-center`}>
                                        <div className="bg-blue-200 rounded-2xl p-4 sm:p-6 w-full">
                                            <div className="w-full h-32 sm:h-40 bg-white rounded-lg flex items-center justify-center text-gray-400">
                                                <span className="text-4xl sm:text-5xl">🕌</span>
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
                        <form className="space-y-4">
                            {/* Date Input - Read Only */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
                                <label className="w-auto sm:w-48 text-center sm:text-left font-semibold text-gray-700">Tanggal</label>
                                <div className="flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-300">
                                        <span className="text-2xl font-bold text-gray-900">{selectedDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Prayer Times */}
                            {prayerNames.map((prayer) => (
                                <div key={prayer.key} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-3">
                                    <label className="w-28 sm:w-48 font-semibold text-gray-700">{prayer.label}</label>
                                    <div className="flex-1 flex items-center gap-4 w-full">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <input
                                                type="checkbox"
                                                checked={prayers[prayer.key as keyof typeof prayers]}
                                                onChange={(e) => handlePrayerChange(prayer.key, e.target.checked)}
                                                disabled={isSubmitting}
                                                className="w-6 h-6 rounded border-2 border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                            />
                                            {isSubmitting && (
                                                <span className="text-xs text-gray-500">Menyimpan...</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Kegiatan Setelah Beribadah Label */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
                                <div className="relative w-full">
                                    <div className="flex items-center gap-2">
                                        <label className="font-semibold text-gray-700 text-base sm:text-lg sm:w-60 mb-0">Kegiatan Setelah Beribadah</label>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowInfo(true);
                                            if (infoTimer.current) clearTimeout(infoTimer.current);
                                            infoTimer.current = window.setTimeout(() => {
                                                setShowInfo(false);
                                                infoTimer.current = null;
                                            }, 3000) as unknown as number;
                                        }}
                                        aria-label="Informasi kegiatan"
                                        title="Informasi"
                                        className="absolute right-0 top-0 p-1 rounded-md hover:bg-gray-100 text-gray-600"
                                    >
                                        <Info className="w-4 h-4" />
                                    </button>

                                    {showInfo && (
                                        // Positioned alert so it doesn't push content down on mobile
                                        <div className="absolute left-0 top-12 sm:top-0 sm:left-auto sm:right-0 bg-blue-50 border border-blue-200 text-blue-900 text-sm rounded-md px-3 py-2 shadow-md w-full sm:w-64 z-20">
                                            <div className="flex items-center gap-2">
                                                <Info className="w-4 h-4 text-blue-700" />
                                                <span>Pilih kegiatan yang dilakukan/kerjakan</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mengaji */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                <label className="font-semibold text-gray-700 text-base sm:text-base w-28 sm:w-48">Mengaji</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={mengaji}
                                        onChange={(e) => handleActivityChange('mengaji', e.target.checked)}
                                        disabled={isSubmitting}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200 disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Berdoa */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                                <label className="font-semibold text-gray-700 text-base sm:text-base w-28 sm:w-48">Berdoa</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={berdoa}
                                        onChange={(e) => handleActivityChange('berdoa', e.target.checked)}
                                        disabled={isSubmitting}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200 disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Bersedekah */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
                                <label className="font-semibold text-gray-700 text-base sm:text-base w-28 sm:w-48">Bersedekah</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={bersedekah}
                                        onChange={(e) => handleActivityChange('bersedekah', e.target.checked)}
                                        disabled={isSubmitting}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200 disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Lainnya */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                                <label className="font-semibold text-gray-700 text-base sm:text-base w-28 sm:w-48">Lainnya</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={lainnya}
                                        onChange={(e) => handleActivityChange('lainnya', e.target.checked)}
                                        disabled={isSubmitting}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200 disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Approval Toggle */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                                <label className="w-auto sm:w-48 font-semibold text-gray-700 whitespace-nowrap">Approval Orang Tua</label>
                                <button
                                    type="button"
                                    disabled
                                    className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors cursor-not-allowed opacity-60 ${approvalOrangTua ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${approvalOrangTua ? 'translate-x-11' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
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
                            <div className="text-center sm:text-right text-sm text-gray-500">
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
