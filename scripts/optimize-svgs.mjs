import { readdir, readFile, writeFile } from 'fs/promises';
import { optimize } from 'svgo';
import { join } from 'path';
const DIR = 'src/data/vehicles/es300-1997/svgs';
async function run() {
  const files = (await readdir(DIR)).filter(f => f.endsWith('.svg'));
  for (const f of files) {
    const p = join(DIR, f); const input = await readFile(p, 'utf8');
    const result = optimize(input, { path: p });
    await writeFile(p, result.data);
    console.log(`${f}: ${input.length} -> ${result.data.length}`);
  }
}
run().catch(console.error);
