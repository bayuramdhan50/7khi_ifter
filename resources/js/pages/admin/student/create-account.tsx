import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useToast } from '@/components/ui/toast';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface CreateAccountProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    classes: Array<{
        id: number;
        name: string;
        grade: number;
        section: string;
    }>;
}

interface FormData {
    name: string;
    email: string;
    nis: string;
    nisn: string;
    religion: string;
    gender: string;
    date_of_birth: string;
    address: string;
    class_id: string;
}

// Configure axios with CSRF token
const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

export default function CreateAccount({ classes }: CreateAccountProps) {
    const { showSuccess, showError } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        nis: '',
        nisn: '',
        religion: '',
        gender: '',
        date_of_birth: '',
        address: '',
        class_id: '',
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
                class_id: formData.class_id ? parseInt(formData.class_id) : null,
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
                showSuccess('Akun siswa berhasil ditambahkan');
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    nis: '',
                    nisn: '',
                    religion: '',
                    gender: '',
                    date_of_birth: '',
                    address: '',
                    class_id: '',
                });
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

    return (
        <AppLayout>
            <Head title="Tambah Akun Siswa Baru" />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
                <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
                            <Link
                                href="/admin/siswa-dashboard"
                                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 sm:gap-2 sm:text-base"
                            >
                                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                                Kembali ke Dashboard Siswa
                            </Link>
                        </div>
                        <h1 className="mb-1 text-2xl font-bold text-gray-900 sm:mb-2 sm:text-3xl">
                            Tambah Akun Siswa Baru
                        </h1>
                        <p className="text-sm text-gray-600 sm:text-base">
                            Buat akun siswa baru dengan mengisi form di bawah ini
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="mx-auto max-w-2xl">
                        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
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

                                {/* Kelas */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Kelas{' '}
                                        <span className="text-gray-500 text-xs font-normal">(opsional - bisa diisi nanti)</span>
                                    </label>
                                    <select
                                        name="class_id"
                                        value={formData.class_id}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Belum Pilih Kelas</option>
                                        {classes.map((classItem) => (
                                            <option
                                                key={classItem.id}
                                                value={classItem.id}
                                            >
                                                Kelas {classItem.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Siswa bisa ditambahkan ke kelas nanti dari halaman daftar siswa kelas
                                    </p>
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
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    'Apakah Anda yakin ingin membatalkan? Data yang telah diisi akan hilang.',
                                                )
                                            ) {
                                                setFormData({
                                                    name: '',
                                                    email: '',
                                                    nis: '',
                                                    nisn: '',
                                                    religion: '',
                                                    gender: '',
                                                    date_of_birth: '',
                                                    address: '',
                                                    class_id: '',
                                                });
                                            }
                                        }}
                                        className="rounded-lg bg-gray-200 px-6 py-2.5 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-300"
                                    >
                                        Reset Form
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isSubmitting
                                            ? 'Menyimpan...'
                                            : 'Simpan Akun Siswa'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
