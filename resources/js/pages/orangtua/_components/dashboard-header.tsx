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
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    placeholder="Cari Aktivitas"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                />
            </div>
        </div>
    );
}
