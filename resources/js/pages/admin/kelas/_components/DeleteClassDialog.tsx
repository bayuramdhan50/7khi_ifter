import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { SchoolClass } from '../types';

interface DeleteClassDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedClass: SchoolClass | null;
    onConfirm: () => void;
}

export default function DeleteClassDialog({
    isOpen,
    onOpenChange,
    selectedClass,
    onConfirm,
}: DeleteClassDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Kelas?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus kelas{' '}
                        <strong>{selectedClass?.name}</strong>? Tindakan ini
                        tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
