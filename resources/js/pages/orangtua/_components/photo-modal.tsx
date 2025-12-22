interface PhotoModalProps {
    photoUrl: string | null;
    onClose: () => void;
}

export default function PhotoModal({ photoUrl, onClose }: PhotoModalProps) {
    if (!photoUrl) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div className="max-w-4xl max-h-[90vh] relative">
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl font-bold"
                >
                    ✕
                </button>
                <img
                    src={photoUrl}
                    alt="Bukti foto kegiatan"
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
            </div>
        </div>
    );
}
