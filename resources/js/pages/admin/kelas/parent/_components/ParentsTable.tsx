import { Edit, Trash2 } from 'lucide-react';
import { Parent } from '../types';

interface ParentsTableProps {
    parents: Parent[];
    onEdit: (parent: Parent) => void;
    onDelete: (parent: Parent) => void;
}

export default function ParentsTable({
    parents,
    onEdit,
    onDelete,
}: ParentsTableProps) {
    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-lg sm:rounded-2xl">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                    <thead>
                        <tr className="border-b-2 border-gray-300 bg-gray-100">
                            <th className="px-3 py-3 text-center text-xs font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-sm lg:px-6">
                                NO
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-sm lg:px-6">
                                Nama Orang Tua
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-sm lg:px-6">
                                Nama Murid
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-sm lg:px-6">
                                Kelas Murid
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-bold text-gray-900 sm:px-4 sm:py-4 sm:text-sm lg:px-6">
                                AKSI
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {parents.map((parent, index) => (
                            <tr
                                key={parent.id}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td className="px-3 py-3 text-center sm:px-4 sm:py-4 lg:px-6">
                                    <span className="text-xs font-semibold text-gray-900 sm:text-sm">
                                        {index + 1}.
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-center sm:px-4 sm:py-4 lg:px-6">
                                    <span className="text-xs font-bold text-gray-900 sm:text-sm">
                                        {parent.parentName}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-center sm:px-4 sm:py-4 lg:px-6">
                                    <span className="text-xs font-bold text-gray-900 sm:text-sm">
                                        {parent.studentName}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-center sm:px-4 sm:py-4 lg:px-6">
                                    <span className="text-xs font-bold text-gray-900 sm:text-sm">
                                        {parent.studentClass}
                                    </span>
                                </td>
                                <td className="px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
                                    <div className="flex justify-center gap-1 sm:gap-2">
                                        <button
                                            onClick={() => onEdit(parent)}
                                            className="rounded-lg bg-gray-800 p-1.5 text-white transition-colors hover:bg-gray-900 sm:p-2"
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(parent)}
                                            className="rounded-lg bg-gray-800 p-1.5 text-white transition-colors hover:bg-gray-900 sm:p-2"
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
            {parents.length === 0 && (
                <div className="p-8 text-center">
                    <p className="font-medium text-gray-600">
                        Tidak ada orang tua yang ditemukan
                    </p>
                </div>
            )}
        </div>
    );
}
