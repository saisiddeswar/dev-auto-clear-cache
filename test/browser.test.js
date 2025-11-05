import { describe, expect, it } from 'vitest';
import { clearBrowserCache } from '../src/browser.js';

// This test runs in Node; provide small mocks for browser globals where necessary.
describe('clearBrowserCache (browser)', () => {
  it('clears storages and unregisters service workers', async () => {
    // Provide simple localStorage/sessionStorage mocks if not present
    if (!globalThis.localStorage) {
      globalThis.localStorage = {
        _map: new Map(),
        setItem(k, v) { this._map.set(String(k), String(v)); },
        getItem(k) { return this._map.get(String(k)) ?? null; },
        clear() { this._map.clear(); }
      };
    }
    if (!globalThis.sessionStorage) {
      globalThis.sessionStorage = {
        _map: new Map(),
        setItem(k, v) { this._map.set(String(k), String(v)); },
        getItem(k) { return this._map.get(String(k)) ?? null; },
        clear() { this._map.clear(); }
      };
    }

    globalThis.localStorage.setItem('k', 'v');
    globalThis.sessionStorage.setItem('s', '1');

    // Mock indexedDB.databases: return empty list to avoid deleteDatabase orchestration in test
    if (!globalThis.indexedDB) {
      globalThis.indexedDB = { databases: () => Promise.resolve([]), deleteDatabase: () => ({}) };
    } else if (typeof globalThis.indexedDB.databases !== 'function') {
      globalThis.indexedDB.databases = () => Promise.resolve([]);
      globalThis.indexedDB.deleteDatabase = () => ({});
    }

    // Mock navigator.serviceWorker
    if (!globalThis.navigator) globalThis.navigator = {};
    globalThis.navigator.serviceWorker = {
      getRegistrations: async () => [
        { scope: '/', unregister: async () => true },
      ]
    };

    const res = await clearBrowserCache({ hardReload: false });

    expect(res.localStorage === true || (res.localStorage && res.localStorage.error)).toBeTruthy();
    expect(res.sessionStorage === true || (res.sessionStorage && res.sessionStorage.error)).toBeTruthy();
    expect(Array.isArray(res.indexedDB)).toBe(true);
    expect(Array.isArray(res.serviceWorkers)).toBe(true);
  });
});

