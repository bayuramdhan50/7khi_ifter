import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { dashboard } from '@/routes/siswa';
import { show as showActivity } from '@/routes/siswa/activity';

interface Activity {
    id: number;
    title: string;
    icon: string;
    color: string;
}

interface ActivityDetail {
    label: string;
    is_checked: boolean;
    value: string | null;
}

interface Submission {
    id: number;
    date: string;
    time: string;
    photo: string | null;
    status: string;
    approved_by: number | null;
    approved_at: string | null;
    details: {
        [key: string]: ActivityDetail;
    };
}

interface BangunPagiHistoryProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    activity: Activity;
    submissions: Submission[];
}

export default function BangunPagiHistory({ auth, activity, submissions }: BangunPagiHistoryProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    
    // Create a map of submissions by date for quick lookup
    const submissionsByDate = useMemo(() => {
        const map: { [key: string]: Submission } = {};
        submissions.forEach(submission => {
            map[submission.date] = submission;
        });
        return map;
    }, [submissions]);

    // Get submission for a specific day
    const getSubmissionForDay = (day: number) => {
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateKey = `${year}-${month}-${dayStr}`;
        return submissionsByDate[dateKey];
    };

    // Get checked activities for a specific day (only count if submission is approved)
    const getCheckedActivities = (day: number) => {
        const submission = getSubmissionForDay(day);
        if (!submission || submission.status !== 'approved') {
            return {
                membereskanTempat: false,
                mandi: false,
                berpakaianRapi: false,
                sarapan: false
            };
        }

        return {
            membereskanTempat: submission.details.membereskan_tempat_tidur?.is_checked || false,
            mandi: submission.details.mandi?.is_checked || false,
            berpakaianRapi: submission.details.berpakaian_rapi?.is_checked || false,
            sarapan: submission.details.sarapan?.is_checked || false
        };
    };

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
                                {/* <div className="absolute top-2 right-2 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md z-10">
                                    <span className="text-white font-bold text-base sm:text-lg">{activity.id}</span>
                                </div> */}
                                <div className={`${activity.color} p-4 sm:p-8 flex items-center justify-center`}>
                                    <div className="bg-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 w-full">
                                        <div className="w-full h-32 sm:h-40 bg-white rounded-lg flex items-center justify-center text-gray-400">
                                            <span className="text-3xl sm:text-5xl">☀️</span>
                                        </div>
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

                            {/* Mobile Card Layout */}
                            <div className="md:hidden space-y-3">
                                {days.map((day) => {
                                    const submission = getSubmissionForDay(day);
                                    const isApproved = submission?.status === 'approved';
                                    const isPending = submission?.status === 'pending';
                                    
                                    return (
                                    <div key={day} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                                                    <span className="text-2xl font-bold text-blue-600">{day}</span>
                                                </div>
                                                <div className="text-white">
                                                    <div className="text-xs opacity-90">Tanggal</div>
                                                    <div className="text-sm font-bold">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedDay(day);
                                                    setShowModal(true);
                                                }}
                                                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:bg-blue-50 transition-colors"
                                            >
                                                Detail
                                            </button>
                                        </div>
                                        
                                        <div className="p-4 space-y-3">
                                            {/* Jam Bangun */}
                                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs text-gray-500">Jam Bangun</div>
                                                        <div className="mt-1 px-2 py-1 border-2 border-gray-300 rounded-lg text-gray-800 text-sm bg-white">
                                                            {submission?.time || '--:--'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Approval Orang Tua */}
                                            <div className={`flex items-center justify-between p-3 rounded-lg ${isApproved ? 'bg-green-50' : 'bg-gray-50'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isApproved ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                        <svg className={`w-5 h-5 ${isApproved ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500">Approval Orang Tua</div>
                                                        <div className={`text-sm font-semibold ${isApproved ? 'text-green-700' : isPending ? 'text-yellow-600' : 'text-gray-500'}`}>
                                                            {isApproved ? 'Disetujui' : isPending ? 'Menunggu' : 'Belum Ada'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`w-12 h-7 rounded-full flex items-center px-1 shadow-inner ${isApproved ? 'bg-green-500' : 'bg-gray-300'}`}>
                                                    <div className={`bg-white w-5 h-5 rounded-full shadow-md ${isApproved ? 'ml-auto' : ''}`}></div>
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
                                                        <div className="text-sm font-semibold text-gray-700">
                                                            {submission?.photo ? 'Ada Foto' : 'Belum Ada'}
                                                        </div>
                                                    </div>
                                                </div>
                                                {submission?.photo && (
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedPhoto(submission.photo);
                                                            setShowPhotoModal(true);
                                                        }}
                                                        className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:bg-purple-600 transition-colors"
                                                    >
                                                        Lihat
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )})}
                            </div>

                            {/* Desktop Table Layout */}
                            <div className="hidden md:block bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200 bg-gray-50">
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 text-sm whitespace-nowrap">TANGGAL</th>
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 text-sm whitespace-nowrap">JAM BANGUN</th>
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 text-sm whitespace-nowrap">APPROVAL ORTU</th>
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 text-sm whitespace-nowrap">BUKTI FOTO</th>
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 text-sm whitespace-nowrap">DETAIL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {days.map((day) => {
                                                const submission = getSubmissionForDay(day);
                                                const isApproved = submission?.status === 'approved';
                                                const isPending = submission?.status === 'pending';
                                                
                                                return (
                                                <tr key={day} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                                    {/* Tanggal */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-center">
                                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                                                                <span className="text-2xl font-bold text-white">{day}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Jam Bangun */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-center">
                                                            <div className="w-full max-w-[140px] px-3 py-2 border-2 border-gray-300 rounded-lg text-gray-800 text-base text-center bg-gray-50">
                                                                {submission?.time || '--:--'}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Approval Orang Tua */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-center">
                                                            <div className={`w-14 h-8 rounded-full flex items-center px-1 shadow-md ${isApproved ? 'bg-green-500' : 'bg-gray-300'}`}>
                                                                <div className={`bg-white w-6 h-6 rounded-full shadow-md ${isApproved ? 'ml-auto' : ''}`}></div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Bukti Foto */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-center">
                                                            {submission?.photo ? (
                                                                <button 
                                                                    onClick={() => {
                                                                        setSelectedPhoto(submission.photo);
                                                                        setShowPhotoModal(true);
                                                                    }}
                                                                    className="w-14 h-14 bg-purple-500 border-2 border-purple-600 rounded-xl flex items-center justify-center hover:bg-purple-600 transition-all shadow-md hover:shadow-lg group"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </button>
                                                            ) : (
                                                                <div className="w-14 h-14 bg-gray-100 border-2 border-gray-300 rounded-xl flex items-center justify-center shadow-md">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Detail Button */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-center">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedDay(day);
                                                                    setShowModal(true);
                                                                }}
                                                                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-xl text-sm font-semibold"
                                                            >
                                                                Lihat Detail
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )})}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 gap-3">
                                <div className="text-xs sm:text-sm text-gray-600">
                                    Showing {startIndex + 1} to {Math.min(endIndex, allDays.length)} of {allDays.length} entries
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        «
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ‹
                                    </button>

                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    currentPage === page
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ›
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        »
                                    </button>

                                    <span className="text-sm text-gray-600 ml-2">
                                        Halaman {currentPage} dari {totalPages}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar - Calendar */}
                        <div className="hidden xl:block w-80 flex-shrink-0">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                                <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">Kalender<br />2025</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {monthNames.map((month, index) => (
                                        <button
                                            key={month}
                                            onClick={() => {
                                                const newDate = new Date(currentMonth);
                                                newDate.setMonth(index);
                                                setCurrentMonth(newDate);
                                                setCurrentPage(1);
                                            }}
                                            className={`p-2 text-center text-xs rounded cursor-pointer hover:scale-105 transition-all duration-200 ${index === currentMonth.getMonth() ? 'bg-blue-500 text-white font-bold shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            {month.substring(0, 3)}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <div className="w-full aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-6xl mb-2">📅</div>
                                            <div className="text-2xl font-bold text-blue-900">2025</div>
                                        </div>
                                    </div>
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
                            Detail Kegiatan Setelah Bangun
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Tanggal: {selectedDay} {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </p>

                        {/* Checkbox List */}
                        <div className="space-y-4">
                            {(() => {
                                const activities = getCheckedActivities(selectedDay);
                                return (
                                    <>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${activities.membereskanTempat ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                                                {activities.membereskanTempat && (
                                                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={`text-sm font-medium ${activities.membereskanTempat ? 'text-gray-900' : 'text-gray-400'}`}>
                                                Membereskan Tempat Tidur
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${activities.mandi ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                                                {activities.mandi && (
                                                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={`text-sm font-medium ${activities.mandi ? 'text-gray-900' : 'text-gray-400'}`}>
                                                Mandi
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${activities.berpakaianRapi ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                                                {activities.berpakaianRapi && (
                                                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={`text-sm font-medium ${activities.berpakaianRapi ? 'text-gray-900' : 'text-gray-400'}`}>
                                                Berpakaian Rapi
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${activities.sarapan ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                                                {activities.sarapan && (
                                                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={`text-sm font-medium ${activities.sarapan ? 'text-gray-900' : 'text-gray-400'}`}>
                                                Sarapan
                                            </span>
                                        </div>
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

            {/* Photo Preview Modal */}
            {showPhotoModal && selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowPhotoModal(false)}>
                    <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button
                            onClick={() => setShowPhotoModal(false)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        {/* Image */}
                        <div className="p-4">
                            <img
                                src={`/storage/activity-photos/${selectedPhoto}`}
                                alt="Bukti Foto Kegiatan"
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    console.error('Failed to load image:', `/storage/${selectedPhoto}`);
                                    target.onerror = null; // Prevent infinite loop
                                }}
                                onLoad={() => {
                                    console.log('Image loaded successfully:', `/storage/${selectedPhoto}`);
                                }}
                            />
                        </div>
                        
                        {/* Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <p className="text-sm text-gray-600 text-center">
                                Bukti Foto Kegiatan Bangun Pagi
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
