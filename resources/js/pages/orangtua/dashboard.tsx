import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function OrangtuaDashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard Orangtua" />

            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-purple-900 mb-4">Dashboard Orangtua</h1>
                        <p className="text-purple-600">Dashboard untuk orangtua akan segera hadir</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
