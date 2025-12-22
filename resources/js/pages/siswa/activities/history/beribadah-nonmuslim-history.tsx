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

interface BeribadahNonMuslimHistoryProps {
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

export default function BeribadahNonMuslimHistory({ auth, activity, submissions }: BeribadahNonMuslimHistoryProps) {
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

    // Get checked activities for a specific day from real submission data
    const getCheckedActivities = (day: number) => {
        const submission = getSubmissionForDay(day);
        if (!submission) {
            return {
                doaPagi: false,
                bacaFirman: false,
                renungan: false,
                doaMalam: false,
                ibadahBersama: false
            };
        }

        return {
            doaPagi: submission.details.doa_pagi?.is_checked || false,
            bacaFirman: submission.details.baca_firman?.is_checked || false,
            renungan: submission.details.renungan?.is_checked || false,
            doaMalam: submission.details.doa_malam?.is_checked || false,
            ibadahBersama: submission.details.ibadah_bersama?.is_checked || false
        };
    };

    const handlePhotoClick = (photo: string) => {
        setSelectedPhoto(photo);
        setShowPhotoModal(true);
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
                                {/* <div className="absolute top-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md z-10">
                                    <span className="text-white font-bold text-lg">{activity.id}</span>
                                </div> */}
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
                                            {/* Kegiatan Ibadah Grid */}
                                            <div className="grid grid-cols-3 gap-2">
                                                {(() => {
                                                    const activities = getCheckedActivities(day);
                                                    return [
                                                        { key: 'doaPagi', label: 'Doa Pagi', color: 'blue' },
                                                        { key: 'bacaFirman', label: 'Baca Firman', color: 'green' },
                                                        { key: 'renungan', label: 'Renungan', color: 'purple' },
                                                        { key: 'doaMalam', label: 'Doa Malam', color: 'orange' },
                                                        { key: 'ibadahBersama', label: 'Ibadah Bersama', color: 'pink' }
                                                    ].map((item, idx) => (
                                                        <div key={idx} className={`flex flex-col items-center gap-1 p-2 bg-${item.color}-50 rounded-lg ${idx === 4 ? 'col-span-3' : ''}`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={activities[item.key as keyof typeof activities]}
                                                                readOnly
                                                                className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 pointer-events-none"
                                                            />
                                                            <span className="text-xs font-medium text-gray-700 text-center">{item.label}</span>
                                                        </div>
                                                    ));
                                                })()}
                                            </div>

                                            {/* Approval Orang Tua */}
                                            {(() => {
                                                const submission = getSubmissionForDay(day);
                                                const isApproved = submission?.status === 'approved';
                                                return (
                                                    <div className={`flex items-center justify-between p-3 rounded-lg ${isApproved ? 'bg-green-50' : 'bg-yellow-50'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isApproved ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                                                <svg className={`w-5 h-5 ${isApproved ? 'text-green-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-gray-500">Approval Orang Tua</div>
                                                                <div className={`text-sm font-semibold ${isApproved ? 'text-green-700' : 'text-yellow-700'}`}>
                                                                    {isApproved ? 'Disetujui' : 'Pending'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`${isApproved ? 'bg-green-500' : 'bg-gray-300'} w-12 h-7 rounded-full flex items-center px-1 shadow-inner`}>
                                                            <div className={`bg-white w-5 h-5 rounded-full shadow-md ${isApproved ? 'ml-auto' : ''}`}></div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            {/* Bukti Foto */}
                                            {(() => {
                                                const submission = getSubmissionForDay(day);
                                                const hasPhoto = !!submission?.photo;
                                                return hasPhoto ? (
                                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-gray-500">Bukti Foto</div>
                                                                <div className="text-sm font-semibold text-gray-700">Foto Tersedia</div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handlePhotoClick(submission.photo!)}
                                                            className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:bg-purple-600 transition-colors"
                                                        >
                                                            Lihat
                                                        </button>
                                                    </div>
                                                ) : null;
                                            })()}
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
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 text-sm whitespace-nowrap">Doa Pagi</th>
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 text-sm whitespace-nowrap">Baca Firman</th>
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 text-sm whitespace-nowrap">Renungan</th>
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 text-sm whitespace-nowrap">Doa Malam</th>
                                                <th className="py-4 px-4 text-center font-bold text-gray-700 text-sm whitespace-nowrap">Ibadah Bersama</th>
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

                                                    {/* Activity columns */}
                                                    {(() => {
                                                        const activities = getCheckedActivities(day);
                                                        return ['doaPagi', 'bacaFirman', 'renungan', 'doaMalam', 'ibadahBersama'].map((activity) => (
                                                            <td key={activity} className="py-4 px-2">
                                                                <div className="flex justify-center items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={activities[activity as keyof typeof activities]}
                                                                        readOnly
                                                                        className="w-6 h-6 border-2 border-gray-300 rounded text-blue-600 pointer-events-none"
                                                                    />
                                                                </div>
                                                            </td>
                                                        ));
                                                    })()}

                                                    {/* Approval Orang Tua */}
                                                    <td className="py-4 px-4">
                                                        {(() => {
                                                            const submission = getSubmissionForDay(day);
                                                            const isApproved = submission?.status === 'approved';
                                                            return (
                                                                <div className="flex justify-center">
                                                                    <div className={`${isApproved ? 'bg-green-500' : 'bg-gray-300'} w-14 h-8 rounded-full flex items-center px-1 shadow-md`}>
                                                                        <div className={`bg-white w-6 h-6 rounded-full shadow-md ${isApproved ? 'ml-auto' : ''}`}></div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}
                                                    </td>

                                                    {/* Bukti Foto */}
                                                    <td className="py-4 px-4">
                                                        {(() => {
                                                            const submission = getSubmissionForDay(day);
                                                            const hasPhoto = !!submission?.photo;
                                                            return (
                                                                <div className="flex justify-center">
                                                                    {hasPhoto ? (
                                                                        <button
                                                                            onClick={() => handlePhotoClick(submission.photo!)}
                                                                            className="w-14 h-14 bg-purple-100 border-2 border-purple-300 rounded-xl flex items-center justify-center hover:bg-purple-200 transition-all shadow-md hover:shadow-lg group"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </button>
                                                                    ) : (
                                                                        <div className="w-14 h-14 bg-gray-100 border-2 border-gray-300 rounded-xl flex items-center justify-center">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })()}
                                                    </td>
                                                </tr>
                                            ))}
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
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
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
                                        <div key={month} className={`p-2 text-center text-xs rounded ${index === currentMonth.getMonth() ? 'bg-blue-500 text-white font-bold' : 'bg-gray-100 text-gray-700'}`}>
                                            {month.substring(0, 3)}
                                        </div>
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

            {/* Photo Modal */}
            {showPhotoModal && selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowPhotoModal(false)}>
                    <div className="bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold">Bukti Foto</h3>
                            <button
                                onClick={() => setShowPhotoModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            <img
                                src={`/storage/activity-photos/${selectedPhoto}`}
                                alt="Bukti Foto"
                                className="w-full h-auto rounded-lg"
                                onError={(e) => {
                                    e.currentTarget.src = '/api/placeholder/400/300';
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
