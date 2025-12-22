import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Head, useForm } from '@inertiajs/react';
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
    const [loginType, setLoginType] = useState<'siswa' | 'staff'>('siswa');

    const { data, setData, post, processing, errors, reset } = useForm({
        nis: '',
        username: '',
        password: '',
        remember: false,
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear unused field based on login type before submit
        if (loginType === 'siswa') {
            setData('username', '');
        } else {
            setData('nis', '');
        }

        // Post to login
        post('/login');
    };

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen flex flex-col lg:flex-row relative bg-white overflow-hidden">
                {/* Desktop background - fixed position, no zoom */}
                <div className="hidden lg:block fixed inset-0 z-0">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: "url('/images/cover%202.png')",
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                </div>

                {/* Mobile background - truly fixed even when keyboard appears */}
                <div className="lg:hidden fixed top-0 left-0 right-0 bottom-0 z-0" style={{ height: '100dvh', width: '100vw', overflow: 'hidden' }}>
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: "url('/images/cover%202.png')",
                            backgroundPosition: '80% bottom',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                </div>

                {/* Left Side - Illustration (kept for spacing on large screens) */}
                <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative z-10">
                    {/* Intentionally left blank; background image is placed behind the whole layout */}
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
                                    {loginType === 'siswa' ? 'Login dengan NIS Anda' : 'Login dengan Username Anda'}
                                </p>
                            </div>

                            {/* Login Type Toggle */}
                            <div className="mb-6 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setLoginType('siswa')}
                                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${loginType === 'siswa'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Siswa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLoginType('staff')}
                                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${loginType === 'staff'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Guru / Orang Tua
                                </button>
                            </div>

                            {status && (
                                <div className="mb-4 text-center text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 sm:space-y-6"
                            >
                                {/* Show validation errors if any */}
                                {(errors.nis || errors.username || errors.email || errors.password || (errors as any).login_error) && (
                                    <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-700 text-xs sm:text-sm font-medium">
                                            {(errors as any).login_error || errors.nis || errors.username || errors.email || errors.password || 'NIS/Username atau Password tidak valid'}
                                        </p>
                                    </div>
                                )}
                                {/* Conditional Field based on login type */}
                                {loginType === 'siswa' ? (
                                    /* NIS Field for Siswa */
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
                                            value={data.nis}
                                            onChange={(e) => setData('nis', e.target.value)}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                                        />
                                        <InputError message={errors.nis} />
                                    </div>
                                ) : (
                                    /* Username Field for Admin/Guru/Orangtua */
                                    <div className="space-y-2">
                                        <Label htmlFor="username" className="text-gray-700 text-xs sm:text-sm">
                                            Username*
                                        </Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            name="username"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="username"
                                            placeholder="Masukkan Username Anda"
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value)}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-sm sm:text-base"
                                        />
                                        <InputError message={errors.username} />
                                    </div>
                                )}

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
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
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
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked === true)}
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
