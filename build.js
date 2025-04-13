import { build } from "esbuild";

build({
  entryPoints: ["./src/index.ts"],
  outfile: "dist/index.js",
  banner: { js: "#!/usr/bin/env node" },
  bundle: true,
  platform: "node",
  format: "esm"
})
  .then(() => {
    console.info("Build complete.");
    process.exit(0);
  })
  .catch(() => process.exit(1));
