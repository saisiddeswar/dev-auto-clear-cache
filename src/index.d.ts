export { clearCache } from './node';
export { clearBrowserCache } from './browser';

// Types
export type { CacheOptions, CacheRemovalResult } from './node';
export type { BrowserCacheOptions, BrowserCacheResult } from './browser';

// Default export convenience
declare const _default: {
  clearCache: typeof clearCache;
  clearBrowserCache: typeof clearBrowserCache;
};

export default _default;