import { X } from 'lucide-react';
import { FormData } from '../types';

interface StudentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: FormData;
    onInputChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => void;
    mode: 'add' | 'edit';
    isSubmitting?: boolean;
}

export default function StudentFormModal({
    isOpen,
    onClose,
    onSubmit,
    formData,
    onInputChange,
    mode,
    isSubmitting = false,
}: StudentFormModalProps) {
    if (!isOpen) return null;

    const title = mode === 'add' ? 'Tambah Siswa Baru' : 'Edit Data Siswa';
    const description =
        mode === 'add'
            ? 'Isi form di bawah untuk menambah data siswa'
            : 'Ubah informasi siswa di bawah';
    const submitText = mode === 'add' ? 'Simpan' : 'Simpan Perubahan';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 transition-colors hover:text-gray-700"
                    aria-label="Close modal"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                </div>

                <form
                    onSubmit={onSubmit}
                    className="max-h-[70vh] space-y-4 overflow-y-auto pr-2"
                >
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Nama Siswa <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                            placeholder="Masukkan nama siswa"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onInputChange}
                            placeholder="contoh@email.com"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                NIS <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nis"
                                value={formData.nis}
                                onChange={onInputChange}
                                placeholder="Nomor Induk Siswa"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
                                onChange={onInputChange}
                                placeholder="NISN (opsional)"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Agama <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="religion"
                            value={formData.religion}
                            onChange={onInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
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

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Jenis Kelamin{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={onInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Tanggal Lahir
                        </label>
                        <input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={onInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Alamat
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={onInputChange}
                            placeholder="Masukkan alamat lengkap"
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="sticky bottom-0 flex gap-3 bg-white pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-300 disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Menyimpan...' : submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
