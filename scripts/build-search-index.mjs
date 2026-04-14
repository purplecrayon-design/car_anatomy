import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
const DIR = 'src/data/vehicles/es300-1997/graphs';
async function run() {
  const files = (await readdir(DIR)).filter(f => f.endsWith('.json'));
  const items = [];
  for (const f of files) {
    const d = JSON.parse(await readFile(join(DIR, f), 'utf8'));
    if (d.nodes) d.nodes.forEach(n => items.push({ id: n.id, label: n.label, type: n.type, system: n.system }));
  }
  await writeFile('src/data/search-index.json', JSON.stringify(items, null, 2));
  console.log(items.length + ' items indexed');
}
run().catch(console.error);
