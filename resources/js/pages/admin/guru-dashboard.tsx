import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff, Edit, Trash2, X } from 'lucide-react';

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

interface FormData {
    name: string;
    class: string;
    password: string;
    passwordConfirmation: string;
}

export default function GuruDashboard({ auth, teachers }: GuruDashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        class: '',
        password: '',
        passwordConfirmation: '',
    });

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openEditModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setFormData({
            name: teacher.name,
            class: teacher.class,
            password: '',
            passwordConfirmation: '',
        });
        setShowEditModal(true);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Add guru submitted:', formData);
        // TODO: Kirim data ke backend
        alert(`Guru ${formData.name} berhasil ditambahkan`);
        setFormData({ name: '', class: '', password: '', passwordConfirmation: '' });
        setShowAddModal(false);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Edit guru submitted:', formData);
        // TODO: Kirim data ke backend
        alert(`Guru ${formData.name} berhasil diperbarui`);
        setFormData({ name: '', class: '', password: '', passwordConfirmation: '' });
        setShowEditModal(false);
        setSelectedTeacher(null);
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
                                                        onClick={() => openEditModal(teacher)}
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
                                    <h2 className="text-2xl font-bold text-gray-900">Tambah Guru Baru</h2>
                                    <p className="text-sm text-gray-600 mt-1">Isi form di bawah untuk menambah data guru</p>
                                </div>

                                <form onSubmit={handleAddSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nama Guru
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan nama guru"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Kelas
                                        </label>
                                        <select
                                            name="class"
                                            value={formData.class}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
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

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan password"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Konfirmasi Password
                                        </label>
                                        <input
                                            type="password"
                                            name="passwordConfirmation"
                                            value={formData.passwordConfirmation}
                                            onChange={handleInputChange}
                                            placeholder="Konfirmasi password"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                            required
                                        />
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
                                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-sm"
                                        >
                                            Simpan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {showEditModal && selectedTeacher && (
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
                                    <h2 className="text-2xl font-bold text-gray-900">Edit Data Guru</h2>
                                    <p className="text-sm text-gray-600 mt-1">Ubah informasi guru di bawah</p>
                                </div>

                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nama Guru
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan nama guru"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Kelas
                                        </label>
                                        <select
                                            name="class"
                                            value={formData.class}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
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

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Password Baru (kosongkan jika tidak ingin mengubah)
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
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
                                            name="passwordConfirmation"
                                            value={formData.passwordConfirmation}
                                            onChange={handleInputChange}
                                            placeholder="Konfirmasi password baru"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900"
                                        />
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
                                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-sm"
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
