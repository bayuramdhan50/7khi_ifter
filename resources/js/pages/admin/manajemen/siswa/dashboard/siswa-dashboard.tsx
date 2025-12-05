import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface Class {
    id: string;
    name: string;
    studentCount: number;
}

interface SiswaDashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    classes: Class[];
}

export default function SiswaDashboard({ auth, classes }: SiswaDashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data untuk kelas jika backend belum siap
    const mockClasses: Class[] = [
        { id: '7a', name: 'Kelas 7A', studentCount: 30 },
        { id: '7b', name: 'Kelas 7B', studentCount: 28 },
        { id: '7c', name: 'Kelas 7C', studentCount: 29 },
        { id: '8a', name: 'Kelas 8A', studentCount: 32 },
        { id: '8b', name: 'Kelas 8B', studentCount: 30 },
        { id: '8c', name: 'Kelas 8C', studentCount: 31 },
        { id: '9a', name: 'Kelas 9A', studentCount: 28 },
        { id: '9b', name: 'Kelas 9B', studentCount: 27 },
        { id: '9c', name: 'Kelas 9C', studentCount: 29 },
    ];

    const displayClasses = classes && classes.length > 0 ? classes : mockClasses;

    // Filter kelas berdasarkan search
    const filteredClasses = displayClasses.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleClassClick = (classId: string) => {
        window.location.href = `/admin/siswa/kelas/${classId}`;
    };

    return (
        <AppLayout>
            <Head title="Dashboard Siswa" />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Dashboard Siswa</h1>
                        <p className="text-sm sm:text-base text-gray-600">Pilih kelas untuk melihat daftar siswa</p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6 sm:mb-8">
                        <div className="relative w-full sm:max-w-md">
                            <input
                                type="text"
                                placeholder="Cari kelas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5 absolute left-3 top-3 sm:top-3.5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Classes Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {filteredClasses.map((cls) => (
                            <button
                                key={cls.id}
                                onClick={() => handleClassClick(cls.id)}
                                className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-500"
                            >
                                <div className="flex flex-col items-center">
                                    {/* School Icon */}
                                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3">🏫</div>

                                    {/* Class Name */}
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{cls.name}</h3>

                                    {/* Student Count */}
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                        </svg>
                                        <span className="font-semibold">{cls.studentCount} Siswa</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredClasses.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">Tidak ada kelas yang ditemukan</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
