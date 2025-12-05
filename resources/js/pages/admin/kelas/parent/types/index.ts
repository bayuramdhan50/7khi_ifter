export interface Parent {
    id: number;
    parentName: string;
    studentName: string;
    studentClass: string;
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
    parents: Parent[];
}

export interface FormData {
    parentName: string;
    studentName: string;
    studentClass: string;
}
