import { Edit, Eye, Trash2 } from 'lucide-react';
import { Student } from '../types';

interface StudentsTableProps {
    students: Student[];
    onView: (student: Student) => void;
    onEdit: (student: Student) => void;
    onDelete: (student: Student) => void;
    onExport: () => void;
}

export default function StudentsTable({
    students,
    onView,
    onEdit,
    onDelete,
    onExport,
}: StudentsTableProps) {
    return (
        <div className="overflow-hidden rounded-lg bg-white shadow-lg sm:rounded-2xl">
            {/* Table Header with Export Button */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
                <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                    Data Siswa
                </h3>
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 sm:px-4 sm:py-2 sm:text-sm"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 sm:h-4 sm:w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Export Table
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-300 bg-gray-100">
                            <th className="px-2 py-2.5 text-center text-[11px] font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-xs lg:px-6 lg:text-sm">
                                NO
                            </th>
                            <th className="px-2 py-2.5 text-center text-[11px] font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-xs lg:px-6 lg:text-sm">
                                NAMA
                            </th>
                            <th className="hidden px-2 py-2.5 text-center text-[11px] font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-xs md:table-cell lg:px-6 lg:text-sm">
                                EMAIL
                            </th>
                            <th className="px-2 py-2.5 text-center text-[11px] font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-xs lg:px-6 lg:text-sm">
                                NIS
                            </th>
                            <th className="hidden px-2 py-2.5 text-center text-[11px] font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-xs lg:table-cell lg:px-6 lg:text-sm">
                                NISN
                            </th>
                            <th className="px-2 py-2.5 text-center text-[11px] font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-xs lg:px-6 lg:text-sm">
                                AGAMA
                            </th>
                            <th className="hidden px-2 py-2.5 text-center text-[11px] font-bold text-gray-900 sm:table-cell sm:px-4 sm:py-4 sm:text-xs lg:px-6 lg:text-sm">
                                JK
                            </th>
                            <th className="hidden px-2 py-2.5 text-center text-[11px] font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-xs lg:px-6 lg:text-sm xl:table-cell">
                                TGL LAHIR
                            </th>
                            <th className="px-2 py-2.5 text-center text-[11px] font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-xs lg:px-6 lg:text-sm">
                                AKSI
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr
                                key={student.id}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td className="px-2 py-2.5 text-center sm:px-4 sm:py-4 lg:px-6">
                                    <span className="text-[11px] font-semibold text-gray-900 sm:text-xs lg:text-sm">
                                        {index + 1}.
                                    </span>
                                </td>
                                <td className="px-2 py-2.5 text-center sm:px-4 sm:py-4 lg:px-6">
                                    <span className="text-[11px] font-bold text-gray-900 sm:text-xs lg:text-sm">
                                        {student.name}
                                    </span>
                                </td>
                                <td className="hidden px-2 py-2.5 text-center sm:px-4 sm:py-4 md:table-cell lg:px-6">
                                    <span className="text-[11px] text-gray-700 sm:text-xs lg:text-sm">
                                        {student.email || '-'}
                                    </span>
                                </td>
                                <td className="px-2 py-2.5 text-center sm:px-4 sm:py-4 lg:px-6">
                                    <span className="text-[11px] font-bold text-gray-900 sm:text-xs lg:text-sm">
                                        {student.nis || '-'}
                                    </span>
                                </td>
                                <td className="hidden px-2 py-2.5 text-center sm:px-4 sm:py-4 lg:table-cell lg:px-6">
                                    <span className="text-[11px] text-gray-700 sm:text-xs lg:text-sm">
                                        {student.nisn || '-'}
                                    </span>
                                </td>
                                <td className="px-2 py-2.5 text-center sm:px-4 sm:py-4 lg:px-6">
                                    <span className="text-[11px] font-bold text-gray-900 sm:text-xs lg:text-sm">
                                        {student.religion}
                                    </span>
                                </td>
                                <td className="hidden px-2 py-2.5 text-center sm:table-cell sm:px-4 sm:py-4 lg:px-6">
                                    <span className="text-[11px] font-bold text-gray-900 sm:text-xs lg:text-sm">
                                        {student.gender}
                                    </span>
                                </td>
                                <td className="hidden px-2 py-2.5 text-center sm:px-4 sm:py-4 lg:px-6 xl:table-cell">
                                    <span className="text-[11px] text-gray-700 sm:text-xs lg:text-sm">
                                        {student.date_of_birth || '-'}
                                    </span>
                                </td>
                                <td className="px-2 py-2.5 sm:px-4 sm:py-4 lg:px-6">
                                    <div className="flex justify-center gap-0.5 sm:gap-2">
                                        <button
                                            onClick={() => onView(student)}
                                            className="flex-shrink-0 rounded bg-gray-800 p-1 text-white transition-colors hover:bg-gray-900 sm:p-2"
                                            title="Lihat Detail"
                                        >
                                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(student)}
                                            className="flex-shrink-0 rounded bg-gray-800 p-1 text-white transition-colors hover:bg-gray-900 sm:p-2"
                                            title="Edit"
                                        >
                                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(student)}
                                            className="flex-shrink-0 rounded bg-red-600 p-1 text-white transition-colors hover:bg-red-700 sm:p-2"
                                            title="Hapus"
                                        >
                                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* No Results */}
            {students.length === 0 && (
                <div className="p-8 text-center">
                    <p className="font-medium text-gray-600">
                        Tidak ada siswa yang ditemukan
                    </p>
                </div>
            )}
        </div>
    );
}
