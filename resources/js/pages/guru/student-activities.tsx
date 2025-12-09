import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface Activity {
    id: number;
    title: string;
    icon: string;
    color: string;
    completed: boolean;
}

interface Student {
    id: number;
    name: string;
    religion: string;
    gender: string;
    progress: number;
}

interface StudentActivitiesProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    student: Student;
    activities: Activity[];
}

export default function StudentActivities({ auth, student, activities = [] }: StudentActivitiesProps) {
    const currentDate = new Date();
    const currentMonth = new Date();

    // Use activities from backend (no mock data)
    const activitiesList: Activity[] = activities;

    const completedCount = activitiesList.filter(a => a.completed).length;
    // Use progress from backend database calculation
    const progressPercentage = student.progress;

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <AppLayout>
            <Head title={`Aktivitas ${student.name}`} />

            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
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
                            <span className="text-gray-900 font-medium truncate">Siswa {student.name}</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Side - Profile & Activities */}
                        <div className="flex-1">
                            {/* Student Profile Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
                                <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                                    {/* Avatar */}
                                    <div className="relative mx-auto sm:mx-0">
                                        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&size=128&background=3b82f6&color=fff&bold=true`}
                                                alt={student.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 md:px-3 py-1 rounded-full border-2 border-blue-600 shadow-sm">
                                            <span className="text-xs font-bold text-blue-600">Kegiatan</span>
                                        </div>
                                    </div>

                                    {/* Student Info */}
                                    <div className="flex-1 w-full">
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center sm:text-left">{student.name}</h2>
                                        
                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs md:text-sm text-gray-600">Progress Hari Ini</span>
                                                <span className="text-xl md:text-2xl font-bold text-blue-600">{progressPercentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden">
                                                <div
                                                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                                                    style={{ width: `${progressPercentage}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-4 mt-2 justify-center sm:justify-start">
                                                {[...Array(7)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                                                            i < completedCount ? 'bg-blue-600' : 'bg-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link href={`/guru/siswa/${student.id}/biodata`} className="flex-1 sm:flex-none">
                                                <button className="w-full px-4 md:px-6 py-2 md:py-3 bg-gray-900 text-white rounded-lg font-medium text-sm md:text-base hover:bg-gray-800 transition-colors">
                                                    Biodata Murid
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Activities Section */}
                            <div className="mb-4 md:mb-6">
                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                    <h2 className="text-xl md:text-2xl font-bold text-blue-900">Kegiatan</h2>
                                    <span className="text-sm md:text-base text-blue-600 font-medium">View All</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {activitiesList.map((activity) => (
                                        <Link
                                            key={activity.id}
                                            href={`/guru/siswa/${student.id}/activity/${activity.id}`}
                                            className="relative bg-white rounded-3xl shadow-lg p-4 md:p-6 border-4 border-gray-800 hover:shadow-xl transition-shadow cursor-pointer overflow-visible"
                                        >
                                            {/* Badge */}
                                            <div className={`absolute -top-3 -right-3 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 border-white shadow-lg z-10 ${
                                                activity.completed ? 'bg-green-500' : 'bg-gray-400'
                                            }`}>
                                                <span className="text-white font-bold text-lg md:text-xl">{activity.id}</span>
                                            </div>

                                            {/* Icon Container */}
                                            <div className={`${activity.color} rounded-t-3xl -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-3 md:mb-4 p-6 md:p-8 flex items-center justify-center relative`}>
                                                <div className="text-5xl md:text-6xl">
                                                    {activity.icon}
                                                </div>
                                                {activity.completed && (
                                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                        ✓ Selesai
                                                    </div>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-center font-bold text-gray-800 text-base md:text-lg leading-tight">
                                                {activity.title}
                                            </h3>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Calendar */}
                        <div className="w-full lg:w-96">
                            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 lg:sticky lg:top-4">
                                {/* Date Display */}
                                <div className="mb-6">
                                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-center font-medium text-gray-800">
                                        {formatDate(currentDate)}
                                    </div>
                                </div>

                                {/* Month Display (Static) */}
                                <div className="flex items-center justify-center mb-4">
                                    <span className="font-bold text-gray-800">
                                        {monthNames[currentMonth.getMonth()]}
                                    </span>
                                </div>

                                {/* Year Display (Static) */}
                                <div className="flex items-center justify-center mb-4">
                                    <span className="font-bold text-gray-800">
                                        {currentMonth.getFullYear()}
                                    </span>
                                </div>

                                {/* Day Names */}
                                <div className="grid grid-cols-7 gap-2 mb-2">
                                    {dayNames.map((day, index) => (
                                        <div
                                            key={index}
                                            className="text-center font-bold text-gray-600 text-sm"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-2">
                                    {/* Empty cells for days before month starts */}
                                    {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                                        <div key={`empty-${index}`} className="aspect-square" />
                                    ))}

                                    {/* Days of the month (Static - No interaction) */}
                                    {Array.from({ length: daysInMonth }).map((_, index) => {
                                        const day = index + 1;
                                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                        const isToday = date.toDateString() === new Date().toDateString();

                                        return (
                                            <div
                                                key={day}
                                                className={`
                                                    aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                                                    ${isToday
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : 'text-gray-700'
                                                    }
                                                `}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Timestamp */}
                                <div className="mt-4 text-center text-xs text-gray-500">
                                    Apr 1, 2025 · 8:41 AM
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="mt-6">
                        <Link href="/guru/dashboard">
                            <button className="px-4 md:px-6 py-2 md:py-3 bg-gray-900 text-white rounded-lg font-medium text-sm md:text-base hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke Dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
