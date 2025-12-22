import { SortColumn, SortOrder, User } from '../types';
import { SortIcon, getRoleBadgeColor, getRoleLabel } from './utils';

interface UsersTableProps {
    users: User[];
    sortBy: SortColumn;
    sortOrder: SortOrder;
    onSort: (column: SortColumn) => void;
    searchQuery: string;
}

export default function UsersTable({
    users,
    sortBy,
    sortOrder,
    onSort,
    searchQuery,
}: UsersTableProps) {
    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-lg sm:rounded-2xl">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                    <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                            <th className="px-2 py-3 text-left text-xs font-bold text-gray-700 sm:px-4 sm:py-4 sm:text-sm">
                                ID
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
                            <th
                                className="cursor-pointer px-2 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-100 sm:px-4 sm:py-4 sm:text-sm"
                                onClick={() => onSort('email')}
                            >
                                Email{' '}
                                <SortIcon
                                    column="email"
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                />
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
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td className="px-2 py-3 sm:px-4 sm:py-4">
                                    <span className="text-xs font-medium text-gray-900 sm:text-sm">
                                        {user.id}
                                    </span>
                                </td>
                                <td className="px-2 py-3 sm:px-4 sm:py-4">
                                    <span className="text-xs font-medium text-gray-900 sm:text-sm">
                                        {user.name}
                                    </span>
                                </td>
                                <td className="px-2 py-3 sm:px-4 sm:py-4">
                                    <span className="text-xs text-gray-600 sm:text-sm">
                                        {user.email}
                                    </span>
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
