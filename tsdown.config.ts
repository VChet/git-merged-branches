import { defineConfig } from "tsdown";

export default defineConfig({
  banner: "#!/usr/bin/env node",
  minify: true,
  publint: true
});
