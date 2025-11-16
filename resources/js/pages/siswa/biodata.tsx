import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface BiodataProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function Biodata({ auth }: BiodataProps) {
    return (
        <AppLayout>
            <Head title="Biodata Siswa" />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
                <div className="container mx-auto px-4">
                    {/* Profile Photo and Name */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="mb-6">
                            <img
                                src="/api/placeholder/200/250"
                                alt={auth.user.name}
                                className="w-48 h-60 object-cover rounded-lg border-4 border-red-600 shadow-lg"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-blue-900">{auth.user.name}</h1>
                    </div>

                    {/* Biodata Content */}
                    <div className="max-w-3xl mx-auto">
                        {/* Edit Button */}
                        <div className="mb-6 flex justify-end">
                            <Link href="/siswa/biodata/edit">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Edit Biodata
                                </Button>
                            </Link>
                        </div>

                        {/* Single Column */}
                        <div className="bg-gray-200 rounded-lg p-8 shadow-lg">
                            <div className="space-y-6">
                                {/* Hobi */}
                                <div>
                                    <label className="font-bold text-gray-800 block mb-2">Hobiku:</label>
                                    <div className="bg-white rounded-lg p-3 min-h-[60px]">
                                        {/* Empty for now */}
                                    </div>
                                </div>

                                {/* Cita-cita */}
                                <div>
                                    <label className="font-bold text-gray-800 block mb-2">Cita-citaku:</label>
                                    <div className="bg-white rounded-lg p-3 min-h-[60px]">
                                        {/* Empty for now */}
                                    </div>
                                </div>

                                {/* Makanan Kesukaan */}
                                <div>
                                    <label className="font-bold text-gray-800 block mb-2">Makanan kesukaanku:</label>
                                    <div className="bg-white rounded-lg p-3 min-h-[60px]">
                                        {/* Empty for now */}
                                    </div>
                                </div>

                                {/* Minuman Kesukaan */}
                                <div>
                                    <label className="font-bold text-gray-800 block mb-2">Minuman kesukaanku:</label>
                                    <div className="bg-white rounded-lg p-3 min-h-[60px]">
                                        {/* Empty for now */}
                                    </div>
                                </div>

                                {/* Hewan Kesukaan */}
                                <div>
                                    <label className="font-bold text-gray-800 block mb-2">Hewan kesukaanku:</label>
                                    <div className="bg-white rounded-lg p-3 min-h-[60px]">
                                        {/* Empty for now */}
                                    </div>
                                </div>

                                {/* Sesuatu yang tidak aku sukai */}
                                <div>
                                    <label className="font-bold text-gray-800 block mb-2">Sesuatu yang tidak aku sukai:</label>
                                    <div className="bg-white rounded-lg p-3 min-h-[60px]">
                                        {/* Empty for now */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-right text-sm text-gray-500 mt-8 max-w-3xl mx-auto">
                        Apr 1, 2025    9:41 AM
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
