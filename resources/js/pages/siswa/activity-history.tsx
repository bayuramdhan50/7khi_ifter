import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { dashboard } from '@/routes/siswa';
import { show as showActivity } from '@/routes/siswa/activity';

interface Activity {
    id: number;
    title: string;
    icon: string;
    color: string;
}

interface ActivityHistoryProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    activity: Activity;
}

export default function ActivityHistory({ auth, activity }: ActivityHistoryProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthNames = [
        'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
        'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
    ];

    // Get days in current month
    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const lastDay = new Date(year, month + 1, 0);
        return lastDay.getDate();
    };

    const daysInMonth = getDaysInMonth();

    // Generate array of days (1 to daysInMonth)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <AppLayout>
            <Head title={`Kebiasaan ${activity.id}: ${activity.title.toUpperCase()}`} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <img src="/api/placeholder/60/60" alt="Logo" className="w-12 h-12" />
                            <h1 className="text-2xl font-bold text-blue-900">Jurnal Harian</h1>
                        </div>
                    </div>

                    <div className="flex gap-8">
                        {/* Left Sidebar */}
                        <div className="w-80 flex-shrink-0">
                            {/* Activity Card */}
                            <div className="bg-white rounded-3xl shadow-lg border-4 border-blue-900 overflow-hidden mb-6">
                                <div className="absolute top-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md z-10">
                                    <span className="text-white font-bold text-lg">{activity.id}</span>
                                </div>
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

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link
                                    href={showActivity.url(activity.id)}
                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg text-center block"
                                >
                                    SELESAI
                                </Link>
                                <Link
                                    href={dashboard.url()}
                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg text-center block"
                                >
                                    MENU
                                </Link>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Title and Month */}
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-blue-900">
                                    Kebiasaan {activity.id}: {activity.title.toUpperCase()}
                                </h2>
                                <h2 className="text-2xl font-bold text-blue-900">
                                    Bulan : {monthNames[currentMonth.getMonth()]}
                                </h2>
                            </div>

                            {/* Table */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200">
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 w-32">TANGGAL</th>
                                                <th className="py-4 px-4 text-center font-bold text-gray-700">WAKTU</th>
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 w-48">APPROVAL ORANG TUA</th>
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 w-32">BUKTI FOTO</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {days.map((day) => (
                                                <tr key={day} className="border-b border-gray-200 hover:bg-gray-50">
                                                    {/* Tanggal */}
                                                    <td className="py-3 px-4">
                                                        <div className="flex justify-center">
                                                            <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-300">
                                                                <span className="text-xl font-bold text-gray-700">{day}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Waktu */}
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Masukan Jawaban"
                                                                defaultValue="Masukan Jawaban"
                                                                className={`flex-1 px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                                    day === 10 ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                                                                }`}
                                                            />
                                                            <Button
                                                                type="button"
                                                                className="bg-gray-800 hover:bg-gray-700 text-white px-6"
                                                            >
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    </td>

                                                    {/* Approval Orang Tua */}
                                                    <td className="py-3 px-4">
                                                        <div className="flex justify-center">
                                                            <button
                                                                type="button"
                                                                disabled
                                                                className="relative inline-flex h-10 w-20 items-center rounded-full transition-colors cursor-not-allowed opacity-60 bg-green-500"
                                                            >
                                                                <span className="inline-block h-8 w-8 transform rounded-full bg-white transition-transform translate-x-11" />
                                                            </button>
                                                        </div>
                                                    </td>

                                                    {/* Bukti Foto */}
                                                    <td className="py-3 px-4">
                                                        <div className="flex justify-center">
                                                            <label className="cursor-pointer">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                />
                                                                <div className="w-16 h-16 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Timestamp */}
                                <div className="text-right text-sm text-gray-500 p-4">
                                    Apr 1, 2025    9:41 AM
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar - Calendar */}
                        <div className="w-80 flex-shrink-0">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                                <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">
                                    Kalender<br />2025
                                </h3>

                                {/* Mini Calendar Preview */}
                                <div className="grid grid-cols-3 gap-2">
                                    {monthNames.map((month, index) => (
                                        <div
                                            key={month}
                                            className={`p-2 text-center text-xs rounded ${
                                                index === currentMonth.getMonth()
                                                    ? 'bg-blue-500 text-white font-bold'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {month.substring(0, 3)}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar illustration placeholder */}
                                <div className="mt-4">
                                    <img
                                        src="/api/placeholder/300/300"
                                        alt="Calendar 2025"
                                        className="w-full rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
