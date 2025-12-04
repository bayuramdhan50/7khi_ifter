interface DashboardHeaderProps {
    userName: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-blue-900">Approval Kegiatan</h1>
                <p className="text-blue-600">Selamat datang, {userName}</p>
            </div>
        </div>
    );
}
