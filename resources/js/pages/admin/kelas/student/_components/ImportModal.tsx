import { Upload, X } from 'lucide-react';
import { ImportedStudent } from '../types';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    importedData: ImportedStudent[];
    importFile: File | null;
    isDragging: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDownloadTemplate: () => void;
    onImportSubmit: () => void;
    onClearImport: () => void;
    isSubmitting?: boolean;
}

export default function ImportModal({
    isOpen,
    onClose,
    importedData,
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileSelect,
    onDownloadTemplate,
    onImportSubmit,
    onClearImport,
    isSubmitting = false,
}: ImportModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-gray-500 transition-colors hover:text-gray-700"
                    aria-label="Close modal"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="mb-6 pr-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Import Data Siswa
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Unggah file Excel (.xlsx) atau CSV untuk import data
                        siswa secara massal
                    </p>
                </div>

                {!importedData.length ? (
                    <>
                        {/* Drag Drop Area */}
                        <div
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                                isDragging
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                            }`}
                        >
                            <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <p className="mb-2 text-sm font-semibold text-gray-900">
                                Drag dan drop file Excel atau CSV di sini
                            </p>
                            <p className="mb-4 text-xs text-gray-600">atau</p>
                            <label className="inline-block">
                                <input
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={onFileSelect}
                                    className="hidden"
                                />
                                <span className="inline-block cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                                    Pilih File
                                </span>
                            </label>
                        </div>

                        {/* Format Info */}
                        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-sm font-semibold text-blue-900">
                                    Download template file Excel:
                                </p>
                                <button
                                    onClick={onDownloadTemplate}
                                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Download
                                </button>
                            </div>
                            <p className="text-sm text-blue-900">
                                Silahkan isi data dari file berikut, lalu upload
                                ulang di menu atas
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Preview Data */}
                        <div className="mb-6">
                            <h3 className="mb-4 text-lg font-bold text-gray-900">
                                Preview Data ({importedData.length} siswa)
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-gray-300 bg-gray-100">
                                            <th className="px-3 py-2 text-center font-bold text-gray-900">
                                                NO
                                            </th>
                                            <th className="px-3 py-2 text-center font-bold text-gray-900">
                                                NAMA
                                            </th>
                                            <th className="px-3 py-2 text-center font-bold text-gray-900">
                                                AGAMA
                                            </th>
                                            <th className="px-3 py-2 text-center font-bold text-gray-900">
                                                JENIS KELAMIN
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {importedData.map((student, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-gray-200 hover:bg-gray-50"
                                            >
                                                <td className="px-3 py-2 text-center text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-3 py-2 text-center text-gray-900">
                                                    {student.name}
                                                </td>
                                                <td className="px-3 py-2 text-center text-gray-900">
                                                    {student.religion}
                                                </td>
                                                <td className="px-3 py-2 text-center text-gray-900">
                                                    {student.gender === 'L'
                                                        ? 'Laki-laki'
                                                        : 'Perempuan'}
                                                </td>
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
                                onClick={onClearImport}
                                disabled={isSubmitting}
                                className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-300 disabled:opacity-50"
                            >
                                Pilih File Lain
                            </button>
                            <button
                                type="button"
                                onClick={onImportSubmit}
                                disabled={isSubmitting}
                                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Mengimport...' : 'Import Data'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
