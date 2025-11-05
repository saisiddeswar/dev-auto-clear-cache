export { clearBrowserCache } from './browser.js';
export { clearCache } from './node.js';

// Default export convenience
export default {
  clearCache: (folders, opts) => clearCache(folders, opts),
  clearBrowserCache: (opts) => clearBrowserCache(opts)
};
