import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface LaguProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function Lagu({ auth }: LaguProps) {
    return (
        <AppLayout>
            <Head title="Lagu Kebiasaan Anak Indonesia Hebat" />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Main Card */}
                        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-3xl shadow-2xl p-12 text-white relative overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute top-1/2 left-5 transform -translate-y-1/2">
                                <svg className="w-24 h-24 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-10 left-10">
                                <svg className="w-20 h-20 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Title */}
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">
                                        LAGU TUJUH KEBIASAAN ANAK INDONESIA HEBAT
                                    </h1>
                                    <p className="text-lg font-semibold">
                                        Cipt: Benny Hermanto
                                    </p>
                                </div>

                                {/* Lyrics */}
                                <div className="space-y-6 text-base leading-relaxed">
                                    {/* Verse 1 */}
                                    <div className="space-y-1">
                                        <p className="font-semibold">Aku anak Indonesia</p>
                                        <p>Punya tujuh kebiasaan luar biasa</p>
                                        <p>Wahai kawan ayo dengarkan</p>
                                        <p>Bersama sama marilah kita lakukan</p>
                                    </div>

                                    {/* Chorus 1 */}
                                    <div className="space-y-1">
                                        <p>Satu, bangun pagi segak ceria</p>
                                        <p>Dua, taat berbakti, rajin berdoa</p>
                                        <p>Tiga, berolah raga</p>
                                        <p>Empat, makan sehat bergizi</p>
                                        <p>Lima, tubuh sehat</p>
                                        <p>Enam, makan sehat bergizi</p>
                                        <p>Menjadi kuat</p>
                                    </div>

                                    {/* Verse 2 */}
                                    <div className="space-y-1">
                                        <p>Ayo, lakukan bersama</p>
                                        <p>Tujuh kebiasaan anak Indonesia</p>
                                        <p>Karakter pribadi yang kuat</p>
                                        <p>Karena kita semua generasi hebat</p>
                                    </div>

                                    {/* Chorus 2 */}
                                    <div className="space-y-1">
                                        <p>Lima, gemar belajar, ilmu bertambah</p>
                                        <p>Enam, bermasyarakat, bantu sesama</p>
                                        <p>Tujuh, tidur cepat, setiap hari</p>
                                        <p>Kebiasaan hebat, kita jalani</p>
                                    </div>

                                    {/* Final Verse */}
                                    <div className="space-y-1">
                                        <p>Ayo, lakukan bersama</p>
                                        <p>Tujuh kebiasaan anak Indonesia</p>
                                        <p>Karakter pribadi yang kuat</p>
                                        <p>Karena kita semua generasi hebat, Yeay! (3x)</p>
                                    </div>
                                </div>

                                {/* Badge Card */}
                                <div className="mt-12 bg-white/90 rounded-2xl p-6 text-center shadow-xl">
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-4 w-20 h-20 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-2xl font-bold text-blue-900">7 KEBIASAAN ANAK INDONESIA HEBAT</h3>
                                            <p className="text-sm text-gray-700 mt-1">
                                                <span className="font-semibold">PENCIPTA : BENNY HERMANTO</span><br />
                                                <span className="text-xs">PENATA MUSIK : ALIZAH MYM FAYEKAT</span><br />
                                                <span className="text-xs">ARANSEMEN: DUHNI DIARMAUAN</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timestamp */}
                        <div className="text-right text-sm text-gray-500 mt-8">
                            Apr 1, 2025    9:41 AM
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
