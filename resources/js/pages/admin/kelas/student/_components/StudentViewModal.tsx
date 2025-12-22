import { X } from 'lucide-react';
import { Student } from '../types';

interface StudentViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: Student | null;
    onEdit: () => void;
}

export default function StudentViewModal({
    isOpen,
    onClose,
    student,
    onEdit,
}: StudentViewModalProps) {
    if (!isOpen || !student) return null;

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
                        Detail Siswa
                    </h2>
                </div>

                <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Nama Siswa
                        </label>
                        <p className="font-semibold text-gray-900">
                            {student.name}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                NIS
                            </label>
                            <p className="font-semibold text-gray-900">
                                {student.nis || '-'}
                            </p>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                NISN
                            </label>
                            <p className="text-gray-900">
                                {student.nisn || '-'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Agama
                        </label>
                        <p className="font-semibold text-gray-900">
                            {student.religion}
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Jenis Kelamin
                        </label>
                        <p className="font-semibold text-gray-900">
                            {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Tanggal Lahir
                        </label>
                        <p className="text-gray-900">
                            {student.date_of_birth || '-'}
                        </p>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Alamat
                        </label>
                        <p className="text-gray-900">
                            {student.address || '-'}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex gap-3 border-t pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-300"
                    >
                        Tutup
                    </button>
                    <button
                        type="button"
                        onClick={onEdit}
                        className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}
