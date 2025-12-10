import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Eye, BookOpen, Users, Calendar, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StudentJournal {
    id: number;
    activity: string;
    date: string;
    status: string;
    notes: string;
}

interface Student {
    id: number;
    name: string;
    class: string;
    nis: string;
    religion: string;
    gender: string;
}

interface ClassData {
    id: number;
    name: string;
    grade: number;
    section: string;
    academic_year: string;
    student_count: number;
}

interface GuruDashboardProps {
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
    studentJournals?: Record<number, StudentJournal[]>;
}

export default function GuruDashboard({ 
    auth, 
    classes = [], 
    selectedClass = null,
    students = [], 
    studentJournals = {} 
}: GuruDashboardProps) {
    const currentDate = new Date();
    const currentMonth = new Date();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [isLoadingClass, setIsLoadingClass] = useState(false);

    // Use actual data from backend
    const studentsList: Student[] = students.length > 0 ? students : [];

    const filteredStudents = studentsList.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.religion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.class.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const handleViewActivities = (studentId: number) => {
        // Navigate to student activities page
        router.visit(`/guru/siswa/${studentId}/activities`);
    };

    const handleClassChange = (classId: string) => {
        if (!classId) return;
        setIsLoadingClass(true);
        // Use Inertia router for smooth navigation without full page reload
        router.visit(`/guru/dashboard?class_id=${classId}`, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoadingClass(false),
        });
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const selectedStudent = studentsList.find(s => s.id === selectedStudentId);
    const selectedStudentJournals = selectedStudentId ? (studentJournals[selectedStudentId] || []) : [];

    return (
        <AppLayout>
            <Head title="Dashboard Guru" />

            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-4 md:mb-8">
                        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg md:text-xl">J</span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold text-blue-700">Jurnal Harian</h1>
                        </div>
                    </div>

                    {/* Class Selector Card */}
                    {classes.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 border border-gray-200">
                            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                Pilih Kelas yang Diampu
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Class Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kelas
                                    </label>
                                    <select
                                        value={selectedClass?.id?.toString() || ''}
                                        onChange={(e) => handleClassChange(e.target.value)}
                                        disabled={isLoadingClass}
                                        className="w-full px-4 py-2 border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-600 bg-white text-gray-900 font-medium appearance-none cursor-pointer hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="" className="text-gray-500">-- Pilih Kelas --</option>
                                        {classes.map((cls) => (
                                            <option key={cls.id} value={cls.id.toString()} className="text-gray-900">
                                                {cls.name} ({cls.student_count} siswa)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Class Info Cards */}
                            {selectedClass && !isLoadingClass && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Card: Kelas */}
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-600">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-xs md:text-sm font-medium">Kelas</p>
                                                <p className="text-2xl md:text-3xl font-bold text-blue-600 mt-1">
                                                    {selectedClass.name}
                                                </p>
                                                <p className="text-gray-600 text-xs md:text-sm mt-2">
                                                    Kelas {selectedClass.grade} Bagian {selectedClass.section}
                                                </p>
                                            </div>
                                            <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-blue-600 opacity-20" />
                                        </div>
                                    </div>

                                    {/* Card: Jumlah Siswa */}
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-600">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-xs md:text-sm font-medium">Jumlah Siswa</p>
                                                <p className="text-2xl md:text-3xl font-bold text-green-600 mt-1">
                                                    {selectedClass.student_count}
                                                </p>
                                                <p className="text-gray-600 text-xs md:text-sm mt-2">Siswa aktif</p>
                                            </div>
                                            <Users className="w-8 h-8 md:w-12 md:h-12 text-green-600 opacity-20" />
                                        </div>
                                    </div>

                                    {/* Card: Tahun Akademik */}
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-l-4 border-purple-600">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-xs md:text-sm font-medium">Tahun Akademik</p>
                                                <p className="text-2xl md:text-3xl font-bold text-purple-600 mt-1">
                                                    {selectedClass.academic_year}
                                                </p>
                                                <p className="text-gray-600 text-xs md:text-sm mt-2">Periode aktif</p>
                                            </div>
                                            <Calendar className="w-8 h-8 md:w-12 md:h-12 text-purple-600 opacity-20" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Main Content */}
                    {selectedClass ? (
                        isLoadingClass ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center">
                                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                                    <p className="text-gray-600 font-medium">Memuat data kelas...</p>
                                </div>
                            </div>
                        ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Side - Students Table */}
                            <div className="flex-1">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    {/* Table Header */}
                                    <div className="p-3 md:p-4 border-b border-gray-200">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                            <h2 className="text-lg md:text-xl font-bold text-blue-600">List Nama Siswa</h2>
                                            <input
                                                type="text"
                                                placeholder="Cari Murid"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    maxWidth: '20rem',
                                                    padding: '8px 12px',
                                                    border: '2px solid #d1d5db',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    backgroundColor: '#ffffff',
                                                    color: '#000000',
                                                    outline: 'none'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                            />
                                        </div>
                                    </div>

                                    {/* Table - Desktop View */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 w-20">
                                                        NO
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                                                        NAMA
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 w-32">
                                                        NIS
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 w-24">
                                                        KELAS
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                                                        AGAMA
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 w-40">
                                                        JENIS KELAMIN
                                                    </th>
                                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 w-40">
                                                        LIHAT JURNAL
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredStudents.map((student, index) => (
                                                    <tr
                                                        key={student.id}
                                                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
                                                            selectedStudentId === student.id ? 'bg-blue-50' : ''
                                                        }`}
                                                        onClick={() => setSelectedStudentId(student.id)}
                                                    >
                                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                            {index + 1}.
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {student.name}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {student.nis}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {student.class}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {student.religion}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                                            {student.gender}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewActivities(student.id);
                                                                }}
                                                                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                                                                title="Lihat Aktivitas"
                                                            >
                                                                <Eye className="w-5 h-5 text-white" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="md:hidden divide-y divide-gray-200">
                                        {filteredStudents.map((student, index) => (
                                            <div 
                                                key={student.id} 
                                                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                                                    selectedStudentId === student.id ? 'bg-blue-50' : ''
                                                }`}
                                                onClick={() => setSelectedStudentId(student.id)}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-gray-900 bg-blue-100 px-2 py-1 rounded">{index + 1}</span>
                                                            <div className="flex-1">
                                                                <div className="text-xs text-gray-500 font-medium">NAMA SISWA</div>
                                                                <div className="text-sm font-bold text-gray-900">{student.name}</div>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2 pl-10">
                                                            <div>
                                                                <div className="text-xs text-gray-500 font-medium">NIS</div>
                                                                <div className="text-sm text-gray-900 font-semibold">{student.nis}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-gray-500 font-medium">KELAS</div>
                                                                <div className="text-sm text-gray-900 font-semibold">{student.class}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-gray-500 font-medium">AGAMA</div>
                                                                <div className="text-sm text-gray-900">{student.religion}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewActivities(student.id);
                                                        }}
                                                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors flex-shrink-0"
                                                        title="Lihat Aktivitas"
                                                    >
                                                        <Eye className="w-5 h-5 text-white" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Empty State */}
                                    {filteredStudents.length === 0 && (
                                        <div className="p-8 text-center">
                                            <p className="text-gray-500">Tidak ada siswa yang cocok dengan pencarian</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Side - Student Journal */}
                            <div className="w-full lg:w-96">
                                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 lg:sticky lg:top-4">
                                    {/* Student Info or No Selection Message */}
                                    {selectedStudent ? (
                                        <>
                                            {/* Student Header */}
                                            <div className="mb-6 pb-4 border-b border-gray-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">
                                                            {selectedStudent.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">{selectedStudent.name}</h3>
                                                        <p className="text-sm text-gray-600">Kelas {selectedStudent.class}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Student Info */}
                                            <div className="mb-6 space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">NIS:</span>
                                                    <span className="font-medium text-gray-900">{selectedStudent.nis}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Agama:</span>
                                                    <span className="font-medium text-gray-900">{selectedStudent.religion}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Jenis Kelamin:</span>
                                                    <span className="font-medium text-gray-900">{selectedStudent.gender}</span>
                                                </div>
                                            </div>

                                            {/* Journal Section */}
                                            <div className="border-t border-gray-200 pt-4">
                                                <h4 className="font-bold text-gray-900 mb-3">Jurnal Terbaru</h4>
                                                {selectedStudentJournals.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {selectedStudentJournals.map((journal) => (
                                                            <div key={journal.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <span className="font-semibold text-sm text-gray-900">
                                                                        {journal.activity}
                                                                    </span>
                                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeColor(journal.status)}`}>
                                                                        {journal.status}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-600 mb-1">{journal.date}</p>
                                                                {journal.notes && (
                                                                    <p className="text-xs text-gray-700 italic">{journal.notes}</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500 text-center py-6">Belum ada jurnal siswa</p>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <span className="text-2xl">👤</span>
                                            </div>
                                            <p className="text-gray-600 font-medium">Pilih siswa untuk melihat jurnal</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        )
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-gray-600 text-lg font-medium">Pilih kelas untuk melihat data siswa</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
