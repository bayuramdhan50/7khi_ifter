import { useState } from 'react';
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { SortColumn, SortOrder, User } from '../types';
import { SortIcon, getRoleBadgeColor, getRoleLabel } from './utils';

interface UsersTableProps {
    users: User[];
    sortBy: SortColumn;
    sortOrder: SortOrder;
    onSort: (column: SortColumn) => void;
    searchQuery: string;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    currentUserId: number;
}

export default function UsersTable({
    users,
    sortBy,
    sortOrder,
    onSort,
    searchQuery,
    onEdit,
    onDelete,
    currentUserId,
}: UsersTableProps) {
    const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());

    const togglePasswordVisibility = (userId: number) => {
        setVisiblePasswords(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    };

    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-lg sm:rounded-2xl">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                    <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                            <th
                                className="cursor-pointer px-2 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-100 sm:px-4 sm:py-4 sm:text-sm"
                                onClick={() => onSort('id')}
                            >
                                No{' '}
                                <SortIcon
                                    column="id"
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                />
                            </th>
                            <th
                                className="cursor-pointer px-2 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-100 sm:px-4 sm:py-4 sm:text-sm"
                                onClick={() => onSort('name')}
                            >
                                Nama{' '}
                                <SortIcon
                                    column="name"
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                />
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 sm:px-4 sm:py-4 sm:text-sm">
                                Username
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 sm:px-4 sm:py-4 sm:text-sm">
                                Password
                            </th>
                            <th
                                className="cursor-pointer px-2 py-3 text-center text-xs font-bold text-gray-700 hover:bg-gray-100 sm:px-4 sm:py-4 sm:text-sm"
                                onClick={() => onSort('role')}
                            >
                                Role{' '}
                                <SortIcon
                                    column="role"
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                />
                            </th>
                            <th
                                className="cursor-pointer px-2 py-3 text-center text-xs font-bold text-gray-700 hover:bg-gray-100 sm:px-4 sm:py-4 sm:text-sm"
                                onClick={() => onSort('createdAt')}
                            >
                                Tanggal Dibuat{' '}
                                <SortIcon
                                    column="createdAt"
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                />
                            </th>
                            <th className="px-2 py-3 text-center text-xs font-bold text-gray-700 sm:px-4 sm:py-4 sm:text-sm">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr
                                key={user.id}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td className="px-2 py-3 sm:px-4 sm:py-4">
                                    <span className="text-xs font-medium text-gray-900 sm:text-sm">
                                        {index + 1}
                                    </span>
                                </td>
                                <td className="px-2 py-3 sm:px-4 sm:py-4">
                                    <span className="text-xs font-medium text-gray-900 sm:text-sm">
                                        {user.name}
                                    </span>
                                </td>
                                <td className="px-2 py-3 sm:px-4 sm:py-4">
                                    <span className="text-xs font-medium text-gray-600 sm:text-sm">
                                        {user.username || '-'}
                                    </span>
                                </td>
                                <td className="px-2 py-3 sm:px-4 sm:py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-600 sm:text-sm font-mono">
                                            {visiblePasswords.has(user.id)
                                                ? (user.password || '-')
                                                : '••••••••'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility(user.id)}
                                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                            title={visiblePasswords.has(user.id) ? 'Sembunyikan password' : 'Tampilkan password'}
                                        >
                                            {visiblePasswords.has(user.id) ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-2 py-3 sm:px-4 sm:py-4">
                                    <div className="flex justify-center">
                                        <span
                                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold sm:px-3 sm:py-1 ${getRoleBadgeColor(user.role)}`}
                                        >
                                            {getRoleLabel(user.role)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-2 py-3 text-center sm:px-4 sm:py-4">
                                    <span className="text-xs text-gray-600 sm:text-sm">
                                        {new Date(
                                            user.createdAt,
                                        ).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </td>
                                <td className="px-2 py-3 sm:px-4 sm:py-4">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(user)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        {user.id !== currentUserId && (
                                            <button
                                                type="button"
                                                onClick={() => onDelete(user)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* No Results Message */}
            {users.length === 0 && (
                <div className="p-8 text-center">
                    <p className="font-medium text-gray-600">
                        {searchQuery
                            ? `Tidak ada hasil untuk "${searchQuery}"`
                            : 'Tidak ada data untuk ditampilkan'}
                    </p>
                </div>
            )}
        </div>
    );
}
