# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a PromptPay QR code generator web app built with Preact and Vite. The app allows users to generate QR codes for Thai PromptPay payments with customizable amounts and supports multiple payment slots.

## Development Commands

- **Development server**: `pnpm dev` (runs on port 8892)
- **Build**: `pnpm build` (TypeScript compile + Vite build, outputs to `build/`)
- **Tests**: `pnpm test` (Playwright e2e tests)
- **Preview**: `pnpm preview` (serves built app on port 8892)

Note: Project uses pnpm as package manager (pnpm@10.14.0+). The CI still references yarn commands but package.json uses pnpm.

## Testing

- Uses Playwright for e2e testing configured in `playwright.config.ts`
- Tests run against Mobile Chrome (Pixel 5) viewport
- Test server runs `pnpm preview` on port 8892
- Tests located in `tests/` directory
- CI runs tests with video/screenshot capture on failures

## Architecture

### Framework Stack
- **Frontend**: Preact (React-like) with JSX
- **Build tool**: Vite with esbuild
- **Styling**: Tailwind CSS + PostCSS
- **PWA**: Vite PWA plugin for service worker and manifest
- **Localization**: Custom context-based system (Thai/English)

### Code Organization ("Packlets" Architecture)
Source code in `src/packlets/` is organized by feature modules:

- `app/` - Main application components (App, AppMain, AppQR, AppHeader)
- `qrcode/` - QR code rendering (supports regular and HDR modes)
- `flipper/` - Card flip animation component with state management
- `slotSelector/` - Multi-slot payment ID management
- `localize/` - Internationalization system (Thai/English)
- `settings/` - Settings modal and configuration
- `branding/` - Logo and brand assets
- `query-flags/` - URL parameter handling

### Key Features
- Multiple payment slots (stored in localStorage)
- Amount specification via URL params or form input
- Card flip interface between QR display and slot selection
- HDR QR code support with WebGL rendering
- PWA capabilities with offline support

### State Management
- Uses Preact hooks (useState, useEffect) for local state
- localStorage for persistence (payment IDs, active slot)
- Custom external store pattern for some shared state

### Build Configuration
- Manual chunk splitting: `ui` (Preact, focus-trap) and `qr` (gl-matrix, qr libraries)
- Bundle analysis with rollup-plugin-visualizer
- PWA manifest configured for standalone display