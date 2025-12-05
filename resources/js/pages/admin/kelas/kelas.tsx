import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface SchoolClass {
    id: number;
    name: string;
    grade: number;
    section: string;
    students_count?: number;
}

interface KelasPageProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    classes?: SchoolClass[];
}

export default function KelasPage({ auth, classes = [] }: KelasPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);

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

    // Mock data jika tidak ada dari backend
    const classList: SchoolClass[] = classes.length > 0 ? classes : [
        { id: 1, name: '7A', grade: 7, section: 'A', students_count: 30 },
        { id: 2, name: '7B', grade: 7, section: 'B', students_count: 28 },
        { id: 3, name: '7C', grade: 7, section: 'C', students_count: 29 },
        { id: 4, name: '8A', grade: 8, section: 'A', students_count: 32 },
        { id: 5, name: '8B', grade: 8, section: 'B', students_count: 30 },
        { id: 6, name: '8C', grade: 8, section: 'C', students_count: 31 },
        { id: 7, name: '9A', grade: 9, section: 'A', students_count: 28 },
        { id: 8, name: '9B', grade: 9, section: 'B', students_count: 27 },
        { id: 9, name: '9C', grade: 9, section: 'C', students_count: 29 },
    ];

    const filteredClasses = classList.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleClassClick = (classId: number) => {
        const cls = classList.find(c => c.id === classId);
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
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-lg sm:text-xl">K</span>
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold text-blue-700">Daftar Kelas</h1>
                            </div>
                            <Button onClick={handleCreate} className="gap-2">
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Tambah Kelas</span>
                                <span className="sm:hidden">Tambah</span>
                            </Button>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full sm:max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Cari Kelas"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 sm:pl-10 text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    {/* Classes Section */}
                    <div className="mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {filteredClasses.map((cls) => (
                                <div
                                    key={cls.id}
                                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-200 overflow-hidden"
                                >
                                    {/* Card Content - Clickable */}
                                    <button
                                        onClick={() => handleClassClick(cls.id)}
                                        className="w-full p-4 sm:p-6 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        {/* School Icon */}
                                        <div className="bg-orange-100 rounded-lg mb-3 sm:mb-4 p-4 sm:p-6 flex items-center justify-center">
                                            <div className="text-4xl sm:text-5xl">🏫</div>
                                        </div>

                                        {/* Class Info */}
                                        <div className="text-center mb-2">
                                            <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1">
                                                Kelas {cls.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600">
                                                {cls.students_count || 0} Siswa
                                            </p>
                                        </div>
                                    </button>

                                    {/* Action Buttons */}
                                    <div className="flex border-t border-gray-200">
                                        <button
                                            onClick={() => handleEdit(cls)}
                                            className="flex-1 p-3 text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 border-r border-gray-200"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            <span className="text-sm font-medium">Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cls)}
                                            className="flex-1 p-3 text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span className="text-sm font-medium">Hapus</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* No Results */}
                        {filteredClasses.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-xl">
                                <p className="text-gray-600 text-lg">Tidak ada kelas yang ditemukan</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Kelas Baru</DialogTitle>
                        <DialogDescription>
                            Masukkan informasi kelas yang ingin ditambahkan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-grade">Tingkat Kelas</Label>
                                <Input
                                    id="create-grade"
                                    type="number"
                                    min="7"
                                    max="9"
                                    placeholder="7-9"
                                    value={createForm.data.grade}
                                    onChange={(e) => createForm.setData('grade', e.target.value)}
                                    required
                                />
                                {createForm.errors.grade && (
                                    <p className="text-sm text-red-600">{createForm.errors.grade}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-section">Seksi (A, B, C, dst.)</Label>
                                <Input
                                    id="create-section"
                                    type="text"
                                    maxLength={1}
                                    placeholder="A"
                                    value={createForm.data.section}
                                    onChange={(e) => createForm.setData('section', e.target.value.toUpperCase())}
                                    required
                                />
                                {createForm.errors.section && (
                                    <p className="text-sm text-red-600">{createForm.errors.section}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="create-name">Nama Kelas</Label>
                                <Input
                                    id="create-name"
                                    type="text"
                                    placeholder="7A"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    required
                                />
                                {createForm.errors.name && (
                                    <p className="text-sm text-red-600">{createForm.errors.name}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Kelas</DialogTitle>
                        <DialogDescription>
                            Ubah informasi kelas.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-grade">Tingkat Kelas</Label>
                                <Input
                                    id="edit-grade"
                                    type="number"
                                    min="7"
                                    max="9"
                                    placeholder="7-9"
                                    value={editForm.data.grade}
                                    onChange={(e) => editForm.setData('grade', e.target.value)}
                                    required
                                />
                                {editForm.errors.grade && (
                                    <p className="text-sm text-red-600">{editForm.errors.grade}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-section">Seksi (A, B, C, dst.)</Label>
                                <Input
                                    id="edit-section"
                                    type="text"
                                    maxLength={1}
                                    placeholder="A"
                                    value={editForm.data.section}
                                    onChange={(e) => editForm.setData('section', e.target.value.toUpperCase())}
                                    required
                                />
                                {editForm.errors.section && (
                                    <p className="text-sm text-red-600">{editForm.errors.section}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Nama Kelas</Label>
                                <Input
                                    id="edit-name"
                                    type="text"
                                    placeholder="7A"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    required
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-red-600">{editForm.errors.name}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kelas?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kelas <strong>{selectedClass?.name}</strong>?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
