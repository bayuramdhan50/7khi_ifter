import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import ClassCard from './_components/ClassCard';
import CreateClassDialog from './_components/CreateClassDialog';
import DeleteClassDialog from './_components/DeleteClassDialog';
import EditClassDialog from './_components/EditClassDialog';
import SearchBar from './_components/SearchBar';
import { KelasPageProps, SchoolClass } from './types';

export default function KelasPage({ classes = [] }: KelasPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(
        null,
    );

    const createForm = useForm({
        name: '',
        grade: '',
        section: '',
    });

    const editForm = useForm({
        name: '',
        grade: '',
        section: '',
    });

    const filteredClasses = classes.filter((cls) =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleClassClick = (classId: number) => {
        const cls = classes.find((c) => c.id === classId);
        if (cls) {
            const formattedId = `${cls.grade}${cls.section.toLowerCase()}`;
            router.visit(`/admin/siswa/kelas/${formattedId}`);
        }
    };

    const handleCreate = () => {
        setIsCreateDialogOpen(true);
        createForm.reset();
    };

    const handleEdit = (cls: SchoolClass) => {
        setSelectedClass(cls);
        editForm.setData({
            name: cls.name,
            grade: cls.grade.toString(),
            section: cls.section,
        });
        setIsEditDialogOpen(true);
    };

    const handleDelete = (cls: SchoolClass) => {
        setSelectedClass(cls);
        setIsDeleteDialogOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/classes', {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                createForm.reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedClass) {
            editForm.put(`/admin/classes/${selectedClass.id}`, {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    editForm.reset();
                    setSelectedClass(null);
                },
            });
        }
    };

    const confirmDelete = () => {
        if (selectedClass) {
            router.delete(`/admin/classes/${selectedClass.id}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedClass(null);
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Daftar Kelas" />

            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="mb-4 flex items-center justify-between sm:mb-6">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 sm:h-12 sm:w-12">
                                    <span className="text-lg font-bold text-white sm:text-xl">
                                        K
                                    </span>
                                </div>
                                <h1 className="text-xl font-bold text-blue-700 sm:text-2xl">
                                    Daftar Kelas
                                </h1>
                            </div>
                            <Button onClick={handleCreate} className="gap-2">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Tambah Kelas
                                </span>
                                <span className="sm:hidden">Tambah</span>
                            </Button>
                        </div>

                        {/* Search Bar */}
                        <SearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                    </div>

                    {/* Classes Section */}
                    <div className="mb-6">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                            {filteredClasses.map((cls) => (
                                <ClassCard
                                    key={cls.id}
                                    cls={cls}
                                    onClassClick={handleClassClick}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                        {/* No Results */}
                        {filteredClasses.length === 0 && (
                            <div className="rounded-xl bg-white py-12 text-center">
                                <p className="text-lg text-gray-600">
                                    Tidak ada kelas yang ditemukan
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Dialog */}
            <CreateClassDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                form={createForm}
                onSubmit={submitCreate}
            />

            {/* Edit Dialog */}
            <EditClassDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                form={editForm}
                onSubmit={submitEdit}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteClassDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                selectedClass={selectedClass}
                onConfirm={confirmDelete}
            />
        </AppLayout>
    );
}
