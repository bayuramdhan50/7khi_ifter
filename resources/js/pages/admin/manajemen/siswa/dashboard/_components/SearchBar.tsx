interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export default function SearchBar({
    searchQuery,
    onSearchChange,
}: SearchBarProps) {
    return (
        <div className="mb-6 sm:mb-8">
            <div className="relative w-full sm:max-w-md">
                <input
                    type="text"
                    placeholder="Cari kelas..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-9 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:py-3 sm:pl-10 sm:text-base"
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-3 left-3 h-4 w-4 text-gray-400 sm:top-3.5 sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>
        </div>
    );
}
