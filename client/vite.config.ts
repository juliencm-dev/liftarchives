import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: false,
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
                navigateFallback: '/index.html',
                navigateFallbackDenylist: [/^\/api\//],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-router': ['react', 'react-dom', '@tanstack/react-router', '@tanstack/react-query'],
                    'vendor-recharts': ['recharts'],
                    'vendor-radix': [
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-popover',
                        '@radix-ui/react-select',
                        '@radix-ui/react-tabs',
                        '@radix-ui/react-scroll-area',
                        '@radix-ui/react-collapsible',
                        '@radix-ui/react-tooltip',
                        '@radix-ui/react-checkbox',
                        '@radix-ui/react-avatar',
                        '@radix-ui/react-label',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-slot',
                    ],
                    'vendor-date': ['date-fns', 'react-day-picker'],
                },
            },
        },
    },
    server: {
        port: 3000,
    },
});
