import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function AdminDashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard Admin" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard Admin</h1>
                        <p className="text-gray-600">Dashboard untuk admin akan segera hadir</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
