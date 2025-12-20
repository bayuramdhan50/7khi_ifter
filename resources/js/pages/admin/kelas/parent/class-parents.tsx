import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ParentsTable from './_components/ParentsTable';
import SearchBar from './_components/SearchBar';
import ExcelImportModal from '@/components/excel-import-modal';
import { ClassParentsProps, Parent } from './types';

export default function ClassParents({
    auth,
    className,
    classId,
    classDbId,
    parents,
}: ClassParentsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);

    // Filter orang tua berdasarkan search
    const filteredParents = (parents || []).filter(
        (parent) =>
            parent.parentName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            (parent.studentName &&
                parent.studentName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())),
    );

    const openEditPage = (parent: Parent) => {
        // Navigate to edit page
        window.location.href = `/admin/orangtua/${parent.id}/edit?classId=${classId}`;
    };

    const handleDelete = (parent: Parent) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus akun orang tua "${parent.parentName}"?\n\nData yang akan dihapus:\n- Akun user\n- Data orang tua\n- Relasi dengan anak\n\nTindakan ini tidak dapat dibatalkan!`,
            )
        ) {
            router.delete(`/admin/orangtua/${parent.id}/delete`, {
                preserveScroll: true,
                onSuccess: () => {
                    alert('Akun orang tua berhasil dihapus!');
                },
                onError: (errors) => {
                    alert(
                        'Gagal menghapus akun: ' +
                        (errors.error || 'Terjadi kesalahan'),
                    );
                },
            });
        }
    };

    const handleDownloadTemplate = () => {
        window.location.href = '/admin/parents/template';
    };

    const handleImportSuccess = () => {
        window.location.reload();
    };

    return (
        <AppLayout>
            <Head title={`Daftar Orang Tua ${className}`} />

            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
                <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
                            <Link
                                href="/admin/orangtua-dashboard"
                                className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-800 sm:gap-2 sm:text-base"
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
                            List Nama Orang Tua
                        </h1>
                        <p className="text-sm text-gray-600 sm:text-base">
                            Daftar orang tua siswa
                        </p>
                    </div>

                    {/* Action Bar */}
                    <SearchBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onAddClick={() =>
                            (window.location.href = `/admin/orangtua/kelas/${classId}/create`)
                        }
                        onDownloadTemplate={handleDownloadTemplate}
                        onImportClick={() => setShowImportModal(true)}
                    />

                    {/* Parents Table */}
                    <ParentsTable
                        parents={filteredParents}
                        onEdit={openEditPage}
                        onDelete={handleDelete}
                    />

                    {/* Excel Import Modal */}
                    <ExcelImportModal
                        isOpen={showImportModal}
                        onClose={() => setShowImportModal(false)}
                        uploadUrl="/admin/parents/import"
                        entityName="Orang Tua"
                        onSuccess={handleImportSuccess}
                        additionalData={{ class_id: classDbId }}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
