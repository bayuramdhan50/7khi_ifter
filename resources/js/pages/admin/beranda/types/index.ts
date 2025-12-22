export interface DashboardStats {
    totalSiswa: number;
    totalGuru: number;
    totalOrangtua: number;
    totalKelas: number;
}

export interface AdminDashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    stats: DashboardStats;
}

export interface DashboardCard {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    textColor: string;
}
