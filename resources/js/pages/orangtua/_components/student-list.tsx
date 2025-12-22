import { Student, StudentStats } from '../types/types';

interface StudentListProps {
    students: Student[];
    selectedStudent: number | null;
    onSelectStudent: (studentId: number) => void;
    stats: StudentStats;
}

export default function StudentList({ students, selectedStudent, onSelectStudent, stats }: StudentListProps) {
    const selectedStudentData = students.find(s => s.id === selectedStudent);

    return (
        <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-blue-900 mb-4">Pilih Anak</h2>

                {/* Student List */}
                <div className="space-y-2">
                    {students.length > 0 ? (
                        students.map((student) => (
                            <button
                                key={student.id}
                                onClick={() => onSelectStudent(student.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                                    selectedStudent === student.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <div className="font-semibold">{student.name}</div>
                                <div className={`text-sm ${selectedStudent === student.id ? 'text-blue-100' : 'text-gray-600'}`}>
                                    Kelas {student.class}
                                </div>
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">Tidak ada data siswa</p>
                    )}
                </div>

                {/* Student Info Card */}
                {selectedStudentData && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-2">Statistik Approval Keseluruhan</p>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-white rounded p-2 text-center">
                                    <div className="text-lg font-bold text-green-600">
                                        {stats.approved}
                                    </div>
                                    <div className="text-xs text-gray-600">Disetujui</div>
                                </div>
                                <div className="bg-white rounded p-2 text-center">
                                    <div className="text-lg font-bold text-yellow-600">
                                        {stats.pending}
                                    </div>
                                    <div className="text-xs text-gray-600">Menunggu</div>
                                </div>
                                <div className="bg-white rounded p-2 text-center">
                                    <div className="text-lg font-bold text-red-600">
                                        {stats.rejected}
                                    </div>
                                    <div className="text-xs text-gray-600">Ditolak</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
