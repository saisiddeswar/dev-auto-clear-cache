export interface BrowserCacheOptions {
  /**
   * Clear localStorage if available
   * @default true
   */
  clearLocalStorage?: boolean;
  /**
   * Clear sessionStorage if available
   * @default true
   */
  clearSessionStorage?: boolean;
  /**
   * Delete all IndexedDB databases if available
   * @default true
   */
  clearIndexedDB?: boolean;
  /**
   * Unregister all service workers
   * @default true
   */
  unregisterServiceWorkers?: boolean;
  /**
   * Hard reload the page with cache busting query param
   * @default false
   */
  hardReload?: boolean;
}

export interface BrowserCacheResult {
  localStorage: boolean | { error: string };
  sessionStorage: boolean | { error: string };
  indexedDB: Array<{
    name?: string;
    deleted?: boolean;
    blocked?: boolean;
    warning?: string;
    error?: string;
  }>;
  serviceWorkers: Array<{
    scope?: string;
    unregistered?: boolean;
    error?: string;
  }>;
  reloaded: boolean;
}

/**
 * Clear browser caches including localStorage, sessionStorage, IndexedDB, and service workers.
 * 
 * @param options - configuration options
 * @returns Results indicating what was cleared
 */
export function clearBrowserCache(options?: BrowserCacheOptions): Promise<BrowserCacheResult>;

export default clearBrowserCache;