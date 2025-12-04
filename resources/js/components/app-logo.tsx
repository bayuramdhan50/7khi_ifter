import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-md">
                <img src="/images/logo-smpn31.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-white">
                    SMP Negeri 37 Bandung
                </span>
                <span className="text-xs text-blue-100">
                    7 Kebiasaan
                </span>
            </div>
        </>
    );
}
