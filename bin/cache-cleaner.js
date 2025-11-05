#!/usr/bin/env node
import { clearCache } from '../src/node.js';

function parseArgs(argv) {
  const args = argv.slice(2);
  const out = { folders: [], yes: false, dryRun: false };
  for (const a of args) {
    if (a === '--yes' || a === '-y') out.yes = true;
    else if (a === '--dry-run') out.dryRun = true;
    else if (a.startsWith('--folders=')) {
      out.folders = a.split('=')[1].split(',').map(s => s.trim()).filter(Boolean);
    } else {
      out.folders.push(a);
    }
  }
  return out;
}

async function main() {
  const { folders, yes, dryRun } = parseArgs(process.argv);

  if (!yes && !dryRun) {
    // simple prompt
    const prompt = 'This will delete common build/cache folders. Proceed? (y/N): ';
    process.stdout.write(prompt);
    const buf = await new Promise((resolve) => {
      process.stdin.once('data', (d) => resolve(d));
    });
    const resp = String(buf).trim().toLowerCase();
    if (resp !== 'y' && resp !== 'yes') {
      console.log('Aborted.');
      process.exit(0);
    }
  }

  try {
    const res = await clearCache(folders, { dryRun });
    console.log('Results:');
    for (const r of res) console.log(JSON.stringify(r));
    process.exit(0);
  } catch (e) {
    console.error('Error clearing cache:', e);
    process.exit(2);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
