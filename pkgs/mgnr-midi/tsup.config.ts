import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],  // Builds both ESM & CJS
  dts: true,  // Generates TypeScript declarations
  splitting: true,
  sourcemap: true,
  clean: true
});
