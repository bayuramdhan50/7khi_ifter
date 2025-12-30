import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Camera } from 'lucide-react';
import { useState } from 'react';

interface ActivityTask {
    id: number;
    tanggal: number;
    date: string;
    waktu: string | null;
    notes: string | null;
    status: string;
    approval_orangtua: boolean;
    bukti_foto: string | null;
    approved_by: number | null;
    approved_at: string | null;
    rejection_reason: string | null;
}

interface Activity {
    id: number;
    title: string;
    icon: string;
    color: string;
    month: string;
    year: number;
    tasks: ActivityTask[];
}

interface Student {
    id: number;
    name: string;
}

interface ActivityDetailProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    student: Student;
    activity: Activity;
}

export default function StudentActivityDetail({ auth, student, activity }: ActivityDetailProps) {
    const [selectedTask, setSelectedTask] = useState<number | null>(null);

    const { data, setData, post, processing } = useForm({
        task_id: 0,
        jawaban: '',
        bukti_foto: null as File | null,
    });

    const handleSubmit = (taskId: number) => {
        data.task_id = taskId;
        post(`/guru/siswa/${student.id}/activity/${activity.id}/task/${taskId}/submit`);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, taskId: number) => {
        if (e.target.files && e.target.files[0]) {
            setData('bukti_foto', e.target.files[0]);
        }
    };

    return (
        <AppLayout>
            <Head title={`${student.name} - ${activity.title}`} />

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

                        <h2 className="text-base md:text-xl text-gray-600 mb-4">Kegiatan {activity.id} {activity.title} - {student.name}</h2>

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
                            <span className="text-gray-900 font-medium truncate">Kegiatan {activity.id}</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full">
                        <div className="w-full">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-8">
                                <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 mb-6 md:mb-8">
                                    {/* Activity Card */}
                                    <div className="relative bg-white rounded-3xl shadow-lg p-4 md:p-6 border-4 border-blue-900 w-full md:w-64 flex-shrink-0">
                                        <div className="absolute -top-3 -right-3 w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                            <span className="text-white font-bold text-base md:text-lg">{activity.id}</span>
                                        </div>

                                        <div className={`${activity.color} rounded-t-3xl -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-3 md:mb-4 p-6 md:p-8 flex items-center justify-center`}>
                                            <div className="text-5xl md:text-6xl">{activity.icon}</div>
                                        </div>

                                        <h3 className="text-center font-bold text-gray-800 text-base md:text-lg leading-tight">
                                            {activity.title}
                                        </h3>
                                    </div>

                                    {/* Header Info */}
                                    <div className="flex-1 w-full">
                                        <div className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg inline-block mb-3 md:mb-4">
                                            <h3 className="text-base md:text-lg font-bold">Kebiasaan {activity.id}: {activity.title.toUpperCase()}</h3>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-base md:text-lg font-bold text-blue-600">Bulan : {activity.month}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tasks Table - Desktop View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 w-20">
                                                    TANGGAL
                                                </th>
                                                <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 w-32">
                                                    WAKTU
                                                </th>
                                                <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700">
                                                    APPROVAL ORANG TUA
                                                </th>
                                                <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-700 w-32">
                                                    BUKTI FOTO
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activity.tasks.map((task, index) => (
                                                <tr key={task.date} className={`hover:bg-gray-50 ${task.status === 'approved' ? 'bg-green-50' :
                                                        task.status === 'pending' ? 'bg-yellow-50' : ''
                                                    }`}>
                                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                                        <div className="bg-gray-200 rounded px-3 py-2 inline-block font-medium">
                                                            {task.tanggal}
                                                        </div>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-3">
                                                        <div className="text-center">
                                                            {task.waktu ? (
                                                                <span className="font-medium text-gray-900">{task.waktu}</span>
                                                            ) : (
                                                                <span className="text-gray-400 italic">Belum submit</span>
                                                            )}
                                                            {task.notes && (
                                                                <p className="text-xs text-gray-600 mt-1">{task.notes}</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-3">
                                                        <div className="flex flex-col items-center gap-2">
                                                            {task.status === 'approved' && (
                                                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                                                    ✓ Approved
                                                                </span>
                                                            )}
                                                            {task.status === 'pending' && (
                                                                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                                                                    ⏳ Pending
                                                                </span>
                                                            )}
                                                            {task.status === 'not_submitted' && (
                                                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                                                                    - Belum Submit
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                                        {task.bukti_foto ? (
                                                            <a href={`/storage/${task.bukti_foto}`} target="_blank" rel="noopener noreferrer">
                                                                <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded transition-colors cursor-pointer">
                                                                    <Camera className="w-5 h-5 text-blue-700" />
                                                                </div>
                                                            </a>
                                                        ) : (
                                                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded">
                                                                <Camera className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Tasks - Mobile Card View */}
                                <div className="md:hidden space-y-4">
                                    {activity.tasks.map((task, index) => (
                                        <div key={task.date} className={`border border-gray-300 rounded-lg p-4 ${task.status === 'approved' ? 'bg-green-50' :
                                                task.status === 'pending' ? 'bg-yellow-50' : 'bg-gray-50'
                                            }`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="bg-gray-200 rounded px-3 py-1.5 font-bold text-gray-900">
                                                    Tanggal: {task.tanggal}
                                                </div>
                                                {task.status === 'approved' && (
                                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                                        ✓ Approved
                                                    </span>
                                                )}
                                                {task.status === 'pending' && (
                                                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                                                        ⏳ Pending
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-700 mb-1 block">WAKTU</label>
                                                    {task.waktu ? (
                                                        <div className="text-sm font-medium text-gray-900 bg-white p-2 rounded border">
                                                            {task.waktu}
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-gray-400 italic bg-white p-2 rounded border">
                                                            Belum submit
                                                        </div>
                                                    )}
                                                </div>

                                                {task.notes && (
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-700 mb-1 block">CATATAN</label>
                                                        <div className="text-xs text-gray-700 bg-white p-2 rounded border">
                                                            {task.notes}
                                                        </div>
                                                    </div>
                                                )}


                                                <div className="flex gap-2 items-center">
                                                    <label className="text-xs font-bold text-gray-700">BUKTI FOTO:</label>
                                                    {task.bukti_foto ? (
                                                        <a href={`/storage/${task.bukti_foto}`} target="_blank" rel="noopener noreferrer">
                                                            <div className="cursor-pointer inline-flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded transition-colors">
                                                                <Camera className="w-5 h-5 text-blue-700" />
                                                            </div>
                                                        </a>
                                                    ) : (
                                                        <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded">
                                                            <Camera className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
        </AppLayout>
    );
}
