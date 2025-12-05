import { X } from 'lucide-react';
import { FormData } from '../types';

interface ParentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: FormData;
    onInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => void;
    mode: 'add' | 'edit';
}

export default function ParentFormModal({
    isOpen,
    onClose,
    onSubmit,
    formData,
    onInputChange,
    mode,
}: ParentFormModalProps) {
    if (!isOpen) return null;

    const title =
        mode === 'add' ? 'Tambah Orang Tua Baru' : 'Edit Data Orang Tua';
    const description =
        mode === 'add'
            ? 'Isi form di bawah untuk menambah data orang tua'
            : 'Ubah informasi orang tua di bawah';
    const submitText = mode === 'add' ? 'Simpan' : 'Perbarui';

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

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Nama Orang Tua
                        </label>
                        <input
                            type="text"
                            name="parentName"
                            value={formData.parentName}
                            onChange={onInputChange}
                            placeholder="Masukkan nama orang tua"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Nama Murid
                        </label>
                        <input
                            type="text"
                            name="studentName"
                            value={formData.studentName}
                            onChange={onInputChange}
                            placeholder="Masukkan nama murid"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Kelas Murid
                        </label>
                        <select
                            name="studentClass"
                            value={formData.studentClass}
                            onChange={onInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
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
                            onClick={onClose}
                            className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-300"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
                        >
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
