import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/toast';
import { useInitials } from '@/hooks/use-initials';
import { useState } from 'react';
import { Heart, Star, Utensils, Coffee, Cat, ThumbsDown } from 'lucide-react';

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
    const { showSuccess } = useToast();
    const getInitials = useInitials();
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        Object.keys(formData).forEach((key) => {
            const value = formData[key as keyof typeof formData].trim();
            if (value && value.length < 3) {
                newErrors[key] = 'Minimal 3 karakter';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        router.post('/siswa/biodata/update', formData, {
            onSuccess: () => {
                setIsSubmitting(false);
                showSuccess('Biodata berhasil disimpan');
                router.visit('/siswa/biodata');
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setErrors(errors);
            }
        });
    };

    const formFields = [
        { name: 'hobi', label: 'Hobi', icon: Heart, iconBg: 'bg-pink-100', iconColor: 'text-pink-500' },
        { name: 'cita_cita', label: 'Cita-cita', icon: Star, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-500' },
        { name: 'makanan_kesukaan', label: 'Makanan Kesukaan', icon: Utensils, iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
        { name: 'minuman_kesukaan', label: 'Minuman Kesukaan', icon: Coffee, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
        { name: 'hewan_kesukaan', label: 'Hewan Kesukaan', icon: Cat, iconBg: 'bg-green-100', iconColor: 'text-green-500' },
        { name: 'tidak_disukai', label: 'Yang Tidak Disukai', icon: ThumbsDown, iconBg: 'bg-red-100', iconColor: 'text-red-500' },
    ];

    return (
        <AppLayout>
            <Head title="Edit Biodata" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 sm:py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        {/* Page Title */}
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Edit Biodata</h1>

                        {/* Profile Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
                            {/* Mobile: Stack layout */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <Avatar className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md flex-shrink-0">
                                        <AvatarFallback className="w-full h-full flex items-center justify-center text-white text-lg sm:text-xl font-semibold bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{auth.user.name}</h2>
                                        <p className="text-sm text-gray-500">Siswa</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href="/siswa/biodata" className="flex-1 sm:flex-none">
                                        <Button variant="outline" size="sm" disabled={isSubmitting} className="w-full sm:w-auto cursor-pointer">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button
                                        size="sm"
                                        onClick={handleSubmit}
                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex-1 sm:flex-none cursor-pointer"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {errors.submit && (
                            <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {errors.submit}
                            </div>
                        )}

                        {/* Form Card */}
                        <form onSubmit={handleSubmit}>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600">
                                    <h3 className="font-semibold text-white text-sm sm:text-base">Informasi Biodata</h3>
                                    <p className="text-xs sm:text-sm text-blue-100 mt-0.5">Pisahkan dengan koma jika lebih dari satu</p>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {formFields.map((field) => {
                                        const IconComponent = field.icon;
                                        const fieldName = field.name as keyof typeof formData;
                                        return (
                                            <div key={field.name} className="px-4 sm:px-6 py-3 sm:py-4">
                                                <div className="flex items-start gap-3">
                                                    <div className={`${field.iconBg} p-2 rounded-lg flex-shrink-0 mt-0.5`}>
                                                        <IconComponent className={`w-4 h-4 ${field.iconColor}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1.5">
                                                            {field.label}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name={field.name}
                                                            value={formData[fieldName]}
                                                            onChange={handleChange}
                                                            className={`w-full px-3 py-2 text-sm text-gray-900 bg-white border rounded-lg ${errors[field.name]
                                                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                                : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                                                                } focus:outline-none focus:ring-1 transition-colors`}
                                                            placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                                                        />
                                                        {errors[field.name] && (
                                                            <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
