import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useToast } from '@/components/ui/toast';
import axios from 'axios';
import { useState } from 'react';
import ActionBar from './_components/ActionBar';
import StudentsTable from './_components/StudentsTable';
import StudentViewModal from './_components/StudentViewModal';
import StudentFormModal from './_components/StudentFormModal';
import MonthSelectionModal from './_components/MonthSelectionModal';
import ExcelImportModal from '@/components/excel-import-modal';
import {
    ClassStudentsProps,
    FormData,
    Student,
} from './types';


export default function ClassStudents({
    className,
    classDbId,
    classId,
    students,
}: ClassStudentsProps) {
    const { showSuccess, showError } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showMonthModal, setShowMonthModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
        null,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        nis: '',
        nisn: '',
        religion: '',
        gender: '',
        date_of_birth: '',
        address: '',
    });

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const exportActivities = () => {
        // Show month selection modal
        setShowMonthModal(true);
    };

    const handleMonthConfirm = (startDate: string, endDate: string) => {
        // Export student activity data with selected date range
        window.location.href = `/admin/students/export-activities?class_id=${classDbId}&class_name=${encodeURIComponent(className)}&start_date=${startDate}&end_date=${endDate}`;
    };

    const downloadCSVTemplate = () => {
        // Use backend endpoint to download template
        window.location.href = `/admin/students/template?class_id=${classDbId}&class_name=${encodeURIComponent(className)}`;
    };

    const handleImportSuccess = () => {
        // Reload students data after successful import
        router.reload({ only: ['students'] });
        setShowImportModal(false);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedStudent || isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await axios.put(
                `/admin/students/${selectedStudent.id}`,
                {
                    name: formData.name,
                    email: formData.email,
                    nis: formData.nis,
                    nisn: formData.nisn || null,
                    religion: formData.religion,
                    gender: formData.gender,
                    date_of_birth: formData.date_of_birth || null,
                    address: formData.address || null,
                },
            );

            if (response.data.success) {
                router.reload({ only: ['students'] });
                showSuccess('Data siswa berhasil diupdate');
                setFormData({
                    name: '',
                    email: '',
                    nis: '',
                    nisn: '',
                    religion: '',
                    gender: '',
                    date_of_birth: '',
                    address: '',
                });
                setSelectedStudent(null);
                setShowEditModal(false);
            }
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message ||
                'Terjadi kesalahan saat mengupdate siswa';
            showError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openViewModal = (student: Student) => {
        setSelectedStudent(student);
        setShowViewModal(true);
    };

    const openEditModal = (student: Student) => {
        setSelectedStudent(student);
        setFormData({
            name: student.name,
            email: student.email || '',
            nis: student.nis || '',
            nisn: student.nisn || '',
            religion: student.religion,
            gender: student.gender,
            date_of_birth: student.date_of_birth || '',
            address: student.address || '',
        });
        setShowEditModal(true);
    };

    const handleDeleteStudent = async (student: Student) => {
        if (
            !confirm(
                `Apakah Anda yakin ingin menghapus siswa "${student.name}"?`,
            )
        ) {
            return;
        }

        try {
            const response = await axios.delete(
                `/admin/students/${student.id}`,
            );

            if (response.data.success) {
                router.reload({ only: ['students'] });
                showSuccess('Siswa berhasil dihapus');
            }
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message ||
                'Terjadi kesalahan saat menghapus siswa';
            showError(message);
        }
    };

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <AppLayout>
            <Head title={`Daftar Siswa ${className}`} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
                <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
                            <Link
                                href="/admin/siswa-dashboard"
                                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 sm:gap-2 sm:text-base"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 sm:h-5 sm:w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Kembali ke Dashboard
                            </Link>
                        </div>
                        <h1 className="mb-1 text-2xl font-bold text-gray-900 sm:mb-2 sm:text-3xl">
                            List Nama Siswa
                        </h1>
                        <p className="text-sm text-gray-600 sm:text-base">
                            Daftar siswa {className}
                        </p>
                    </div>

                    {/* Action Bar */}
                    <ActionBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onAddClick={() => router.visit(`/admin/siswa/kelas/${classId}/create`)}
                        onImportClick={() => setShowImportModal(true)}
                        onDownloadTemplate={downloadCSVTemplate}
                    />

                    {/* Students Table */}
                    <StudentsTable
                        students={filteredStudents}
                        onView={openViewModal}
                        onEdit={openEditModal}
                        onDelete={handleDeleteStudent}
                        onExport={exportActivities}
                    />

                    {/* Modal Lihat Detail Siswa */}
                    <StudentViewModal
                        isOpen={showViewModal}
                        onClose={() => setShowViewModal(false)}
                        student={selectedStudent}
                        onEdit={() => {
                            setShowViewModal(false);
                            if (selectedStudent) openEditModal(selectedStudent);
                        }}
                    />

                    {/* Modal Edit Siswa */}
                    {selectedStudent && (
                        <StudentFormModal
                            isOpen={showEditModal}
                            onClose={() => setShowEditModal(false)}
                            onSubmit={handleEditSubmit}
                            formData={formData}
                            onInputChange={handleInputChange}
                            mode="edit"
                            isSubmitting={isSubmitting}
                        />
                    )}

                    {/* Modal Import Siswa */}
                    <ExcelImportModal
                        isOpen={showImportModal}
                        onClose={() => setShowImportModal(false)}
                        uploadUrl="/admin/students/import"
                        entityName="Siswa"
                        onSuccess={handleImportSuccess}
                        additionalData={{ class_id: classDbId }}
                    />

                    {/* Modal Pilih Bulan Export */}
                    <MonthSelectionModal
                        isOpen={showMonthModal}
                        onClose={() => setShowMonthModal(false)}
                        onConfirm={handleMonthConfirm}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
