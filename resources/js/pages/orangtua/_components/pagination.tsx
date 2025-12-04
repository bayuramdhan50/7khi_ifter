interface PaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
    showSelector?: boolean;
}

export default function Pagination({
    currentPage,
    totalPages,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    showSelector = true,
}: PaginationProps) {
    return (
        <div className={`flex items-center ${showSelector ? 'justify-between' : 'justify-end'} p-4 border-t border-gray-200`}>
            {showSelector && (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Show</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={31}>31</option>
                    </select>
                    <span className="text-sm font-medium text-gray-700">entries</span>
                </div>
            )}
            <div className="flex items-center justify-center gap-2 ml-auto">
                {currentPage > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            «
                        </button>
                        <button
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            ‹
                        </button>
                    </>
                )}

                <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {currentPage < totalPages && (
                    <>
                        <button
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            ›
                        </button>
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            »
                        </button>
                    </>
                )}

                <span className="text-sm text-gray-600 ml-2">
                    Halaman {currentPage} dari {totalPages}
                </span>
            </div>
        </div>
    );
}
