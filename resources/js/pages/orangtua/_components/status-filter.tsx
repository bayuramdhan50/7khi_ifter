import { FilterStatus } from '../types/types';

interface StatusFilterProps {
    filterStatus: FilterStatus;
    onFilterChange: (status: FilterStatus) => void;
}

export default function StatusFilter({ filterStatus, onFilterChange }: StatusFilterProps) {
    const filters = [
        { key: 'all', label: 'Semua', activeColor: 'bg-blue-500 text-white shadow-blue-200' },
        { key: 'pending', label: 'Menunggu', activeColor: 'bg-yellow-500 text-white shadow-yellow-200' },
        { key: 'approved', label: 'Disetujui', activeColor: 'bg-green-500 text-white shadow-green-200' },
    ] as const;

    return (
        <div className="inline-flex items-center gap-1 bg-white rounded-xl shadow-sm p-1.5 border border-gray-100">
            {filters.map((filter) => (
                <button
                    key={filter.key}
                    onClick={() => onFilterChange(filter.key)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${filterStatus === filter.key
                            ? `${filter.activeColor} shadow-md`
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}
