import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle2, Clock, XCircle, AlertCircle, Camera, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DailySubmission {
    day: number;
    date: string;
    status: string;
    time: string | null;
    notes: string | null;
    photo: string | null;
    approved_at: string | null;
}

interface ActivityStats {
    approved: number;
    pending: number;
    rejected: number;
    total: number;
}

interface Activity {
    id: number;
    title: string;
    icon: string;
    color: string;
    submissions: DailySubmission[];
    stats: ActivityStats;
}

interface Student {
    id: number;
    name: string;
    religion: string;
    gender: string;
    progress: number;
}

interface StudentAllActivitiesProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    student: Student;
    activities: Activity[];
    month: string;
    year: number;
    daysInMonth: number;
}

export default function StudentAllActivities({ 
    auth, 
    student, 
    activities, 
    month, 
    year, 
    daysInMonth 
}: StudentAllActivitiesProps) {
    const [isLoadingMonth, setIsLoadingMonth] = useState(false);

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsLoadingMonth(true);
        const selectedMonth = months.indexOf(e.target.value) + 1;
        
        router.visit(`/guru/siswa/${student.id}/activities/all?month=${selectedMonth}&year=${year}`, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoadingMonth(false),
        });
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsLoadingMonth(true);
        const selectedYear = parseInt(e.target.value);
        const currentMonthNumber = months.indexOf(month) + 1;
        
        router.visit(`/guru/siswa/${student.id}/activities/all?month=${currentMonthNumber}&year=${selectedYear}`, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoadingMonth(false),
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">✓ Approved</span>;
            case 'pending':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-medium">⏳ Pending</span>;
            case 'rejected':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">✗ Rejected</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">- Belum Submit</span>;
        }
    };

    // Calculate overall stats
    const overallStats = activities.reduce((acc, activity) => {
        acc.approved += activity.stats.approved;
        acc.pending += activity.stats.pending;
        acc.rejected += activity.stats.rejected;
        acc.total += activity.stats.total;
        return acc;
    }, { approved: 0, pending: 0, rejected: 0, total: 0 });

    const totalPossible = daysInMonth * 7;
    const completionRate = totalPossible > 0 ? Math.round((overallStats.approved / totalPossible) * 100) : 0;

    return (
        <AppLayout>
            <Head title={`Semua Jurnal - ${student.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Semua Jurnal Kegiatan
                                </h1>
                                <p className="text-gray-600 mt-1">{student.name} - {month} {year}</p>
                            </div>
                        </div>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                            <Link href="/guru/dashboard" className="hover:text-blue-600 transition-colors">
                                Dashboard
                            </Link>
                            <span>/</span>
                            <Link href={`/guru/siswa/${student.id}/activities`} className="hover:text-blue-600 transition-colors">
                                {student.name}
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">Semua Jurnal</span>
                        </div>

                        {/* Month Selector */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <span className="font-semibold text-gray-700">Filter Periode:</span>
                                </div>
                                
                                {isLoadingMonth ? (
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="font-medium">Memuat data...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={month}
                                            onChange={handleMonthChange}
                                            disabled={isLoadingMonth}
                                            className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {months.map((m) => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>

                                        <select
                                            value={year}
                                            onChange={handleYearChange}
                                            disabled={isLoadingMonth}
                                            className="px-4 py-2 border-2 border-gray-300 rounded-lg font-medium text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {years.map((y) => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Overall Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
                                <div className="text-3xl font-bold mb-1">{completionRate}%</div>
                                <div className="text-sm opacity-90">Progress Bulan Ini</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border-2 border-green-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <span className="text-2xl font-bold text-green-600">{overallStats.approved}</span>
                                </div>
                                <div className="text-sm text-gray-600">Approved</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border-2 border-yellow-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                    <span className="text-2xl font-bold text-yellow-600">{overallStats.pending}</span>
                                </div>
                                <div className="text-sm text-gray-600">Pending</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border-2 border-red-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    <span className="text-2xl font-bold text-red-600">{overallStats.rejected}</span>
                                </div>
                                <div className="text-sm text-gray-600">Rejected</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <Calendar className="w-5 h-5 text-gray-600" />
                                    <span className="text-2xl font-bold text-gray-900">{overallStats.total}</span>
                                </div>
                                <div className="text-sm text-gray-600">Total Submit</div>
                            </div>
                        </div>
                    </div>

                    {/* Activities List */}
                    <div className="space-y-6">
                        {activities.map((activity, index) => (
                            <div key={activity.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                {/* Activity Header */}
                                <div className={`${activity.color} p-6`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                                                <span className="text-4xl">{activity.icon}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-bold text-gray-800">
                                                        Kegiatan {activity.id}
                                                    </span>
                                                </div>
                                                <h2 className="text-2xl font-bold text-gray-900">{activity.title}</h2>
                                            </div>
                                        </div>

                                        {/* Activity Stats */}
                                        <div className="hidden md:flex items-center gap-4 bg-white/90 rounded-lg px-4 py-3">
                                            <div className="text-center">
                                                <div className="text-xl font-bold text-green-600">{activity.stats.approved}</div>
                                                <div className="text-xs text-gray-600">Approved</div>
                                            </div>
                                            <div className="w-px h-10 bg-gray-300"></div>
                                            <div className="text-center">
                                                <div className="text-xl font-bold text-yellow-600">{activity.stats.pending}</div>
                                                <div className="text-xs text-gray-600">Pending</div>
                                            </div>
                                            <div className="w-px h-10 bg-gray-300"></div>
                                            <div className="text-center">
                                                <div className="text-xl font-bold text-red-600">{activity.stats.rejected}</div>
                                                <div className="text-xs text-gray-600">Rejected</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submissions Grid - Desktop */}
                                <div className="hidden md:block p-6">
                                    <div className="grid grid-cols-7 gap-3">
                                        {activity.submissions.map((submission) => (
                                            <div
                                                key={submission.day}
                                                className={`
                                                    relative rounded-lg border-2 p-3 transition-all hover:shadow-md
                                                    ${submission.status === 'approved' ? 'bg-green-50 border-green-300' :
                                                    submission.status === 'pending' ? 'bg-yellow-50 border-yellow-300' :
                                                    submission.status === 'rejected' ? 'bg-red-50 border-red-300' :
                                                    'bg-gray-50 border-gray-200'}
                                                `}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <div className="text-2xl font-bold text-gray-900 mb-2">
                                                        {submission.day}
                                                    </div>
                                                    {getStatusIcon(submission.status)}
                                                    {submission.time && (
                                                        <div className="text-xs text-gray-600 mt-2 text-center font-medium">
                                                            {submission.time}
                                                        </div>
                                                    )}
                                                    {submission.photo && (
                                                        <a 
                                                            href={`/storage/${submission.photo}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="mt-2"
                                                        >
                                                            <Camera className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submissions List - Mobile */}
                                <div className="md:hidden p-4 space-y-3">
                                    {activity.submissions
                                        .filter(s => s.status !== 'not_submitted')
                                        .map((submission) => (
                                            <div
                                                key={submission.day}
                                                className={`
                                                    rounded-lg border-2 p-4
                                                    ${submission.status === 'approved' ? 'bg-green-50 border-green-300' :
                                                    submission.status === 'pending' ? 'bg-yellow-50 border-yellow-300' :
                                                    'bg-red-50 border-red-300'}
                                                `}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-lg font-bold text-gray-900">
                                                        Tanggal {submission.day}
                                                    </div>
                                                    {getStatusBadge(submission.status)}
                                                </div>
                                                {submission.time && (
                                                    <div className="text-sm text-gray-700 mb-1">
                                                        <span className="font-medium">Waktu:</span> {submission.time}
                                                    </div>
                                                )}
                                                {submission.notes && (
                                                    <div className="text-sm text-gray-700 mb-1">
                                                        <span className="font-medium">Catatan:</span> {submission.notes}
                                                    </div>
                                                )}
                                                {submission.photo && (
                                                    <a 
                                                        href={`/storage/${submission.photo}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mt-2"
                                                    >
                                                        <Camera className="w-4 h-4" />
                                                        Lihat Foto
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    {activity.submissions.filter(s => s.status !== 'not_submitted').length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            Belum ada submission untuk kegiatan ini
                                        </div>
                                    )}
                                </div>

                                {/* View Detail Link */}
                                <div className="px-6 pb-6">
                                    <Link 
                                        href={`/guru/siswa/${student.id}/activity/${activity.id}`}
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    >
                                        Lihat Detail Lengkap →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Back Button */}
                    <div className="mt-8">
                        <Link href={`/guru/siswa/${student.id}/activities`}>
                            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2 shadow-lg">
                                <ArrowLeft className="w-5 h-5" />
                                Kembali ke Profil Siswa
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
