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

interface GemarBelajarHistoryProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    activity: Activity;
}

export default function GemarBelajarHistory({ auth, activity }: GemarBelajarHistoryProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    
    // Mock data untuk checkbox yang sudah diceklis (nanti diganti dengan data dari backend)
    const getCheckedActivities = (day: number) => ({
        ekstrakurikuler: day % 2 === 0,
        bimbinganBelajar: day % 3 === 0,
        mengerjakanTugas: day % 4 === 0,
        lainnya: day % 5 === 0
    });

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
    const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Calculate pagination
    const totalPages = Math.ceil(allDays.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const days = allDays.slice(startIndex, endIndex);

    return (
        <AppLayout>
            <Head title={`Kebiasaan ${activity.id}: ${activity.title.toUpperCase()}`} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-4 sm:py-8">
                <div className="container mx-auto px-2 sm:px-4">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
                        {/* Left Sidebar */}
                        <div className="w-full lg:w-80 flex-shrink-0">
                            {/* Activity Card */}
                            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border-2 sm:border-4 border-blue-900 overflow-hidden mb-4 sm:mb-6 relative">
                                <div className="absolute top-2 right-2 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md z-10">
                                    <span className="text-white font-bold text-base sm:text-lg">{activity.id}</span>
                                </div>
                                <div className={`${activity.color} p-4 sm:p-8 flex items-center justify-center`}>
                                    <div className="bg-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 w-full">
                                        <img
                                            src="/api/placeholder/200/150"
                                            alt={activity.title}
                                            className="w-full h-auto rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="p-3 sm:p-4 text-center">
                                    <h3 className="font-bold text-gray-800 text-sm sm:text-base">{activity.title}</h3>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex lg:flex-col gap-2 sm:gap-3">
                                <Link
                                    href={showActivity.url(activity.id)}
                                    className="flex-1 lg:w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-center block text-sm sm:text-base"
                                >
                                    SELESAI
                                </Link>
                                <Link
                                    href={dashboard.url()}
                                    className="flex-1 lg:w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-center block text-sm sm:text-base"
                                >
                                    MENU
                                </Link>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Title and Month */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-8 gap-2">
                                <h2 className="text-lg sm:text-2xl font-bold text-blue-900">
                                    Kebiasaan {activity.id}: {activity.title.toUpperCase()}
                                </h2>
                                <h2 className="text-base sm:text-2xl font-bold text-blue-900">
                                    Bulan : {monthNames[currentMonth.getMonth()]}
                                </h2>
                            </div>

                            {/* Filter Dropdown */}
                            <div className="mb-3 sm:mb-4 flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-medium text-gray-700">Show</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium bg-white text-gray-700"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={31}>31</option>
                                </select>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">entries</span>
                            </div>

                            {/* Table */}
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                                <div className="lg:overflow-x-auto">
                                    <table className="w-full lg:min-w-max">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200 bg-gray-50">
                                                <th className="py-2 sm:py-4 px-2 sm:px-4 text-center font-bold text-gray-700 text-xs sm:text-sm whitespace-nowrap">TANGGAL</th>
                                                <th className="py-2 sm:py-4 px-2 sm:px-4 text-center font-bold text-gray-700 text-xs sm:text-sm whitespace-nowrap">KEGIATAN BELAJAR</th>
                                                <th className="py-2 sm:py-4 px-2 sm:px-4 text-center font-bold text-gray-700 text-xs sm:text-sm whitespace-nowrap">APPROVAL ORTU</th>
                                                <th className="py-2 sm:py-4 px-2 sm:px-4 text-center font-bold text-gray-700 text-xs sm:text-sm whitespace-nowrap">BUKTI FOTO</th>
                                                <th className="py-2 sm:py-4 px-2 sm:px-4 text-center font-bold text-gray-700 text-xs sm:text-sm whitespace-nowrap">DETAIL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {days.map((day) => (
                                                <tr key={day} className="border-b border-gray-200 hover:bg-gray-50">
                                                    {/* Tanggal */}
                                                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                                                        <div className="flex justify-center">
                                                            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-300">
                                                                <span className="text-base sm:text-xl font-bold text-gray-700">{day}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Kegiatan Belajar */}
                                                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                                                        <div className="flex justify-center">
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 sm:w-6 sm:h-6 rounded border-2 border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </td>

                                                    {/* Approval Orang Tua */}
                                                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                                                        <div className="flex justify-center">
                                                            <button
                                                                type="button"
                                                                disabled
                                                                className="relative inline-flex h-8 w-16 sm:h-10 sm:w-20 items-center rounded-full transition-colors cursor-not-allowed opacity-60 bg-green-500"
                                                            >
                                                                <span className="inline-block h-6 w-6 sm:h-8 sm:w-8 transform rounded-full bg-white transition-transform translate-x-9 sm:translate-x-11" />
                                                            </button>
                                                        </div>
                                                    </td>

                                                    {/* Bukti Foto */}
                                                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                                                        <div className="flex justify-center">
                                                            <label className="cursor-pointer">
                                                                <input type="file" accept="image/*" className="hidden" />
                                                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </td>

                                                    {/* Detail Button */}
                                                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                                                        <div className="flex justify-center">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedDay(day);
                                                                    setShowModal(true);
                                                                }}
                                                                className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm font-semibold"
                                                            >
                                                                <span className="sm:hidden">Lihat</span>
                                                                <span className="hidden sm:inline">Lihat Detail</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2 p-3 sm:p-4 border-t border-gray-200">
                                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50">«</button>
                                    <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50">‹</button>
                                    <div className="flex gap-1 flex-wrap justify-center">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button key={page} onClick={() => setCurrentPage(page)} className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{page}</button>
                                        ))}
                                    </div>
                                    <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50">›</button>
                                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50">»</button>
                                    <span className="text-xs sm:text-sm text-gray-600 ml-0 sm:ml-2 mt-2 sm:mt-0">Halaman {currentPage} dari {totalPages}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar - Calendar */}
                        <div className="hidden xl:block w-80 flex-shrink-0">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                                <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">Kalender<br />2025</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {monthNames.map((month, index) => (
                                        <div key={month} className={`p-2 text-center text-xs rounded ${index === currentMonth.getMonth() ? 'bg-blue-500 text-white font-bold' : 'bg-gray-100 text-gray-700'}`}>
                                            {month.substring(0, 3)}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <img src="/api/placeholder/300/300" alt="Calendar 2025" className="w-full rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Pop-up */}
            {showModal && selectedDay !== null && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setShowModal(false);
                                setSelectedDay(null);
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Modal Header */}
                        <h3 className="text-xl font-bold text-blue-900 mb-4 pr-8">
                            Jenis Kegiatan Belajar
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Tanggal: {selectedDay} {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </p>

                        {/* Checkbox List */}
                        <div className="space-y-4">
                            {(() => {
                                const activities = getCheckedActivities(selectedDay);
                                const learningTypes = [
                                    { key: 'ekstrakurikuler', label: 'Ekstrakurikuler' },
                                    { key: 'bimbinganBelajar', label: 'Bimbingan Belajar' },
                                    { key: 'mengerjakanTugas', label: 'Mengerjakan Tugas' },
                                    { key: 'lainnya', label: 'Lainnya' }
                                ];
                                return (
                                    <>
                                        {learningTypes.map(({ key, label }) => (
                                            <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                                <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${activities[key as keyof typeof activities] ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                                                    {activities[key as keyof typeof activities] && (
                                                        <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className={`text-sm font-medium ${activities[key as keyof typeof activities] ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {label}
                                                </span>
                                            </div>
                                        ))}
                                    </>
                                );
                            })()}
                        </div>

                        {/* Close Button */}
                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedDay(null);
                                }}
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
