import { Eye } from 'lucide-react';
import type { Activity, ActivitySubmission, GroupedSubmission } from '../types/types';

interface SubmissionsTableProps {
    submissions: GroupedSubmission[];
    selectedActivity: Activity | undefined;
    onViewDetail: (date: string) => void;
    sortField: 'date' | 'status' | 'total';
    sortDirection: 'asc' | 'desc';
    onSort: (field: 'date' | 'status' | 'total') => void;
}

export default function SubmissionsTable({
    submissions,
    selectedActivity,
    onViewDetail,
    sortField,
    sortDirection,
    onSort,
}: SubmissionsTableProps) {
    if (submissions.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Belum ada data</h3>
                <p className="text-gray-500 mt-1">Tidak ada kegiatan untuk filter yang dipilih</p>
            </div>
        );
    }

    const getActivityColor = (activityId: number) => {
        // You might want to pass activities list as prop to map colors properly
        // For now using default colors based on ID roughly matching the dashboard
        const colors = [
            'bg-orange-100 text-orange-600',
            'bg-purple-100 text-purple-600',
            'bg-blue-100 text-blue-600',
            'bg-green-100 text-green-600',
            'bg-rose-100 text-rose-600',
            'bg-amber-100 text-amber-600',
            'bg-indigo-100 text-indigo-600',
        ];
        return colors[(activityId - 1) % colors.length] || colors[0];
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div
                className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#60a5fa #f3f4f6'
                }}
            >
                <style>{`
                    .scrollbar-thin::-webkit-scrollbar {
                        height: 10px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-track {
                        background: #f3f4f6;
                        border-radius: 5px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb {
                        background: #60a5fa;
                        border-radius: 5px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                        background: #3b82f6;
                    }
                `}</style>
                <table className="w-full min-w-[700px]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <button
                                    onClick={() => onSort('date')}
                                    className="flex items-center gap-2 hover:text-gray-700 transition-colors"
                                >
                                    Tanggal
                                    <svg
                                        className={`w-4 h-4 transition-transform ${sortField === 'date' && sortDirection === 'desc' ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        opacity={sortField === 'date' ? 1 : 0.3}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 11l5-5m0 0l5 5m-5-5v12"
                                        />
                                    </svg>
                                </button>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <button
                                    onClick={() => onSort('status')}
                                    className="flex items-center gap-2 hover:text-gray-700 transition-colors"
                                >
                                    Status Approval
                                    <svg
                                        className={`w-4 h-4 transition-transform ${sortField === 'status' && sortDirection === 'desc' ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        opacity={sortField === 'status' ? 1 : 0.3}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 11l5-5m0 0l5 5m-5-5v12"
                                        />
                                    </svg>
                                </button>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <button
                                    onClick={() => onSort('total')}
                                    className="flex items-center gap-2 hover:text-gray-700 transition-colors"
                                >
                                    Total Kebiasaan yang Terisi
                                    <svg
                                        className={`w-4 h-4 transition-transform ${sortField === 'total' && sortDirection === 'desc' ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        opacity={sortField === 'total' ? 1 : 0.3}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 11l5-5m0 0l5 5m-5-5v12"
                                        />
                                    </svg>
                                </button>
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {submissions.map((group) => (
                            <tr
                                key={group.date}
                                className="hover:bg-blue-50/50 transition-colors duration-150 group"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {(() => {
                                            try {
                                                if (!group.date) return '-';
                                                // Create a safe date string YYYY-MM-DD
                                                const dateStr = String(group.date).split('T')[0];
                                                const parts = dateStr.split('-');
                                                if (parts.length === 3) {
                                                    const [year, month, day] = parts.map(Number);
                                                    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                                                        const localDate = new Date(year, month - 1, day);
                                                        return localDate.toLocaleDateString('id-ID', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        });
                                                    }
                                                }
                                                // Fallback to simple date formatting if custom parsing fails
                                                return new Date(group.date).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                });
                                            } catch (e) {
                                                return String(group.date);
                                            }
                                        })()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-1">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${group.status === 'approved'
                                                ? 'bg-green-100 text-green-700 border-green-200'
                                                : group.status === 'rejected'
                                                    ? 'bg-red-100 text-red-700 border-red-200'
                                                    : group.status === 'mixed'
                                                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                        : 'bg-blue-100 text-blue-700 border-blue-200'
                                                }`}
                                        >
                                            {group.status === 'approved' ? 'Selesai' :
                                                group.status === 'rejected' ? 'Perlu Perbaikan' :
                                                    group.status === 'mixed' ? 'Sebagian Selesai' : 'Menunggu'}
                                        </span>
                                        <span className="text-xs text-gray-600 font-medium">
                                            {group.submissions.filter(s => s.status === 'approved').length}/{group.totalActivities} Disetujui
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">
                                        {group.totalActivities} Kegiatan
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onViewDetail(group.date)}
                                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors border border-blue-200 shadow-sm"
                                            title="Lihat Detail"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export type { ActivitySubmission, GroupedSubmission };
