import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    email: string;
    religion: string;
    gender: string;
    nis: string;
    birth_date: string;
    address: string;
    photo?: string;
}

interface Biodata {
    hobbies: string[];
    aspirations: string[];
    favorite_foods: string[];
    disliked_foods: string[];
    favorite_animals: string[];
    disliked_items: string[];
}

interface StudentBiodataProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    student: Student;
    biodata?: Biodata;
}

export default function StudentBiodata({ auth, student, biodata }: StudentBiodataProps) {
    return (
        <AppLayout>
            <Head title={`Biodata ${student.name}`} />

            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-4 md:py-8">
                    {/* Header */}
                    <div className="mb-4 md:mb-8">
                        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg md:text-xl">J</span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold text-blue-700">Jurnal Harian</h1>
                        </div>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mb-4">
                            <Link href="/guru/dashboard" className="hover:text-blue-600 truncate">
                                Dashboard
                            </Link>
                            <span>/</span>
                            <Link href={`/guru/siswa/${student.id}/activities`} className="hover:text-blue-600 truncate">
                                Siswa {student.name}
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium truncate">Biodata Murid</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
                        {/* Left Side - Biodata */}
                        {/* Left Side - Biodata */}
                        <div className="flex-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-8">
                                {/* Student Photo and Name */}
                                <div className="flex flex-col items-center mb-8">
                                    <div className="w-32 h-40 md:w-40 md:h-48 mb-4 overflow-hidden rounded-lg border-4 border-red-600">
                                        <img
                                            src={student.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&size=200&background=dc2626&color=fff&bold=true`}
                                            alt={student.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-blue-600">{student.name}</h2>
                                </div>

                                {/* Student Personal Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-blue-50 rounded-lg p-4 md:p-6">
                                    {/* Email */}
                                    <div>
                                        <p className="text-xs md:text-sm font-medium text-gray-600">Email</p>
                                        <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                                            {student.email && student.email !== '-' ? student.email : <span className="text-gray-400 italic">Data belum diisi</span>}
                                        </p>
                                    </div>

                                    {/* Agama */}
                                    <div>
                                        <p className="text-xs md:text-sm font-medium text-gray-600">Agama</p>
                                        <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                                            {student.religion && student.religion !== '-' ? student.religion : <span className="text-gray-400 italic">Data belum diisi</span>}
                                        </p>
                                    </div>

                                    {/* NIS */}
                                    <div>
                                        <p className="text-xs md:text-sm font-medium text-gray-600">NIS</p>
                                        <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                                            {student.nis && student.nis !== '-' ? student.nis : <span className="text-gray-400 italic">Data belum diisi</span>}
                                        </p>
                                    </div>

                                    {/* Jenis Kelamin */}
                                    <div>
                                        <p className="text-xs md:text-sm font-medium text-gray-600">Jenis Kelamin</p>
                                        <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                                            {student.gender && student.gender !== '-' ? (student.gender === 'L' ? 'Laki-laki' : 'Perempuan') : <span className="text-gray-400 italic">Data belum diisi</span>}
                                        </p>
                                    </div>

                                    {/* Tanggal Lahir */}
                                    <div>
                                        <p className="text-xs md:text-sm font-medium text-gray-600">Tanggal Lahir</p>
                                        <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                                            {student.birth_date && student.birth_date !== '-' ? student.birth_date : <span className="text-gray-400 italic">Data belum diisi</span>}
                                        </p>
                                    </div>

                                    {/* Alamat */}
                                    <div>
                                        <p className="text-xs md:text-sm font-medium text-gray-600">Alamat</p>
                                        <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                                            {student.address && student.address !== '-' ? student.address : <span className="text-gray-400 italic">Data belum diisi</span>}
                                        </p>
                                    </div>
                                </div>

                                {/* Biodata Content - Preferensi & Kesukaaan */}
                                <div className="mb-6">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Preferensi & Kesukaaan</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Left Column */}
                                        <div className="space-y-6">
                                            {/* Hobi */}
                                            <div className="bg-gray-100 rounded-lg p-4">
                                                <h3 className="font-bold text-gray-900 mb-3">Hobi :</h3>
                                                <div className="space-y-2 text-sm text-gray-700">
                                                    {biodata?.hobbies && biodata.hobbies.length > 0 ? (
                                                        biodata.hobbies.map((hobby, index) => (
                                                            <div key={index}>• {hobby}</div>
                                                        ))
                                                    ) : (
                                                        <div className="text-gray-400 italic">Belum diisi</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Cita-cita */}
                                            <div className="bg-gray-100 rounded-lg p-4">
                                                <h3 className="font-bold text-gray-900 mb-3">Cita-cita :</h3>
                                                <div className="space-y-2 text-sm text-gray-700">
                                                    {biodata?.aspirations && biodata.aspirations.length > 0 ? (
                                                        biodata.aspirations.map((aspiration, index) => (
                                                            <div key={index}>• {aspiration}</div>
                                                        ))
                                                    ) : (
                                                        <div className="text-gray-400 italic">Belum diisi</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Makanan kesukaan */}
                                            <div className="bg-gray-100 rounded-lg p-4">
                                                <h3 className="font-bold text-gray-900 mb-3">Makanan kesukaan :</h3>
                                                <div className="space-y-2 text-sm text-gray-700">
                                                    {biodata?.favorite_foods && biodata.favorite_foods.length > 0 ? (
                                                        biodata.favorite_foods.map((food, index) => (
                                                            <div key={index}>• {food}</div>
                                                        ))
                                                    ) : (
                                                        <div className="text-gray-400 italic">Belum diisi</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-6">
                                            {/* Minuman kesukaan */}
                                            <div className="bg-gray-100 rounded-lg p-4">
                                                <h3 className="font-bold text-gray-900 mb-3">Minuman kesukaan :</h3>
                                                <div className="space-y-2 text-sm text-gray-700">
                                                    {biodata?.favorite_drinks && biodata.favorite_drinks.length > 0 ? (
                                                        biodata.favorite_drinks.map((drink, index) => (
                                                            <div key={index}>• {drink}</div>
                                                        ))
                                                    ) : (
                                                        <div className="text-gray-400 italic">Belum diisi</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Hewan kesukaan */}
                                            <div className="bg-gray-100 rounded-lg p-4">
                                                <h3 className="font-bold text-gray-900 mb-3">Hewan kesukaan :</h3>
                                                <div className="space-y-2 text-sm text-gray-700">
                                                    {biodata?.favorite_animals && biodata.favorite_animals.length > 0 ? (
                                                        biodata.favorite_animals.map((animal, index) => (
                                                            <div key={index}>• {animal}</div>
                                                        ))
                                                    ) : (
                                                        <div className="text-gray-400 italic">Belum diisi</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Sesuatu yang tidak aku suka */}
                                            <div className="bg-gray-100 rounded-lg p-4">
                                                <h3 className="font-bold text-gray-900 mb-3">Sesuatu yang tidak aku suka :</h3>
                                                <div className="space-y-2 text-sm text-gray-700">
                                                    {biodata?.disliked_items && biodata.disliked_items.length > 0 ? (
                                                        biodata.disliked_items.map((item, index) => (
                                                            <div key={index}>• {item}</div>
                                                        ))
                                                    ) : (
                                                        <div className="text-gray-400 italic">Belum diisi</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Back Button */}
                            <div className="mt-6">
                                <Link href={`/guru/siswa/${student.id}/activities`}>
                                    <button className="px-4 md:px-6 py-2 md:py-3 bg-gray-900 text-white rounded-lg font-medium text-sm md:text-base hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                                        <ArrowLeft className="w-4 h-4" />
                                        Kembali
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
