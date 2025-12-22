import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
}: PaginationProps) {
    if (totalItems === 0) return null;

    return (
        <div className="flex items-center justify-between rounded-b-xl border-t border-gray-200 bg-white p-4 sm:rounded-b-2xl">
            {/* Mobile: Just justify-center to center the buttons. Desktop: justify-between to put text on right */}
            <div className="flex w-full items-center justify-center sm:justify-between">
                <div className="hidden text-sm text-gray-700 sm:block">
                    Page <span className="font-semibold">{currentPage}</span> of{' '}
                    <span className="font-semibold">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                    {currentPage > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                title="First Page"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                title="Previous Page"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                        </>
                    )}

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
                                if (
                                    index > 0 &&
                                    array[index - 1] !== page - 1
                                ) {
                                    return (
                                        <span
                                            key={`ellipsis-${page}`}
                                            className="px-2 py-2 text-sm text-gray-500 sm:px-3"
                                        >
                                            ...
                                        </span>
                                    );
                                }
                                return (
                                    <button
                                        key={page}
                                        onClick={() => onPageChange(page)}
                                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${currentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                    </div>

                    {currentPage < totalPages && (
                        <>
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                title="Next Page"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                title="Last Page"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
