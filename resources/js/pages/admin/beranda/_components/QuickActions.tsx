import { GraduationCap, School, UserCheck, Users } from 'lucide-react';
import QuickActionCard from './QuickActionCard';

export default function QuickActions() {
    const actions = [
        {
            href: '/admin/kelas',
            icon: School,
            title: 'Kelola Kelas',
            description: 'Lihat daftar kelas',
            colorScheme: 'blue' as const,
        },
        {
            href: '/admin/siswa-dashboard',
            icon: Users,
            title: 'Kelola Siswa',
            description: 'Manajemen data siswa',
            colorScheme: 'blue' as const,
        },
        {
            href: '/admin/guru-dashboard',
            icon: GraduationCap,
            title: 'Kelola Guru',
            description: 'Manajemen data guru',
            colorScheme: 'green' as const,
        },
        {
            href: '/admin/orangtua-dashboard',
            icon: UserCheck,
            title: 'Kelola Orang Tua',
            description: 'Manajemen data orang tua',
            colorScheme: 'orange' as const,
        },
        {
            href: '/admin/users',
            icon: Users,
            title: 'Kelola Pengguna',
            description: 'Manajemen semua pengguna',
            colorScheme: 'purple' as const,
        },
    ];

    return (
        <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Aksi Cepat</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {actions.map((action, index) => (
                    <QuickActionCard key={index} {...action} />
                ))}
            </div>
        </div>
    );
}
