import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff, Edit, Trash2, X } from 'lucide-react';

interface Teacher {
    id: number;
    user_id: number;
    name: string;
    email: string;
    nip: string;
    phone: string;
    address: string;
    is_active: boolean;
    class_id: number | null;
    class_name: string;
    createdAt: string;
}

interface ClassOption {
    id: number;
    name: string;
    grade: number;
    section: string;
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
    allClasses: ClassOption[];
}

interface FormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    nip: string;
    phone: string;
    address: string;
    class_id: number | string;
}

export default function GuruDashboard({ auth, teachers, allClasses }: GuruDashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    const { data: addData, setData: setAddData, post: postAdd, processing: processingAdd, reset: resetAdd } = useForm<FormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        nip: '',
        phone: '',
        address: '',
        class_id: '',
    });

    const { data: editData, setData: setEditData, put: putEdit, processing: processingEdit, reset: resetEdit } = useForm<FormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        nip: '',
        phone: '',
        address: '',
        class_id: '',
    });

    // Filter guru berdasarkan search
    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.nip.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const togglePasswordVisibility = (teacherId: number) => {
        setShowPasswords(prev => ({
            ...prev,
            [teacherId]: !prev[teacherId]
        }));
    };

    const openEditModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setEditData({
            name: teacher.name,
            email: teacher.email,
            password: '',
            password_confirmation: '',
            nip: teacher.nip === '-' ? '' : teacher.nip,
            phone: teacher.phone === '-' ? '' : teacher.phone,
            address: teacher.address === '-' ? '' : teacher.address,
            class_id: teacher.class_id ? teacher.class_id.toString() : '',
        });
        setShowEditModal(true);
    };

    const openDeleteConfirm = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setShowDeleteConfirm(true);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postAdd('/admin/teachers', {
            onSuccess: () => {
                resetAdd();
                setShowAddModal(false);
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTeacher) {
            putEdit(`/admin/teachers/${selectedTeacher.id}`, {
                onSuccess: () => {
                    resetEdit();
                    setShowEditModal(false);
                    setSelectedTeacher(null);
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedTeacher) {
            router.delete(`/admin/teachers/${selectedTeacher.id}`, {
                onSuccess: () => {
                    setShowDeleteConfirm(false);
                    setSelectedTeacher(null);
                },
            });
        }
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
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center text-sm sm:text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Tambah Akun
                            </button>

                            {/* Search Box */}
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Cari nama, email, atau NIP..."
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
                            <table className="w-full min-w-[900px]">
                                <thead>
                                    <tr className="border-b-2 border-gray-300 bg-gray-100">
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 text-center font-bold text-gray-900 text-xs sm:text-sm">NO</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 text-left font-bold text-gray-900 text-xs sm:text-sm">Nama Guru</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 text-left font-bold text-gray-900 text-xs sm:text-sm">Email</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 text-center font-bold text-gray-900 text-xs sm:text-sm">NIP</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 text-center font-bold text-gray-900 text-xs sm:text-sm">Telepon</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 text-center font-bold text-gray-900 text-xs sm:text-sm">Kelas</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 text-center font-bold text-gray-900 text-xs sm:text-sm">Status</th>
                                        <th className="py-3 px-3 sm:py-4 sm:px-4 text-center font-bold text-gray-900 text-xs sm:text-sm">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTeachers.map((teacher, index) => (
                                        <tr key={teacher.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 text-center">
                                                <span className="font-semibold text-gray-900 text-xs sm:text-sm">{index + 1}.</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4">
                                                <span className="font-bold text-gray-900 text-xs sm:text-sm">{teacher.name}</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4">
                                                <span className="text-gray-700 text-xs sm:text-sm">{teacher.email}</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 text-center">
                                                <span className="text-gray-700 text-xs sm:text-sm">{teacher.nip}</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 text-center">
                                                <span className="text-gray-700 text-xs sm:text-sm">{teacher.phone}</span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 text-center">
                                                <span className="inline-block bg-blue-100 text-blue-800 font-semibold px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm">
                                                    {teacher.class_name}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4 text-center">
                                                <span className={`inline-block px-2 sm:px-3 py-1 rounded-lg font-semibold text-xs sm:text-sm ${
                                                    teacher.is_active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {teacher.is_active ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 sm:py-4 sm:px-4">
                                                <div className="flex justify-center gap-1 sm:gap-2">
                                                    <button
                                                        onClick={() => openEditModal(teacher)}
                                                        className="bg-gray-800 hover:bg-gray-900 text-white p-1.5 sm:p-2 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteConfirm(teacher)}
                                                        className="bg-red-600 hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-lg transition-colors"
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

                    {/* Add Modal */}
                    {showAddModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X className="h-6 w-6" />
                                </button>

                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Tambah Guru Baru</h2>
                                    <p className="text-sm text-gray-600 mt-1">Isi form di bawah untuk menambah data guru</p>
                                </div>

                                <form onSubmit={handleAddSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Nama Guru <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={addData.name}
                                                onChange={(e) => setAddData('name', e.target.value)}
                                                placeholder="Masukkan nama guru"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={addData.email}
                                                onChange={(e) => setAddData('email', e.target.value)}
                                                placeholder="Masukkan email"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                NIP
                                            </label>
                                            <input
                                                type="text"
                                                value={addData.nip}
                                                onChange={(e) => setAddData('nip', e.target.value)}
                                                placeholder="Masukkan NIP"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Telepon
                                            </label>
                                            <input
                                                type="text"
                                                value={addData.phone}
                                                onChange={(e) => setAddData('phone', e.target.value)}
                                                placeholder="Masukkan nomor telepon"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Password <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                value={addData.password}
                                                onChange={(e) => setAddData('password', e.target.value)}
                                                placeholder="Masukkan password"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Konfirmasi Password <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                value={addData.password_confirmation}
                                                onChange={(e) => setAddData('password_confirmation', e.target.value)}
                                                placeholder="Konfirmasi password"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Alamat
                                        </label>
                                        <textarea
                                            value={addData.address}
                                            onChange={(e) => setAddData('address', e.target.value)}
                                            placeholder="Masukkan alamat lengkap"
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Kelas yang Diampu
                                        </label>
                                        <select
                                            value={addData.class_id}
                                            onChange={(e) => setAddData('class_id', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                        >
                                            <option value="">Pilih Kelas</option>
                                            {allClasses.map((classOption) => (
                                                <option key={classOption.id} value={classOption.id}>
                                                    {classOption.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Pilih satu kelas yang akan diampu oleh guru ini
                                        </p>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors text-sm"
                                            disabled={processingAdd}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-sm disabled:opacity-50"
                                            disabled={processingAdd}
                                        >
                                            {processingAdd ? 'Menyimpan...' : 'Simpan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {showEditModal && selectedTeacher && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X className="h-6 w-6" />
                                </button>

                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Edit Data Guru</h2>
                                    <p className="text-sm text-gray-600 mt-1">Ubah informasi guru di bawah</p>
                                </div>

                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Nama Guru <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={editData.name}
                                                onChange={(e) => setEditData('name', e.target.value)}
                                                placeholder="Masukkan nama guru"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={editData.email}
                                                onChange={(e) => setEditData('email', e.target.value)}
                                                placeholder="Masukkan email"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                NIP
                                            </label>
                                            <input
                                                type="text"
                                                value={editData.nip}
                                                onChange={(e) => setEditData('nip', e.target.value)}
                                                placeholder="Masukkan NIP"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Telepon
                                            </label>
                                            <input
                                                type="text"
                                                value={editData.phone}
                                                onChange={(e) => setEditData('phone', e.target.value)}
                                                placeholder="Masukkan nomor telepon"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Password Baru (kosongkan jika tidak ingin mengubah)
                                            </label>
                                            <input
                                                type="password"
                                                value={editData.password}
                                                onChange={(e) => setEditData('password', e.target.value)}
                                                placeholder="Masukkan password baru"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Konfirmasi Password Baru
                                            </label>
                                            <input
                                                type="password"
                                                value={editData.password_confirmation}
                                                onChange={(e) => setEditData('password_confirmation', e.target.value)}
                                                placeholder="Konfirmasi password baru"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Alamat
                                        </label>
                                        <textarea
                                            value={editData.address}
                                            onChange={(e) => setEditData('address', e.target.value)}
                                            placeholder="Masukkan alamat lengkap"
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Kelas yang Diampu
                                        </label>
                                        <select
                                            value={editData.class_id}
                                            onChange={(e) => setEditData('class_id', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                        >
                                            <option value="">Pilih Kelas</option>
                                            {allClasses.map((classOption) => (
                                                <option key={classOption.id} value={classOption.id}>
                                                    {classOption.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Pilih satu kelas yang akan diampu oleh guru ini
                                        </p>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditModal(false)}
                                            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors text-sm"
                                            disabled={processingEdit}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-sm disabled:opacity-50"
                                            disabled={processingEdit}
                                        >
                                            {processingEdit ? 'Memperbarui...' : 'Perbarui'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {showDeleteConfirm && selectedTeacher && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
                                <div className="text-center mb-6">
                                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                        <Trash2 className="h-8 w-8 text-red-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Hapus Guru</h2>
                                    <p className="text-gray-600">
                                        Apakah Anda yakin ingin menghapus guru <span className="font-bold">{selectedTeacher.name}</span>? 
                                        Tindakan ini tidak dapat dibatalkan.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                                    >
                                        Ya, Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
