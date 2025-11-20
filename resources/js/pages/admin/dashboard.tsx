import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface SchoolClass {
    id: number;
    name: string;
    grade: number;
    section: string;
    studentCount: number;
}

interface AdminDashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    classes?: SchoolClass[];
}

export default function AdminDashboard({ auth, classes = [] }: AdminDashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data jika tidak ada dari backend
    const classList: SchoolClass[] = classes.length > 0 ? classes : [
        { id: 1, name: 'Kelas 1 A', grade: 1, section: 'A', studentCount: 25 },
        { id: 2, name: 'Kelas 1 B', grade: 1, section: 'B', studentCount: 24 },
        { id: 3, name: 'Kelas 2 A', grade: 2, section: 'A', studentCount: 26 },
        { id: 4, name: 'Kelas 2 B', grade: 2, section: 'B', studentCount: 25 },
        { id: 5, name: 'Kelas 3 A', grade: 3, section: 'A', studentCount: 27 },
        { id: 6, name: 'Kelas 3 B', grade: 3, section: 'B', studentCount: 26 },
        { id: 7, name: 'Kelas 4 A', grade: 4, section: 'A', studentCount: 28 },
        { id: 8, name: 'Kelas 4 B', grade: 4, section: 'B', studentCount: 25 },
        { id: 9, name: 'Kelas 5 A', grade: 5, section: 'A', studentCount: 29 },
        { id: 10, name: 'Kelas 5 B', grade: 5, section: 'B', studentCount: 27 },
        { id: 11, name: 'Kelas 6 A', grade: 6, section: 'A', studentCount: 30 },
        { id: 12, name: 'Kelas 6 B', grade: 6, section: 'B', studentCount: 28 },
    ];

    const filteredClasses = classList.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleClassClick = (classId: number) => {
        // TODO: Navigate to class detail page
        router.visit(`/admin/kelas/${classId}`);
    };

    return (
        <AppLayout>
            <Head title="Dashboard Admin" />

            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-lg sm:text-xl">J</span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-blue-700">Jurnal Harian</h1>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full sm:max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Cari Siswa"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 sm:pl-10 text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    {/* Classes Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-blue-900">Kelas</h2>
                            <Link href="#" className="text-sm sm:text-base text-blue-600 font-medium hover:text-blue-700">
                                View All
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {filteredClasses.map((cls) => (
                                <button
                                    key={cls.id}
                                    onClick={() => handleClassClick(cls.id)}
                                    className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 sm:border-4 border-gray-800 group"
                                >
                                    {/* School Icon */}
                                    <div className="bg-orange-100 rounded-t-2xl sm:rounded-t-3xl -mx-3 sm:-mx-4 lg:-mx-6 -mt-3 sm:-mt-4 lg:-mt-6 mb-2 sm:mb-3 lg:mb-4 p-4 sm:p-6 lg:p-8 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                        <div className="text-4xl sm:text-5xl lg:text-6xl">
                                            🏫
                                        </div>
                                    </div>

                                    {/* Class Info */}
                                    <div className="text-center">
                                        <h3 className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg mb-0.5 sm:mb-1">
                                            {cls.name}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-600">
                                            {cls.studentCount} Siswa
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
