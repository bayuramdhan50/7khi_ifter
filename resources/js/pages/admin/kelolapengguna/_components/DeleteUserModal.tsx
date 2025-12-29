import { X, AlertTriangle } from 'lucide-react';
import { User } from '../types';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  user,
  onConfirm,
  isSubmitting,
}: DeleteUserModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Hapus Akun</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Konfirmasi Penghapusan
              </h3>
              <p className="mt-2 text-gray-600">
                Apakah Anda yakin ingin menghapus akun{' '}
                <strong>{user.name}</strong>?
              </p>
              <p className="mt-2 text-sm text-red-600">
                Tindakan ini tidak dapat dibatalkan. Semua data terkait akun ini akan dihapus secara permanen.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Menghapus...' : 'Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
