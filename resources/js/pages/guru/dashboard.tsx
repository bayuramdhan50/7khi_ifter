import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: number;
    name: string;
    religion: string;
    gender: string;
}

interface GuruDashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    students?: Student[];
}

export default function GuruDashboard({ auth, students = [] }: GuruDashboardProps) {
    const currentDate = new Date();
    const currentMonth = new Date();
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data jika tidak ada data dari backend
    const studentsList: Student[] = students.length > 0 ? students : [
        { id: 1, name: 'MICHAEL', religion: 'ISLAM', gender: 'L' },
        { id: 2, name: 'BUDI', religion: 'KRISTEN', gender: 'L' },
        { id: 3, name: 'CIA', religion: 'HINDU', gender: 'P' },
        { id: 4, name: 'NAMA MURID', religion: 'ISI AGAMA', gender: 'L/P' },
        { id: 5, name: 'NAMA MURID', religion: 'ISI AGAMA', gender: 'L/P' },
        { id: 6, name: 'NAMA MURID', religion: 'ISI AGAMA', gender: 'L/P' },
        { id: 7, name: 'NAMA MURID', religion: 'ISI AGAMA', gender: 'L/P' },
        { id: 8, name: 'NAMA MURID', religion: 'ISI AGAMA', gender: 'L/P' },
        { id: 9, name: 'NAMA MURID', religion: 'ISI AGAMA', gender: 'L/P' },
        { id: 10, name: 'NAMA MURID', religion: 'ISI AGAMA', gender: 'L/P' },
        { id: 11, name: 'NAMA MURID', religion: 'ISI AGAMA', gender: 'L/P' },
    ];

    const filteredStudents = studentsList.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.religion.toLowerCase().includes(searchQuery.toLowerCase())
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

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Side - Students Table */}
                        <div className="flex-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                {/* Table Header */}
                                <div className="p-3 md:p-4 border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <h2 className="text-lg md:text-xl font-bold text-blue-600">List Nama Siswa</h2>
                                        <Input
                                            type="text"
                                            placeholder="Cari Murid"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full sm:max-w-xs"
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
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                                                    AGAMA
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 w-40">
                                                    JENIS KELAMIN
                                                </th>
                                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 w-40">
                                                    LIHAT AKTIVITAS
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents.map((student, index) => (
                                                <tr
                                                    key={student.id}
                                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                        {index + 1}.
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {student.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {student.religion}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                                        {student.gender}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => handleViewActivities(student.id)}
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
                                        <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-gray-900 bg-blue-100 px-2 py-1 rounded">{index + 1}</span>
                                                        <div className="flex-1">
                                                            <div className="text-xs text-gray-500 font-medium">NAMA SISWA</div>
                                                            <div className="text-sm font-bold text-gray-900">{student.name}</div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 pl-10">
                                                        <div>
                                                            <div className="text-xs text-gray-500 font-medium">AGAMA</div>
                                                            <div className="text-sm text-gray-900">{student.religion}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-500 font-medium">JENIS KELAMIN</div>
                                                            <div className="text-sm text-gray-900">{student.gender}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleViewActivities(student.id)}
                                                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors flex-shrink-0"
                                                    title="Lihat Aktivitas"
                                                >
                                                    <Eye className="w-5 h-5 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Calendar */}
                        <div className="w-full lg:w-96">
                            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 lg:sticky lg:top-4">
                                {/* Date Display */}
                                <div className="mb-6">
                                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-center font-medium">
                                        {formatDate(currentDate)}
                                    </div>
                                </div>

                                {/* Month Display (Static) */}
                                <div className="flex items-center justify-center mb-4">
                                    <span className="font-bold text-gray-800">
                                        {monthNames[currentMonth.getMonth()]}
                                    </span>
                                </div>

                                {/* Year Display (Static) */}
                                <div className="flex items-center justify-center mb-4">
                                    <span className="font-bold text-gray-800">
                                        {currentMonth.getFullYear()}
                                    </span>
                                </div>

                                {/* Day Names */}
                                <div className="grid grid-cols-7 gap-2 mb-2">
                                    {dayNames.map((day, index) => (
                                        <div
                                            key={index}
                                            className="text-center font-bold text-gray-600 text-sm"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-2">
                                    {/* Empty cells for days before month starts */}
                                    {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                                        <div key={`empty-${index}`} className="aspect-square" />
                                    ))}

                                    {/* Days of the month (Static) */}
                                    {Array.from({ length: daysInMonth }).map((_, index) => {
                                        const day = index + 1;
                                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                        const isToday = date.toDateString() === new Date().toDateString();

                                        return (
                                            <div
                                                key={day}
                                                className={`
                                                    aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                                                    ${isToday
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700'
                                                    }
                                                `}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
