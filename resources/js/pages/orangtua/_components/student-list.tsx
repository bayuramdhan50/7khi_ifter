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
        <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Pilih Anak</h2>

                {/* Student List */}
                <div className="space-y-2">
                    {students.length > 0 ? (
                        students.map((student) => (
                            <button
                                key={student.id}
                                onClick={() => onSelectStudent(student.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${selectedStudent === student.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="font-semibold">{student.name}</div>
                                <div className={`text-sm ${selectedStudent === student.id ? 'text-blue-100' : 'text-gray-500'}`}>
                                    Kelas {student.class}
                                </div>
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">Tidak ada data siswa</p>
                    )}
                </div>

                {/* Stats Card */}
                {selectedStudentData && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 font-medium mb-2">Statistik Keseluruhan</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                                <div className="text-xl font-bold text-green-600">
                                    {stats.approved}
                                </div>
                                <div className="text-xs text-green-700">Disetujui</div>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-100">
                                <div className="text-xl font-bold text-yellow-600">
                                    {stats.pending}
                                </div>
                                <div className="text-xs text-yellow-700">Menunggu</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
