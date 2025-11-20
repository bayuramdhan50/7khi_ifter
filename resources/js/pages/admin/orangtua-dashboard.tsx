import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface Class {
    id: string;
    name: string;
    studentCount: number;
}

interface OrangTuaDashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    classes: Class[];
}

export default function OrangTuaDashboard({ auth, classes }: OrangTuaDashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data untuk kelas jika backend belum siap
    const mockClasses: Class[] = [
        { id: '1a', name: 'Kelas 1A', studentCount: 25 },
        { id: '1b', name: 'Kelas 1B', studentCount: 28 },
        { id: '2a', name: 'Kelas 2A', studentCount: 26 },
        { id: '2b', name: 'Kelas 2B', studentCount: 27 },
        { id: '3a', name: 'Kelas 3A', studentCount: 24 },
        { id: '3b', name: 'Kelas 3B', studentCount: 29 },
        { id: '4a', name: 'Kelas 4A', studentCount: 25 },
        { id: '4b', name: 'Kelas 4B', studentCount: 26 },
        { id: '5a', name: 'Kelas 5A', studentCount: 27 },
        { id: '5b', name: 'Kelas 5B', studentCount: 28 },
        { id: '6a', name: 'Kelas 6A', studentCount: 24 },
        { id: '6b', name: 'Kelas 6B', studentCount: 25 },
    ];

    const displayClasses = classes && classes.length > 0 ? classes : mockClasses;

    // Filter kelas berdasarkan search
    const filteredClasses = displayClasses.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleClassClick = (classId: string) => {
        window.location.href = `/admin/orangtua/kelas/${classId}`;
    };

    return (
        <AppLayout>
            <Head title="Dashboard Orang Tua" />

            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Dashboard Orang Tua</h1>
                        <p className="text-sm sm:text-base text-gray-600">Pilih kelas untuk melihat daftar orang tua</p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6 sm:mb-8">
                        <div className="relative w-full sm:max-w-md">
                            <input
                                type="text"
                                placeholder="Cari kelas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
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
                                className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-purple-500"
                            >
                                <div className="flex flex-col items-center">
                                    {/* School Icon */}
                                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3">🏫</div>
                                    
                                    {/* Class Name */}
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{cls.name}</h3>
                                    
                                    {/* Student Count */}
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-purple-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                        </svg>
                                        <span className="font-semibold text-sm sm:text-base">{cls.studentCount} Orang Tua</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredClasses.length === 0 && (
                        <div className="text-center py-8 sm:py-12">
                            <p className="text-gray-600 text-base sm:text-lg">Tidak ada kelas yang ditemukan</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
