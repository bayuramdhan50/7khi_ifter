import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { GraduationCap, School, UserCheck, Users } from 'lucide-react';
import QuickActions from './_components/QuickActions';
import StatCard from './_components/StatCard';
import { AdminDashboardProps, DashboardCard } from './types';

export default function AdminDashboard({ auth, stats }: AdminDashboardProps) {
    const dashboardCards: DashboardCard[] = [
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
                <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                            Dashboard Admin
                        </h1>
                        <p className="text-gray-600">
                            Selamat datang, {auth.user.name}
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                        {dashboardCards.map((card, index) => (
                            <StatCard key={index} card={card} />
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <QuickActions />
                </div>
            </div>
        </AppLayout>
    );
}
