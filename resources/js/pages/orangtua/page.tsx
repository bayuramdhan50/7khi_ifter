import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { approve, reject } from '@/routes/orangtua/submissions';

import { useState, useMemo } from 'react';
import {
    DashboardHeader,
    StudentList,
    StatusFilter,
    SubmissionsTable,
    Pagination,
    PhotoModal,
    ConfirmationModal,
    type GroupedSubmission,
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
    const [sortField, setSortField] = useState<'date' | 'status' | 'total'>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc'); // desc = newest first

    // Group submissions by date
    const groupedSubmissions = useMemo(() => {
        const filtered = submissions.filter(
            submission =>
                submission.studentId === selectedStudent &&
                (filterStatus === 'all' || submission.status === filterStatus)
        );

        // Sort by the selected field and direction
        if (sortField === 'date') {
            if (sortDirection === 'desc') {
                filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // newest first
            } else {
                filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // oldest first
            }
        }

        // Group by date
        const groups: { [key: string]: ActivitySubmission[] } = {};
        filtered.forEach(submission => {
            const date = submission.date;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(submission);
        });

        // Convert to array
        const result = Object.keys(groups).map(date => {
            const dateSubmissions = groups[date];
            const allApproved = dateSubmissions.every(s => s.status === 'approved');
            const allRejected = dateSubmissions.every(s => s.status === 'rejected');
            const hasPending = dateSubmissions.some(s => s.status === 'pending');

            let status: 'approved' | 'rejected' | 'pending' | 'mixed' = 'pending';
            if (allApproved) status = 'approved';
            else if (allRejected) status = 'rejected';
            else if (!hasPending) status = 'mixed';

            return {
                date,
                submissions: dateSubmissions,
                totalActivities: dateSubmissions.length,
                status
            } as GroupedSubmission;
        });

        // Apply sorting for status and total after grouping
        if (sortField === 'status') {
            const statusOrder: Record<string, number> = { approved: 1, pending: 2, rejected: 3, mixed: 4 };
            result.sort((a: GroupedSubmission, b: GroupedSubmission) => {
                const comparison = statusOrder[a.status] - statusOrder[b.status];
                return sortDirection === 'desc' ? -comparison : comparison;
            });
        } else if (sortField === 'total') {
            result.sort((a: GroupedSubmission, b: GroupedSubmission) => {
                const comparison = a.totalActivities - b.totalActivities;
                return sortDirection === 'desc' ? -comparison : comparison;
            });
        }

        return result;
    }, [submissions, selectedStudent, filterStatus, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(groupedSubmissions.length / itemsPerPage);
    const paginatedSubmissions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return groupedSubmissions.slice(startIndex, startIndex + itemsPerPage);
    }, [groupedSubmissions, currentPage, itemsPerPage]);

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

    const handleViewDetail = (date: string) => {
        const student = students.find(s => s.id === selectedStudent);
        if (student && selectedStudent) {
            // Extract only the date part (YYYY-MM-DD) to avoid timezone issues
            const dateOnly = date.split('T')[0];
            router.visit(`/orangtua/daily-report/detail?student_id=${selectedStudent}&date=${dateOnly}`);
        }
    };

    const handleSort = (field: 'date' | 'status' | 'total') => {
        if (sortField === field) {
            // Toggle direction if same field
            setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
        } else {
            // Change field and set to desc by default
            setSortField(field);
            setSortDirection('desc');
        }
        setCurrentPage(1); // Reset to first page when sorting changes
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    return (
        <AppLayout>
            <Head title="Dashboard Orang Tua" />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
                <div className="container mx-auto px-4 py-6">
                    <DashboardHeader userName={auth.user.name} />

                    <div className="flex flex-col lg:flex-row gap-6">
                        <StudentList
                            students={students}
                            selectedStudent={selectedStudent}
                            onSelectStudent={handleSelectStudent}
                            stats={studentStats}
                        />

                        <div className="flex-1">
                            {/* Filter and Entries Row */}
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                <StatusFilter
                                    filterStatus={filterStatus}
                                    onFilterChange={handleFilterChange}
                                />

                                <div className="inline-flex items-center gap-2 bg-white rounded-xl shadow-sm px-4 py-2 border border-gray-100">
                                    <span className="text-sm text-gray-500">Show</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                        className="px-2 py-1 border border-gray-200 rounded-lg text-sm font-semibold bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={31}>31</option>
                                    </select>
                                    <span className="text-sm text-gray-500">entries</span>
                                </div>
                            </div>

                            <SubmissionsTable
                                submissions={paginatedSubmissions}
                                selectedActivity={selectedActivityData}
                                onViewDetail={handleViewDetail}
                                sortField={sortField}
                                sortDirection={sortDirection}
                                onSort={handleSort}
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
