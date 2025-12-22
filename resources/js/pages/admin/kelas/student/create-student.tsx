import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useToast } from '@/components/ui/toast';
import axios from 'axios';
import { ArrowLeft, UserPlus, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { FormData } from './types';

interface UnassignedStudent {
    id: number;
    name: string;
    email: string;
    nis: string;
    nisn: string;
    religion: string;
    gender: string;
}

interface CreateStudentProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    className: string;
    classId: string;
    classDbId: number;
    unassignedStudents: UnassignedStudent[];
}

// Configure axios with CSRF token
const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

export default function CreateStudent({
    className,
    classId,
    classDbId,
    unassignedStudents,
}: CreateStudentProps) {
    const { showSuccess, showError } = useToast();
    const [activeTab, setActiveTab] = useState<'create' | 'assign'>('create');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        nis: '',
        nisn: '',
        religion: '',
        gender: '',
        date_of_birth: '',
        address: '',
    });

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await axios.post('/admin/students', {
                class_id: classDbId,
                name: formData.name,
                email: formData.email,
                nis: formData.nis,
                nisn: formData.nisn || null,
                religion: formData.religion,
                gender: formData.gender,
                date_of_birth: formData.date_of_birth || null,
                address: formData.address || null,
            });

            if (response.data.success) {
                showSuccess('Siswa berhasil ditambahkan');
                router.visit(`/admin/siswa/kelas/${classId}`);
            }
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message ||
                'Terjadi kesalahan saat menambahkan siswa';
            showError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssignStudent = async (e: FormEvent) => {
        e.preventDefault();

        if (!selectedStudentId || isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await axios.put(
                `/admin/students/${selectedStudentId}/assign-class`,
                {
                    class_id: classDbId,
                },
            );

            if (response.data.success) {
                showSuccess('Siswa berhasil ditambahkan ke kelas');
                router.visit(`/admin/siswa/kelas/${classId}`);
            }
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message ||
                'Terjadi kesalahan saat menambahkan siswa ke kelas';
            showError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppLayout>
            <Head title={`Tambah Siswa - ${className}`} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
                <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
                            <Link
                                href={`/admin/siswa/kelas/${classId}`}
                                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 sm:gap-2 sm:text-base"
                            >
                                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                                Kembali ke Daftar Siswa
                            </Link>
                        </div>
                        <h1 className="mb-1 text-2xl font-bold text-gray-900 sm:mb-2 sm:text-3xl">
                            Tambah Siswa Baru
                        </h1>
                        <p className="text-sm text-gray-600 sm:text-base">
                            Tambah siswa baru ke kelas {className}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="mx-auto max-w-2xl">
                        <div className="rounded-2xl bg-white shadow-lg">
                            {/* Tabs */}
                            <div className="border-b border-gray-200">
                                <div className="flex">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('create')}
                                        className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${activeTab === 'create'
                                                ? 'border-b-2 border-blue-600 text-blue-600'
                                                : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <UserPlus className="h-4 w-4" />
                                            Buat Akun Baru
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('assign')}
                                        className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${activeTab === 'assign'
                                                ? 'border-b-2 border-blue-600 text-blue-600'
                                                : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Users className="h-4 w-4" />
                                            Pilih Siswa Terdaftar
                                            {unassignedStudents.length > 0 && (
                                                <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                    {unassignedStudents.length}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6 sm:p-8">
                                {/* Tab 1: Create New */}
                                {activeTab === 'create' && (
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        {/* Nama Siswa */}
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Nama Siswa{' '}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Masukkan nama siswa"
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Email{' '}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="contoh@email.com"
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        {/* NIS & NISN */}
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                    NIS{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nis"
                                                    value={formData.nis}
                                                    onChange={handleInputChange}
                                                    placeholder="Nomor Induk Siswa"
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                    NISN
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nisn"
                                                    value={formData.nisn}
                                                    onChange={handleInputChange}
                                                    placeholder="NISN (opsional)"
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Agama */}
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Agama{' '}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="religion"
                                                value={formData.religion}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Pilih Agama</option>
                                                <option value="Islam">Islam</option>
                                                <option value="Kristen">Kristen</option>
                                                <option value="Katolik">Katolik</option>
                                                <option value="Hindu">Hindu</option>
                                                <option value="Buddha">Buddha</option>
                                                <option value="Konghucu">Konghucu</option>
                                            </select>
                                        </div>

                                        {/* Jenis Kelamin */}
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Jenis Kelamin{' '}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">
                                                    Pilih Jenis Kelamin
                                                </option>
                                                <option value="L">Laki-laki</option>
                                                <option value="P">Perempuan</option>
                                            </select>
                                        </div>

                                        {/* Tanggal Lahir */}
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Tanggal Lahir
                                            </label>
                                            <input
                                                type="date"
                                                name="date_of_birth"
                                                value={formData.date_of_birth}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Alamat */}
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Alamat
                                            </label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Masukkan alamat lengkap"
                                                rows={4}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                            <Link
                                                href={`/admin/siswa/kelas/${classId}`}
                                                className="rounded-lg bg-gray-200 px-6 py-2.5 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-300"
                                            >
                                                Batal
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {isSubmitting
                                                    ? 'Menyimpan...'
                                                    : 'Simpan Siswa'}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Tab 2: Assign Existing Student */}
                                {activeTab === 'assign' && (
                                    <form
                                        onSubmit={handleAssignStudent}
                                        className="space-y-6"
                                    >
                                        {unassignedStudents.length === 0 ? (
                                            <div className="rounded-lg bg-gray-50 p-8 text-center">
                                                <Users className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                                    Tidak Ada Siswa Tersedia
                                                </h3>
                                                <p className="mb-4 text-sm text-gray-600">
                                                    Semua siswa sudah terdaftar di
                                                    kelas atau belum ada siswa yang
                                                    terdaftar.
                                                </p>
                                                <Link
                                                    href="/admin/siswa/create-account"
                                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                                >
                                                    <UserPlus className="h-4 w-4" />
                                                    Buat Akun Siswa Baru
                                                </Link>
                                            </div>
                                        ) : (
                                            <>
                                                <div>
                                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                        Pilih Siswa{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </label>
                                                    <select
                                                        value={selectedStudentId}
                                                        onChange={(e) =>
                                                            setSelectedStudentId(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    >
                                                        <option value="">
                                                            Pilih siswa yang akan
                                                            ditambahkan
                                                        </option>
                                                        {unassignedStudents.map(
                                                            (student) => (
                                                                <option
                                                                    key={student.id}
                                                                    value={student.id}
                                                                >
                                                                    {student.name} -{' '}
                                                                    {student.nis} (
                                                                    {student.email})
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Siswa yang ditampilkan adalah
                                                        siswa yang sudah punya akun
                                                        tapi belum masuk kelas
                                                    </p>
                                                </div>

                                                {/* Preview Selected Student */}
                                                {selectedStudentId && (
                                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                                        <h4 className="mb-3 text-sm font-semibold text-gray-900">
                                                            Preview Data Siswa
                                                        </h4>
                                                        {unassignedStudents
                                                            .filter(
                                                                (s) =>
                                                                    s.id.toString() ===
                                                                    selectedStudentId,
                                                            )
                                                            .map((student) => (
                                                                <div
                                                                    key={student.id}
                                                                    className="space-y-2 text-sm"
                                                                >
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-600">
                                                                            Nama:
                                                                        </span>
                                                                        <span className="font-medium text-gray-900">
                                                                            {
                                                                                student.name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-600">
                                                                            Email:
                                                                        </span>
                                                                        <span className="font-medium text-gray-900">
                                                                            {
                                                                                student.email
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-600">
                                                                            NIS:
                                                                        </span>
                                                                        <span className="font-medium text-gray-900">
                                                                            {
                                                                                student.nis
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-600">
                                                                            Agama:
                                                                        </span>
                                                                        <span className="font-medium text-gray-900">
                                                                            {
                                                                                student.religion
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-600">
                                                                            Jenis Kelamin:
                                                                        </span>
                                                                        <span className="font-medium text-gray-900">
                                                                            {student.gender ===
                                                                                'L'
                                                                                ? 'Laki-laki'
                                                                                : 'Perempuan'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                                    <Link
                                                        href={`/admin/siswa/kelas/${classId}`}
                                                        className="rounded-lg bg-gray-200 px-6 py-2.5 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-300"
                                                    >
                                                        Batal
                                                    </Link>
                                                    <button
                                                        type="submit"
                                                        disabled={
                                                            isSubmitting ||
                                                            !selectedStudentId
                                                        }
                                                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                                    >
                                                        {isSubmitting
                                                            ? 'Menambahkan...'
                                                            : 'Tambahkan ke Kelas'}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
