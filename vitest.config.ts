import { defineConfig } from "vitest/config";
import { resolve } from "path";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    exclude: ["node_modules/", "dist/", "**/*.d.ts", "**/server/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.d.ts",
        "**/__tests__/**",
        "**/test/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./client"),
    },
  },
});
