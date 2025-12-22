import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { ToastProvider } from './components/ui/toast';
import axios from 'axios';
import { router } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Configure axios to include CSRF token
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token instanceof HTMLMetaElement) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found');
}

// Handle CSRF token mismatch errors globally
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 419) {
            // CSRF token mismatch - reload page to get fresh token
            console.warn('CSRF token mismatch detected, reloading page...');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <ToastProvider>
                    <App {...props} />
                </ToastProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// Handle Inertia errors globally
router.on('error', (event) => {
    const response = (event.detail as any).response;
    if (response?.status === 419) {
        // CSRF token mismatch in Inertia request
        console.warn('CSRF token mismatch in Inertia request, reloading...');
        window.location.reload();
    }
});

// This will set light / dark mode on load...
initializeTheme();
