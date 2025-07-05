import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

export default defineConfig({
  plugins: [
    react({
      fastRefresh: false, // COMPLETELY DISABLE fast refresh
      jsxRuntime: "automatic",
    }),
    {
      name: "express-middleware",
      configureServer(server) {
        const app = createServer();
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/api")) {
            app(req, res, next);
          } else {
            next();
          }
        });
      },
    },
  ],

  server: {
    host: "::",
    port: parseInt(process.env.PORT || "8080"),
    strictPort: false,
    hmr: false, // COMPLETELY DISABLE HMR
    watch: null, // COMPLETELY DISABLE file watching
    middlewareMode: false,
    fs: {
      allow: [".."],
      strict: false,
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
