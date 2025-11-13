import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function GuruDashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard Guru" />

            <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-green-900 mb-4">Dashboard Guru</h1>
                        <p className="text-green-600">Dashboard untuk guru akan segera hadir</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
