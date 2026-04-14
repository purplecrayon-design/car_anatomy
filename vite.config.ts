import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,json,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /\.svg$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'diagram-svgs',
              expiration: { maxEntries: 100 },
            },
          },
          {
            urlPattern: /\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'graph-data',
              expiration: { maxEntries: 200 },
            },
          },
        ],
      },
      manifest: {
        name: "97' Vehicle Explorer",
        short_name: "97'",
        description: "97' Vehicle Anatomy Explorer",
        theme_color: '#0071e3',
        background_color: '#f5f5f7',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
