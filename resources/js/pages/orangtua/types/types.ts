export interface Student {
    id: number;
    name: string;
    class: string;
}

export interface Activity {
    id: number;
    title: string;
    icon: string;
    color: string;
}

export interface ActivitySubmission {
    id: number;
    studentId: number;
    studentName: string;
    activityTitle: string;
    activityId: number;
    date: string;
    time: string;
    photo: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    notes?: string;
}

export interface StudentStats {
    approved: number;
    pending: number;
    rejected: number;
}

export type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';
