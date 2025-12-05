import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Users, GraduationCap, UserCheck, School } from 'lucide-react';

interface DashboardStats {
    totalSiswa: number;
    totalGuru: number;
    totalOrangtua: number;
    totalKelas: number;
}

interface AdminDashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    stats: DashboardStats;
}

export default function AdminDashboard({ auth, stats }: AdminDashboardProps) {
    const dashboardCards = [
        {
            title: 'Total Siswa',
            value: stats.totalSiswa,
            icon: Users,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
        },
        {
            title: 'Total Guru',
            value: stats.totalGuru,
            icon: GraduationCap,
            color: 'bg-green-500',
            textColor: 'text-green-600',
        },
        {
            title: 'Total Orang Tua',
            value: stats.totalOrangtua,
            icon: UserCheck,
            color: 'bg-orange-500',
            textColor: 'text-orange-600',
        },
        {
            title: 'Total Kelas',
            value: stats.totalKelas,
            icon: School,
            color: 'bg-purple-500',
            textColor: 'text-purple-600',
        },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard Admin" />

            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                            Dashboard Admin
                        </h1>
                        <p className="text-gray-600">
                            Selamat datang, {auth.user.name}
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        {dashboardCards.map((card, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            {card.title}
                                        </p>
                                        <p className={`text-3xl font-bold ${card.textColor}`}>
                                            {card.value}
                                        </p>
                                    </div>
                                    <div className={`${card.color} p-3 rounded-lg`}>
                                        <card.icon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Aksi Cepat
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <a
                                href="/admin/kelas"
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200">
                                        <School className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Kelola Kelas</p>
                                        <p className="text-sm text-gray-600">Lihat daftar kelas</p>
                                    </div>
                                </div>
                            </a>
                            <a
                                href="/admin/siswa-dashboard"
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Kelola Siswa</p>
                                        <p className="text-sm text-gray-600">Manajemen data siswa</p>
                                    </div>
                                </div>
                            </a>
                            <a
                                href="/admin/guru-dashboard"
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200">
                                        <GraduationCap className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Kelola Guru</p>
                                        <p className="text-sm text-gray-600">Manajemen data guru</p>
                                    </div>
                                </div>
                            </a>
                            <a
                                href="/admin/orangtua-dashboard"
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200">
                                        <UserCheck className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Kelola Orang Tua</p>
                                        <p className="text-sm text-gray-600">Manajemen data orang tua</p>
                                    </div>
                                </div>
                            </a>
                            <a
                                href="/admin/users"
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Kelola Pengguna</p>
                                        <p className="text-sm text-gray-600">Manajemen semua pengguna</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
