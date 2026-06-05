// Post-build: repackage Nitro `dist/` output into Vercel Build Output API v3
// at `.vercel/output/` so Vercel's git-based deploys can serve it.
import { cp, mkdir, rm, writeFile, readFile, access } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const out = join(root, ".vercel", "output");
const staticDir = join(out, "static");
const fnDir = join(out, "functions", "__server.func");

try {
  await access(dist);
} catch {
  console.error("[vercel-package] dist/ not found — run `vite build` first.");
  process.exit(1);
}

await rm(join(root, ".vercel", "output"), { recursive: true, force: true });
await mkdir(staticDir, { recursive: true });
await mkdir(fnDir, { recursive: true });

// 1. config.json — copy from Nitro
const cfg = JSON.parse(await readFile(join(dist, "config.json"), "utf8"));
await writeFile(join(out, "config.json"), JSON.stringify(cfg, null, 2));

// 2. Static assets: dist/client/* -> .vercel/output/static/*
await cp(join(dist, "client"), staticDir, { recursive: true });

// 3. Server function: dist/server/* -> functions/__server.func/*
await cp(join(dist, "server"), fnDir, { recursive: true });

// 4. .vc-config.json telling Vercel how to run the handler
const vcConfig = {
  runtime: "nodejs20.x",
  handler: "index.mjs",
  launcherType: "Nodejs",
  shouldAddHelpers: true,
  supportsResponseStreaming: true,
};
await writeFile(
  join(fnDir, ".vc-config.json"),
  JSON.stringify(vcConfig, null, 2),
);

// 5. package.json with type: module so .mjs is loaded as ESM
await writeFile(
  join(fnDir, "package.json"),
  JSON.stringify({ type: "module" }, null, 2),
);

console.log("[vercel-package] Wrote .vercel/output (BOA v3)");
