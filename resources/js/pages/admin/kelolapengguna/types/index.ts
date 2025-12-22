export interface User {
    id: number;
    name: string;
    username: string;
    password: string;
    role: 'siswa' | 'orangtua' | 'guru' | 'admin';
    createdAt: string;
}

export interface UserStats {
    total: number;
    siswa: number;
    orangtua: number;
    guru: number;
    admin: number;
}

export interface AdminUsersProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    users: User[];
    userStats: UserStats;
}

export type RoleFilter = 'all' | 'siswa' | 'orangtua' | 'guru' | 'admin';
export type SortColumn = 'id' | 'name' | 'role' | 'createdAt';
export type SortOrder = 'asc' | 'desc';
