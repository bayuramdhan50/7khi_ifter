import { InertiaFormProps } from '@inertiajs/react';
import { X } from 'lucide-react';
import { ClassOption, FormData, Teacher } from '../types';

interface EditTeacherModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    form: InertiaFormProps<FormData>;
    teacher: Teacher | null;
    allClasses: ClassOption[];
}

export default function EditTeacherModal({
    isOpen,
    onClose,
    onSubmit,
    form,
    teacher,
    allClasses,
}: EditTeacherModalProps) {
    if (!isOpen || !teacher) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 transition-colors hover:text-gray-700"
                    aria-label="Close modal"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Edit Data Guru
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Ubah informasi guru di bawah
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Nama Guru{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                placeholder="Masukkan nama guru"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                NIP
                            </label>
                            <input
                                type="text"
                                value={form.data.nip}
                                onChange={(e) =>
                                    form.setData('nip', e.target.value)
                                }
                                placeholder="Masukkan NIP"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Telepon
                            </label>
                            <input
                                type="text"
                                value={form.data.phone}
                                onChange={(e) =>
                                    form.setData('phone', e.target.value)
                                }
                                placeholder="Masukkan nomor telepon"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Password Baru (kosongkan jika tidak ingin
                                mengubah)
                            </label>
                            <input
                                type="password"
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData('password', e.target.value)
                                }
                                placeholder="Masukkan password baru"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Konfirmasi Password Baru
                            </label>
                            <input
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(e) =>
                                    form.setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                placeholder="Konfirmasi password baru"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Alamat
                        </label>
                        <textarea
                            value={form.data.address}
                            onChange={(e) =>
                                form.setData('address', e.target.value)
                            }
                            placeholder="Masukkan alamat lengkap"
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Kelas yang Diampu
                        </label>
                        <select
                            value={form.data.class_id}
                            onChange={(e) =>
                                form.setData('class_id', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Pilih Kelas</option>
                            {allClasses.map((classOption) => (
                                <option
                                    key={classOption.id}
                                    value={classOption.id}
                                >
                                    {classOption.name}
                                </option>
                            ))}
                        </select>
                        <p className="mt-2 text-xs text-gray-500">
                            Pilih satu kelas yang akan diampu oleh guru ini
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-300"
                            disabled={form.processing}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                            disabled={form.processing}
                        >
                            {form.processing ? 'Memperbarui...' : 'Perbarui'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
