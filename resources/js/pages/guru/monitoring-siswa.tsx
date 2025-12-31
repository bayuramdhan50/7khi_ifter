import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, User, BookOpen, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ClassData {
    id: number;
    name: string;
    grade: number;
    section: string;
    academic_year: string;
    student_count: number;
}

interface Student {
    id: number;
    name: string;
    nis: string;
    class: string;
}

interface ActivityProgress {
    activityName: string;
    percentage: number;
    daysCompleted: number;
    totalDays: number;
    status: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
    color: string;
}

interface MonitoringSiswaProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    classes?: ClassData[];
    selectedClass?: ClassData | null;
    students?: Student[];
    selectedStudent?: Student | null;
    monthlyProgress?: ActivityProgress[];
    selectedMonth?: string;
    selectedYear?: number;
}

export default function MonitoringSiswa({
    auth,
    classes = [],
    selectedClass = null,
    students = [],
    selectedStudent = null,
    monthlyProgress = [],
    selectedMonth = 'Desember',
    selectedYear = 2025
}: MonitoringSiswaProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingClass, setIsLoadingClass] = useState(false);
    const [isLoadingStudent, setIsLoadingStudent] = useState(false);

    const handleClassChange = (classId: string) => {
        if (!classId) return;
        setIsLoadingClass(true);
        router.visit(`/guru/monitoring-siswa?class_id=${classId}`, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoadingClass(false),
        });
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nis.includes(searchQuery)
    );

    const handleStudentSelect = (studentId: number) => {
        setIsLoadingStudent(true);
        const params = new URLSearchParams();
        if (selectedClass) params.append('class_id', selectedClass.id.toString());
        params.append('student_id', studentId.toString());
        router.visit(`/guru/monitoring-siswa?${params.toString()}`, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoadingStudent(false),
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Sangat Baik': return 'text-green-700 bg-green-100';
            case 'Baik': return 'text-blue-700 bg-blue-100';
            case 'Cukup': return 'text-yellow-700 bg-yellow-100';
            case 'Kurang': return 'text-red-700 bg-red-100';
            default: return 'text-gray-700 bg-gray-100';
        }
    };

    const averagePercentage = monthlyProgress.length > 0
        ? monthlyProgress.reduce((sum, item) => sum + item.percentage, 0) / monthlyProgress.length
        : 0;

    return (
        <AppLayout>
            <Head title="Monitoring Per Siswa" />

            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-6">
                    {/* Header */}
                    <div className="mb-6">
                        <Link href="/guru/monitoring-aktivitas" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Kembali ke Monitoring Aktivitas Kelas</span>
                        </Link>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Monitoring Aktivitas Siswa</h1>
                                <p className="text-sm text-gray-500">Pantau progress individu siswa per bulan</p>
                            </div>
                        </div>

                        {/* Class Selection - Modern */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-semibold text-gray-700">Pilih Kelas:</span>
                                    <select
                                        value={selectedClass?.id || ''}
                                        onChange={(e) => handleClassChange(e.target.value)}
                                        disabled={isLoadingClass}
                                        className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer disabled:opacity-50 min-w-[150px]"
                                    >
                                        <option value="">-- Pilih --</option>
                                        {classes.map((classItem) => (
                                            <option key={classItem.id} value={classItem.id}>
                                                {classItem.name} ({classItem.student_count} siswa)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {selectedClass && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                            </svg>
                                            <span className="text-sm font-bold">{selectedClass.student_count} Siswa</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm font-bold">{selectedMonth} {selectedYear}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content - 2 Column */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Sidebar - Pilih Siswa */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-220px)] flex flex-col">
                                <div className="bg-blue-600 p-4 flex-shrink-0">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="font-bold text-lg text-white">Pilih Siswa</h2>
                                        <span className="bg-white/20 text-white text-xs font-medium px-2 py-1 rounded-full">
                                            {filteredStudents.length} siswa
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari nama atau NIS..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 border-0 focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    {filteredStudents.length > 0 ? (
                                        <div className="p-3 space-y-2">
                                            {filteredStudents.map((student) => (
                                                <button
                                                    key={student.id}
                                                    onClick={() => handleStudentSelect(student.id)}
                                                    disabled={isLoadingStudent}
                                                    className={`w-full text-left p-3 rounded-lg border transition-all ${selectedStudent?.id === student.id
                                                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <p className="font-semibold text-gray-900">{student.name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">NIS: {student.nis} • Kelas: {student.class}</p>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center text-gray-500">
                                            <p>Tidak ada siswa ditemukan</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content - Detail Siswa */}
                        <div className="lg:col-span-8">
                            <div className="h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
                                {isLoadingClass || isLoadingStudent ? (
                                    <div className="flex items-center justify-center py-20">
                                        <div className="text-center">
                                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                                            <p className="text-gray-600 font-medium">
                                                {isLoadingClass ? 'Memuat data kelas...' : 'Memuat data siswa...'}
                                            </p>
                                        </div>
                                    </div>
                                ) : selectedStudent ? (
                                    <div className="space-y-4">
                                        {/* Student Info Card */}
                                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm p-5 text-white">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h2 className="text-xl font-bold mb-1">{selectedStudent.name}</h2>
                                                    <p className="text-blue-100 text-sm">NIS: {selectedStudent.nis} | Kelas: {selectedStudent.class}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-blue-100">Periode</p>
                                                    <p className="text-lg font-bold">{selectedMonth} {selectedYear}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 bg-white/10 rounded-lg p-3 inline-block">
                                                <p className="text-xs text-blue-100">Rata-rata Keaktifan</p>
                                                <p className="text-2xl font-bold">{Math.round(averagePercentage)}%</p>
                                            </div>
                                        </div>

                                        {/* Summary Card */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <h3 className="font-bold text-base mb-3 text-gray-900">Ringkasan Evaluasi</h3>
                                            <div className="grid grid-cols-4 gap-3">
                                                <div className="text-center p-2 bg-green-50 rounded-lg">
                                                    <p className="text-xs text-gray-600">Sangat Baik</p>
                                                    <p className="text-xl font-bold text-green-600">
                                                        {monthlyProgress.filter(p => p.status === 'Sangat Baik').length}
                                                    </p>
                                                </div>
                                                <div className="text-center p-2 bg-blue-50 rounded-lg">
                                                    <p className="text-xs text-gray-600">Baik</p>
                                                    <p className="text-xl font-bold text-blue-600">
                                                        {monthlyProgress.filter(p => p.status === 'Baik').length}
                                                    </p>
                                                </div>
                                                <div className="text-center p-2 bg-yellow-50 rounded-lg">
                                                    <p className="text-xs text-gray-600">Cukup</p>
                                                    <p className="text-xl font-bold text-yellow-600">
                                                        {monthlyProgress.filter(p => p.status === 'Cukup').length}
                                                    </p>
                                                </div>
                                                <div className="text-center p-2 bg-red-50 rounded-lg">
                                                    <p className="text-xs text-gray-600">Kurang</p>
                                                    <p className="text-xl font-bold text-red-600">
                                                        {monthlyProgress.filter(p => p.status === 'Kurang').length}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress per Aktivitas */}
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <h3 className="font-bold text-base mb-3 text-gray-900">Progress Per Aktivitas</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {monthlyProgress.map((activity, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-7 h-7 ${activity.color} rounded flex items-center justify-center text-white font-bold text-xs`}>
                                                                    {index + 1}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-sm text-gray-900">{activity.activityName}</h4>
                                                                    <p className="text-xs text-gray-500">{activity.daysCompleted}/{activity.totalDays} hari</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-lg font-bold text-gray-900">{activity.percentage}%</p>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                                            <div
                                                                className={`${activity.color} h-2 rounded-full transition-all`}
                                                                style={{ width: `${activity.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(activity.status)}`}>
                                                                {activity.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center h-full flex flex-col items-center justify-center">
                                        <User className="w-16 h-16 text-gray-300 mb-4" />
                                        <p className="text-gray-500 text-lg">Pilih siswa untuk melihat progress bulanan</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
