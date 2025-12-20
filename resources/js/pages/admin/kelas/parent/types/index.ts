export interface Parent {
    id: number;
    parentName: string; // From user.name
    email?: string; // From user.email
    phone?: string; // From parents table
    address?: string; // From parents table
    occupation?: string; // From parents table
    studentId?: number;
    classId?: number;
    studentName?: string; // For display purposes from backend
    studentClass?: string; // For display purposes from backend
}

export interface Student {
    id: number;
    name: string;
    class_id: number;
}

export interface Class {
    id: number;
    name: string;
    students: Student[];
}

export interface ClassParentsProps {
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
    parents: Parent[];
    allClasses?: Class[];
}

export interface ChildData {
    id: string; // unique ID for the form entry
    classId: string;
    studentId: string;
    relationship: 'ayah' | 'ibu' | 'wali' | '';
}

export interface FormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    occupation: string;
    children: ChildData[];
}
