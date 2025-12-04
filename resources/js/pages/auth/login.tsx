import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen flex flex-col lg:flex-row relative" style={{ background: 'linear-gradient(to bottom, #a8d8ea 0%, #d4f1f4 100%)' }}>
                {/* Background Image for Mobile */}
                <div className="lg:hidden absolute inset-0">
                    <img
                        src="/images/bg_login_page.png"
                        alt="SMPN 37 Bandung"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>

                {/* Left Side - Illustration */}
                <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
                    <img
                        src="/images/bg_login_page.png"
                        alt="SMPN 37 Bandung"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-10 min-h-screen">
                    <div className="w-full max-w-md">{/* Login Card */}
                        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">{/* Header */}
                            <div className="mb-6 lg:mb-8">
                                <h1 className="text-xl sm:text-2xl font-bold text-blue-700 mb-2">
                                    Login to your Account
                                </h1>
                                <p className="text-xs sm:text-sm text-blue-600">
                                    with your registered Email Address
                                </p>
                            </div>

                            {status && (
                                <div className="mb-4 text-center text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="space-y-4 sm:space-y-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* NIS Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="nis" className="text-gray-700 text-xs sm:text-sm">
                                                NIS (Nomor Induk Siswa)*
                                            </Label>
                                            <Input
                                                id="nis"
                                                type="text"
                                                name="nis"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="username"
                                                placeholder="Masukkan NIS Anda"
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                                            />
                                            <InputError message={errors.nis} />
                                        </div>

                                        {/* Password Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-gray-700 text-xs sm:text-sm">
                                                Kata Sandi*
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Masukkan kata sandi"
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-14 sm:pr-16 text-black text-sm sm:text-base"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium px-2"
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Remember Me */}
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="border-blue-600"
                                            />
                                            <Label
                                                htmlFor="remember"
                                                className="text-xs sm:text-sm text-gray-700 cursor-pointer"
                                            >
                                                Ingat kata sandi saya
                                            </Label>
                                        </div>

                                        {/* Login Button */}
                                        <Button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing && <Spinner />}
                                            Masuk
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
