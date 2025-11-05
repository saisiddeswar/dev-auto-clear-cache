import fsSync from 'fs';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { clearCache } from '../src/node.js';

describe('clearCache (node)', () => {
  it('removes default cache folders when present', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'cache-test-'));
    // create .next and dist and node_modules/.cache
    await fs.mkdir(path.join(tmp, '.next'));
    await fs.mkdir(path.join(tmp, 'dist'));
    await fs.mkdir(path.join(tmp, 'node_modules'), { recursive: true });
    await fs.mkdir(path.join(tmp, 'node_modules', '.cache'));

    const res = await clearCache(undefined, { cwd: tmp, dryRun: false });

    // ensure they were removed
    expect(fsSync.existsSync(path.join(tmp, '.next'))).toBe(false);
    expect(fsSync.existsSync(path.join(tmp, 'dist'))).toBe(false);
    expect(fsSync.existsSync(path.join(tmp, 'node_modules', '.cache'))).toBe(false);

    // cleanup tmp
    await fs.rm(tmp, { recursive: true, force: true });
    expect(res).toBeDefined();
  });
});
