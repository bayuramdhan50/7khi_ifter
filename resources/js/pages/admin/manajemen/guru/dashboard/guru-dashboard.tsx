import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ActionBar from './_components/ActionBar';
import AddTeacherModal from './_components/AddTeacherModal';
import DeleteConfirmModal from './_components/DeleteConfirmModal';
import EditTeacherModal from './_components/EditTeacherModal';
import TeachersTable from './_components/TeachersTable';
import ExcelImportModal from '@/components/excel-import-modal';
import { FormData, GuruDashboardProps, Teacher } from './types';

export default function GuruDashboard({
    teachers,
    allClasses,
}: GuruDashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(
        null,
    );

    const addForm = useForm<FormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        nip: '',
        phone: '',
        address: '',
        class_id: '',
    });

    const editForm = useForm<FormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        nip: '',
        phone: '',
        address: '',
        class_id: '',
    });

    // Filter guru berdasarkan search
    const filteredTeachers = teachers.filter(
        (teacher) =>
            teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (teacher.email ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (teacher.nip ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const openEditModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        editForm.setData({
            name: teacher.name,
            email: teacher.email,
            password: '',
            password_confirmation: '',
            nip: teacher.nip === '-' ? '' : teacher.nip,
            phone: teacher.phone === '-' ? '' : teacher.phone,
            address: teacher.address === '-' ? '' : teacher.address,
            class_id: teacher.class_id ? teacher.class_id.toString() : '',
        });
        setShowEditModal(true);
    };

    const openDeleteConfirm = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setShowDeleteConfirm(true);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/admin/teachers', {
            onSuccess: () => {
                addForm.reset();
                setShowAddModal(false);
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTeacher) {
            editForm.put(`/admin/teachers/${selectedTeacher.id}`, {
                onSuccess: () => {
                    editForm.reset();
                    setShowEditModal(false);
                    setSelectedTeacher(null);
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedTeacher) {
            router.delete(`/admin/teachers/${selectedTeacher.id}`, {
                onSuccess: () => {
                    setShowDeleteConfirm(false);
                    setSelectedTeacher(null);
                },
            });
        }
    };

    const handleDownloadTemplate = () => {
        window.location.href = '/admin/teachers/template';
    };

    const handleImportSuccess = () => {
        // Reload page to show new data
        window.location.reload();
    };

    return (
        <AppLayout>
            <Head title="Dashboard Guru" />

            <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
                <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="mb-1 text-2xl font-bold text-gray-900 sm:mb-2 sm:text-3xl">
                            List Nama Guru
                        </h1>
                        <p className="text-sm text-gray-600 sm:text-base">
                            Daftar guru dan kelas yang diampu
                        </p>
                    </div>

                    {/* Action Bar */}
                    <ActionBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onAddClick={() => setShowAddModal(true)}
                        onDownloadTemplate={handleDownloadTemplate}
                        onImportClick={() => setShowImportModal(true)}
                    />

                    {/* Teachers Table */}
                    <TeachersTable
                        teachers={filteredTeachers}
                        onEdit={openEditModal}
                        onDelete={openDeleteConfirm}
                    />

                    {/* Add Modal */}
                    <AddTeacherModal
                        isOpen={showAddModal}
                        onClose={() => setShowAddModal(false)}
                        onSubmit={handleAddSubmit}
                        form={addForm}
                        allClasses={allClasses}
                    />

                    {/* Edit Modal */}
                    <EditTeacherModal
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        onSubmit={handleEditSubmit}
                        form={editForm}
                        teacher={selectedTeacher}
                        allClasses={allClasses}
                    />

                    {/* Delete Confirmation Modal */}
                    <DeleteConfirmModal
                        isOpen={showDeleteConfirm}
                        onClose={() => setShowDeleteConfirm(false)}
                        onConfirm={handleDelete}
                        teacher={selectedTeacher}
                    />

                    {/* Excel Import Modal */}
                    <ExcelImportModal
                        isOpen={showImportModal}
                        onClose={() => setShowImportModal(false)}
                        uploadUrl="/admin/teachers/import"
                        entityName="Guru"
                        onSuccess={handleImportSuccess}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
