import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
const DIR = 'src/data/vehicles/es300-1997/graphs';
async function run() {
  const files = (await readdir(DIR)).filter(f => f.endsWith('.json'));
  let ok = true;
  for (const f of files) {
    const d = JSON.parse(await readFile(join(DIR, f), 'utf8'));
    if (!d.nodes) { console.log('SKIP ' + f); continue; }
    const ids = new Set(d.nodes.map(n => n.id));
    const errs = d.edges.filter(e => !ids.has(e.source) || !ids.has(e.target));
    if (errs.length) { ok = false; console.log('FAIL ' + f + ': ' + errs.length + ' bad edges'); }
    else console.log('OK ' + f + ' (' + d.nodes.length + ' nodes)');
  }
  process.exit(ok ? 0 : 1);
}
run().catch(console.error);
