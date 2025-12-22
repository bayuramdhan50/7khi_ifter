import { X, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FormData, Class, Student, ChildData } from '../types';

interface ParentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: FormData;
    onInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => void;
    onChildChange: (
        childId: string,
        field: keyof Omit<ChildData, 'id'>,
        value: string,
    ) => void;
    onAddChild: () => void;
    onRemoveChild: (childId: string) => void;
    mode: 'add' | 'edit';
    allClasses?: Class[];
}

export default function ParentFormModal({
    isOpen,
    onClose,
    onSubmit,
    formData,
    onInputChange,
    onChildChange,
    onAddChild,
    onRemoveChild,
    mode,
    allClasses = [],
}: ParentFormModalProps) {
    const [availableStudentsPerChild, setAvailableStudentsPerChild] =
        useState<Record<string, Student[]>>({});

    // Update available students when any child's class changes
    useEffect(() => {
        const newAvailableStudents: Record<string, Student[]> = {};
        formData.children.forEach((child) => {
            if (child.classId) {
                const selectedClass = allClasses.find(
                    (c) => c.id.toString() === child.classId,
                );
                newAvailableStudents[child.id] =
                    selectedClass?.students || [];
            } else {
                newAvailableStudents[child.id] = [];
            }
        });
        setAvailableStudentsPerChild(newAvailableStudents);
    }, [formData.children, allClasses]);

    if (!isOpen) return null;

    const title =
        mode === 'add' ? 'Tambah Akun Orang Tua Baru' : 'Edit Data Orang Tua';
    const description =
        mode === 'add'
            ? 'Isi form di bawah untuk membuat akun orang tua'
            : 'Ubah informasi orang tua di bawah';
    const submitText = mode === 'add' ? 'Simpan Akun' : 'Perbarui';

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
                    {/* Nama Orang Tua */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Nama Orang Tua{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                            placeholder="Masukkan nama orang tua"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    {/* No. Telepon */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            No. Telepon
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={onInputChange}
                            placeholder="08xxxxxxxxxx"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
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
                            onChange={onInputChange}
                            placeholder="Masukkan alamat lengkap"
                            rows={2}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Pekerjaan */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Pekerjaan
                        </label>
                        <input
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            onChange={onInputChange}
                            placeholder="Masukkan pekerjaan"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Data Anak */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Data Anak{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-4">
                            {formData.children.map((child, index) => {
                                const availableStudents =
                                    availableStudentsPerChild[child.id] || [];
                                return (
                                    <div
                                        key={child.id}
                                        className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-gray-700">
                                                Anak ke-{index + 1}
                                            </h4>
                                            {formData.children.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onRemoveChild(child.id)
                                                    }
                                                    className="text-red-500 transition-colors hover:text-red-700"
                                                    aria-label="Hapus anak"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {/* Hubungan */}
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-gray-600">
                                                    Hubungan{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    value={child.relationship}
                                                    onChange={(e) =>
                                                        onChildChange(
                                                            child.id,
                                                            'relationship',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                                                    required
                                                >
                                                    <option value="">
                                                        Pilih Hubungan
                                                    </option>
                                                    <option value="ayah">
                                                        Ayah
                                                    </option>
                                                    <option value="ibu">
                                                        Ibu
                                                    </option>
                                                    <option value="wali">
                                                        Wali
                                                    </option>
                                                </select>
                                            </div>

                                            {/* Kelas */}
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-gray-600">
                                                    Kelas{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    value={child.classId}
                                                    onChange={(e) =>
                                                        onChildChange(
                                                            child.id,
                                                            'classId',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                                                    required
                                                >
                                                    <option value="">
                                                        Pilih Kelas
                                                    </option>
                                                    {allClasses.map(
                                                        (classItem) => (
                                                            <option
                                                                key={
                                                                    classItem.id
                                                                }
                                                                value={
                                                                    classItem.id
                                                                }
                                                            >
                                                                Kelas{' '}
                                                                {classItem.name}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </div>

                                            {/* Nama Anak - Only show when class is selected */}
                                            {child.classId && (
                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Nama Anak{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </label>
                                                    <select
                                                        value={child.studentId}
                                                        onChange={(e) =>
                                                            onChildChange(
                                                                child.id,
                                                                'studentId',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                                                        required
                                                    >
                                                        <option value="">
                                                            Pilih Anak
                                                        </option>
                                                        {availableStudents.length >
                                                            0 ? (
                                                            availableStudents.map(
                                                                (student) => (
                                                                    <option
                                                                        key={
                                                                            student.id
                                                                        }
                                                                        value={
                                                                            student.id
                                                                        }
                                                                    >
                                                                        {
                                                                            student.name
                                                                        }
                                                                    </option>
                                                                ),
                                                            )
                                                        ) : (
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Tidak ada siswa
                                                                di kelas ini
                                                            </option>
                                                        )}
                                                    </select>
                                                    {availableStudents.length ===
                                                        0 && (
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                Belum ada siswa
                                                                terdaftar di kelas
                                                                ini
                                                            </p>
                                                        )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Add Child Button */}
                            <button
                                type="button"
                                onClick={onAddChild}
                                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-600 transition-colors hover:border-purple-400 hover:bg-purple-100"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Anak Lain
                            </button>
                        </div>
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
