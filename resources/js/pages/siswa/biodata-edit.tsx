import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface BiodataEditProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function BiodataEdit({ auth }: BiodataEditProps) {
    const [formData, setFormData] = useState({
        hobi: '',
        cita_cita: '',
        makanan_kesukaan: '',
        minuman_kesukaan: '',
        hewan_kesukaan: '',
        tidak_disukai: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
    };

    return (
        <AppLayout>
            <Head title="Edit Biodata" />

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

                    {/* Form Content */}
                    <div className="max-w-3xl mx-auto">
                        {/* Action Buttons */}
                        <div className="mb-6 flex justify-between items-center">
                            <Link href="/siswa/biodata">
                                <Button variant="outline" className="border-gray-600 text-gray-600 hover:bg-gray-100">
                                    ← Kembali
                                </Button>
                            </Link>
                            <Button
                                onClick={handleSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Simpan
                            </Button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="bg-gray-200 rounded-lg p-8 shadow-lg">
                                <div className="space-y-6">
                                    {/* Hobi */}
                                    <div>
                                        <label className="font-bold text-gray-800 block mb-2">Hobiku:</label>
                                        <textarea
                                            name="hobi"
                                            value={formData.hobi}
                                            onChange={handleChange}
                                            className="w-full bg-white rounded-lg p-3 min-h-[80px] border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            placeholder="Tulis hobi kamu di sini..."
                                        />
                                    </div>

                                    {/* Cita-cita */}
                                    <div>
                                        <label className="font-bold text-gray-800 block mb-2">Cita-citaku:</label>
                                        <textarea
                                            name="cita_cita"
                                            value={formData.cita_cita}
                                            onChange={handleChange}
                                            className="w-full bg-white rounded-lg p-3 min-h-[80px] border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            placeholder="Tulis cita-cita kamu di sini..."
                                        />
                                    </div>

                                    {/* Makanan Kesukaan */}
                                    <div>
                                        <label className="font-bold text-gray-800 block mb-2">Makanan kesukaanku:</label>
                                        <textarea
                                            name="makanan_kesukaan"
                                            value={formData.makanan_kesukaan}
                                            onChange={handleChange}
                                            className="w-full bg-white rounded-lg p-3 min-h-[80px] border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            placeholder="Tulis makanan kesukaan kamu di sini..."
                                        />
                                    </div>

                                    {/* Minuman Kesukaan */}
                                    <div>
                                        <label className="font-bold text-gray-800 block mb-2">Minuman kesukaanku:</label>
                                        <textarea
                                            name="minuman_kesukaan"
                                            value={formData.minuman_kesukaan}
                                            onChange={handleChange}
                                            className="w-full bg-white rounded-lg p-3 min-h-[80px] border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            placeholder="Tulis minuman kesukaan kamu di sini..."
                                        />
                                    </div>

                                    {/* Hewan Kesukaan */}
                                    <div>
                                        <label className="font-bold text-gray-800 block mb-2">Hewan kesukaanku:</label>
                                        <textarea
                                            name="hewan_kesukaan"
                                            value={formData.hewan_kesukaan}
                                            onChange={handleChange}
                                            className="w-full bg-white rounded-lg p-3 min-h-[80px] border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            placeholder="Tulis hewan kesukaan kamu di sini..."
                                        />
                                    </div>

                                    {/* Sesuatu yang tidak aku sukai */}
                                    <div>
                                        <label className="font-bold text-gray-800 block mb-2">Sesuatu yang tidak aku sukai:</label>
                                        <textarea
                                            name="tidak_disukai"
                                            value={formData.tidak_disukai}
                                            onChange={handleChange}
                                            className="w-full bg-white rounded-lg p-3 min-h-[80px] border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            placeholder="Tulis sesuatu yang tidak kamu sukai di sini..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
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
