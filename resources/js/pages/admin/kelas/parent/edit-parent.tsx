import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useToast } from '@/components/ui/toast';
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Class, ChildData } from './types';

interface EditParentProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    classId: string;
    className: string;
    allClasses: Class[];
    parent: {
        id: number;
        name: string;
        username?: string;
        email: string;
        phone?: string;
        address?: string;
        occupation?: string;
        children: {
            id: number;
            studentId: number;
            classId: number;
            relationship: 'ayah' | 'ibu' | 'wali';
        }[];
    };
}

export default function EditParent({
    auth,
    classId,
    className,
    allClasses,
    parent,
}: EditParentProps) {
    const { showError } = useToast();
    const [formData, setFormData] = useState({
        name: parent.name,
        username: parent.username || '',
        email: parent.email,
        phone: parent.phone || '',
        address: parent.address || '',
        occupation: parent.occupation || '',
        children: parent.children.map((child, index) => ({
            id: (index + 1).toString(),
            classId: child.classId.toString(),
            studentId: child.studentId.toString(),
            relationship: child.relationship,
        })) as ChildData[],
    });

    const [availableStudentsPerChild, setAvailableStudentsPerChild] = useState<
        Record<string, { id: number; name: string }[]>
    >({});

    // Initialize available students for existing children on component mount
    useEffect(() => {
        const initialStudents: Record<string, { id: number; name: string }[]> = {};

        formData.children.forEach((child) => {
            if (child.classId) {
                const selectedClass = allClasses.find(
                    (c) => c.id.toString() === child.classId,
                );
                if (selectedClass) {
                    initialStudents[child.id] = selectedClass.students || [];
                }
            }
        });

        setAvailableStudentsPerChild(initialStudents);
    }, []); // Run only once on mount

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target;

        // Auto-fill username from name
        if (name === 'name') {
            const autoUsername = value
                .toLowerCase()
                .replace(/\s+/g, '') // Remove all spaces
                .replace(/[^a-z0-9]/g, ''); // Remove special characters

            setFormData((prev) => ({
                ...prev,
                name: value,
                username: autoUsername,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleChildChange = (
        childId: string,
        field: keyof Omit<ChildData, 'id'>,
        value: string,
    ) => {
        setFormData((prev) => ({
            ...prev,
            children: prev.children.map((child) =>
                child.id === childId ? { ...child, [field]: value } : child,
            ),
        }));

        // Update available students when class changes
        if (field === 'classId') {
            const selectedClass = allClasses.find(
                (c) => c.id.toString() === value,
            );
            setAvailableStudentsPerChild((prev) => ({
                ...prev,
                [childId]: selectedClass?.students || [],
            }));
        }
    };

    const addChild = () => {
        const newId = (
            Math.max(...formData.children.map((c) => parseInt(c.id))) + 1
        ).toString();
        setFormData((prev) => ({
            ...prev,
            children: [
                ...prev.children,
                {
                    id: newId,
                    classId: '',
                    studentId: '',
                    relationship: '',
                },
            ],
        }));
    };

    const removeChild = (childId: string) => {
        if (formData.children.length > 1) {
            setFormData((prev) => ({
                ...prev,
                children: prev.children.filter((child) => child.id !== childId),
            }));
            setAvailableStudentsPerChild((prev) => {
                const newState = { ...prev };
                delete newState[childId];
                return newState;
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.put(`/admin/orangtua/${parent.id}/update`, {
            name: formData.name,
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            occupation: formData.occupation,
            children: formData.children.map((child) => ({
                classId: child.classId,
                studentId: child.studentId,
                relationship: child.relationship,
            })),
            classId: classId,
        } as any, {
            onSuccess: () => {
                // Redirect will be handled by backend
            },
            onError: (errors) => {
                console.error('Error updating parent:', errors);
                showError('Gagal memperbarui data orang tua. Silakan coba lagi.');
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Edit Data Orang Tua - ${className}`} />

            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 py-6">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <button
                            onClick={() =>
                                router.visit(`/admin/orangtua/kelas/${classId}`)
                            }
                            className="mb-4 flex items-center gap-2 text-sm font-medium text-purple-600 transition-colors hover:text-purple-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Daftar Orang Tua
                        </button>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            Edit Data Orang Tua
                        </h1>
                        <p className="text-gray-600">
                            Perbarui informasi orang tua di bawah
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Data Orang Tua */}
                        <div className="rounded-2xl bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-xl font-bold text-gray-900">
                                Data Orang Tua
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Nama */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Nama Orang Tua{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan nama orang tua"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Email{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="contoh@email.com"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Username <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="Username untuk login (otomatis dari nama)"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Username otomatis diisi dari nama (huruf kecil, tanpa spasi)
                                    </p>
                                </div>

                                {/* No. Telepon */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        No. Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="08xxxxxxxxxx"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                {/* Alamat */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Alamat
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan alamat lengkap"
                                        rows={3}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                {/* Pekerjaan */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Pekerjaan
                                    </label>
                                    <input
                                        type="text"
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan pekerjaan"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Data Anak */}
                        <div className="rounded-2xl bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-xl font-bold text-gray-900">
                                Data Anak{' '}
                                <span className="text-red-500">*</span>
                            </h2>
                            <div className="space-y-4">
                                {formData.children.map((child, index) => {
                                    const availableStudents =
                                        availableStudentsPerChild[child.id] ||
                                        [];
                                    return (
                                        <div
                                            key={child.id}
                                            className="rounded-xl border-2 border-gray-200 bg-gray-50 p-5"
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    Anak ke-{index + 1}
                                                </h3>
                                                {formData.children.length >
                                                    1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeChild(child.id)
                                                            }
                                                            className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Hapus
                                                        </button>
                                                    )}
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-3">
                                                {/* Hubungan */}
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                                        Hubungan{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </label>
                                                    <select
                                                        value={
                                                            child.relationship
                                                        }
                                                        onChange={(e) =>
                                                            handleChildChange(
                                                                child.id,
                                                                'relationship',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                                                        required
                                                    >
                                                        <option value="">
                                                            Pilih Hubungan
                                                        </option>
                                                        <option value="ayah">
                                                            Ayah
                                                        </option>
                                                        <option value="ibu">
                                                            Ibu
                                                        </option>
                                                        <option value="wali">
                                                            Wali
                                                        </option>
                                                    </select>
                                                </div>

                                                {/* Kelas */}
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                                        Kelas{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </label>
                                                    <select
                                                        value={child.classId}
                                                        onChange={(e) =>
                                                            handleChildChange(
                                                                child.id,
                                                                'classId',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                                                        required
                                                    >
                                                        <option value="">
                                                            Pilih Kelas
                                                        </option>
                                                        {allClasses.map(
                                                            (classItem) => (
                                                                <option
                                                                    key={
                                                                        classItem.id
                                                                    }
                                                                    value={
                                                                        classItem.id
                                                                    }
                                                                >
                                                                    Kelas{' '}
                                                                    {
                                                                        classItem.name
                                                                    }
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </div>

                                                {/* Nama Anak */}
                                                {child.classId && (
                                                    <div>
                                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                                            Nama Anak{' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </label>
                                                        <select
                                                            value={
                                                                child.studentId
                                                            }
                                                            onChange={(e) =>
                                                                handleChildChange(
                                                                    child.id,
                                                                    'studentId',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                                                            required
                                                        >
                                                            <option value="">
                                                                Pilih Anak
                                                            </option>
                                                            {availableStudents.length >
                                                                0 ? (
                                                                availableStudents.map(
                                                                    (
                                                                        student,
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                student.id
                                                                            }
                                                                            value={
                                                                                student.id
                                                                            }
                                                                        >
                                                                            {
                                                                                student.name
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <option
                                                                    value=""
                                                                    disabled
                                                                >
                                                                    Tidak ada
                                                                    siswa di
                                                                    kelas ini
                                                                </option>
                                                            )}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Add Child Button */}
                                <button
                                    type="button"
                                    onClick={addChild}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50 px-6 py-4 text-sm font-semibold text-purple-600 transition-all hover:border-purple-400 hover:bg-purple-100"
                                >
                                    <Plus className="h-5 w-5" />
                                    Tambah Anak Lain
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() =>
                                    router.visit(
                                        `/admin/orangtua/kelas/${classId}`,
                                    )
                                }
                                className="flex-1 rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-300 md:flex-none md:px-8"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="flex-1 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-700 md:px-8"
                            >
                                Perbarui Data Orang Tua
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
