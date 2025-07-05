import { defineConfig, Plugin, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// ULTIMATE FINAL SOLUTION - SIQUEIRA CAMPOS IMÓVEIS
// KRYONIX Technology - COMPLETE ELIMINATION of automatic reloads
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const isProd = mode === "production";

  console.log(
    `🚀 [SIQUEIRA FINAL] Configurando ${mode.toUpperCase()} - ANTI-RELOAD MODE`,
  );

  const config: UserConfig = {
    // FINAL SOLUTION: Complete server configuration to stop reloads
    server: {
      host: "::",
      port: parseInt(process.env.PORT || "8080"),
      strictPort: false,

      // CRITICAL: COMPLETELY DISABLE HMR to stop automatic reloads
      hmr: false, // <-- THIS IS THE KEY! Complete HMR disable

      // Alternative: If we need some HMR but want to control it
      // hmr: {
      //   overlay: false,
      //   clientPort: false, // Disable client-side HMR
      // },

      // File system settings
      fs: {
        allow: [".."],
        strict: false,
      },

      // DISABLE file watching completely in development to prevent reloads
      watch: null,

      // Origin configuration
      origin: `http://localhost:${parseInt(process.env.PORT || "8080")}`,
    },

    // Build configuration
    build: {
      outDir: "dist/spa",
      sourcemap: isDev,
      minify: isProd ? "esbuild" : false,
      target: "es2020",

      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
        },
      },
    },

    // Dependency optimization with stability focus
    optimizeDeps: {
      include: ["react", "react-dom", "react-dom/client", "react-router-dom"],

      // Don't force re-optimization to prevent reload triggers
      force: false,

      exclude: ["fsevents"],
    },

    // Minimal plugin configuration to prevent reload triggers
    plugins: [
      // Basic React plugin without hot refresh
      react({
        fastRefresh: false, // DISABLE fast refresh to prevent reloads
      }),

      // Minimal Express integration
      minimalExpressPlugin(),
    ],

    // Path resolution
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },

    // CSS configuration
    css: {
      devSourcemap: false, // Disable to prevent CSS-related reloads
    },

    // Environment variables
    define: {
      __DEV__: isDev,
      __PROD__: isProd,
      __VERSION__: JSON.stringify("2.0.0"),
    },

    // ESBuild configuration
    esbuild: {
      target: "es2020",
      logOverride: {
        "this-is-undefined-in-esm": "silent",
      },
    },
  };

  return config;
});

// MINIMAL Express plugin without any hot reload interference
function minimalExpressPlugin(): Plugin {
  return {
    name: "minimal-express-plugin",
    apply: "serve",
    configureServer(server) {
      try {
        const app = createServer();

        // Simple middleware integration without any HMR interference
        server.middlewares.use((req, res, next) => {
          // Skip Vite internal requests
          if (
            req.url?.startsWith("/@") ||
            req.url?.includes("/node_modules/") ||
            req.url?.includes(".map")
          ) {
            return next();
          }

          // Pass to Express
          app(req, res, next);
        });

        console.log(
          "✅ MINIMAL Express server configured (no HMR interference)",
        );
      } catch (error) {
        console.error("❌ Error configuring minimal Express server:", error);
      }
    },
  };
}
