import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { edit } from '@/routes/settings/password';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan Kata Sandi',
        href: edit().url,
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Kata Sandi" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Perbarui Kata Sandi"
                        description="Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman"
                    />

                    <Form
                        {...PasswordController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                        className="space-y-6"
                    >
                        {({ errors, processing, recentlySuccessful }) => {
                            const { showToast } = useToast();

                            useEffect(() => {
                                if (recentlySuccessful) {
                                    showToast(
                                        'Kata sandi berhasil diubah!',
                                        'success',
                                    );
                                }
                            }, [recentlySuccessful]);

                            return (
                                <>
                                    <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                        <div className="space-y-6">
                                            {/* Info Box */}
                                            <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
                                                <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                        Tips Kata Sandi Aman
                                                    </p>
                                                    <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                                                        <li>
                                                            • Minimal 8 karakter
                                                        </li>
                                                        <li>
                                                            • Kombinasi huruf
                                                            besar, kecil, angka,
                                                            dan simbol
                                                        </li>
                                                        <li>
                                                            • Jangan gunakan kata
                                                            sandi yang mudah
                                                            ditebak
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Current Password */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="current_password">
                                                    Kata Sandi Saat Ini
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>

                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <Lock className="h-4 w-4 text-neutral-400" />
                                                    </div>
                                                    <Input
                                                        id="current_password"
                                                        ref={currentPasswordInput}
                                                        name="current_password"
                                                        type={
                                                            showCurrentPassword
                                                                ? 'text'
                                                                : 'password'
                                                        }
                                                        className="block w-full pl-10 pr-10"
                                                        autoComplete="current-password"
                                                        placeholder="Masukkan kata sandi saat ini"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                                        onClick={() =>
                                                            setShowCurrentPassword(
                                                                !showCurrentPassword,
                                                            )
                                                        }
                                                    >
                                                        {showCurrentPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>

                                                <InputError
                                                    message={
                                                        errors.current_password
                                                    }
                                                />
                                            </div>

                                            {/* New Password */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="password">
                                                    Kata Sandi Baru
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>

                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <Lock className="h-4 w-4 text-neutral-400" />
                                                    </div>
                                                    <Input
                                                        id="password"
                                                        ref={passwordInput}
                                                        name="password"
                                                        type={
                                                            showNewPassword
                                                                ? 'text'
                                                                : 'password'
                                                        }
                                                        className="block w-full pl-10 pr-10"
                                                        autoComplete="new-password"
                                                        placeholder="Masukkan kata sandi baru"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                                        onClick={() =>
                                                            setShowNewPassword(
                                                                !showNewPassword,
                                                            )
                                                        }
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>

                                                <InputError
                                                    message={errors.password}
                                                />
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                    Minimal 8 karakter dengan
                                                    kombinasi huruf, angka, dan
                                                    simbol
                                                </p>
                                            </div>

                                            {/* Confirm Password */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="password_confirmation">
                                                    Konfirmasi Kata Sandi
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </Label>

                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <Lock className="h-4 w-4 text-neutral-400" />
                                                    </div>
                                                    <Input
                                                        id="password_confirmation"
                                                        name="password_confirmation"
                                                        type={
                                                            showConfirmPassword
                                                                ? 'text'
                                                                : 'password'
                                                        }
                                                        className="block w-full pl-10 pr-10"
                                                        autoComplete="new-password"
                                                        placeholder="Ketik ulang kata sandi baru"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                                        onClick={() =>
                                                            setShowConfirmPassword(
                                                                !showConfirmPassword,
                                                            )
                                                        }
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>

                                                <InputError
                                                    message={
                                                        errors.password_confirmation
                                                    }
                                                />
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                    Pastikan kata sandi sama
                                                    dengan yang di atas
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            data-test="update-password-button"
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Simpan Kata Sandi'}
                                        </Button>

                                        {recentlySuccessful && (
                                            <p className="text-sm text-green-600 dark:text-green-400">
                                                ✓ Kata sandi berhasil
                                                diperbarui!
                                            </p>
                                        )}
                                    </div>
                                </>
                            );
                        }}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
