import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff, Edit, Trash2 } from 'lucide-react';

interface Teacher {
    id: number;
    name: string;
    class: string;
    password: string;
}

interface GuruDashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    teachers: Teacher[];
}

export default function GuruDashboard({ auth, teachers }: GuruDashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});

    // Mock data untuk guru jika backend belum siap
    const mockTeachers: Teacher[] = [
        { id: 1, name: 'Guru 1', class: '7 A', password: 'password123' },
        { id: 2, name: 'Guru 2', class: '7 B', password: 'password123' },
        { id: 3, name: 'Guru 3', class: '7 C', password: 'password123' },
        { id: 4, name: 'Guru 4', class: '7 D', password: 'password123' },
        { id: 5, name: 'Guru 5', class: '8 A', password: 'password123' },
        { id: 6, name: 'Guru 6', class: '8 B', password: 'password123' },
        { id: 7, name: 'Guru 7', class: '8 C', password: 'password123' },
        { id: 8, name: 'Guru 8', class: '8 D', password: 'password123' },
        { id: 9, name: 'Guru 9', class: '9 A', password: 'password123' },
        { id: 10, name: 'Guru 10', class: '9 B', password: 'password123' },
        { id: 11, name: 'Guru 11', class: '9 C', password: 'password123' },
    ];

    const displayTeachers = teachers && teachers.length > 0 ? teachers : mockTeachers;

    // Filter guru berdasarkan search
    const filteredTeachers = displayTeachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.class.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const togglePasswordVisibility = (teacherId: number) => {
        setShowPasswords(prev => ({
            ...prev,
            [teacherId]: !prev[teacherId]
        }));
    };

    return (
        <AppLayout>
            <Head title="Dashboard Guru" />

            <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">List Nama Guru</h1>
                        <p className="text-sm sm:text-base text-gray-600">Daftar guru dan kelas yang diampu</p>
                    </div>

                    {/* Action Bar */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
                            {/* Tambah Akun Button */}
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center text-sm sm:text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Tambah Akun
                            </button>

                            {/* Search Box */}
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Cari Nama Guru"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 sm:h-5 sm:w-5 absolute left-3 top-2.5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Teachers Table */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                                <thead>
                                    <tr className="border-b-2 border-gray-300 bg-gray-100">
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">NO</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">Nama Guru</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">Kelas</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">Kata Sandi</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTeachers.map((teacher, index) => (
                                        <tr key={teacher.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center">
                                                <span className="font-semibold text-gray-900 text-xs sm:text-sm">{index + 1}.</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center">
                                                <span className="font-bold text-gray-900 text-xs sm:text-sm">{teacher.name}</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center">
                                                <span className="inline-block bg-blue-100 text-blue-800 font-bold px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg border-2 border-blue-500 text-xs sm:text-sm">
                                                    {teacher.class}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6">
                                                <div className="flex items-center justify-center gap-1 sm:gap-2">
                                                    <span className="bg-gray-200 text-gray-900 font-bold px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg text-xs sm:text-sm">
                                                        {showPasswords[teacher.id] ? teacher.password : '••••••'}
                                                    </span>
                                                    <button
                                                        onClick={() => togglePasswordVisibility(teacher.id)}
                                                        className="bg-gray-800 hover:bg-gray-900 text-white p-1.5 sm:p-2 rounded-lg transition-colors"
                                                        title={showPasswords[teacher.id] ? 'Sembunyikan Password' : 'Tampilkan Password'}
                                                    >
                                                        {showPasswords[teacher.id] ? (
                                                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6">
                                                <div className="flex justify-center gap-1 sm:gap-2">
                                                    <button 
                                                        className="bg-gray-800 hover:bg-gray-900 text-white p-1.5 sm:p-2 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    </button>
                                                    <button 
                                                        className="bg-gray-800 hover:bg-gray-900 text-white p-1.5 sm:p-2 rounded-lg transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* No Results */}
                        {filteredTeachers.length === 0 && (
                            <div className="p-6 sm:p-8 text-center">
                                <p className="text-gray-600 font-medium text-sm sm:text-base">Tidak ada guru yang ditemukan</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
