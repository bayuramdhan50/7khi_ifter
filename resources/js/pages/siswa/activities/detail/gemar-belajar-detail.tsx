import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
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
}

export default function GemarBelajarDetail({ auth, activity, nextActivity, previousActivity }: GemarBelajarDetailProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(1);
    const [gemarBelajar, setGemarBelajar] = useState(false);
    const [approvalOrangTua, setApprovalOrangTua] = useState(false);
    const [image, setImage] = useState<File | null>(null);

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
            gemarBelajar,
            approvalOrangTua,
            image
        });
    };

    return (
        <AppLayout>
            <Head title={`Kebiasaan ${activity.id}: ${activity.title.toUpperCase()}`} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header with Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <Link
                            href={previousActivity ? showActivity.url(previousActivity.id) : dashboard.url()}
                            className="bg-gray-800 text-white hover:bg-gray-700 rounded-lg px-6 py-2 inline-block"
                        >
                            ← Kembali
                        </Link>

                        <Link
                            href={history.url()}
                            className="bg-gray-800 text-white hover:bg-gray-700 rounded-lg px-6 py-2 inline-block"
                        >
                            Riwayat
                        </Link>

                        {nextActivity ? (
                            <Link
                                href={showActivity.url(nextActivity.id)}
                                className="bg-gray-800 text-white hover:bg-gray-700 rounded-lg px-6 py-2 inline-block"
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
                    <div className="flex items-center justify-center gap-8 mb-8">
                        <button
                            onClick={() => changeMonth('prev')}
                            className="text-gray-700 hover:text-gray-900"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>

                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-blue-900">
                                Bulan : {monthNames[currentMonth.getMonth()]}
                            </h2>
                        </div>

                        <button
                            onClick={() => changeMonth('next')}
                            className="text-gray-700 hover:text-gray-900"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-gray-800">
                        <h1 className="text-2xl font-bold text-blue-900 mb-8 text-center">
                            Kebiasaan {activity.id}: {activity.title.toUpperCase()}
                        </h1>

                        {/* Activity Icon Card */}
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10">
                                    <span className="text-white font-bold text-xl">{activity.id}</span>
                                </div>

                                <div className="bg-white rounded-3xl shadow-lg border-4 border-blue-900 overflow-hidden w-64">
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
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Date Input */}
                            <div className="flex items-center gap-4">
                                <label className="w-48 font-semibold text-gray-700">TANGGAL</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-300">
                                        <input
                                            type="number"
                                            min="1"
                                            max="31"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(Number(e.target.value))}
                                            className="w-12 h-12 text-center text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Kegiatan Belajar Input */}
                            <div className="flex items-center gap-4">
                                <label className="w-48 font-semibold text-gray-700">KEGIATAN BELAJAR</label>
                                <div className="flex-1 flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={gemarBelajar}
                                            onChange={(e) => setGemarBelajar(e.target.checked)}
                                            className="w-6 h-6 rounded border-2 border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-600">
                                            {gemarBelajar ? 'Sudah belajar' : 'Belum belajar'}
                                        </span>
                                    </div>
                                    <Button
                                        type="button"
                                        className="bg-gray-800 hover:bg-gray-700 text-white px-8"
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>

                            {/* Approval Toggle */}
                            <div className="flex items-center gap-4">
                                <label className="w-48 font-semibold text-gray-700">APPROVAL ORANG TUA</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        disabled
                                        className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors cursor-not-allowed opacity-60 ${
                                            approvalOrangTua ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                                                approvalOrangTua ? 'translate-x-11' : 'translate-x-1'
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
                            <div className="text-right text-sm text-gray-500">
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
