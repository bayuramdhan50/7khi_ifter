import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    religion: string;
    gender: string;
}

interface ClassStudentsProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    className: string;
    classId: string;
    students: Student[];
}

export default function ClassStudents({ auth, className, classId, students }: ClassStudentsProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data jika backend belum siap
    const mockStudents: Student[] = [
        { id: 1, name: 'Ahmad Fauzi', religion: 'Islam', gender: 'L' },
        { id: 2, name: 'Siti Nurhaliza', religion: 'Islam', gender: 'P' },
        { id: 3, name: 'Budi Santoso', religion: 'Islam', gender: 'L' },
        { id: 4, name: 'Dewi Lestari', religion: 'Islam', gender: 'P' },
        { id: 5, name: 'Eko Prasetyo', religion: 'Islam', gender: 'L' },
        { id: 6, name: 'Fitri Handayani', religion: 'Islam', gender: 'P' },
        { id: 7, name: 'Galih Pratama', religion: 'Islam', gender: 'L' },
        { id: 8, name: 'Hani Safitri', religion: 'Islam', gender: 'P' },
        { id: 9, name: 'Irfan Hakim', religion: 'Islam', gender: 'L' },
        { id: 10, name: 'Jasmine Putri', religion: 'Islam', gender: 'P' },
        { id: 11, name: 'Kirana Azzahra', religion: 'Islam', gender: 'P' },
    ];

    const displayStudents = students && students.length > 0 ? students : mockStudents;

    // Filter siswa berdasarkan search
    const filteredStudents = displayStudents.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title={`Daftar Siswa ${className}`} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <Link
                                href="/admin/siswa-dashboard"
                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Kembali ke Dashboard
                            </Link>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">List Nama Siswa</h1>
                        <p className="text-sm sm:text-base text-gray-600">Daftar siswa {className}</p>
                    </div>

                    {/* Action Bar */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 items-stretch">
                            {/* Tambah User Button */}
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 lg:px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center text-sm sm:text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Tambah User
                            </button>

                            {/* Export Button */}
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-5 lg:px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center text-sm sm:text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Export File
                            </button>

                            {/* Search Box */}
                            <div className="relative flex-1 sm:max-w-64">
                                <input
                                    type="text"
                                    placeholder="Cari Kegiatan"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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

                    {/* Students Table */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                                <thead>
                                    <tr className="border-b-2 border-gray-300 bg-gray-100">
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">NO</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">NAMA</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">AGAMA</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">JENIS KELAMIN</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student, index) => (
                                        <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center">
                                                <span className="font-semibold text-gray-900 text-xs sm:text-sm">{index + 1}.</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center">
                                                <span className="font-bold text-gray-900 text-xs sm:text-sm">{student.name}</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center">
                                                <span className="font-bold text-gray-900 text-xs sm:text-sm">{student.religion}</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center">
                                                <span className="font-bold text-gray-900 text-xs sm:text-sm">{student.gender}</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6">
                                                <div className="flex justify-center gap-1 sm:gap-2">
                                                    <button 
                                                        className="bg-gray-800 hover:bg-gray-900 text-white p-1.5 sm:p-2 rounded-lg transition-colors"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    </button>
                                                    <button 
                                                        className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                    <button 
                                                        className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-lg transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* No Results */}
                        {filteredStudents.length === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-gray-600 font-medium">Tidak ada siswa yang ditemukan</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
