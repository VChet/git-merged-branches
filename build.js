import { build } from "esbuild";

const config = {
  entryPoints: ["./src/index.ts"],
  outfile: "dist/index.js",
  banner: { js: "#!/usr/bin/env node" },
  bundle: true,
  platform: "node",
  format: "esm",
  logLevel: "info"
};

build(config).catch(() => process.exit(1));
