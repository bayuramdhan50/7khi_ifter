import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { dashboard } from '@/routes/siswa';
import { show as showActivity } from '@/routes/siswa/activity';

interface Activity {
    id: number;
    title: string;
    icon: string;
    color: string;
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
}

export default function BeribadahMuslimDetail({ auth, activity, nextActivity, previousActivity }: BeribadahMuslimDetailProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(1);
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
    const [mengaji, setMengaji] = useState(false);
    const [berdoa, setBerdoa] = useState(false);
    const [bersedekah, setBersedekah] = useState(false);
    const [lainnya, setLainnya] = useState(false);

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

    const handlePrayerSubmit = (prayerKey: string) => {
        setPrayers(prev => ({
            ...prev,
            [prayerKey]: true
        }));
        console.log(`Submit ${prayerKey}`, {
            tanggal: selectedDate,
            [prayerKey]: true
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

                    {/* Month Navigation */}
                    <div className="flex items-center justify-center gap-6 sm:gap-8 mb-8 flex-wrap">
                        <button
                            onClick={() => changeMonth('prev')}
                            className="text-gray-700 hover:text-gray-900"
                        >
                            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>

                        <div className="text-center">
                            <h2 className="text-xl sm:text-3xl font-bold text-blue-900 leading-tight">
                                Bulan : {monthNames[currentMonth.getMonth()]}
                            </h2>
                        </div>

                        <button
                            onClick={() => changeMonth('next')}
                            className="text-gray-700 hover:text-gray-900"
                        >
                            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>
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
                                            <img
                                                src="/api/placeholder/200/150"
                                                alt={activity.title}
                                                className="w-full h-auto rounded-lg"
                                            />
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
                            {/* Date Input */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
                                <label className="w-auto sm:w-48 text-center sm:text-left font-semibold text-gray-700">Tanggal</label>
                                <div className="flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-300">
                                        <input
                                            // type="number"
                                            // min="1"
                                            // max="31"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(Number(e.target.value))}
                                            className="w-12 h-12 text-center text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none"
                                        />
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
                                                onChange={(e) => setPrayers(prev => ({ ...prev, [prayer.key]: e.target.checked }))}
                                                className="w-6 h-6 rounded border-2 border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-600">
                                                {prayers[prayer.key as keyof typeof prayers] ? 'Sudah dikerjakan' : 'Belum dikerjakan'}
                                            </span>
                                        </div>
                                        {/* <Button
                                            type="button"
                                            onClick={() => handlePrayerSubmit(prayer.key)}
                                            className="bg-gray-800 hover:bg-gray-700 text-white px-8"
                                        >
                                            Submit
                                        </Button> */}
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
                                        onChange={(e) => setMengaji(e.target.checked)}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200"
                                    />
                                    {/* <Button type="button" className="bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200 text-white px-6 sm:px-8 py-2 shadow-md hover:shadow-lg text-sm sm:text-base">Submit</Button> */}
                                </div>
                            </div>

                            {/* Berdoa */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                                <label className="font-semibold text-gray-700 text-base sm:text-base w-28 sm:w-48">Berdoa</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={berdoa}
                                        onChange={(e) => setBerdoa(e.target.checked)}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200"
                                    />
                                    {/* <Button type="button" className="bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200 text-white px-6 sm:px-8 py-2 shadow-md hover:shadow-lg text-sm sm:text-base">Submit</Button> */}
                                </div>
                            </div>

                            {/* Bersedekah */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
                                <label className="font-semibold text-gray-700 text-base sm:text-base w-28 sm:w-48">Bersedekah</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={bersedekah}
                                        onChange={(e) => setBersedekah(e.target.checked)}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200"
                                    />
                                    {/* <Button type="button" className="bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200 text-white px-6 sm:px-8 py-2 shadow-md hover:shadow-lg text-sm sm:text-base">Submit</Button> */}
                                </div>
                            </div>

                            {/* Lainnya */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                                <label className="font-semibold text-gray-700 text-base sm:text-base w-28 sm:w-48">Lainnya</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={lainnya}
                                        onChange={(e) => setLainnya(e.target.checked)}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200"
                                    />
                                    {/* <Button type="button" className="bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200 text-white px-6 sm:px-8 py-2 shadow-md hover:shadow-lg text-sm sm:text-base">Submit</Button> */}
                                </div>
                            </div>

                            {/* Approval Toggle */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 relative">
                                <label className="w-auto sm:w-48 font-semibold text-gray-700 whitespace-nowrap">Approval Orang Tua</label>
                                <div className="flex items-center gap-4">
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

                                    {/* Image Upload */}
                                    <label className="cursor-pointer absolute right-0 bottom-0 sm:static sm:mr-0 mr-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <div className="w-16 h-16 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                            {image ? (
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </div>
                                    </label>
                                </div>
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
