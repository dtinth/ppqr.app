// See: https://github.com/dtinth/ppqr.app/issues/42
// Ref: https://stackoverflow.com/a/38980776/559913

// A simple, no-op service worker that takes immediate control.

self.addEventListener('install', () => {
  // Skip over the "waiting" lifecycle state, to ensure that our
  // new service worker is activated immediately, even if there's
  // another tab open controlled by our older service worker code.
  self.skipWaiting()
})
