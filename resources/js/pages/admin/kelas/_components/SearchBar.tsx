import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export default function SearchBar({
    searchQuery,
    onSearchChange,
}: SearchBarProps) {
    return (
        <div className="relative w-full sm:max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:h-5 sm:w-5" />
            <Input
                type="text"
                placeholder="Cari Kelas"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 text-gray-900 text-sm sm:pl-10 sm:text-base"
            />
        </div>
    );
}
