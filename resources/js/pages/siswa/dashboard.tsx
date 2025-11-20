import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { show as showActivity } from '@/routes/siswa/activity';

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
}

export default function SiswaDashboard({ auth, activities }: SiswaDashboardProps) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

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

    const changeMonth = (increment: number) => {
        const newMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() + increment));
        setCurrentMonth(new Date(newMonth));
    };

    const changeYear = (increment: number) => {
        const newYear = new Date(currentMonth.setFullYear(currentMonth.getFullYear() + increment));
        setCurrentMonth(new Date(newYear));
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <AppLayout>
            <Head title="Dashboard Siswa" />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-blue-900">Jurnal Harian</h1>
                            <p className="text-blue-600">Welcome, {auth.user.name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Cari Kegiatan"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Side - Activities */}
                        <div className="flex-1">
                            {/* Profile Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                                <div className="flex items-center gap-6">
                                    {/* Profile Image */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src="/api/placeholder/120/150"
                                            alt={auth.user.name}
                                            className="w-28 h-36 object-cover rounded-lg border-4 border-gray-200"
                                        />
                                    </div>

                                    {/* Profile Info */}
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{auth.user.name}</h2>

                                        {/* Progress Bar */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-4xl font-bold text-gray-800">78 %</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '78%' }}></div>
                                            </div>
                                        </div>

                                        {/* Rating Stars */}
                                        <div className="flex items-center gap-2 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    className={`w-6 h-6 ${star <= 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            <span className="ml-2 text-sm text-gray-600">5/7 Hari Tuntas!</span>
                                        </div>
                                    </div>

                                    {/* Date Picker */}
                                    <div className="flex-shrink-0">
                                        <input
                                            type="date"
                                            defaultValue="2025-08-17"
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-blue-900">Kegiatan</h2>
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                    View Less
                                </a>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activities.map((activity) => (
                                    <Link
                                        key={activity.id}
                                        href={getActivityDetailRoute(activity)}
                                        className="relative bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-4 border-gray-800"
                                    >
                                        {/* Badge */}
                                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                            <span className="text-white font-bold text-lg">{activity.id}</span>
                                        </div>

                                        {/* Icon Container */}
                                        <div className={`${activity.color} rounded-t-3xl -mx-6 -mt-6 mb-4 p-8 flex items-center justify-center`}>
                                            <div className="text-6xl">
                                                {activity.icon}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-center font-bold text-gray-800 text-lg leading-tight">
                                            {activity.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Side - Calendar */}
                        <div className="w-full lg:w-96">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                                {/* Date Display */}
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        value={formatDate(selectedDate)}
                                        readOnly
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-center font-medium text-gray-800"
                                    />
                                </div>

                                {/* Month/Year Navigation */}
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => changeMonth(-1)}
                                        className="text-blue-600 hover:text-blue-700 text-xl font-bold px-3 py-1"
                                    >
                                        ‹
                                    </button>
                                    <span className="font-bold text-gray-800">
                                        {monthNames[currentMonth.getMonth()]}
                                    </span>
                                    <button
                                        onClick={() => changeMonth(1)}
                                        className="text-blue-600 hover:text-blue-700 text-xl font-bold px-3 py-1"
                                    >
                                        ›
                                    </button>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => changeYear(-1)}
                                        className="text-blue-600 hover:text-blue-700 text-xl font-bold px-3 py-1"
                                    >
                                        ‹
                                    </button>
                                    <span className="font-bold text-gray-800">
                                        {currentMonth.getFullYear()}
                                    </span>
                                    <button
                                        onClick={() => changeYear(1)}
                                        className="text-blue-600 hover:text-blue-700 text-xl font-bold px-3 py-1"
                                    >
                                        ›
                                    </button>
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

                                    {/* Days of the month */}
                                    {Array.from({ length: daysInMonth }).map((_, index) => {
                                        const day = index + 1;
                                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                        const isToday = date.toDateString() === new Date().toDateString();
                                        const isSelected = date.toDateString() === selectedDate.toDateString();

                                        return (
                                            <button
                                                key={day}
                                                onClick={() => setSelectedDate(date)}
                                                className={`
                                                    aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                                                    transition-colors
                                                    ${isSelected
                                                        ? 'bg-blue-600 text-white'
                                                        : isToday
                                                            ? 'bg-blue-100 text-blue-600'
                                                            : 'hover:bg-gray-100 text-gray-700'
                                                    }
                                                `}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Ok
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
