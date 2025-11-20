import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

interface OrangTuaManagementProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    orangtua: User[];
    totalOrangTua: number;
}

export default function OrangTuaManagement({ auth, orangtua, totalOrangTua }: OrangTuaManagementProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'email' | 'createdAt'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Search orang tua
    const searchedOrangTua = orangtua.filter(parent => 
        parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort orang tua
    const sortedOrangTua = [...searchedOrangTua].sort((a, b) => {
        let compareA: string | number = '';
        let compareB: string | number = '';

        if (sortBy === 'name') {
            compareA = a.name.toLowerCase();
            compareB = b.name.toLowerCase();
        } else if (sortBy === 'email') {
            compareA = a.email.toLowerCase();
            compareB = b.email.toLowerCase();
        } else if (sortBy === 'createdAt') {
            compareA = new Date(a.createdAt).getTime();
            compareB = new Date(b.createdAt).getTime();
        }

        if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
        if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sortedOrangTua.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrangTua = sortedOrangTua.slice(startIndex, endIndex);

    // Handler untuk sorting
    const handleSort = (column: 'name' | 'email' | 'createdAt') => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    // Icon untuk sorting
    const SortIcon = ({ column }: { column: 'name' | 'email' | 'createdAt' }) => {
        if (sortBy !== column) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        if (sortOrder === 'asc') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
            );
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    return (
        <AppLayout>
            <Head title="Kelola Orang Tua" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kelola Orang Tua</h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">Manajemen data orang tua</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Tambah Orang Tua
                        </button>
                    </div>

                    {/* Statistics Card */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border-l-4 border-purple-500">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
                                <div className="flex-1">
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1">Total Orang Tua</p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">{totalOrangTua}</p>
                                </div>
                                <div className="bg-purple-100 p-2 sm:p-2.5 lg:p-3 rounded-full self-end sm:self-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Box */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Cari nama atau email orang tua..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
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

                    {/* Orang Tua Table */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                                <thead>
                                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                                        <th className="py-3 px-2 sm:py-4 sm:px-4 text-left font-bold text-gray-700 text-xs sm:text-sm">ID</th>
                                        <th 
                                            className="py-3 px-2 sm:py-4 sm:px-4 text-left font-bold text-gray-700 cursor-pointer hover:bg-gray-100 text-xs sm:text-sm"
                                            onClick={() => handleSort('name')}
                                        >
                                            Nama <SortIcon column="name" />
                                        </th>
                                        <th 
                                            className="py-3 px-2 sm:py-4 sm:px-4 text-left font-bold text-gray-700 cursor-pointer hover:bg-gray-100 text-xs sm:text-sm"
                                            onClick={() => handleSort('email')}
                                        >
                                            Email <SortIcon column="email" />
                                        </th>
                                        <th 
                                            className="py-3 px-2 sm:py-4 sm:px-4 text-center font-bold text-gray-700 cursor-pointer hover:bg-gray-100 text-xs sm:text-sm"
                                            onClick={() => handleSort('createdAt')}
                                        >
                                            Tanggal Dibuat <SortIcon column="createdAt" />
                                        </th>
                                        <th className="py-3 px-2 sm:py-4 sm:px-4 text-center font-bold text-gray-700 text-xs sm:text-sm">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedOrangTua.map((parent) => (
                                        <tr key={parent.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-2 sm:py-4 sm:px-4">
                                                <span className="font-medium text-gray-900 text-xs sm:text-sm">{parent.id}</span>
                                            </td>
                                            <td className="py-3 px-2 sm:py-4 sm:px-4">
                                                <span className="font-medium text-gray-900 text-xs sm:text-sm">{parent.name}</span>
                                            </td>
                                            <td className="py-3 px-2 sm:py-4 sm:px-4">
                                                <span className="text-gray-600 text-xs sm:text-sm">{parent.email}</span>
                                            </td>
                                            <td className="py-3 px-2 sm:py-4 sm:px-4 text-center">
                                                <span className="text-gray-600 text-xs sm:text-sm">
                                                    {new Date(parent.createdAt).toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 sm:py-4 sm:px-4">
                                                <div className="flex justify-center gap-1 sm:gap-2">
                                                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                                                        Edit
                                                    </button>
                                                    <button className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* No Results Message */}
                        {paginatedOrangTua.length === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-gray-600 font-medium">
                                    {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Tidak ada data orang tua'}
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {paginatedOrangTua.length > 0 && (
                        <div className="flex items-center justify-between p-4 border-t border-gray-200">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">Show</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-sm font-medium text-gray-700">entries</span>
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    «
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ‹
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                currentPage === page
                                                    ? 'bg-purple-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ›
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    »
                                </button>

                                <span className="text-sm text-gray-600 ml-2">
                                    Halaman {currentPage} dari {totalPages}
                                </span>
                            </div>
                        </div>
                        )}
                    </div>

                    {/* Add Modal */}
                    {showAddModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full">
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tambah Orang Tua Baru</h2>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form className="space-y-3 sm:space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                placeholder="Masukkan nama lengkap"
                                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">Email</label>
                                            <input
                                                type="email"
                                                placeholder="Masukkan email"
                                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">Password</label>
                                        <input
                                            type="password"
                                            placeholder="Masukkan password"
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">Konfirmasi Password</label>
                                        <input
                                            type="password"
                                            placeholder="Konfirmasi password"
                                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base font-medium transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 sm:px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm sm:text-base font-medium transition-colors"
                                        >
                                            Simpan Orang Tua
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
