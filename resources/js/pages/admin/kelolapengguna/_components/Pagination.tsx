interface PaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange,
}: PaginationProps) {
    if (totalItems === 0) return null;

    return (
        <div className="flex items-center justify-between rounded-b-xl border-t border-gray-200 bg-white p-4 sm:rounded-b-2xl">
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Show</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) =>
                        onItemsPerPageChange(Number(e.target.value))
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
                <span className="text-sm font-medium text-gray-700">
                    entries
                </span>
            </div>

            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    First
                </button>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Previous
                </button>

                <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                            return (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 &&
                                    page <= currentPage + 1)
                            );
                        })
                        .map((page, index, array) => {
                            if (index > 0 && array[index - 1] !== page - 1) {
                                return (
                                    <span
                                        key={`ellipsis-${page}`}
                                        className="px-3 py-2 text-sm text-gray-500"
                                    >
                                        ...
                                    </span>
                                );
                            }
                            return (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                        currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Last
                </button>
            </div>

            <div className="text-sm text-gray-700">
                Page <span className="font-semibold">{currentPage}</span> of{' '}
                <span className="font-semibold">{totalPages}</span>
            </div>
        </div>
    );
}
