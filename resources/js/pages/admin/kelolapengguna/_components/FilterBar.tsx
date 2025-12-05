import { RoleFilter, UserStats } from '../types';

interface FilterBarProps {
    selectedRole: RoleFilter;
    onRoleChange: (role: RoleFilter) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    userStats: UserStats;
}

export default function FilterBar({
    selectedRole,
    onRoleChange,
    searchQuery,
    onSearchChange,
    userStats,
}: FilterBarProps) {
    const handleRoleClick = (role: RoleFilter) => {
        onRoleChange(role);
    };

    return (
        <div className="mb-4 rounded-xl bg-white p-3 shadow-lg sm:mb-6 sm:rounded-2xl sm:p-4">
            <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <span className="text-xs font-medium text-gray-700 sm:text-sm">
                        Filter Role:
                    </span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        <button
                            onClick={() => handleRoleClick('all')}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:py-2 sm:text-sm lg:px-4 ${
                                selectedRole === 'all'
                                    ? 'bg-gray-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Semua ({userStats.total})
                        </button>
                        <button
                            onClick={() => handleRoleClick('siswa')}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:py-2 sm:text-sm lg:px-4 ${
                                selectedRole === 'siswa'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Siswa ({userStats.siswa})
                        </button>
                        <button
                            onClick={() => handleRoleClick('orangtua')}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:py-2 sm:text-sm lg:px-4 ${
                                selectedRole === 'orangtua'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Orang Tua ({userStats.orangtua})
                        </button>
                        <button
                            onClick={() => handleRoleClick('guru')}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:py-2 sm:text-sm lg:px-4 ${
                                selectedRole === 'guru'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Guru ({userStats.guru})
                        </button>
                        <button
                            onClick={() => handleRoleClick('admin')}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:py-2 sm:text-sm lg:px-4 ${
                                selectedRole === 'admin'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Admin ({userStats.admin})
                        </button>
                    </div>
                </div>

                {/* Search Box */}
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Cari nama atau email..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-9 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:pl-10"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute top-2.5 left-3 h-4 w-4 text-gray-400 sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
