import { useState, useCallback } from 'react';
import { Upload, X, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface ExcelImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    uploadUrl: string;
    entityName: string; // 'siswa', 'guru', or 'orangtua'
    onSuccess?: () => void;
    additionalData?: Record<string, string | number>; // Additional form data to send
}

interface ImportError {
    row: number;
    attribute: string;
    errors: string[];
    values?: Record<string, unknown>;
}

export default function ExcelImportModal({
    isOpen,
    onClose,
    uploadUrl,
    entityName,
    onSuccess,
    additionalData,
}: ExcelImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState<ImportError[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [importedCount, setImportedCount] = useState(0);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && isValidFile(droppedFile)) {
            setFile(droppedFile);
            setErrors([]);
            setSuccessMessage('');
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && isValidFile(selectedFile)) {
            setFile(selectedFile);
            setErrors([]);
            setSuccessMessage('');
        }
    };

    const isValidFile = (file: File): boolean => {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
        ];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            alert('Format file tidak valid. Hanya file Excel (.xlsx, .xls) yang diperbolehkan.');
            return false;
        }

        if (file.size > maxSize) {
            alert('Ukuran file terlalu besar. Maksimal 5MB.');
            return false;
        }

        return true;
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);
        setErrors([]);
        setSuccessMessage('');

        const formData = new FormData();
        formData.append('file', file);

        // Append additional data if provided
        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, String(value));
            });
        }

        // Get CSRF token
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');

        try {
            const response = await axios.post(uploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            if (response.data.success) {
                setSuccessMessage(response.data.message);
                setImportedCount(response.data.imported || 0);
                setFile(null);

                // Call onSuccess callback after short delay
                setTimeout(() => {
                    onSuccess?.();
                    handleClose();
                }, 2000);
            } else {
                setErrors(response.data.errors || []);
                setImportedCount(response.data.imported || 0);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const errorData = error.response.data;
                setErrors(errorData.errors || []);
                alert(errorData.message || 'Terjadi kesalahan saat import');
            } else {
                alert('Terjadi kesalahan saat upload file');
            }
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleClose = () => {
        setFile(null);
        setErrors([]);
        setSuccessMessage('');
        setImportedCount(0);
        setUploadProgress(0);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        Import {entityName} dari Excel
                    </h2>
                    <button
                        onClick={handleClose}
                        className="rounded-full p-1 hover:bg-gray-100"
                        disabled={isUploading}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Drag & Drop Area */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative mb-4 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragging
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-gray-50'
                        }`}
                >
                    <FileSpreadsheet className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <p className="mb-2 text-sm font-medium text-gray-700">
                        Drag & drop file Excel di sini
                    </p>
                    <p className="mb-4 text-xs text-gray-500">
                        atau klik tombol di bawah untuk memilih file
                    </p>
                    <label className="inline-block cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        <Upload className="mr-2 inline h-4 w-4" />
                        Pilih File
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isUploading}
                        />
                    </label>
                    <p className="mt-2 text-xs text-gray-500">
                        Format: .xlsx atau .xls (maksimal 5MB)
                    </p>
                </div>

                {/* Selected File */}
                {file && (
                    <div className="mb-4 flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                        <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                        {!isUploading && (
                            <button
                                onClick={() => setFile(null)}
                                className="rounded-full p-1 hover:bg-blue-100"
                            >
                                <X className="h-4 w-4 text-gray-600" />
                            </button>
                        )}
                    </div>
                )}

                {/* Upload Progress */}
                {isUploading && (
                    <div className="mb-4">
                        <div className="mb-1 flex justify-between text-sm">
                            <span className="text-gray-700">Mengupload...</span>
                            <span className="font-medium text-blue-600">
                                {uploadProgress}%
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 flex items-start gap-3 rounded-lg bg-green-50 p-4">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-900">
                                {successMessage}
                            </p>
                            <p className="mt-1 text-xs text-green-700">
                                {importedCount} data berhasil diimport
                            </p>
                        </div>
                    </div>
                )}

                {/* Errors */}
                {errors.length > 0 && (
                    <div className="mb-4 max-h-60 overflow-y-auto rounded-lg bg-red-50 p-4">
                        <div className="mb-2 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <p className="text-sm font-medium text-red-900">
                                Ditemukan {errors.length} error
                                {importedCount > 0 && ` (${importedCount} data berhasil diimport)`}
                            </p>
                        </div>
                        <ul className="space-y-2 text-xs">
                            {errors.map((error, index) => (
                                <li key={index} className="text-red-700">
                                    <span className="font-medium">Baris {error.row}:</span>{' '}
                                    {error.errors.join(', ')}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
                        disabled={isUploading}
                    >
                        Tutup
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isUploading ? 'Mengupload...' : 'Upload & Import'}
                    </button>
                </div>
            </div>
        </div>
    );
}
