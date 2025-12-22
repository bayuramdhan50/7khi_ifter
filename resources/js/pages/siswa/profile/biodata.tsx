import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Pencil, Heart, Star, Utensils, Coffee, Cat, ThumbsDown } from 'lucide-react';

interface Biodata {
    hobbies?: string[];
    aspirations?: string[];
    favorite_foods?: string[];
    favorite_drinks?: string[];
    favorite_animals?: string[];
    disliked_items?: string[];
}

interface BiodataProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    biodata?: Biodata;
}

export default function Biodata({ auth, biodata }: BiodataProps) {
    const getInitials = useInitials();

    const renderDataContent = (items?: string[]) => {
        if (!items || items.length === 0) {
            return <span className="text-gray-400 italic">Belum diisi</span>;
        }
        return <span className="text-gray-700">{items.join(', ')}</span>;
    };

    const biodataItems = [
        { label: 'Hobi', data: biodata?.hobbies, icon: Heart, iconBg: 'bg-pink-100', iconColor: 'text-pink-500' },
        { label: 'Cita-cita', data: biodata?.aspirations, icon: Star, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-500' },
        { label: 'Makanan Kesukaan', data: biodata?.favorite_foods, icon: Utensils, iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
        { label: 'Minuman Kesukaan', data: biodata?.favorite_drinks, icon: Coffee, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
        { label: 'Hewan Kesukaan', data: biodata?.favorite_animals, icon: Cat, iconBg: 'bg-green-100', iconColor: 'text-green-500' },
        { label: 'Yang Tidak Disukai', data: biodata?.disliked_items, icon: ThumbsDown, iconBg: 'bg-red-100', iconColor: 'text-red-500' },
    ];

    return (
        <AppLayout>
            <Head title="Biodata Siswa" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 sm:py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        {/* Page Title */}
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Biodata Siswa</h1>

                        {/* Profile Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
                            {/* Mobile: Stack layout */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                                <div className="sm:ml-auto">
                                    <Link href="/siswa/biodata/edit" className="block">
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm w-full sm:w-auto cursor-pointer">
                                            <Pencil className="w-4 h-4 mr-1.5" />
                                            Edit Biodata
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Biodata Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600">
                                <h3 className="font-semibold text-white text-sm sm:text-base">Informasi Biodata</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {biodataItems.map((item, index) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <div key={index} className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className={`${item.iconBg} p-2 rounded-lg flex-shrink-0`}>
                                                    <IconComponent className={`w-4 h-4 ${item.iconColor}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1">
                                                        {item.label}
                                                    </div>
                                                    <div className="text-sm break-words">
                                                        {renderDataContent(item.data)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
