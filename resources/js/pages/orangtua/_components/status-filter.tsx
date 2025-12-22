import { FilterStatus } from '../types/types';

interface StatusFilterProps {
    filterStatus: FilterStatus;
    onFilterChange: (status: FilterStatus) => void;
}

export default function StatusFilter({ filterStatus, onFilterChange }: StatusFilterProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <button
                    onClick={() => onFilterChange('all')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        filterStatus === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Semua
                </button>
                <button
                    onClick={() => onFilterChange('pending')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        filterStatus === 'pending'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Menunggu
                </button>
                <button
                    onClick={() => onFilterChange('approved')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        filterStatus === 'approved'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Disetujui
                </button>
                <button
                    onClick={() => onFilterChange('rejected')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        filterStatus === 'rejected'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Ditolak
                </button>
            </div>
        </div>
    );
}
