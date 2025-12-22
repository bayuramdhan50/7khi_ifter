import { Trash2 } from 'lucide-react';
import { Teacher } from '../types';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    teacher: Teacher | null;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    teacher,
}: DeleteConfirmModalProps) {
    if (!isOpen || !teacher) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <Trash2 className="h-8 w-8 text-red-600" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">
                        Hapus Guru
                    </h2>
                    <p className="text-gray-600">
                        Apakah Anda yakin ingin menghapus guru{' '}
                        <span className="font-bold">{teacher.name}</span>?
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-900 transition-colors hover:bg-gray-300"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700"
                    >
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}
