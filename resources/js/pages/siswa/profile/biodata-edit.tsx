import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Biodata {
    hobbies?: string[];
    aspirations?: string[];
    favorite_foods?: string[];
    favorite_drinks?: string[];
    favorite_animals?: string[];
    disliked_items?: string[];
}

interface BiodataEditProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    biodata?: Biodata;
}

export default function BiodataEdit({ auth, biodata }: BiodataEditProps) {
    const [formData, setFormData] = useState({
        hobi: biodata?.hobbies?.join(', ') || '',
        cita_cita: biodata?.aspirations?.join(', ') || '',
        makanan_kesukaan: biodata?.favorite_foods?.join(', ') || '',
        minuman_kesukaan: biodata?.favorite_drinks?.join(', ') || '',
        hewan_kesukaan: biodata?.favorite_animals?.join(', ') || '',
        tidak_disukai: biodata?.disliked_items?.join(', ') || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error untuk field ini saat user mulai mengetik
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        // Optional: Validasi minimal character jika ingin
        // Contoh: setiap field harus minimal 3 karakter jika diisi
        Object.keys(formData).forEach((key) => {
            const value = formData[key as keyof typeof formData].trim();
            if (value && value.length < 3) {
                newErrors[key] = 'Minimal 3 karakter jika diisi';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

        const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
            router.post('/siswa/biodata/update', formData, {
                onSuccess: () => {
                    setIsSubmitting(false);
                    window.alert('Biodata berhasil di edit');
                    router.visit('/siswa/biodata');
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    setErrors(errors);
                }
            });
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
                                <Button variant="outline" className="border-gray-600 text-gray-600 hover:bg-gray-100" disabled={isSubmitting}>
                                    ← Kembali
                                </Button>
                            </Link>
                            <Button
                                onClick={handleSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>

                        {/* General Error Message */}
                        {errors.submit && (
                            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                                {errors.submit}
                            </div>
                        )}

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
                                        className={`w-full bg-white rounded-lg p-3 min-h-[80px] border-2 text-black ${
                                            errors.hobi ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none`}
                                        placeholder="Tulis hobi kamu di sini..."
                                    />
                                    {errors.hobi && <p className="text-red-500 text-sm mt-1">{errors.hobi}</p>}
                                </div>

                                {/* Cita-cita */}
                                <div>
                                    <label className="font-bold text-gray-800 block mb-2">Cita-citaku:</label>
                                    <textarea
                                        name="cita_cita"
                                        value={formData.cita_cita}
                                        onChange={handleChange}
                                        className={`w-full bg-white rounded-lg p-3 min-h-[80px] border-2 text-black ${
                                            errors.cita_cita ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none`}
                                        placeholder="Tulis cita-cita kamu di sini..."
                                    />
                                    {errors.cita_cita && <p className="text-red-500 text-sm mt-1">{errors.cita_cita}</p>}
                                </div>

                                {/* Makanan Kesukaan */}
                                <div>
                                    <label className="font-bold text-gray-800 block mb-2">Makanan kesukaanku:</label>
                                    <textarea
                                        name="makanan_kesukaan"
                                        value={formData.makanan_kesukaan}
                                        onChange={handleChange}
                                        className={`w-full bg-white rounded-lg p-3 min-h-[80px] border-2 text-black ${
                                            errors.makanan_kesukaan ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none`}
                                        placeholder="Tulis makanan kesukaan kamu di sini..."
                                    />
                                    {errors.makanan_kesukaan && <p className="text-red-500 text-sm mt-1">{errors.makanan_kesukaan}</p>}
                                </div>

                                {/* Minuman Kesukaan */}
                                <div>
                                    <label className="font-bold text-gray-800 block mb-2">Minuman kesukaanku:</label>
                                    <textarea
                                        name="minuman_kesukaan"
                                        value={formData.minuman_kesukaan}
                                        onChange={handleChange}
                                        className={`w-full bg-white rounded-lg p-3 min-h-[80px] border-2 text-black ${
                                            errors.minuman_kesukaan ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none`}
                                        placeholder="Tulis minuman kesukaan kamu di sini..."
                                    />
                                    {errors.minuman_kesukaan && <p className="text-red-500 text-sm mt-1">{errors.minuman_kesukaan}</p>}
                                </div>

                                {/* Hewan Kesukaan */}
                                <div>
                                    <label className="font-bold text-gray-800 block mb-2">Hewan kesukaanku:</label>
                                    <textarea
                                        name="hewan_kesukaan"
                                        value={formData.hewan_kesukaan}
                                        onChange={handleChange}
                                        className={`w-full bg-white rounded-lg p-3 min-h-[80px] border-2 text-black ${
                                            errors.hewan_kesukaan ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none`}
                                        placeholder="Tulis hewan kesukaan kamu di sini..."
                                    />
                                    {errors.hewan_kesukaan && <p className="text-red-500 text-sm mt-1">{errors.hewan_kesukaan}</p>}
                                </div>

                                {/* Sesuatu yang tidak aku sukai */}
                                <div>
                                    <label className="font-bold text-gray-800 block mb-2">Sesuatu yang tidak aku sukai:</label>
                                    <textarea
                                        name="tidak_disukai"
                                        value={formData.tidak_disukai}
                                        onChange={handleChange}
                                        className={`w-full bg-white rounded-lg p-3 min-h-[80px] border-2 text-black ${
                                            errors.tidak_disukai ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none`}
                                        placeholder="Tulis sesuatu yang tidak kamu sukai di sini..."
                                    />
                                    {errors.tidak_disukai && <p className="text-red-500 text-sm mt-1">{errors.tidak_disukai}</p>}
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
