import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

const DEFAULT_FOLDERS = [
  '.next',
  '.vite',
  '.nuxt',
  'dist',
  'build',
  path.join('node_modules', '.cache')
];

/**
 * Remove a directory or file recursively and safely.
 */
async function removePath(targetPath, options = {}) {
  const { dryRun = false } = options;
  if (dryRun) {
    return { path: targetPath, removed: false, dryRun: true };
  }

  try {
    await fs.rm(targetPath, { recursive: true, force: true });
    return { path: targetPath, removed: true };
  } catch (err) {
    return { path: targetPath, removed: false, error: String(err) };
  }
}

/**
 * Clear development cache folders in cwd (or provided cwd).
 *
 * @param {string[]|undefined} folders - explicit list of folders (relative to cwd) to delete
 * @param {{cwd?:string, dryRun?:boolean}} options
 */
export async function clearCache(folders, options = {}) {
  const cwd = options.cwd || process.cwd();
  const dryRun = Boolean(options.dryRun);

  const targets = (folders && folders.length > 0) ? folders : DEFAULT_FOLDERS;
  const results = [];

  for (const t of targets) {
    const full = path.resolve(cwd, t);
    if (!existsSync(full)) {
      results.push({ path: full, existed: false });
      continue;
    }

    // Remove
    // eslint-disable-next-line no-await-in-loop
    const res = await removePath(full, { dryRun });
    results.push({ path: full, existed: true, ...res });
  }

  return results;
}

export default clearCache;
