export interface Class {
    id: string;
    name: string;
    studentCount: number;
}

export interface OrangTuaDashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    classes: Class[];
}
