import { SortColumn, SortOrder } from '../types';

interface SortIconProps {
    column: SortColumn;
    sortBy: SortColumn;
    sortOrder: SortOrder;
}

export function SortIcon({ column, sortBy, sortOrder }: SortIconProps) {
    if (sortBy !== column) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1 inline-block h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
            </svg>
        );
    }
    if (sortOrder === 'asc') {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1 inline-block h-4 w-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                />
            </svg>
        );
    }
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 inline-block h-4 w-4 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );
}

export function getRoleBadgeColor(role: string) {
    switch (role) {
        case 'siswa':
            return 'bg-blue-100 text-blue-800';
        case 'orangtua':
            return 'bg-green-100 text-green-800';
        case 'guru':
            return 'bg-purple-100 text-purple-800';
        case 'admin':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

export function getRoleLabel(role: string) {
    switch (role) {
        case 'siswa':
            return 'Siswa';
        case 'orangtua':
            return 'Orang Tua';
        case 'guru':
            return 'Guru';
        case 'admin':
            return 'Admin';
        default:
            return role;
    }
}
