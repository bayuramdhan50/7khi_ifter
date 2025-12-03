import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Edit, Trash2, X } from 'lucide-react';

interface Parent {
    id: number;
    parentName: string;
    studentName: string;
    studentClass: string;
}

interface ClassParentsProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    className: string;
    classId: string;
    parents: Parent[];
}

interface FormData {
    parentName: string;
    studentName: string;
    studentClass: string;
}

export default function ClassParents({ auth, className, classId, parents }: ClassParentsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
    const [formData, setFormData] = useState<FormData>({
        parentName: '',
        studentName: '',
        studentClass: '',
    });

    // Mock data jika backend belum siap
    const mockParents: Parent[] = [
        { id: 1, parentName: 'Orang Tua 1', studentName: 'Ahmad Fauzi', studentClass: '7 A' },
        { id: 2, parentName: 'Orang Tua 2', studentName: 'Siti Nurhaliza', studentClass: '7 B' },
        { id: 3, parentName: 'Orang Tua 3', studentName: 'Budi Santoso', studentClass: '7 C' },
        { id: 4, parentName: 'Orang Tua 4', studentName: 'Dewi Lestari', studentClass: '7 D' },
        { id: 5, parentName: 'Orang Tua 5', studentName: 'Eko Prasetyo', studentClass: '8 A' },
        { id: 6, parentName: 'Orang Tua 6', studentName: 'Fitri Handayani', studentClass: '8 B' },
        { id: 7, parentName: 'Orang Tua 7', studentName: 'Galih Pratama', studentClass: '8 C' },
        { id: 8, parentName: 'Orang Tua 8', studentName: 'Hani Safitri', studentClass: '8 D' },
        { id: 9, parentName: 'Orang Tua 9', studentName: 'Irfan Hakim', studentClass: '9 A' },
        { id: 10, parentName: 'Orang Tua 10', studentName: 'Jasmine Putri', studentClass: '9 B' },
        { id: 11, parentName: 'Orang Tua 11', studentName: 'Kirana Azzahra', studentClass: '9 C' },
    ];

    const displayParents = parents && parents.length > 0 ? parents : mockParents;

    // Filter orang tua berdasarkan search
    const filteredParents = displayParents.filter(parent =>
        parent.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openEditModal = (parent: Parent) => {
        setSelectedParent(parent);
        setFormData({
            parentName: parent.parentName,
            studentName: parent.studentName,
            studentClass: parent.studentClass,
        });
        setShowEditModal(true);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Add parent submitted:', formData);
        // TODO: Kirim data ke backend
        alert(`Orang Tua ${formData.parentName} berhasil ditambahkan`);
        setFormData({ parentName: '', studentName: '', studentClass: '' });
        setShowAddModal(false);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Edit parent submitted:', formData);
        // TODO: Kirim data ke backend
        alert(`Orang Tua ${formData.parentName} berhasil diperbarui`);
        setFormData({ parentName: '', studentName: '', studentClass: '' });
        setShowEditModal(false);
        setSelectedParent(null);
    };

    return (
        <AppLayout>
            <Head title={`Daftar Orang Tua ${className}`} />

            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <Link
                                href="/admin/orangtua-dashboard"
                                className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Kembali ke Dashboard
                            </Link>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">List Nama Orang Tua</h1>
                        <p className="text-sm sm:text-base text-gray-600">Daftar orang tua siswa</p>
                    </div>

                    {/* Action Bar */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
                            {/* Tambah Akun Button */}
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-5 lg:px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center text-sm sm:text-base">
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
                                    className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
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

                    {/* Parents Table */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                                <thead>
                                    <tr className="border-b-2 border-gray-300 bg-gray-100">
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">NO</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">Nama Orang Tua</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">Nama Murid</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">Kelas Murid</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-xs sm:text-sm">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredParents.map((parent, index) => (
                                        <tr key={parent.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center">
                                                <span className="font-semibold text-gray-900 text-xs sm:text-sm">{index + 1}.</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center">
                                                <span className="font-bold text-gray-900 text-xs sm:text-sm">{parent.parentName}</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center">
                                                <span className="font-bold text-gray-900 text-xs sm:text-sm">{parent.studentName}</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 text-center">
                                                <span className="font-bold text-gray-900 text-xs sm:text-sm">{parent.studentClass}</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6">
                                                <div className="flex justify-center gap-1 sm:gap-2">
                                                    <button
                                                        onClick={() => openEditModal(parent)}
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
                        {filteredParents.length === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-gray-600 font-medium">Tidak ada orang tua yang ditemukan</p>
                            </div>
                        )}
                    </div>

                    {/* Add Modal */}
                    {showAddModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X className="h-6 w-6" />
                                </button>

                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Tambah Orang Tua Baru</h2>
                                    <p className="text-sm text-gray-600 mt-1">Isi form di bawah untuk menambah data orang tua</p>
                                </div>

                                <form onSubmit={handleAddSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nama Orang Tua
                                        </label>
                                        <input
                                            type="text"
                                            name="parentName"
                                            value={formData.parentName}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan nama orang tua"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nama Murid
                                        </label>
                                        <input
                                            type="text"
                                            name="studentName"
                                            value={formData.studentName}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan nama murid"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Kelas Murid
                                        </label>
                                        <select
                                            name="studentClass"
                                            value={formData.studentClass}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900"
                                            required
                                        >
                                            <option value="">Pilih Kelas</option>
                                            <option value="7 A">7 A</option>
                                            <option value="7 B">7 B</option>
                                            <option value="7 C">7 C</option>
                                            <option value="7 D">7 D</option>
                                            <option value="8 A">8 A</option>
                                            <option value="8 B">8 B</option>
                                            <option value="8 C">8 C</option>
                                            <option value="8 D">8 D</option>
                                            <option value="9 A">9 A</option>
                                            <option value="9 B">9 B</option>
                                            <option value="9 C">9 C</option>
                                            <option value="9 D">9 D</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors text-sm"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors text-sm"
                                        >
                                            Simpan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {showEditModal && selectedParent && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X className="h-6 w-6" />
                                </button>

                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Edit Data Orang Tua</h2>
                                    <p className="text-sm text-gray-600 mt-1">Ubah informasi orang tua di bawah</p>
                                </div>

                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nama Orang Tua
                                        </label>
                                        <input
                                            type="text"
                                            name="parentName"
                                            value={formData.parentName}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan nama orang tua"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nama Murid
                                        </label>
                                        <input
                                            type="text"
                                            name="studentName"
                                            value={formData.studentName}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan nama murid"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Kelas Murid
                                        </label>
                                        <select
                                            name="studentClass"
                                            value={formData.studentClass}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900"
                                            required
                                        >
                                            <option value="">Pilih Kelas</option>
                                            <option value="7 A">7 A</option>
                                            <option value="7 B">7 B</option>
                                            <option value="7 C">7 C</option>
                                            <option value="7 D">7 D</option>
                                            <option value="8 A">8 A</option>
                                            <option value="8 B">8 B</option>
                                            <option value="8 C">8 C</option>
                                            <option value="8 D">8 D</option>
                                            <option value="9 A">9 A</option>
                                            <option value="9 B">9 B</option>
                                            <option value="9 C">9 C</option>
                                            <option value="9 D">9 D</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditModal(false)}
                                            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors text-sm"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors text-sm"
                                        >
                                            Perbarui
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
