interface DashboardHeaderProps {
    userName: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Approval Kegiatan</h1>
            <p className="text-gray-500">Selamat datang, <span className="text-blue-600 font-medium">{userName}</span></p>
        </div>
    );
}
