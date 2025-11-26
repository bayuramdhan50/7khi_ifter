import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
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
}

export default function BerolahragaDetail({ auth, activity, nextActivity, previousActivity }: BerolahragaDetailProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(1);
    const [berolahraga, setBerolahraga] = useState(false);
    const [approvalOrangTua, setApprovalOrangTua] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    
    // Dropdown state for exercise duration
    const [waktuBerolahraga, setWaktuBerolahraga] = useState('');

    const monthNames = [
        'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
        'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            tanggal: selectedDate,
            berolahraga,
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
                    <div className="flex items-center justify-between mb-4 sm:mb-8 gap-2">
                        <Link
                            href={previousActivity ? showActivity.url(previousActivity.id) : dashboard.url()}
                            className="bg-gray-800 text-white hover:bg-gray-700 hover:scale-105 transition-all duration-200 rounded-lg px-3 py-2 sm:px-6 inline-block shadow-md hover:shadow-lg text-xs sm:text-base"
                        >
                            ← Kembali
                        </Link>

                        <Link
                            href={history.url()}
                            className="bg-gray-800 text-white hover:bg-gray-700 hover:scale-105 transition-all duration-200 rounded-lg px-3 py-2 sm:px-6 inline-block shadow-md hover:shadow-lg text-xs sm:text-base"
                        >
                            Riwayat
                        </Link>

                        {nextActivity ? (
                            <Link
                                href={showActivity.url(nextActivity.id)}
                                className="bg-gray-800 text-white hover:bg-gray-700 hover:scale-105 transition-all duration-200 rounded-lg px-3 py-2 sm:px-6 inline-block shadow-md hover:shadow-lg text-xs sm:text-base"
                            >
                                Lanjut →
                            </Link>
                        ) : (
                            <button
                                type="button"
                                disabled
                                className="bg-gray-400 text-white rounded-lg px-6 py-2 cursor-not-allowed opacity-50"
                            >
                                Lanjut →
                            </button>
                        )}
                    </div>

                    {/* Month Navigation */}
                    <div className="flex items-center justify-center gap-3 sm:gap-8 mb-4 sm:mb-8">
                        <button
                            onClick={() => changeMonth('prev')}
                            className="text-gray-700 hover:text-blue-600 hover:scale-110 transition-all duration-200 p-1 sm:p-2 rounded-full hover:bg-blue-100"
                        >
                            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>

                        <div className="text-center">
                            <h2 className="text-lg sm:text-3xl font-bold text-blue-900">
                                Bulan : {monthNames[currentMonth.getMonth()]}
                            </h2>
                        </div>

                        <button
                            onClick={() => changeMonth('next')}
                            className="text-gray-700 hover:text-blue-600 hover:scale-110 transition-all duration-200 p-1 sm:p-2 rounded-full hover:bg-blue-100"
                        >
                            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 border-2 sm:border-4 border-gray-800">
                        <h1 className="text-base sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-8 text-center">
                            Kebiasaan {activity.id}: {activity.title.toUpperCase()}
                        </h1>

                        {/* Activity Icon Card */}
                        <div className="flex justify-center mb-4 sm:mb-8">
                            <div className="relative">
                                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center border-2 sm:border-4 border-white shadow-lg z-10">
                                    <span className="text-white font-bold text-sm sm:text-xl">{activity.id}</span>
                                </div>

                                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border-2 sm:border-4 border-blue-900 overflow-hidden w-48 sm:w-64">
                                    <div className={`${activity.color} p-8 flex items-center justify-center`}>
                                        <div className="bg-blue-200 rounded-2xl p-6 w-full">
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
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            {/* Date Input */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">TANGGAL</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                                        <input
                                            type="number"
                                            min="1"
                                            max="31"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(Number(e.target.value))}
                                            className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl sm:text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Kegiatan Olahraga Input */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">KEGIATAN OLAHRAGA</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={berolahraga}
                                        onChange={(e) => setBerolahraga(e.target.checked)}
                                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition-all duration-200"
                                    />
                                    <Button
                                        type="button"
                                        className="bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200 text-white px-6 sm:px-8 py-2 shadow-md hover:shadow-lg text-sm sm:text-base"
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>

                            {/* Waktu Berolahraga Dropdown */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">WAKTU BEROLAHRAGA</label>
                                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                                    <select
                                        value={waktuBerolahraga}
                                        onChange={(e) => setWaktuBerolahraga(e.target.value)}
                                        className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm sm:text-base hover:border-blue-400 transition-all duration-200"
                                    >
                                        <option value="">Pilih Durasi</option>
                                        <option value="10">10 Menit</option>
                                        <option value="20">20 Menit</option>
                                        <option value="30">30 Menit</option>
                                        <option value="30+">&gt; 30 Menit</option>
                                    </select>
                                    <Button
                                        type="button"
                                        className="bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200 text-white px-6 sm:px-8 py-2 shadow-md hover:shadow-lg text-sm sm:text-base"
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>

                            {/* Approval Toggle */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <label className="font-semibold text-gray-700 text-sm sm:text-base sm:w-48">APPROVAL ORANG TUA</label>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <button
                                        type="button"
                                        disabled
                                        className={`relative inline-flex h-8 w-16 sm:h-10 sm:w-20 items-center rounded-full transition-colors cursor-not-allowed opacity-60 ${
                                            approvalOrangTua ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-6 w-6 sm:h-8 sm:w-8 transform rounded-full bg-white transition-transform ${
                                                approvalOrangTua ? 'translate-x-9 sm:translate-x-11' : 'translate-x-1'
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
                            <div className="text-right text-xs sm:text-sm text-gray-500">
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
