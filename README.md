# dev-auto-clear-cache

A small utility to clear development and browser caches to help speed up iteration and avoid stale assets during local development.

Features
- Node API: detect and remove common cache/build folders like `.next`, `.vite`, `dist`, `build`, and `node_modules/.cache`.
- Browser API: clear localStorage, sessionStorage, delete IndexedDB (when available), unregister service workers, and optionally hard reload the page.
- CLI: `npx dev-auto-clear-cache` with options for dry-run and custom folders.

Usage

Node:

```js
import { clearCache } from 'dev-auto-clear-cache';

await clearCache(['dist', 'node_modules/.cache']);
```

Browser:

```js
import { clearBrowserCache } from 'dev-auto-clear-cache';

clearBrowserCache({
  clearLocalStorage: true,
  clearSessionStorage: true,
  clearIndexedDB: true,
  unregisterServiceWorkers: true,
  hardReload: true
});
```

CLI:

```
npx dev-auto-clear-cache
```

Testing

Run unit tests with:

```
npm install
npm test
```
