import { defineConfig } from 'vite'

import preact from '@preact/preset-vite'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          ui: ['focus-trap-react', 'preact', 'preact/hooks', 'preact/compat'],
          qr: ['gl-matrix', 'promptpay-qr', 'qrcode'],
        },
      },
    },
  },
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
      },
      manifest: {
        short_name: 'ppqr.app',
        name: 'ppqr.app',
        icons: [
          {
            src: 'logo192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: 'logo512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
        start_url: '.',
        display: 'standalone',
        theme_color: '#353433',
        background_color: '#353433',
      },
    }),
    visualizer(),
  ],
})
