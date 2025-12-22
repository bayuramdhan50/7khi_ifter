import { Class } from '../types';

interface ClassCardProps {
    class: Class;
    onClassClick: (classId: string) => void;
}

export default function ClassCard({
    class: cls,
    onClassClick,
}: ClassCardProps) {
    return (
        <button
            onClick={() => onClassClick(cls.id)}
            className="rounded-xl border-2 border-transparent bg-white p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-xl sm:rounded-2xl sm:p-5 lg:p-6"
        >
            <div className="flex flex-col items-center">
                {/* School Icon */}
                <div className="mb-2 text-4xl sm:mb-3 sm:text-5xl lg:text-6xl">
                    🏫
                </div>

                {/* Class Name */}
                <h3 className="mb-1 text-base font-bold text-gray-900 sm:mb-2 sm:text-lg">
                    {cls.name}
                </h3>

                {/* Student Count */}
                <div className="flex items-center gap-2 text-blue-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="font-semibold">
                        {cls.studentCount} Siswa
                    </span>
                </div>
            </div>
        </button>
    );
}
