import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import ClassesGrid from './_components/ClassesGrid';
import SearchBar from './_components/SearchBar';
import { SiswaDashboardProps } from './types';

export default function SiswaDashboard({ classes }: SiswaDashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter kelas berdasarkan search
    const filteredClasses = classes.filter((cls) =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleClassClick = (classId: string) => {
        router.visit(`/admin/siswa/kelas/${classId}`);
    };

    return (
        <AppLayout>
            <Head title="Dashboard Siswa" />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
                <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="mb-1 text-2xl font-bold text-gray-900 sm:mb-2 sm:text-3xl">
                            Dashboard Siswa
                        </h1>
                        <p className="text-sm text-gray-600 sm:text-base">
                            Pilih kelas untuk melihat daftar siswa
                        </p>
                    </div>

                    {/* Search Bar */}
                    <SearchBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />

                    {/* Classes Grid */}
                    <ClassesGrid
                        classes={filteredClasses}
                        onClassClick={handleClassClick}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
