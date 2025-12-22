import { X } from 'lucide-react';
import { useState } from 'react';

interface MonthSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (startDate: string, endDate: string) => void;
}

export default function MonthSelectionModal({
    isOpen,
    onClose,
    onConfirm,
}: MonthSelectionModalProps) {
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(
        currentDate.getMonth() + 1,
    ); // 1-12
    const [selectedYear, setSelectedYear] = useState(
        currentDate.getFullYear(),
    );

    if (!isOpen) return null;

    const handleConfirm = () => {
        // Format dates in YYYY-MM-DD format using local timezone
        const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;

        // Calculate last day of selected month
        const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
        const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

        onConfirm(startDate, endDate);
        onClose();
    };

    // Generate years (current year and 2 years back)
    const years = [];
    for (let i = 0; i < 3; i++) {
        years.push(currentDate.getFullYear() - i);
    }

    const months = [
        { value: 1, label: 'Januari' },
        { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' },
        { value: 4, label: 'April' },
        { value: 5, label: 'Mei' },
        { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' },
        { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' },
        { value: 12, label: 'Desember' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-bold text-gray-900">
                        Pilih Periode Export
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <p className="mb-4 text-sm text-gray-600">
                        Pilih bulan dan tahun untuk data aktivitas yang akan
                        di-export
                    </p>

                    <div className="space-y-4">
                        {/* Month Selection */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Bulan
                            </label>
                            <select
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(Number(e.target.value))
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {months.map((month) => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Year Selection */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Tahun
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) =>
                                    setSelectedYear(Number(e.target.value))
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                    >
                        Export
                    </button>
                </div>
            </div>
        </div>
    );
}
