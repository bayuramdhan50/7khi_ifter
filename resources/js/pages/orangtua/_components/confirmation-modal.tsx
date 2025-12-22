import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: 'approve' | 'reject';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const isApprove = type === 'approve';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isApprove ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}
          >
            {isApprove ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors cursor-pointer ${isApprove
                ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200'
                : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200'
                }`}
            >
              {isApprove ? 'Ya, Setujui' : 'Ya, Tolak'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
