import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { approve, reject } from '@/routes/orangtua/submissions';
import { useState, useMemo } from 'react';
import {
    DashboardHeader,
    StudentList,
    ActivityTabs,
    StatusFilter,
    SubmissionsTable,
    Pagination,
    PhotoModal,
} from './_components';
import type { Student, Activity, ActivitySubmission, FilterStatus } from './_components';

interface OrangtuaDashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    students: Student[];
    submissions: ActivitySubmission[];
    activities: Activity[];
}

export default function OrangtuaDashboard({ auth, students = [], submissions = [], activities = [] }: OrangtuaDashboardProps) {
    const [selectedStudent, setSelectedStudent] = useState<number | null>(students[0]?.id || null);
    const [selectedActivity, setSelectedActivity] = useState<number>(activities[0]?.id || 1);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    // Filter submissions based on selected student, activity, and status
    const filteredSubmissions = useMemo(() => {
        return submissions.filter(
            submission =>
                submission.studentId === selectedStudent &&
                submission.activityId === selectedActivity &&
                (filterStatus === 'all' || submission.status === filterStatus)
        );
    }, [submissions, selectedStudent, selectedActivity, filterStatus]);

    // Pagination
    const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
    const paginatedSubmissions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredSubmissions.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredSubmissions, currentPage, itemsPerPage]);

    const selectedActivityData = activities.find(a => a.id === selectedActivity);

    // Calculate statistics for selected student
    const studentStats = useMemo(() => {
        const studentSubmissions = submissions.filter(s => s.studentId === selectedStudent);
        return {
            approved: studentSubmissions.filter(s => s.status === 'approved').length,
            pending: studentSubmissions.filter(s => s.status === 'pending').length,
            rejected: studentSubmissions.filter(s => s.status === 'rejected').length,
        };
    }, [submissions, selectedStudent]);

    const handleSelectStudent = (studentId: number) => {
        setSelectedStudent(studentId);
        setCurrentPage(1);
    };

    const handleSelectActivity = (activityId: number) => {
        setSelectedActivity(activityId);
        setCurrentPage(1);
        setFilterStatus('all');
    };

    const handleFilterChange = (status: FilterStatus) => {
        setFilterStatus(status);
        setCurrentPage(1);
    };

    const handleApprove = (submissionId: number) => {
        router.post(approve.url(submissionId), {}, {
            preserveScroll: true,
        });
    };

    const handleReject = (submissionId: number) => {
        router.post(reject.url(submissionId), {}, {
            preserveScroll: true,
        });
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    return (
        <AppLayout>
            <Head title="Dashboard Orang Tua" />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
                <div className="container mx-auto px-4 py-8">
                    <DashboardHeader userName={auth.user.name} />

                    <div className="flex flex-col lg:flex-row gap-8">
                        <StudentList
                            students={students}
                            selectedStudent={selectedStudent}
                            onSelectStudent={handleSelectStudent}
                            stats={studentStats}
                        />

                        <div className="flex-1">
                            <ActivityTabs
                                activities={activities}
                                selectedActivity={selectedActivity}
                                onSelectActivity={handleSelectActivity}
                            />

                            <StatusFilter
                                filterStatus={filterStatus}
                                onFilterChange={handleFilterChange}
                            />

                            {/* Items per page selector placed above the table */}
                            <div className="flex items-center gap-3 px-4 py-3 mb-4">
                                <span className="text-sm font-medium text-gray-700">Show</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={31}>31</option>
                                </select>
                                <span className="text-sm font-medium text-gray-700">entries</span>
                            </div>

                            <SubmissionsTable
                                submissions={paginatedSubmissions}
                                selectedActivity={selectedActivityData}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                onPhotoClick={setSelectedPhoto}
                            />

                            {paginatedSubmissions.length > 0 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                    onItemsPerPageChange={handleItemsPerPageChange}
                                    showSelector={false}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <PhotoModal photoUrl={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        </AppLayout>
    );
}
