import { Activity, ActivitySubmission } from '../types/types';

interface SubmissionsTableProps {
    submissions: ActivitySubmission[];
    selectedActivity: Activity | undefined;
    onApprove: (submissionId: number) => void;
    onReject: (submissionId: number) => void;
    onPhotoClick: (photoUrl: string) => void;
}

export default function SubmissionsTable({
    submissions,
    selectedActivity,
    onApprove,
    onReject,
    onPhotoClick,
}: SubmissionsTableProps) {
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'approved':
                return 'Disetujui';
            case 'rejected':
                return 'Ditolak';
            case 'pending':
                return 'Menunggu';
            default:
                return status;
        }
    };

    if (submissions.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-8 text-center">
                    <p className="text-gray-600 font-medium">Tidak ada data untuk ditampilkan</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                            <th className="py-4 px-4 text-left font-bold text-gray-700">
                                Kegiatan: {selectedActivity?.title}
                            </th>
                            <th className="py-4 px-4 text-left font-bold text-gray-700">Tanggal</th>
                            <th className="py-4 px-4 text-left font-bold text-gray-700">Waktu</th>
                            <th className="py-4 px-4 text-center font-bold text-gray-700">Bukti Foto</th>
                            <th className="py-4 px-4 text-center font-bold text-gray-700">Status</th>
                            <th className="py-4 px-4 text-center font-bold text-gray-700">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((submission) => (
                            <tr key={submission.id} className="border-b border-gray-200 hover:bg-gray-50">
                                {/* Kegiatan */}
                                <td className="py-4 px-4">
                                    <div className="font-medium text-gray-800">{submission.activityTitle}</div>
                                </td>

                                {/* Tanggal */}
                                <td className="py-4 px-4">
                                    <div className="text-gray-600">
                                        {new Date(submission.date).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </div>
                                </td>

                                {/* Waktu */}
                                <td className="py-4 px-4">
                                    <div className="text-gray-600">{submission.time}</div>
                                </td>

                                {/* Bukti Foto */}
                                <td className="py-4 px-4">
                                    <div className="flex justify-center">
                                        {submission.photo ? (
                                            <button
                                                onClick={() => onPhotoClick(submission.photo)}
                                                className="w-12 h-12 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                                            >
                                                <img
                                                    src={submission.photo}
                                                    alt="Bukti foto"
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="py-4 px-4">
                                    <div className="flex justify-center">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                                                submission.status
                                            )}`}
                                        >
                                            {getStatusLabel(submission.status)}
                                        </span>
                                    </div>
                                </td>

                                {/* Aksi */}
                                <td className="py-4 px-4">
                                    <div className="flex justify-center gap-2">
                                        {submission.status === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => onApprove(submission.id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                                                    title="Setujui"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => onReject(submission.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                                                    title="Tolak"
                                                >
                                                    ✕
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-gray-500 text-sm">-</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
