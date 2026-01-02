import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit, update } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan Profil',
        href: edit().url,
    },
];

export default function Profile() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: auth.user.name || '',
            username: auth.user.username || '',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(update().url, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Profil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Informasi Profil"
                        description="Kelola profil dan pengaturan akun Anda"
                    />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="space-y-4">
                                {/* Nama Field */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name">
                                        Nama Lengkap
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Masukkan nama lengkap"
                                        className="max-w-md"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Username Field - Only for non-siswa */}
                                {auth.user.role !== 'siswa' && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">
                                            Username
                                        </Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            value={data.username}
                                            onChange={(e) =>
                                                setData(
                                                    'username',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Masukkan username"
                                            className="max-w-md"
                                        />
                                        {errors.username && (
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                {errors.username}
                                            </p>
                                        )}
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                            Username digunakan untuk login ke
                                            sistem
                                        </p>
                                    </div>
                                )}

                                {/* Info Role */}
                                <div className="grid gap-2">
                                    <Label>Role</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium capitalize text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                            {auth.user.role}
                                        </span>
                                    </div>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Role tidak dapat diubah. Hubungi admin
                                        jika perlu perubahan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>

                            {recentlySuccessful && (
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    ✓ Profil berhasil diperbarui!
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
