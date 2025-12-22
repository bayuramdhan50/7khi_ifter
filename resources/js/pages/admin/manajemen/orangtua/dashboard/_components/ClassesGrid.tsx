import { Class } from '../types';
import ClassCard from './ClassCard';

interface ClassesGridProps {
    classes: Class[];
    onClassClick: (classId: string) => void;
}

export default function ClassesGrid({
    classes,
    onClassClick,
}: ClassesGridProps) {
    if (classes.length === 0) {
        return (
            <div className="py-8 text-center sm:py-12">
                <p className="text-base text-gray-600 sm:text-lg">
                    Tidak ada kelas yang ditemukan
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {classes.map((cls) => (
                <ClassCard
                    key={cls.id}
                    class={cls}
                    onClassClick={onClassClick}
                />
            ))}
        </div>
    );
}
