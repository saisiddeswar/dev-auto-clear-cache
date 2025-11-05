export { clearBrowserCache } from './browser';
export { clearCache } from './node';

// Types
export type { BrowserCacheOptions, BrowserCacheResult } from './browser';
export type { CacheOptions, CacheRemovalResult } from './node';

// Default export convenience
declare const _default: {
  clearCache: typeof clearCache;
  clearBrowserCache: typeof clearBrowserCache;
};

export default _default;