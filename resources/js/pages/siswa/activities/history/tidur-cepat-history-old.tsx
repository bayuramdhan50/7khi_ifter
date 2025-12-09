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

interface TidurCepatHistoryProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    activity: Activity;
}

export default function TidurCepatHistory({ auth, activity }: TidurCepatHistoryProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

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

                            {/* Mobile Card Layout */}
                            <div className="md:hidden space-y-3">
                                {days.map((day) => (
                                    <div key={day} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                                                    <span className="text-2xl font-bold text-blue-600">{day}</span>
                                                </div>
                                                <div className="text-white">
                                                    <div className="text-xs opacity-90">Tanggal</div>
                                                    <div className="text-sm font-bold">{monthNames[currentMonth.getMonth()]} 2025</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-4 space-y-3">
                                            {/* Jam Tidur */}
                                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs text-gray-500">Jam Tidur</div>
                                                        <input
                                                            type="time"
                                                            className="mt-1 w-full px-2 py-1 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Approval Orang Tua */}
                                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500">Approval Orang Tua</div>
                                                        <div className="text-sm font-semibold text-green-700">Disetujui</div>
                                                    </div>
                                                </div>
                                                <div className="bg-green-500 w-12 h-7 rounded-full flex items-center px-1 shadow-inner">
                                                    <div className="bg-white w-5 h-5 rounded-full shadow-md ml-auto"></div>
                                                </div>
                                            </div>

                                            {/* Bukti Foto */}
                                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500">Bukti Foto</div>
                                                        <div className="text-sm font-semibold text-gray-700">Upload Foto</div>
                                                    </div>
                                                </div>
                                                <label className="cursor-pointer">
                                                    <input type="file" accept="image/*" className="hidden" />
                                                    <div className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:bg-purple-600 transition-colors">
                                                        Pilih
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table Layout */}
                            <div className="hidden md:block bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200 bg-gray-50">
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 text-sm whitespace-nowrap">TANGGAL</th>
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 text-sm whitespace-nowrap">JAM TIDUR</th>
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 text-sm whitespace-nowrap">APPROVAL ORTU</th>
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 text-sm whitespace-nowrap">BUKTI FOTO</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {days.map((day) => (
                                                <tr key={day} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                                    {/* Tanggal */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-center">
                                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                                                                <span className="text-2xl font-bold text-white">{day}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Jam Tidur */}
                                                    <td className="py-4 px-4">
                                                        <input
                                                            type="time"
                                                            className="w-full max-w-[140px] px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-base"
                                                        />
                                                    </td>

                                                    {/* Approval Orang Tua */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-center">
                                                            <div className="bg-green-500 w-14 h-8 rounded-full flex items-center px-1 shadow-md">
                                                                <div className="bg-white w-6 h-6 rounded-full shadow-md ml-auto"></div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Bukti Foto */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-center">
                                                            <label className="cursor-pointer">
                                                                <input type="file" accept="image/*" className="hidden" />
                                                                <div className="w-14 h-14 bg-purple-100 border-2 border-purple-300 rounded-xl flex items-center justify-center hover:bg-purple-200 transition-all shadow-md hover:shadow-lg group">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                            </div>

                            {/* Pagination */}
                            <div className="mt-4">
                                <div className="bg-white rounded-xl shadow-lg p-4 md:p-5">
                                    <div className="flex flex-col items-center gap-3">
                                        {/* Page Numbers */}
                                        <div className="flex gap-2 flex-wrap justify-center">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button 
                                                    key={page} 
                                                    onClick={() => setCurrentPage(page)} 
                                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-bold text-sm md:text-base transition-all shadow-md ${
                                                        currentPage === page 
                                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-110 shadow-lg' 
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        {/* Navigation Arrows */}
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => setCurrentPage(1)} 
                                                disabled={currentPage === 1} 
                                                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                title="Halaman Pertama"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                                                disabled={currentPage === 1} 
                                                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                title="Sebelumnya"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            
                                            <span className="text-sm md:text-base font-semibold text-gray-700 px-3">
                                                Halaman {currentPage} dari {totalPages}
                                            </span>
                                            
                                            <button 
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                                                disabled={currentPage === totalPages} 
                                                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                title="Selanjutnya"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => setCurrentPage(totalPages)} 
                                                disabled={currentPage === totalPages} 
                                                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                title="Halaman Terakhir"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
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
        </AppLayout>
    );
}
