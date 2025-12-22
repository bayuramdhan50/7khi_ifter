export interface Class {
    id: string;
    name: string;
    studentCount: number;
}

export interface SiswaDashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
    classes: Class[];
}
