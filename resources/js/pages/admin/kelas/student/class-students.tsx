import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import ActionBar from './_components/ActionBar';
import ImportModal from './_components/ImportModal';
import StudentsTable from './_components/StudentsTable';
import StudentViewModal from './_components/StudentViewModal';
import StudentFormModal from './_components/StudentFormModal';
import {
    ClassStudentsProps,
    FormData,
    ImportedStudent,
    Student,
} from './types';

// Configure axios with CSRF token
const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

export default function ClassStudents({
    className,
    classDbId,
    classId,
    students,
}: ClassStudentsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importedData, setImportedData] = useState<ImportedStudent[]>([]);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
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

    const parseFile = (file: File) => {
        const isExcel =
            file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

        if (isExcel) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(
                        event.target?.result as ArrayBuffer,
                    );
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(
                        firstSheet,
                    ) as Record<
                        string,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        any
                    >[];

                    const parsed: ImportedStudent[] = jsonData
                        .map((row) => ({
                            name: row.NAMA || row.nama || '',
                            religion: row.AGAMA || row.agama || '',
                            gender:
                                row.JENIS_KELAMIN ||
                                row.jenis_kelamin ||
                                row.gender ||
                                '',
                        }))
                        .filter((item) => item.name);

                    setImportedData(parsed);
                    setImportFile(file);
                } catch (error) {
                    console.error('Error parsing Excel:', error);
                    alert(
                        'Gagal membaca file Excel. Pastikan format file benar.',
                    );
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const csv = event.target?.result as string;
                    const lines = csv.split('\n').filter((line) => line.trim());

                    const dataLines = lines.slice(1);
                    const parsed: ImportedStudent[] = dataLines
                        .map((line) => {
                            const [, nama, agama, jenisKelamin] = line
                                .split(',')
                                .map((item) => item.trim());
                            return {
                                name: nama || '',
                                religion: agama || '',
                                gender: jenisKelamin || '',
                            };
                        })
                        .filter((item) => item.name);

                    setImportedData(parsed);
                    setImportFile(file);
                } catch (error) {
                    console.error('Error parsing CSV:', error);
                    alert(
                        'Gagal membaca file CSV. Pastikan format file benar.',
                    );
                }
            };
            reader.readAsText(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            parseFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        const isValidFile =
            file &&
            (file.type === 'text/csv' ||
                file.name.endsWith('.csv') ||
                file.name.endsWith('.xlsx') ||
                file.name.endsWith('.xls') ||
                file.type ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel');

        if (isValidFile) {
            parseFile(file);
        } else {
            alert('Silakan upload file CSV atau Excel (.xlsx, .xls)');
        }
    };

    const handleImportSubmit = async () => {
        if (importedData.length === 0) {
            alert('Tidak ada data untuk diimport');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post('/admin/students/import', {
                class_id: classDbId,
                students: importedData,
            });

            if (response.data.success) {
                router.reload({ only: ['students'] });
                alert(response.data.message);
                setImportedData([]);
                setImportFile(null);
                setShowImportModal(false);
            }
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message ||
                'Terjadi kesalahan saat import siswa';
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadCSVTemplate = () => {
        const dataToExport =
            students.length > 0
                ? students.map((student, index) => ({
                      NO: index + 1,
                      NAMA: student.name,
                      AGAMA: student.religion,
                      JENIS_KELAMIN: student.gender,
                  }))
                : [
                      {
                          NO: 1,
                          NAMA: 'Ahmad Fauzi',
                          AGAMA: 'Islam',
                          JENIS_KELAMIN: 'L',
                      },
                      {
                          NO: 2,
                          NAMA: 'Siti Nurhaliza',
                          AGAMA: 'Islam',
                          JENIS_KELAMIN: 'P',
                      },
                      {
                          NO: 3,
                          NAMA: 'Budi Santoso',
                          AGAMA: 'Islam',
                          JENIS_KELAMIN: 'L',
                      },
                  ];

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Siswa');

        worksheet['!cols'] = [
            { wch: 5 },
            { wch: 20 },
            { wch: 12 },
            { wch: 15 },
        ];

        const fileName =
            students.length > 0
                ? `data_siswa_${className.replace(/\s+/g, '_')}.xlsx`
                : 'format_siswa.xlsx';

        XLSX.writeFile(workbook, fileName);
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
                alert('Data siswa berhasil diupdate');
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
            alert(message);
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
                alert('Siswa berhasil dihapus');
            }
        } catch (error) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    .response?.data?.message ||
                'Terjadi kesalahan saat menghapus siswa';
            alert(message);
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
                    />

                    {/* Students Table */}
                    <StudentsTable
                        students={filteredStudents}
                        onView={openViewModal}
                        onEdit={openEditModal}
                        onDelete={handleDeleteStudent}
                        onExport={downloadCSVTemplate}
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
                    <ImportModal
                        isOpen={showImportModal}
                        onClose={() => {
                            setShowImportModal(false);
                            setImportedData([]);
                            setImportFile(null);
                        }}
                        importedData={importedData}
                        importFile={importFile}
                        isDragging={isDragging}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onFileSelect={handleFileSelect}
                        onDownloadTemplate={downloadCSVTemplate}
                        onImportSubmit={handleImportSubmit}
                        onClearImport={() => {
                            setImportedData([]);
                            setImportFile(null);
                        }}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
