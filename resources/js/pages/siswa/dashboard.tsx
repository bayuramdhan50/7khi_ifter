import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { show as showActivity } from '@/routes/siswa/activity';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

interface Activity {
    id: number;
    title: string;
    icon: string;
    color: string;
    completed: boolean;
}

interface SiswaDashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
            religion?: string;
        };
    };
    activities: Activity[];
    completionPercentage: number;
    completedDays: number;
}

export default function SiswaDashboard({ auth, activities, completionPercentage, completedDays }: SiswaDashboardProps) {
    const currentDate = new Date();
    const currentMonth = new Date();
    const getInitials = useInitials();

    // Determine the activity detail route based on activity title
    const getActivityDetailRoute = (activity: Activity) => {
        const title = activity.title.toLowerCase();
        const activityId = activity.id;

        // Handle berbakti/beribadah - route to appropriate page based on religion
        if (title.includes('berbakti') || title.includes('beribadah')) {
            // Check user religion to determine which page
            const userReligion = auth.user.religion || 'muslim';
            if (userReligion === 'muslim') {
                return `/siswa/activities/beribadah-muslim/${activityId}`;
            } else {
                return `/siswa/activities/beribadah-nonmuslim/${activityId}`;
            }
        } else if (title.includes('bangun pagi')) {
            return `/siswa/activities/bangun-pagi/${activityId}`;
        } else if (title.includes('berolahraga')) {
            return `/siswa/activities/berolahraga/${activityId}`;
        } else if (title.includes('gemar belajar')) {
            return `/siswa/activities/gemar-belajar/${activityId}`;
        } else if (title.includes('makan') && title.includes('sehat')) {
            return `/siswa/activities/makan-sehat/${activityId}`;
        } else if (title.includes('bermasyarakat')) {
            return `/siswa/activities/bermasyarakat/${activityId}`;
        } else if (title.includes('tidur cepat')) {
            return `/siswa/activities/tidur-cepat/${activityId}`;
        }

        // Fallback to generic activity detail
        return showActivity.url(activityId);
    };

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
            <Head title="Dashboard Siswa" />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
                <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8 gap-3 sm:gap-0">
                        <div>
                            <h1 className="text-xl sm:text-3xl font-bold text-blue-900">Jurnal Harian</h1>
                            <p className="text-sm sm:text-base text-blue-600">Welcome, {auth.user.name}</p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
                        {/* Left Side - Activities */}
                        <div className="flex-1">
                            {/* Profile Card */}
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-8">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                                    {/* Profile Image */}
                                    <div className="flex-shrink-0">
                                        <Avatar className="w-20 h-24 sm:w-28 sm:h-36 rounded-lg border-2 sm:border-4 border-blue-700 bg-blue-700 flex items-center justify-center">
                                            <AvatarFallback className="w-full h-full flex items-center justify-center text-white text-5xl sm:text-7xl font-bold rounded-lg bg-blue-700">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    {/* Profile Info */}
                                    <div className="flex-1 w-full text-center sm:text-left">
                                        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">{auth.user.name}</h2>

                                        {/* Progress Bar */}
                                        <div className="mb-2 sm:mb-3">
                                            <div className="flex items-center justify-center sm:justify-between mb-2">
                                                <span className="text-3xl sm:text-4xl font-bold text-gray-800">{completionPercentage} %</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                                                <div className="bg-blue-600 h-2 sm:h-3 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                                            </div>
                                        </div>

                                        {/* Completion text */}
                                        <div className="mb-2 sm:mb-3 text-sm text-gray-600 text-center sm:text-left">
                                            <span className="font-semibold">{completedDays}/7 Hari Tuntas!</span>
                                        </div>
                                    </div>

                                    {/* Date Picker - Hidden di mobile atau di bawah */}
                                    <div className="flex-shrink-0 w-full sm:w-auto">
                                        <input
                                            type="date"
                                            defaultValue="2025-08-17"
                                            className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-sm sm:text-base hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-2xl font-bold text-blue-900">Kegiatan</h2>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                {activities.map((activity) => (
                                    <Link
                                        key={activity.id}
                                        href={getActivityDetailRoute(activity)}
                                        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg p-3 sm:p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                                    >
                                        {/* Badge */}
                                        <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                            <span className="text-white font-bold text-sm sm:text-lg">{activity.id}</span>
                                        </div>

                                        {/* Icon Container */}
                                        <div className={`${activity.color} rounded-t-2xl sm:rounded-t-3xl -mx-3 -mt-3 sm:-mx-6 sm:-mt-6 mb-2 sm:mb-4 p-4 sm:p-8 flex items-center justify-center`}>
                                            <div className="text-3xl sm:text-6xl">
                                                {activity.icon}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-center font-bold text-gray-800 text-xs sm:text-lg leading-tight">
                                            {activity.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Side - Calendar */}
                        <div className="w-full lg:w-96">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-4">
                                {/* Date Display */}
                                <div className="mb-4 sm:mb-6">
                                    <div className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-center font-medium text-gray-800 text-sm sm:text-base">
                                        {formatDate(currentDate)}
                                    </div>
                                </div>

                                {/* Month Display (Static) */}
                                <div className="flex items-center justify-center mb-3 sm:mb-4">
                                    <span className="font-bold text-gray-800 text-sm sm:text-base">
                                        {monthNames[currentMonth.getMonth()]}
                                    </span>
                                </div>

                                {/* Year Display (Static) */}
                                <div className="flex items-center justify-center mb-3 sm:mb-4">
                                    <span className="font-bold text-gray-800 text-sm sm:text-base">
                                        {currentMonth.getFullYear()}
                                    </span>
                                </div>

                                {/* Day Names */}
                                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                                    {dayNames.map((day, index) => (
                                        <div
                                            key={index}
                                            className="text-center font-bold text-gray-600 text-xs sm:text-sm"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                                    {/* Empty cells for days before month starts */}
                                    {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                                        <div key={`empty-${index}`} className="aspect-square" />
                                    ))}

                                    {/* Days of the month (Static) */}
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
