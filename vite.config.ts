import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true, // Enable fast refresh but configure properly
      jsxImportSource: "@emotion/react",
    }),
    {
      name: "express-middleware",
      configureServer(server) {
        const app = createServer();
        server.middlewares.use((req, res, next) => {
          if (
            req.url?.startsWith("/@") ||
            req.url?.includes("/node_modules/") ||
            req.url?.includes(".css") ||
            req.url?.includes("?html-proxy")
          ) {
            return next();
          }
          app(req, res, next);
        });
      },
    },
  ],

  server: {
    host: "::",
    port: parseInt(process.env.PORT || "8080"),
    strictPort: false,
    hmr: {
      port: 24678, // Use a different port for HMR
      overlay: false, // Disable error overlay
    },
    watch: {
      usePolling: false,
      interval: 1000,
      ignored: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
    },
    fs: {
      allow: [".."],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },

  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    force: false,
  },

  build: {
    outDir: "dist/spa",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },

  css: {
    devSourcemap: false,
  },

  esbuild: {
    target: "es2020",
  },
});
