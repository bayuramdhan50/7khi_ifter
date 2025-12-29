import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/toast';
import { UserPlus } from 'lucide-react';
import FilterBar from './_components/FilterBar';
import Pagination from './_components/Pagination';
import StatsCards from './_components/StatsCards';
import UsersTable from './_components/UsersTable';
import EditUserModal, { EditUserFormData } from './_components/EditUserModal';
import DeleteUserModal from './_components/DeleteUserModal';
import AddAdminModal, { AddAdminFormData } from './_components/AddAdminModal';
import { AdminUsersProps, RoleFilter, SortColumn, SortOrder, User } from './types';

export default function AdminUsers({ users, userStats, auth }: AdminUsersProps & { auth: { user: { id: number } } }) {
    const { showSuccess, showError } = useToast();
    const [selectedRole, setSelectedRole] = useState<RoleFilter>('all');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortColumn>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    // Modal states
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter users berdasarkan role
    const filteredUsers =
        selectedRole === 'all'
            ? users
            : users.filter((user) => user.role === selectedRole);

    // Search users
    const searchedUsers = filteredUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Sort users
    const sortedUsers = [...searchedUsers].sort((a, b) => {
        let compareA: string | number = '';
        let compareB: string | number = '';

        if (sortBy === 'id') {
            compareA = a.id;
            compareB = b.id;
        } else if (sortBy === 'name') {
            compareA = a.name.toLowerCase();
            compareB = b.name.toLowerCase();
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

    // Edit handlers
    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    const handleEditSave = async (data: EditUserFormData) => {
        if (!selectedUser || isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await axios.put(`/admin/users/${selectedUser.id}`, data);
            if (response.data.success) {
                showSuccess('Akun berhasil diupdate');
                router.reload({ only: ['users', 'userStats'] });
                setEditModalOpen(false);
                setSelectedUser(null);
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Gagal mengupdate akun';
            showError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete handlers
    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedUser || isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await axios.delete(`/admin/users/${selectedUser.id}`);
            if (response.data.success) {
                showSuccess('Akun berhasil dihapus');
                router.reload({ only: ['users', 'userStats'] });
                setDeleteModalOpen(false);
                setSelectedUser(null);
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Gagal menghapus akun';
            showError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add Admin handler
    const handleAddAdmin = async (data: AddAdminFormData) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await axios.post('/admin/users', data);
            if (response.data.success) {
                showSuccess('Admin berhasil ditambahkan');
                router.reload({ only: ['users', 'userStats'] });
                setAddAdminModalOpen(false);
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Gagal menambahkan admin';
            showError(message);
        } finally {
            setIsSubmitting(false);
        }
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
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />

                    {/* Add Admin Button */}
                    <div className="mb-4 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setAddAdminModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-lg"
                        >
                            <UserPlus className="w-5 h-5" />
                            Tambah Admin
                        </button>
                    </div>

                    {/* Users Table */}
                    <UsersTable
                        users={paginatedUsers}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        searchQuery={searchQuery}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        currentUserId={auth?.user?.id || 0}
                    />

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={sortedUsers.length}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/* Edit Modal */}
            <EditUserModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                onSave={handleEditSave}
                isSubmitting={isSubmitting}
            />

            {/* Delete Modal */}
            <DeleteUserModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                onConfirm={handleDeleteConfirm}
                isSubmitting={isSubmitting}
            />

            {/* Add Admin Modal */}
            <AddAdminModal
                isOpen={addAdminModalOpen}
                onClose={() => setAddAdminModalOpen(false)}
                onSave={handleAddAdmin}
                isSubmitting={isSubmitting}
            />
        </AppLayout>
    );
}
