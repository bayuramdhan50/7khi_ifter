import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import FilterBar from './_components/FilterBar';
import Pagination from './_components/Pagination';
import StatsCards from './_components/StatsCards';
import UsersTable from './_components/UsersTable';
import { AdminUsersProps, RoleFilter, SortColumn, SortOrder } from './types';

export default function AdminUsers({ users, userStats }: AdminUsersProps) {
    const [selectedRole, setSelectedRole] = useState<RoleFilter>('all');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortColumn>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    // Filter users berdasarkan role
    const filteredUsers =
        selectedRole === 'all'
            ? users
            : users.filter((user) => user.role === selectedRole);

    // Search users
    const searchedUsers = filteredUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Sort users
    const sortedUsers = [...searchedUsers].sort((a, b) => {
        let compareA: string | number = '';
        let compareB: string | number = '';

        if (sortBy === 'name') {
            compareA = a.name.toLowerCase();
            compareB = b.name.toLowerCase();
        } else if (sortBy === 'email') {
            compareA = a.email.toLowerCase();
            compareB = b.email.toLowerCase();
        } else if (sortBy === 'role') {
            compareA = a.role.toLowerCase();
            compareB = b.role.toLowerCase();
        } else if (sortBy === 'createdAt') {
            compareA = new Date(a.createdAt).getTime();
            compareB = new Date(b.createdAt).getTime();
        }

        if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
        if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

    // Handler untuk sorting
    const handleSort = (column: SortColumn) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const handleRoleChange = (role: RoleFilter) => {
        setSelectedRole(role);
        setCurrentPage(1);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    return (
        <AppLayout>
            <Head title="Kelola User" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                Kelola Pengguna
                            </h1>
                            <p className="mt-1 text-sm text-gray-600 sm:text-base">
                                Lihat daftar pengguna aplikasi
                            </p>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <StatsCards userStats={userStats} />

                    {/* Filter & Search */}
                    <FilterBar
                        selectedRole={selectedRole}
                        onRoleChange={handleRoleChange}
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        userStats={userStats}
                    />

                    {/* Users Table */}
                    <UsersTable
                        users={paginatedUsers}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        searchQuery={searchQuery}
                    />

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={sortedUsers.length}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
