export interface CacheRemovalResult {
  path: string;
  existed: boolean;
  removed?: boolean;
  error?: string;
  dryRun?: boolean;
}

export interface CacheOptions {
  /**
   * Working directory to resolve paths from. Defaults to process.cwd()
   */
  cwd?: string;
  /**
   * If true, only reports what would be deleted without actually deleting
   */
  dryRun?: boolean;
}

/**
 * Clear development cache folders in cwd (or provided cwd).
 *
 * @param folders - explicit list of folders (relative to cwd) to delete
 * @param options - configuration options
 * @returns Array of results for each folder processed
 */
export function clearCache(folders?: string[], options?: CacheOptions): Promise<CacheRemovalResult[]>;

export default clearCache;