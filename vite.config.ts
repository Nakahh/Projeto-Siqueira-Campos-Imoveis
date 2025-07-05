import { defineConfig, Plugin, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// ENTERPRISE VITE CONFIGURATION - SIQUEIRA CAMPOS IMÓVEIS
// KRYONIX Technology - Anti-Loop Protection & Maximum Performance
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const isProd = mode === "production";

  console.log(`🚀 [VITE] Configurando ambiente: ${mode}`);

  const config: UserConfig = {
    // Enhanced server configuration with HMR loop prevention
    server: {
      host: "::",
      port: parseInt(process.env.PORT || "8080"),
      strictPort: false,

      // CRITICAL: HMR Configuration to prevent loops
      hmr: {
        port: parseInt(process.env.PORT || "8080"),
        overlay: isDev,
        // Prevent HMR loop by configuring proper client settings
        clientPort: parseInt(process.env.PORT || "8080"),
      },

      // File system optimizations
      fs: {
        allow: [".."],
        strict: false,
      },

      // Watch optimizations to prevent excessive reloads
      watch: {
        usePolling: false,
        interval: 1000,
        ignored: [
          "**/node_modules/**",
          "**/dist/**",
          "**/.git/**",
          "**/coverage/**",
          "**/tmp/**",
          "**/temp/**",
        ],
      },

      // Origin configuration
      origin: `http://localhost:${parseInt(process.env.PORT || "8080")}`,
    },

    // Build optimizations
    build: {
      outDir: "dist/spa",
      sourcemap: isDev,
      minify: isProd ? "esbuild" : false,
      target: "es2020",

      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            router: ["react-router-dom"],
            ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
            utils: ["date-fns", "clsx", "tailwind-merge"],
          },
        },
      },

      chunkSizeWarningLimit: 1000,
    },

    // Critical: Dependency optimization to prevent HMR issues
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "lucide-react",
        "clsx",
        "tailwind-merge",
      ],

      // Force dependency re-optimization in dev to prevent stale modules
      force: isDev,

      // Exclude problematic dependencies that can cause HMR loops
      exclude: ["fsevents"],

      // Pre-bundle dependencies to prevent HMR cascades
      esbuildOptions: {
        target: "es2020",
      },
    },

    // Enhanced plugin configuration with loop prevention
    plugins: [
      // React plugin with optimized settings
      react({
        fastRefresh: isDev,
        babel: {
          plugins: isDev ? [] : [],
        },
      }),

      // Enhanced Express plugin with HMR protection
      expressServerPlugin(),

      // Development enhancements with loop protection
      ...(isDev ? [developmentEnhancementsPlugin()] : []),

      // Production optimizations
      ...(isProd ? [productionOptimizationsPlugin()] : []),
    ],

    // Path resolution
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
        "@server": path.resolve(__dirname, "./server"),
      },
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },

    // CSS configuration
    css: {
      devSourcemap: isDev,
      postcss: {
        plugins: [],
      },
    },

    // Environment variables
    define: {
      __DEV__: isDev,
      __PROD__: isProd,
      __VERSION__: JSON.stringify("2.0.0"),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    // ESBuild configuration
    esbuild: {
      target: "es2020",
      logOverride: {
        "this-is-undefined-in-esm": "silent",
      },
    },

    // Preview configuration for production testing
    preview: {
      port: 8080,
      host: "::",
    },
  };

  return config;
});

// Enhanced Express server plugin with comprehensive HMR protection
function expressServerPlugin(): Plugin {
  return {
    name: "express-server-plugin-enhanced",
    apply: "serve",
    configureServer(server) {
      try {
        const app = createServer();

        // Enhanced error handling middleware
        app.use((err: any, req: any, res: any, next: any) => {
          console.error("[EXPRESS ERROR]", err);

          if (req.path.startsWith("/api/")) {
            res.status(500).json({
              error: "Internal server error",
              message: err.message,
              timestamp: new Date().toISOString(),
            });
          } else {
            next(err);
          }
        });

        // HMR-safe middleware integration
        server.middlewares.use((req, res, next) => {
          // Skip HMR and Vite internal requests
          if (
            req.url?.includes("/@vite") ||
            req.url?.includes("/@react-refresh") ||
            req.url?.includes("/@fs/") ||
            req.url?.includes("/node_modules/")
          ) {
            return next();
          }

          // Pass to Express app
          app(req, res, next);
        });

        console.log("✅ Express server plugin configured with HMR protection");
      } catch (error) {
        console.error("❌ Error configuring Express server plugin:", error);
      }
    },
  };
}

// Development enhancements with HMR loop prevention
function developmentEnhancementsPlugin(): Plugin {
  let lastReloadTime = 0;
  const reloadCooldown = 2000; // 2 seconds minimum between reloads

  return {
    name: "development-enhancements-protected",
    apply: "serve",

    configureServer(server) {
      // Enhanced development logging with spam protection
      server.middlewares.use((req, res, next) => {
        const start = Date.now();

        res.on("finish", () => {
          const duration = Date.now() - start;
          const isAsset =
            req.url?.includes("/assets/") ||
            req.url?.includes("/node_modules/") ||
            req.url?.includes("/@vite") ||
            req.url?.includes("/@react-refresh");

          // Only log non-asset requests and slow requests
          if (!isAsset || duration > 100) {
            console.log(
              `[${res.statusCode}] ${req.method} ${req.url} - ${duration}ms`,
            );
          }
        });

        next();
      });

      console.log("✅ Development enhancements with HMR protection activated");
    },

    handleHotUpdate(ctx) {
      const now = Date.now();

      // Prevent excessive hot reloads
      if (now - lastReloadTime < reloadCooldown) {
        console.log(
          `🔄 Hot reload throttled: ${ctx.file.replace(process.cwd(), "")}`,
        );
        return [];
      }

      lastReloadTime = now;
      console.log(`🔄 Hot reload: ${ctx.file.replace(process.cwd(), "")}`);

      // Return modules for normal HMR processing
      return ctx.modules;
    },
  };
}

// Production optimizations plugin
function productionOptimizationsPlugin(): Plugin {
  return {
    name: "production-optimizations",
    apply: "build",
    generateBundle(options, bundle) {
      const chunks = Object.values(bundle).filter(
        (chunk) => chunk.type === "chunk",
      );
      console.log(`📦 Generated ${chunks.length} chunks for production`);

      chunks.forEach((chunk) => {
        if (chunk.type === "chunk") {
          console.log(
            `   ${chunk.fileName}: ${(chunk.code.length / 1024).toFixed(2)}KB`,
          );
        }
      });
    },
  };
}
