import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Activity, TrendingUp, Users, CheckCircle, Clock, AlertCircle, BookOpen, Calendar, User, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ClassData {
    id: number;
    name: string;
    grade: number;
    section: string;
    academic_year: string;
    student_count: number;
}

interface ActivityStat {
    id: number;
    nama: string;
    icon: string;
    totalSiswa: number;
    siswaAktif: number;
    persentase: number;
    bgColor: string;
    borderColor: string;
    textColor: string;
    progressColor: string;
}

interface MonitoringAktivitasProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    classes?: ClassData[];
    selectedClass?: ClassData | null;
    activityStats?: ActivityStat[];
    selectedPeriod?: 'hari' | 'minggu' | 'bulan';
}

export default function MonitoringAktivitas({ 
    auth, 
    classes = [], 
    selectedClass = null,
    activityStats = [],
    selectedPeriod = 'bulan'
}: MonitoringAktivitasProps) {
    const [isLoadingClass, setIsLoadingClass] = useState(false);
    const [isLoadingPeriod, setIsLoadingPeriod] = useState(false);

    const handleClassChange = (classId: string) => {
        if (!classId) return;
        setIsLoadingClass(true);
        const params = new URLSearchParams();
        params.append('class_id', classId);
        params.append('period', selectedPeriod);
        router.visit(`/guru/monitoring-aktivitas?${params.toString()}`, {
            preserveState: false,
            preserveScroll: false,
        });
    };

    const handlePeriodChange = (period: 'hari' | 'minggu' | 'bulan') => {
        setIsLoadingPeriod(true);
        const params = new URLSearchParams();
        if (selectedClass) params.append('class_id', selectedClass.id.toString());
        params.append('period', period);
        router.visit(`/guru/monitoring-aktivitas?${params.toString()}`, {
            preserveState: false,
            preserveScroll: false,
        });
    };

    // Statistik umum dari data real
    const overallStats = activityStats.length > 0 ? {
        totalSiswa: selectedClass?.student_count || 0,
        rataRataKeaktifan: Math.round(
            activityStats.reduce((sum, item) => sum + item.persentase, 0) / activityStats.length
        ),
        aktivitasTertinggi: activityStats.reduce((max, item) => 
            item.persentase > max.persentase ? item : max
        ),
        aktivitasTerendah: activityStats.reduce((min, item) => 
            item.persentase < min.persentase ? item : min
        ),
    } : {
        totalSiswa: 0,
        rataRataKeaktifan: 0,
        aktivitasTertinggi: { nama: '-', persentase: 0 },
        aktivitasTerendah: { nama: '-', persentase: 0 },
    };

    return (
        <AppLayout>
            <Head title="Monitoring Aktivitas Siswa" />

            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-4 md:py-8">
                    {/* Header */}
                    <div className="mb-6 md:mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        Monitoring Aktivitas Siswa
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Pantau partisipasi siswa dalam 7 Kebiasaan Anak Indonesia
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/guru/monitoring-siswa"
                                className="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
                            >
                                <User className="w-5 h-5" />
                                <span>Monitoring Per Siswa</span>
                            </Link>
                        </div>

                        {/* Info Cards - Moved to Top */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                            {/* Informasi Umum */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-5 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm font-bold">ℹ</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-lg mb-3 text-blue-900">Informasi Umum</p>
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 mt-0.5">•</span>
                                                <span>Data menampilkan statistik partisipasi siswa dalam 7 kebiasaan</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 mt-0.5">•</span>
                                                <span>Persentase dihitung dari jumlah siswa yang aktif melakukan aktivitas</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-600 mt-0.5">•</span>
                                                <span>Gunakan filter periode untuk melihat data harian, mingguan, atau bulanan</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Klasifikasi Status */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-300 rounded-xl p-5 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-lg mb-3 text-purple-900">Klasifikasi Status Partisipasi</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full whitespace-nowrap shadow-sm">
                                                    ✓ Sangat Baik
                                                </span>
                                                <span className="text-gray-700">: 100% dalam sebulan</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500 text-white text-xs font-bold rounded-full whitespace-nowrap shadow-sm">
                                                    ↗ Baik
                                                </span>
                                                <span className="text-gray-700">: 75% - 99% dalam sebulan</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full whitespace-nowrap shadow-sm">
                                                    ⚠ Cukup
                                                </span>
                                                <span className="text-gray-700">: 50% - 74% dalam sebulan</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full whitespace-nowrap shadow-sm">
                                                    ✕ Kurang
                                                </span>
                                                <span className="text-gray-700">: Kurang dari 50% dalam sebulan</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Class Selection */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                                <div className="flex items-center gap-2 min-w-fit">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                    <label className="text-sm md:text-base font-medium text-gray-700 whitespace-nowrap">
                                        Pilih Kelas yang Diampu
                                    </label>
                                </div>
                                <select
                                    value={selectedClass?.id || ''}
                                    onChange={(e) => handleClassChange(e.target.value)}
                                    disabled={isLoadingClass}
                                    className="flex-1 w-full md:max-w-md px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-white border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="" className="text-gray-500">Pilih Kelas</option>
                                    {classes.map((classItem) => (
                                        <option key={classItem.id} value={classItem.id} className="text-gray-900 font-medium py-2">
                                            {classItem.name} ({classItem.student_count} siswa)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedClass && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-600">Kelas</p>
                                            <p className="text-sm font-bold text-blue-600">{selectedClass.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Jumlah Siswa</p>
                                            <p className="text-sm font-bold text-green-600">{selectedClass.student_count} siswa</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Tingkat</p>
                                            <p className="text-sm font-bold text-purple-600">Kelas {selectedClass.grade}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Tahun Akademik</p>
                                            <p className="text-sm font-bold text-orange-600">{selectedClass.academic_year}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Overall Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {/* Total Siswa */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {overallStats.totalSiswa}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        {/* Rata-rata Keaktifan */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Rata-rata Keaktifan</p>
                                    <p className="text-3xl font-bold text-green-600 mt-2">
                                        {overallStats.rataRataKeaktifan}%
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        {/* Aktivitas Tertinggi */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tertinggi</p>
                                    <p className="text-lg font-bold text-purple-600 mt-2">
                                        {overallStats.aktivitasTertinggi.nama}
                                    </p>
                                    <p className="text-sm text-gray-500">{overallStats.aktivitasTertinggi.persentase}%</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        {/* Aktivitas Terendah */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Terendah</p>
                                    <p className="text-lg font-bold text-orange-600 mt-2">
                                        {overallStats.aktivitasTerendah.nama}
                                    </p>
                                    <p className="text-sm text-gray-500">{overallStats.aktivitasTerendah.persentase}%</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Period Filter */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-8">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                            <div className="flex items-center gap-2 min-w-fit">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <label className="text-sm md:text-base font-medium text-gray-700 whitespace-nowrap">
                                    Filter Periode
                                </label>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => handlePeriodChange('hari')}
                                    disabled={isLoadingPeriod}
                                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-medium text-sm md:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                        selectedPeriod === 'hari'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Hari Ini
                                </button>
                                <button
                                    onClick={() => handlePeriodChange('minggu')}
                                    disabled={isLoadingPeriod}
                                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-medium text-sm md:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                        selectedPeriod === 'minggu'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Minggu Ini
                                </button>
                                <button
                                    onClick={() => handlePeriodChange('bulan')}
                                    disabled={isLoadingPeriod}
                                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-medium text-sm md:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                        selectedPeriod === 'bulan'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Bulan Ini
                                </button>
                            </div>
                            <div className="md:ml-auto">
                                <p className="text-xs md:text-sm text-gray-600">
                                    Menampilkan data: <span className="font-bold text-blue-600">
                                        {selectedPeriod === 'hari' && 'Hari Ini'}
                                        {selectedPeriod === 'minggu' && 'Minggu Ini'}
                                        {selectedPeriod === 'bulan' && 'Bulan Ini'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Detail Per Aktivitas */}
                    {isLoadingClass || isLoadingPeriod ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center">
                                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                                    <p className="text-gray-600 font-medium">
                                        {isLoadingClass ? 'Memuat data kelas...' : 'Memuat data periode...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Detail Partisipasi Per Aktivitas
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {activityStats.map((aktivitas) => (
                                <div
                                    key={aktivitas.id}
                                    className={`${aktivitas.bgColor} ${aktivitas.borderColor} border-2 rounded-lg p-6 transition-all hover:shadow-md`}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{aktivitas.icon}</span>
                                            <div>
                                                <h3 className={`font-bold text-lg ${aktivitas.textColor}`}>
                                                    {aktivitas.nama}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {aktivitas.siswaAktif} dari {aktivitas.totalSiswa} siswa
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`text-2xl font-bold ${aktivitas.textColor}`}>
                                            {aktivitas.persentase}%
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className={`${aktivitas.progressColor} h-3 rounded-full transition-all duration-500`}
                                                style={{ width: `${aktivitas.persentase}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Info Tambahan */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>{aktivitas.siswaAktif} aktif</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4 text-orange-600" />
                                            <span>{aktivitas.totalSiswa - aktivitas.siswaAktif} belum</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mt-4">
                                        {aktivitas.persentase === 100 ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                <CheckCircle className="w-3 h-3" />
                                                Sangat Baik
                                            </span>
                                        ) : aktivitas.persentase >= 75 ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                <TrendingUp className="w-3 h-3" />
                                                Baik
                                            </span>
                                        ) : aktivitas.persentase >= 50 ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                                                <AlertCircle className="w-3 h-3" />
                                                Cukup
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                                <AlertCircle className="w-3 h-3" />
                                                Kurang
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
