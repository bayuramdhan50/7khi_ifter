import { Button } from '@/components/ui/button';
import { Edit, Trash2, Users } from 'lucide-react';
import { SchoolClass } from '../types';

interface ClassCardProps {
    cls: SchoolClass;
    onClassClick: (classId: number) => void;
    onEdit: (cls: SchoolClass) => void;
    onDelete: (cls: SchoolClass) => void;
}

export default function ClassCard({
    cls,
    onClassClick,
    onEdit,
    onDelete,
}: ClassCardProps) {
    return (
        <div className="overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-lg transition-shadow hover:shadow-xl">
            {/* Card Content - Clickable */}
            <div
                className="cursor-pointer p-4 transition-colors hover:bg-gray-50 sm:p-6"
                onClick={() => onClassClick(cls.id)}
            >
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 sm:h-12 sm:w-12">
                        <span className="text-base font-bold text-white sm:text-lg">
                            {cls.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 sm:gap-2">
                        <Users className="h-4 w-4" />
                        <span className="text-xs font-medium sm:text-sm">
                            {cls.students_count || 0} siswa
                        </span>
                    </div>
                </div>
                <h3 className="mb-1 text-lg font-bold text-gray-900 sm:text-xl">
                    Kelas {cls.name}
                </h3>
                <p className="text-xs text-gray-600 sm:text-sm">
                    Tingkat {cls.grade} - Seksi {cls.section}
                </p>
            </div>

            {/* Action Buttons - Separate from clickable area */}
            <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(cls);
                    }}
                    className="gap-1 sm:gap-2"
                >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Edit</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(cls);
                    }}
                    className="gap-1 text-red-600 hover:border-red-300 hover:text-red-700 sm:gap-2"
                >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Hapus</span>
                </Button>
            </div>
        </div>
    );
}
