import { UserStats } from '../types';

interface StatsCardsProps {
    userStats: UserStats;
}

export default function StatsCards({ userStats }: StatsCardsProps) {
    return (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-6">
            {/* Total Users */}
            <div className="rounded-xl border-l-4 border-gray-500 bg-white p-3 shadow-lg sm:rounded-2xl sm:p-4 lg:p-6">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <p className="mb-0.5 text-xs font-medium text-gray-600 sm:mb-1 sm:text-sm">
                            Total User
                        </p>
                        <p className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                            {userStats.total}
                        </p>
                    </div>
                    <div className="self-end rounded-full bg-gray-100 p-2 sm:self-auto sm:p-2.5 lg:p-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-600 sm:h-6 sm:w-6 lg:h-8 lg:w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Siswa */}
            <div className="rounded-xl border-l-4 border-blue-500 bg-white p-3 shadow-lg sm:rounded-2xl sm:p-4 lg:p-6">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <p className="mb-0.5 text-xs font-medium text-gray-600 sm:mb-1 sm:text-sm">
                            Siswa
                        </p>
                        <p className="text-xl font-bold text-blue-600 sm:text-2xl lg:text-3xl">
                            {userStats.siswa}
                        </p>
                    </div>
                    <div className="self-end rounded-full bg-blue-100 p-2 sm:self-auto sm:p-2.5 lg:p-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6 lg:h-8 lg:w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 14l9-5-9-5-9 5 9 5z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Orangtua */}
            <div className="rounded-xl border-l-4 border-green-500 bg-white p-3 shadow-lg sm:rounded-2xl sm:p-4 lg:p-6">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <p className="mb-0.5 text-xs font-medium text-gray-600 sm:mb-1 sm:text-sm">
                            Orang Tua
                        </p>
                        <p className="text-xl font-bold text-green-600 sm:text-2xl lg:text-3xl">
                            {userStats.orangtua}
                        </p>
                    </div>
                    <div className="self-end rounded-full bg-green-100 p-2 sm:self-auto sm:p-2.5 lg:p-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-600 sm:h-6 sm:w-6 lg:h-8 lg:w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Guru */}
            <div className="rounded-xl border-l-4 border-purple-500 bg-white p-3 shadow-lg sm:rounded-2xl sm:p-4 lg:p-6">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <p className="mb-0.5 text-xs font-medium text-gray-600 sm:mb-1 sm:text-sm">
                            Guru
                        </p>
                        <p className="text-xl font-bold text-purple-600 sm:text-2xl lg:text-3xl">
                            {userStats.guru}
                        </p>
                    </div>
                    <div className="self-end rounded-full bg-purple-100 p-2 sm:self-auto sm:p-2.5 lg:p-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6 lg:h-8 lg:w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Admin */}
            <div className="rounded-xl border-l-4 border-red-500 bg-white p-3 shadow-lg sm:rounded-2xl sm:p-4 lg:p-6">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <p className="mb-0.5 text-xs font-medium text-gray-600 sm:mb-1 sm:text-sm">
                            Admin
                        </p>
                        <p className="text-xl font-bold text-red-600 sm:text-2xl lg:text-3xl">
                            {userStats.admin}
                        </p>
                    </div>
                    <div className="self-end rounded-full bg-red-100 p-2 sm:self-auto sm:p-2.5 lg:p-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-600 sm:h-6 sm:w-6 lg:h-8 lg:w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
