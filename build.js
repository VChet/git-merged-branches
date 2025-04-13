import { build } from "esbuild";

build({
  entryPoints: ["./src/index.ts"],
  outfile: "dist/index.js",
  banner: { js: "#!/usr/bin/env node" },
  bundle: true,
  platform: "node",
  format: "esm",
  logLevel: "info"
}).catch(() => process.exit(1));
