import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

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
        };
    };
}

export default function SiswaDashboard({ auth }: SiswaDashboardProps) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const activities: Activity[] = [
        { id: 1, title: 'Bangun Pagi', icon: '☀️', color: 'bg-orange-100', completed: false },
        { id: 2, title: 'Berbakti', icon: '🙏', color: 'bg-blue-100', completed: false },
        { id: 3, title: 'Berolahraga', icon: '⚽', color: 'bg-green-100', completed: false },
        { id: 4, title: 'Gemar Belajar', icon: '📚', color: 'bg-yellow-100', completed: false },
        { id: 5, title: 'Makan Makanan Sehat dan Bergizi', icon: '🍎', color: 'bg-pink-100', completed: false },
        { id: 6, title: 'Bermasyarakat', icon: '👨‍👩‍👧‍👦', color: 'bg-purple-100', completed: false },
        { id: 7, title: 'Tidur Cepat', icon: '🌙', color: 'bg-indigo-100', completed: false },
    ];

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
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Side - Activities */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-blue-900">Kegiatan</h2>
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                    View Less
                                </a>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activities.map((activity) => (
                                    <div
                                        key={activity.id}
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
                                    </div>
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-center font-medium"
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
