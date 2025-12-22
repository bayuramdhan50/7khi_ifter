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
                <div className="container mx-auto px-4 py-4 md:py-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link href="/guru/monitoring-aktivitas" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Kembali ke Monitoring Aktivitas Kelas</span>
                        </Link>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Monitoring Aktivitas Siswa
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Pantau progress individu siswa per bulan
                                </p>
                            </div>
                        </div>

                        {/* Class Selection */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                                <div className="flex items-center gap-2 min-w-fit">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                    <label className="text-sm md:text-base font-medium text-gray-700 whitespace-nowrap">
                                        Pilih Kelas yang Diampu
                                    </label>
                                </div>
                                <select
                                    value={selectedClass?.id || ''}
                                    onChange={(e) => handleClassChange(e.target.value)}
                                    disabled={isLoadingClass}
                                    className="flex-1 w-full md:max-w-md px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-white border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="" className="text-gray-500">Pilih Kelas</option>
                                    {classes.map((classItem) => (
                                        <option key={classItem.id} value={classItem.id} className="text-gray-900 font-medium py-2">
                                            {classItem.name} ({classItem.student_count} siswa)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedClass && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-600">Kelas</p>
                                            <p className="text-sm font-bold text-blue-600">{selectedClass.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Jumlah Siswa</p>
                                            <p className="text-sm font-bold text-green-600">{selectedClass.student_count} siswa</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Tingkat</p>
                                            <p className="text-sm font-bold text-purple-600">Kelas {selectedClass.grade}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Tahun Akademik</p>
                                            <p className="text-sm font-bold text-orange-600">{selectedClass.academic_year}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sidebar - Daftar Siswa */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <h2 className="font-bold text-lg mb-4">Pilih Siswa</h2>
                                
                                {/* Search */}
                                <input
                                    type="text"
                                    placeholder="Cari nama atau NIS..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-base font-bold bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors mb-4"
                                    style={{ 
                                        color: '#000000',
                                        WebkitTextFillColor: '#000000',
                                        opacity: 1
                                    }}
                                />

                                {/* Student List */}
                                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                    {filteredStudents.map((student) => (
                                        <button
                                            key={student.id}
                                            onClick={() => handleStudentSelect(student.id)}
                                            disabled={isLoadingStudent}
                                            className={`w-full text-left p-3 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                                selectedStudent?.id === student.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <p className="font-medium text-gray-900">{student.name}</p>
                                            <p className="text-xs text-gray-600">NIS: {student.nis}</p>
                                            <p className="text-xs text-gray-600">Kelas: {student.class}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content - Progress Chart */}
                        <div className="lg:col-span-2">
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
                                <div className="space-y-6">
                                    {/* Student Info Card */}
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm p-6 text-white">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h2 className="text-2xl font-bold mb-2">{selectedStudent.name}</h2>
                                                <p className="text-blue-100">NIS: {selectedStudent.nis} | Kelas: {selectedStudent.class}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-blue-100">Periode</p>
                                                <p className="text-xl font-bold">{selectedMonth} {selectedYear}</p>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <div className="bg-white/10 rounded-lg p-3">
                                                <p className="text-sm text-blue-100">Rata-rata Keaktifan</p>
                                                <p className="text-3xl font-bold mt-1">{Math.round(averagePercentage)}%</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary Card */}
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                                        <h3 className="font-bold text-lg mb-4 text-purple-900">Ringkasan Evaluasi</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">Sangat Baik</p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {monthlyProgress.filter(p => p.status === 'Sangat Baik').length}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">Baik</p>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {monthlyProgress.filter(p => p.status === 'Baik').length}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">Cukup</p>
                                                <p className="text-2xl font-bold text-yellow-600">
                                                    {monthlyProgress.filter(p => p.status === 'Cukup').length}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">Kurang</p>
                                                <p className="text-2xl font-bold text-red-600">
                                                    {monthlyProgress.filter(p => p.status === 'Kurang').length}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress per Aktivitas */}
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <h3 className="font-bold text-xl mb-6">Progress Per Aktivitas</h3>
                                        
                                        <div className="space-y-6">
                                            {monthlyProgress.map((activity, index) => (
                                                <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                                                    {/* Activity Header */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                                                                {index + 1}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-gray-900">{activity.activityName}</h4>
                                                                <p className="text-xs text-gray-600">
                                                                    {activity.daysCompleted} dari {activity.totalDays} hari
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-gray-900">{activity.percentage}%</p>
                                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                                                {activity.status}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="relative">
                                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                                            <div
                                                                className={`${activity.color} h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                                                                style={{ width: `${activity.percentage}%` }}
                                                            >
                                                                {activity.percentage > 15 && (
                                                                    <span className="text-xs font-bold text-white">{activity.percentage}%</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/* Markers */}
                                                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                                                            <span>0%</span>
                                                            <span className="text-yellow-600">50%</span>
                                                            <span className="text-blue-600">75%</span>
                                                            <span className="text-green-600">100%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                    <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">Pilih siswa untuk melihat progress bulanan</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
