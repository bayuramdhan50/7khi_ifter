import { Edit, Trash2 } from 'lucide-react';
import { Teacher } from '../types';

interface TeachersTableProps {
    teachers: Teacher[];
    onEdit: (teacher: Teacher) => void;
    onDelete: (teacher: Teacher) => void;
}

export default function TeachersTable({
    teachers,
    onEdit,
    onDelete,
}: TeachersTableProps) {
    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-lg sm:rounded-2xl">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="border-b-2 border-gray-300 bg-gray-100">
                            <th className="px-3 py-3 text-center text-xs font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-sm">
                                NO
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-sm">
                                Nama Guru
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-sm">
                                NIP
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-sm">
                                Telepon
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-sm">
                                Kelas
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-sm">
                                Status
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-sm">
                                AKSI
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((teacher, index) => (
                            <tr
                                key={teacher.id}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td className="px-3 py-3 text-center sm:px-4 sm:py-4">
                                    <span className="text-xs font-semibold text-gray-900 sm:text-sm">
                                        {index + 1}.
                                    </span>
                                </td>
                                <td className="px-3 py-3 sm:px-4 sm:py-4">
                                    <span className="text-xs font-bold text-gray-900 sm:text-sm">
                                        {teacher.name}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-center sm:px-4 sm:py-4">
                                    <span className="text-xs text-gray-700 sm:text-sm">
                                        {teacher.nip}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-center sm:px-4 sm:py-4">
                                    <span className="text-xs text-gray-700 sm:text-sm">
                                        {teacher.phone}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-center sm:px-4 sm:py-4">
                                    <span className="inline-block rounded-lg bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 sm:px-3 sm:text-sm">
                                        {teacher.class_name}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-center sm:px-4 sm:py-4">
                                    <span
                                        className={`inline-block rounded-lg px-2 py-1 text-xs font-semibold sm:px-3 sm:text-sm ${teacher.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {teacher.is_active
                                            ? 'Aktif'
                                            : 'Tidak Aktif'}
                                    </span>
                                </td>
                                <td className="px-3 py-3 sm:px-4 sm:py-4">
                                    <div className="flex justify-center gap-1 sm:gap-2">
                                        <button
                                            onClick={() => onEdit(teacher)}
                                            className="rounded-lg bg-gray-800 p-1.5 text-white transition-colors hover:bg-gray-900 sm:p-2"
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(teacher)}
                                            className="rounded-lg bg-red-600 p-1.5 text-white transition-colors hover:bg-red-700 sm:p-2"
                                            title="Hapus"
                                        >
                                            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* No Results */}
            {teachers.length === 0 && (
                <div className="p-6 text-center sm:p-8">
                    <p className="text-sm font-medium text-gray-600 sm:text-base">
                        Tidak ada guru yang ditemukan
                    </p>
                </div>
            )}
        </div>
    );
}
