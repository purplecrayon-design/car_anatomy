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
        name: 'LexWire — ES300 Wiring Explorer',
        short_name: 'LexWire',
        description: 'Interactive wiring diagram for 1997 Lexus ES300',
        theme_color: '#1a1a2e',
        background_color: '#07070b',
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
