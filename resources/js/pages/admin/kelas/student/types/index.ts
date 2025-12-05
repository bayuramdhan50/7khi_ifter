export interface Student {
    id: number;
    name: string;
    email?: string;
    nis?: string;
    nisn?: string;
    religion: string;
    gender: string;
    date_of_birth?: string;
    address?: string;
}

export interface ImportedStudent {
    name: string;
    religion: string;
    gender: string;
}

export interface ClassStudentsProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    className: string;
    classId: string;
    classDbId: number;
    students: Student[];
}

export interface FormData {
    name: string;
    email: string;
    nis: string;
    nisn: string;
    religion: string;
    gender: string;
    date_of_birth: string;
    address: string;
}
