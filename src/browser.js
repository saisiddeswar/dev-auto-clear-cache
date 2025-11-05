/**
 * clearBrowserCache(options)
 * - clearLocalStorage
 * - clearSessionStorage
 * - clearIndexedDB
 * - unregisterServiceWorkers
 * - hardReload
 */
export async function clearBrowserCache(options = {}) {
  const {
    clearLocalStorage = true,
    clearSessionStorage = true,
    clearIndexedDB = true,
    unregisterServiceWorkers = true,
    hardReload = false
  } = options;

  const results = {
    localStorage: false,
    sessionStorage: false,
    indexedDB: [],
    serviceWorkers: [],
    reloaded: false
  };

  if (clearLocalStorage && (typeof window !== 'undefined' && window.localStorage || typeof localStorage !== 'undefined')) {
    try {
      (window?.localStorage || localStorage).clear();
      results.localStorage = true;
    } catch (e) {
      results.localStorage = { error: String(e) };
    }
  }

  if (clearSessionStorage && (typeof window !== 'undefined' && window.sessionStorage || typeof sessionStorage !== 'undefined')) {
    try {
      (window?.sessionStorage || sessionStorage).clear();
      results.sessionStorage = true;
    } catch (e) {
      results.sessionStorage = { error: String(e) };
    }
  }

  if (clearIndexedDB && typeof indexedDB !== 'undefined') {
    // Modern browsers expose indexedDB.databases()
    try {
      if (typeof indexedDB.databases === 'function') {
        // returns Promise<[{name,version}]>
        // eslint-disable-next-line no-await-in-loop
        const dbs = await indexedDB.databases();
        for (const d of dbs) {
          if (!d.name) continue;
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => {
            const req = indexedDB.deleteDatabase(d.name);
            req.onsuccess = () => resolve({ name: d.name, deleted: true });
            req.onerror = () => resolve({ name: d.name, deleted: false });
            req.onblocked = () => resolve({ name: d.name, deleted: false, blocked: true });
          }).then((r) => results.indexedDB.push(r));
        }
      } else {
        // Fallback: try known names? Not possible to enumerate reliably
        results.indexedDB.push({ warning: 'indexedDB.databases() not available — cannot enumerate DBs in this environment' });
      }
    } catch (e) {
      results.indexedDB.push({ error: String(e) });
    }
  }

  if (unregisterServiceWorkers && typeof navigator !== 'undefined' && navigator.serviceWorker) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) {
        // eslint-disable-next-line no-await-in-loop
        const ok = await r.unregister();
        results.serviceWorkers.push({ scope: r.scope, unregistered: ok });
      }
    } catch (e) {
      results.serviceWorkers.push({ error: String(e) });
    }
  }

  if (hardReload && typeof location !== 'undefined') {
    // Force reload bypassing cache by adding a cache-bust query param
    const url = new URL(location.href);
    url.searchParams.set('_dev_auto_clear_cache', String(Date.now()));
    // small timeout to allow unregistering to finish
    setTimeout(() => {
      // eslint-disable-next-line no-restricted-globals
      location.replace(url.toString());
    }, 100);
    results.reloaded = true;
  }

  return results;
}

export default clearBrowserCache;
