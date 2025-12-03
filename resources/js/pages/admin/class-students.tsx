import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, Edit, Trash2, X, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Student {
    id: number;
    name: string;
    religion: string;
    gender: string;
}

interface ImportedStudent {
    name: string;
    religion: string;
    gender: string;
}

interface ClassStudentsProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    className: string;
    classId: string;
    students: Student[];
}

interface FormData {
    name: string;
    religion: string;
    gender: string;
}

export default function ClassStudents({ auth, className, classId, students }: ClassStudentsProps) {
    // Mock data jika backend belum siap
    const initialMockStudents: Student[] = [
        { id: 1, name: 'Ahmad Fauzi', religion: 'Islam', gender: 'L' },
        { id: 2, name: 'Siti Nurhaliza', religion: 'Islam', gender: 'P' },
        { id: 3, name: 'Budi Santoso', religion: 'Islam', gender: 'L' },
        { id: 4, name: 'Dewi Lestari', religion: 'Islam', gender: 'P' },
        { id: 5, name: 'Eko Prasetyo', religion: 'Islam', gender: 'L' },
        { id: 6, name: 'Fitri Handayani', religion: 'Islam', gender: 'P' },
        { id: 7, name: 'Galih Pratama', religion: 'Islam', gender: 'L' },
        { id: 8, name: 'Hani Safitri', religion: 'Islam', gender: 'P' },
        { id: 9, name: 'Irfan Hakim', religion: 'Islam', gender: 'L' },
        { id: 10, name: 'Jasmine Putri', religion: 'Islam', gender: 'P' },
        { id: 11, name: 'Kirana Azzahra', religion: 'Islam', gender: 'P' },
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importedData, setImportedData] = useState<ImportedStudent[]>([]);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [localStudents, setLocalStudents] = useState<Student[]>(
        students && students.length > 0 ? students : initialMockStudents
    );
    const [formData, setFormData] = useState<FormData>({
        name: '',
        religion: '',
        gender: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const parseFile = (file: File) => {
        const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

        if (isExcel) {
            // Parse Excel file
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet) as any[];

                    const parsed: ImportedStudent[] = jsonData.map(row => ({
                        name: row.NAMA || row.nama || '',
                        religion: row.AGAMA || row.agama || '',
                        gender: row.JENIS_KELAMIN || row.jenis_kelamin || row.gender || '',
                    })).filter(item => item.name);

                    setImportedData(parsed);
                    setImportFile(file);
                } catch (error) {
                    console.error('Error parsing Excel:', error);
                    alert('Gagal membaca file Excel. Pastikan format file benar.');
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            // Parse CSV file
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const csv = event.target?.result as string;
                    const lines = csv.split('\n').filter(line => line.trim());

                    // Skip header row
                    const dataLines = lines.slice(1);
                    const parsed: ImportedStudent[] = dataLines.map(line => {
                        const [, nama, agama, jenisKelamin] = line.split(',').map(item => item.trim());
                        return {
                            name: nama || '',
                            religion: agama || '',
                            gender: jenisKelamin || '',
                        };
                    }).filter(item => item.name);

                    setImportedData(parsed);
                    setImportFile(file);
                } catch (error) {
                    console.error('Error parsing CSV:', error);
                    alert('Gagal membaca file CSV. Pastikan format file benar.');
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
        const isValidFile = file && (
            file.type === 'text/csv' ||
            file.name.endsWith('.csv') ||
            file.name.endsWith('.xlsx') ||
            file.name.endsWith('.xls') ||
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel'
        );

        if (isValidFile) {
            parseFile(file);
        } else {
            alert('Silakan upload file CSV atau Excel (.xlsx, .xls)');
        }
    };

    const handleImportSubmit = () => {
        console.log('Importing data:', importedData);

        // Convert imported data to Student format with new IDs
        const newStudents: Student[] = importedData.map((item, index) => ({
            id: Date.now() + index, // Generate unique ID
            name: item.name,
            religion: item.religion,
            gender: item.gender,
        }));

        // Add to local students
        setLocalStudents(prev => [...prev, ...newStudents]);

        alert(`${importedData.length} siswa berhasil diimport`);
        setImportedData([]);
        setImportFile(null);
        setShowImportModal(false);
    };

    const downloadCSVTemplate = () => {
        // Jika ada data di tabel, export data yang ada
        // Jika belum ada, export template sample
        const dataToExport = localStudents.length > 0
            ? localStudents.map((student, index) => ({
                'NO': index + 1,
                'NAMA': student.name,
                'AGAMA': student.religion,
                'JENIS_KELAMIN': student.gender
            }))
            : [
                { 'NO': 1, 'NAMA': 'Ahmad Fauzi', 'AGAMA': 'Islam', 'JENIS_KELAMIN': 'L' },
                { 'NO': 2, 'NAMA': 'Siti Nurhaliza', 'AGAMA': 'Islam', 'JENIS_KELAMIN': 'P' },
                { 'NO': 3, 'NAMA': 'Budi Santoso', 'AGAMA': 'Islam', 'JENIS_KELAMIN': 'L' },
            ];

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Siswa');

        // Set column widths
        worksheet['!cols'] = [
            { wch: 5 },  // NO
            { wch: 20 }, // NAMA
            { wch: 12 }, // AGAMA
            { wch: 15 }  // JENIS_KELAMIN
        ];

        const fileName = localStudents.length > 0
            ? `data_siswa_${className.replace(/\s+/g, '_')}.xlsx`
            : 'format_siswa.xlsx';

        XLSX.writeFile(workbook, fileName);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Add form submitted:', formData);

        // Create new student
        const newStudent: Student = {
            id: Date.now(), // Generate unique ID
            name: formData.name,
            religion: formData.religion,
            gender: formData.gender,
        };

        // Add to local students
        setLocalStudents(prev => [...prev, newStudent]);

        alert('Siswa berhasil ditambahkan');
        setFormData({ name: '', religion: '', gender: '' });
        setShowAddModal(false);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Edit form submitted:', formData);

        if (selectedStudent) {
            // Update student in local students
            setLocalStudents(prev => prev.map(student =>
                student.id === selectedStudent.id
                    ? { ...student, name: formData.name, religion: formData.religion, gender: formData.gender }
                    : student
            ));

            alert('Data siswa berhasil diupdate');
        }

        setFormData({ name: '', religion: '', gender: '' });
        setSelectedStudent(null);
        setShowEditModal(false);
    };

    const openViewModal = (student: Student) => {
        setSelectedStudent(student);
        setShowViewModal(true);
    };

    const openEditModal = (student: Student) => {
        setSelectedStudent(student);
        setFormData({
            name: student.name,
            religion: student.religion,
            gender: student.gender,
        });
        setShowEditModal(true);
    };

    const handleDeleteStudent = (student: Student) => {
        if (confirm(`Apakah Anda yakin ingin menghapus siswa "${student.name}"?`)) {
            // Remove from local students
            setLocalStudents(prev => prev.filter(s => s.id !== student.id));
            alert('Siswa berhasil dihapus');
        }
    };

    // Filter siswa berdasarkan search
    const filteredStudents = localStudents.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title={`Daftar Siswa ${className}`} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <Link
                                href="/admin/siswa-dashboard"
                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Kembali ke Dashboard
                            </Link>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">List Nama Siswa</h1>
                        <p className="text-sm sm:text-base text-gray-600">Daftar siswa {className}</p>
                    </div>

                    {/* Action Bar */}
                    <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-2 sm:p-4 mb-4 sm:mb-6">
                        {/* Mobile Layout: Buttons side by side */}
                        <div className="flex gap-2 mb-3 sm:hidden">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Tambah User
                            </button>
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center text-sm">
                                <Upload className="h-4 w-4" />
                                Import tabel
                            </button>
                        </div>

                        {/* Desktop Layout: Buttons and search in a row */}
                        <div className="hidden sm:flex flex-col lg:flex-row gap-2 lg:gap-3">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 lg:px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center text-sm lg:text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Tambah User
                            </button>
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 lg:px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center text-sm lg:text-base">
                                <Upload className="h-4 w-4 lg:h-5 lg:w-5" />
                                Import File
                            </button>
                            <div className="relative flex-1 lg:max-w-sm">
                                <input
                                    type="text"
                                    placeholder="Cari Siswa"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 lg:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 lg:h-5 lg:w-5 absolute left-3 top-2.5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Search Box for Mobile (Below buttons) */}
                        <div className="relative sm:hidden">
                            <input
                                type="text"
                                placeholder="Cari Siswa"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 absolute left-3 top-2.5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Students Table */}
                    <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg overflow-hidden">
                        {/* Table Header with Export Button */}
                        <div className="border-b border-gray-200 px-4 py-3 sm:px-6 flex items-center justify-between bg-gray-50">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900">Data Siswa</h3>
                            <button
                                onClick={downloadCSVTemplate}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 text-xs sm:text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Export Table
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-300 bg-gray-100">
                                        <th className="py-2.5 px-2 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-[11px] sm:text-xs lg:text-sm">NO</th>
                                        <th className="py-2.5 px-2 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-[11px] sm:text-xs lg:text-sm">NAMA</th>
                                        <th className="py-2.5 px-2 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-[11px] sm:text-xs lg:text-sm">AGAMA</th>
                                        <th className="py-2.5 px-2 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-[11px] sm:text-xs lg:text-sm hidden sm:table-cell">JENIS KELAMIN</th>
                                        <th className="py-2.5 px-2 sm:py-4 sm:px-4 lg:px-6 text-center font-bold text-gray-900 text-[11px] sm:text-xs lg:text-sm">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student, index) => (
                                        <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="py-2.5 px-2 sm:py-4 sm:px-4 lg:px-6 text-center">
                                                <span className="font-semibold text-gray-900 text-[11px] sm:text-xs lg:text-sm">{index + 1}.</span>
                                            </td>
                                            <td className="py-2.5 px-2 sm:py-4 sm:px-4 lg:px-6 text-center">
                                                <span className="font-bold text-gray-900 text-[11px] sm:text-xs lg:text-sm">{student.name}</span>
                                            </td>
                                            <td className="py-2.5 px-2 sm:py-4 sm:px-4 lg:px-6 text-center">
                                                <span className="font-bold text-gray-900 text-[11px] sm:text-xs lg:text-sm">{student.religion}</span>
                                            </td>
                                            <td className="py-2.5 px-2 sm:py-4 sm:px-4 lg:px-6 text-center hidden sm:table-cell">
                                                <span className="font-bold text-gray-900 text-[11px] sm:text-xs lg:text-sm">{student.gender}</span>
                                            </td>
                                            <td className="py-2.5 px-2 sm:py-4 sm:px-4 lg:px-6">
                                                <div className="flex justify-center gap-0.5 sm:gap-2">
                                                    <button
                                                        onClick={() => openViewModal(student)}
                                                        className="bg-gray-800 hover:bg-gray-900 text-white p-1 sm:p-2 rounded transition-colors flex-shrink-0"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(student)}
                                                        className="bg-gray-800 hover:bg-gray-900 text-white p-1 sm:p-2 rounded transition-colors flex-shrink-0"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteStudent(student)}
                                                        className="bg-red-600 hover:bg-red-700 text-white p-1 sm:p-2 rounded transition-colors flex-shrink-0"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* No Results */}
                        {filteredStudents.length === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-gray-600 font-medium">Tidak ada siswa yang ditemukan</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Tambah Siswa */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Tambah Siswa Baru</h2>
                                <p className="text-sm text-gray-600 mt-1">Isi form di bawah untuk menambah data siswa</p>
                            </div>

                            <form onSubmit={handleAddSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nama Siswa
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan nama siswa"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Agama
                                    </label>
                                    <select
                                        name="religion"
                                        value={formData.religion}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                                        required
                                    >
                                        <option value="">Pilih Agama</option>
                                        <option value="Islam">Islam</option>
                                        <option value="Kristen">Kristen</option>
                                        <option value="Katolik">Katolik</option>
                                        <option value="Hindu">Hindu</option>
                                        <option value="Buddha">Buddha</option>
                                        <option value="Konghucu">Konghucu</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                                        required
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors text-sm"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Lihat Detail Siswa */}
                {showViewModal && selectedStudent && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Detail Siswa</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nama Siswa
                                    </label>
                                    <p className="text-gray-900 font-semibold">{selectedStudent.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Agama
                                    </label>
                                    <p className="text-gray-900 font-semibold">{selectedStudent.religion}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Jenis Kelamin
                                    </label>
                                    <p className="text-gray-900 font-semibold">{selectedStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowViewModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors text-sm"
                                    >
                                        Tutup
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowViewModal(false);
                                            openEditModal(selectedStudent);
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Edit Siswa */}
                {showEditModal && selectedStudent && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Edit Data Siswa</h2>
                                <p className="text-sm text-gray-600 mt-1">Ubah informasi siswa di bawah</p>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nama Siswa
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan nama siswa"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Agama
                                    </label>
                                    <select
                                        name="religion"
                                        value={formData.religion}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                                        required
                                    >
                                        <option value="">Pilih Agama</option>
                                        <option value="Islam">Islam</option>
                                        <option value="Kristen">Kristen</option>
                                        <option value="Katolik">Katolik</option>
                                        <option value="Hindu">Hindu</option>
                                        <option value="Buddha">Buddha</option>
                                        <option value="Konghucu">Konghucu</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                                        required
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors text-sm"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm"
                                    >
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Import Siswa */}
                {showImportModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={() => {
                                    setShowImportModal(false);
                                    setImportedData([]);
                                    setImportFile(null);
                                }}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
                                aria-label="Close modal"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <div className="mb-6 pr-6">
                                <h2 className="text-2xl font-bold text-gray-900">Import Data Siswa</h2>
                                <p className="text-sm text-gray-600 mt-1">Unggah file Excel (.xlsx) atau CSV untuk import data siswa secara massal</p>
                            </div>

                            {!importedData.length ? (
                                <>
                                    {/* Drag Drop Area */}
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                            isDragging
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                                        }`}
                                    >
                                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-sm font-semibold text-gray-900 mb-2">
                                            Drag dan drop file Excel atau CSV di sini
                                        </p>
                                        <p className="text-xs text-gray-600 mb-4">atau</p>
                                        <label className="inline-block">
                                            <input
                                                type="file"
                                                accept=".csv,.xlsx,.xls"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                            <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer text-sm">
                                                Pilih File
                                            </span>
                                        </label>
                                    </div>

                                    {/* Format Info */}
                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm font-semibold text-blue-900">Download template file Excel:</p>
                                            <button
                                                onClick={downloadCSVTemplate}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-semibold transition-colors text-xs flex items-center gap-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                                Download
                                            </button>
                                        </div>
                                        <p className="text-sm text-blue-900">Silahkan isi data dari file berikut, lalu upload ulang di menu atas</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Preview Data */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Preview Data ({importedData.length} siswa)</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b-2 border-gray-300 bg-gray-100">
                                                        <th className="py-2 px-3 text-center font-bold text-gray-900">NO</th>
                                                        <th className="py-2 px-3 text-center font-bold text-gray-900">NAMA</th>
                                                        <th className="py-2 px-3 text-center font-bold text-gray-900">AGAMA</th>
                                                        <th className="py-2 px-3 text-center font-bold text-gray-900">JENIS KELAMIN</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {importedData.map((student, index) => (
                                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                                            <td className="py-2 px-3 text-center text-gray-900">{index + 1}</td>
                                                            <td className="py-2 px-3 text-center text-gray-900">{student.name}</td>
                                                            <td className="py-2 px-3 text-center text-gray-900">{student.religion}</td>
                                                            <td className="py-2 px-3 text-center text-gray-900">{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImportedData([]);
                                                setImportFile(null);
                                            }}
                                            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors text-sm"
                                        >
                                            Pilih File Lain
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleImportSubmit}
                                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-sm"
                                        >
                                            Import Data
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
