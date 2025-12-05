import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ParentFormModal from './_components/ParentFormModal';
import ParentsTable from './_components/ParentsTable';
import SearchBar from './_components/SearchBar';
import { ClassParentsProps, FormData, Parent } from './types';

export default function ClassParents({
    auth,
    className,
    classId,
    parents,
}: ClassParentsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
    const [formData, setFormData] = useState<FormData>({
        parentName: '',
        studentName: '',
        studentClass: '',
    });

    // Mock data jika backend belum siap
    const mockParents: Parent[] = [
        {
            id: 1,
            parentName: 'Orang Tua 1',
            studentName: 'Ahmad Fauzi',
            studentClass: '7 A',
        },
        {
            id: 2,
            parentName: 'Orang Tua 2',
            studentName: 'Siti Nurhaliza',
            studentClass: '7 B',
        },
        {
            id: 3,
            parentName: 'Orang Tua 3',
            studentName: 'Budi Santoso',
            studentClass: '7 C',
        },
        {
            id: 4,
            parentName: 'Orang Tua 4',
            studentName: 'Dewi Lestari',
            studentClass: '7 D',
        },
        {
            id: 5,
            parentName: 'Orang Tua 5',
            studentName: 'Eko Prasetyo',
            studentClass: '8 A',
        },
        {
            id: 6,
            parentName: 'Orang Tua 6',
            studentName: 'Fitri Handayani',
            studentClass: '8 B',
        },
        {
            id: 7,
            parentName: 'Orang Tua 7',
            studentName: 'Galih Pratama',
            studentClass: '8 C',
        },
        {
            id: 8,
            parentName: 'Orang Tua 8',
            studentName: 'Hani Safitri',
            studentClass: '8 D',
        },
        {
            id: 9,
            parentName: 'Orang Tua 9',
            studentName: 'Irfan Hakim',
            studentClass: '9 A',
        },
        {
            id: 10,
            parentName: 'Orang Tua 10',
            studentName: 'Jasmine Putri',
            studentClass: '9 B',
        },
        {
            id: 11,
            parentName: 'Orang Tua 11',
            studentName: 'Kirana Azzahra',
            studentClass: '9 C',
        },
    ];

    const displayParents =
        parents && parents.length > 0 ? parents : mockParents;

    // Filter orang tua berdasarkan search
    const filteredParents = displayParents.filter(
        (parent) =>
            parent.parentName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            parent.studentName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const openEditModal = (parent: Parent) => {
        setSelectedParent(parent);
        setFormData({
            parentName: parent.parentName,
            studentName: parent.studentName,
            studentClass: parent.studentClass,
        });
        setShowEditModal(true);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Add parent submitted:', formData);
        // TODO: Kirim data ke backend
        alert(`Orang Tua ${formData.parentName} berhasil ditambahkan`);
        setFormData({ parentName: '', studentName: '', studentClass: '' });
        setShowAddModal(false);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Edit parent submitted:', formData);
        // TODO: Kirim data ke backend
        alert(`Orang Tua ${formData.parentName} berhasil diperbarui`);
        setFormData({ parentName: '', studentName: '', studentClass: '' });
        setShowEditModal(false);
        setSelectedParent(null);
    };

    const handleDelete = (parent: Parent) => {
        // TODO: Implement delete functionality
        console.log('Delete parent:', parent);
        alert(`Hapus data ${parent.parentName}?`);
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
                        onAddClick={() => setShowAddModal(true)}
                    />

                    {/* Parents Table */}
                    <ParentsTable
                        parents={filteredParents}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />

                    {/* Add Modal */}
                    <ParentFormModal
                        isOpen={showAddModal}
                        onClose={() => setShowAddModal(false)}
                        onSubmit={handleAddSubmit}
                        formData={formData}
                        onInputChange={handleInputChange}
                        mode="add"
                    />

                    {/* Edit Modal */}
                    {selectedParent && (
                        <ParentFormModal
                            isOpen={showEditModal}
                            onClose={() => setShowEditModal(false)}
                            onSubmit={handleEditSubmit}
                            formData={formData}
                            onInputChange={handleInputChange}
                            mode="edit"
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
