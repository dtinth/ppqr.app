import { defineConfig } from 'vite-plus'

import preact from '@preact/preset-vite'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

const manualChunkGroups = {
  ui: ['focus-trap-react', 'preact', 'preact/hooks', 'preact/compat'],
  qr: ['gl-matrix', 'promptpay-qr', 'qrcode'],
}

// https://vitejs.dev/config/
export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    singleQuote: true,
    semi: false,
    trailingComma: 'all',
    printWidth: 80,
    sortPackageJson: false,
    ignorePatterns: [],
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['tests/**'],
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          for (const [chunkName, packages] of Object.entries(
            manualChunkGroups,
          )) {
            if (packages.some((pkg) => id.includes(`/node_modules/${pkg}/`))) {
              return chunkName
            }
          }
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
