import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

// Conditionally import wayfinder
let wayfinderPlugin: any = null;
try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const wayfinder = require('@laravel/vite-plugin-wayfinder');
    wayfinderPlugin = wayfinder.wayfinder({
        formVariants: true,
    });
} catch (e) {
    // Wayfinder not available, will continue without it
    console.warn('Wayfinder plugin not available');
}

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: [],
            },
        }),
        tailwindcss(),
        ...(wayfinderPlugin ? [wayfinderPlugin] : []),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    optimizeDeps: {
        include: ['recharts'],
    },
});
