import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const root = join(process.cwd(), ".next", "static", "chunks");
const files = await readdir(root);
const sizes = await Promise.all(
  files
    .filter((file) => file.endsWith(".js"))
    .map(async (file) => ({ file, size: (await stat(join(root, file))).size })),
);
const total = sizes.reduce((sum, item) => sum + item.size, 0);
const largest = sizes.sort((a, b) => b.size - a.size)[0];
const totalBudget = 2_200_000;
const chunkBudget = 950_000;
console.log(
  `JavaScript chunks: ${(total / 1024 / 1024).toFixed(2)} MiB total; largest ${(largest.size / 1024).toFixed(1)} KiB (${largest.file})`,
);
if (total > totalBudget || largest.size > chunkBudget) {
  console.error(
    `Bundle budget exceeded (total ${totalBudget} bytes, single chunk ${chunkBudget} bytes).`,
  );
  process.exit(1);
}
