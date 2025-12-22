export interface Teacher {
    id: number;
    user_id: number;
    name: string;
    email: string;
    nip: string;
    phone: string;
    address: string;
    is_active: boolean;
    class_id: number | null;
    class_name: string;
    createdAt: string;
}

export interface ClassOption {
    id: number;
    name: string;
    grade: number;
    section: string;
}

export interface GuruDashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    teachers: Teacher[];
    allClasses: ClassOption[];
}

export interface FormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    nip: string;
    phone: string;
    address: string;
    class_id: number | string;
}
