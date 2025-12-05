export interface SchoolClass {
    id: number;
    name: string;
    grade: number;
    section: string;
    students_count?: number;
}

export interface KelasPageProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    classes?: SchoolClass[];
}

export interface ClassFormData {
    name: string;
    grade: string;
    section: string;
}
