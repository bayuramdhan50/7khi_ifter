import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InertiaFormProps } from '@inertiajs/react';
import { ClassFormData } from '../types';

interface EditClassDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    form: InertiaFormProps<ClassFormData>;
    onSubmit: (e: React.FormEvent) => void;
}

export default function EditClassDialog({
    isOpen,
    onOpenChange,
    form,
    onSubmit,
}: EditClassDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Kelas</DialogTitle>
                    <DialogDescription>Ubah informasi kelas.</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-grade">Tingkat Kelas</Label>
                            <Input
                                id="edit-grade"
                                type="number"
                                min="7"
                                max="9"
                                placeholder="7-9"
                                value={form.data.grade}
                                onChange={(e) =>
                                    form.setData('grade', e.target.value)
                                }
                                required
                            />
                            {form.errors.grade && (
                                <p className="text-sm text-red-600">
                                    {form.errors.grade}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-section">
                                Seksi (A, B, C, dst.)
                            </Label>
                            <Input
                                id="edit-section"
                                type="text"
                                maxLength={1}
                                placeholder="A"
                                value={form.data.section}
                                onChange={(e) =>
                                    form.setData(
                                        'section',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                required
                            />
                            {form.errors.section && (
                                <p className="text-sm text-red-600">
                                    {form.errors.section}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nama Kelas</Label>
                            <Input
                                id="edit-name"
                                type="text"
                                placeholder="7A"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                required
                            />
                            {form.errors.name && (
                                <p className="text-sm text-red-600">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
