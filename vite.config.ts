import { defineConfig, Plugin, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// ULTIMATE ENTERPRISE VITE CONFIGURATION - SIQUEIRA CAMPOS IMÓVEIS
// KRYONIX Technology - BULLETPROOF Anti-Loop & Maximum Performance System
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const isProd = mode === "production";

  console.log(`🚀 [SIQUEIRA VITE] Configurando ambiente ${mode.toUpperCase()}`);

  const config: UserConfig = {
    // BULLETPROOF Server Configuration
    server: {
      host: "::",
      port: parseInt(process.env.PORT || "8080"),
      strictPort: false,

      // CRITICAL: Complete HMR Configuration to ELIMINATE loops
      hmr: {
        port: parseInt(process.env.PORT || "8080"),
        overlay: false, // Disable overlay to prevent cascading errors
        clientPort: parseInt(process.env.PORT || "8080"),
      },

      // File system optimizations
      fs: {
        allow: [".."],
        strict: false,
      },

      // ULTRA-OPTIMIZED Watch Configuration to prevent loops
      watch: {
        usePolling: false,
        interval: 2000, // Increased to prevent rapid fire changes
        ignored: [
          "**/node_modules/**",
          "**/dist/**",
          "**/.git/**",
          "**/coverage/**",
          "**/tmp/**",
          "**/temp/**",
          "**/public/react-test.html", // Ignore problematic files
          "**/public/test.html",
          "**/dist/spa/react-test.html",
          "**/dist/spa/test.html",
          "**/dist/server/react-test.html",
          "**/dist/server/test.html",
        ],
      },

      // Origin configuration
      origin: `http://localhost:${parseInt(process.env.PORT || "8080")}`,
    },

    // Enhanced build configuration
    build: {
      outDir: "dist/spa",
      sourcemap: isDev,
      minify: isProd ? "esbuild" : false,
      target: "es2020",

      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
        },
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

    // ULTRA-OPTIMIZED Dependency Configuration
    optimizeDeps: {
      // Core dependencies for immediate optimization
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react-router-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "lucide-react",
        "clsx",
        "tailwind-merge",
        "next-themes",
      ],

      // FORCE fresh optimization to prevent stale modules
      force: true,

      // Exclude problematic dependencies
      exclude: [
        "fsevents",
        "@esbuild/linux-x64",
        "@esbuild/darwin-x64",
        "@esbuild/win32-x64",
      ],

      // Enhanced esbuild options
      esbuildOptions: {
        target: "es2020",
        keepNames: true,
        minify: false,
      },
    },

    // ENTERPRISE Plugin Stack
    plugins: [
      // Enhanced React plugin
      react({
        fastRefresh: isDev,
        babel: {
          plugins: [],
        },
      }),

      // BULLETPROOF Express integration
      bulletproofExpressPlugin(),

      // Development enhancements
      ...(isDev ? [enterpriseDevelopmentPlugin()] : []),

      // Production optimizations
      ...(isProd ? [enterpriseProductionPlugin()] : []),
    ],

    // Enhanced path resolution
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

    // Enhanced ESBuild configuration
    esbuild: {
      target: "es2020",
      keepNames: true,
      logOverride: {
        "this-is-undefined-in-esm": "silent",
        "commonjs-variable-in-esm": "silent",
      },
    },

    // Preview configuration
    preview: {
      port: 8080,
      host: "::",
    },
  };

  return config;
});

// BULLETPROOF Express Server Plugin
function bulletproofExpressPlugin(): Plugin {
  return {
    name: "bulletproof-express-plugin",
    apply: "serve",
    configureServer(server) {
      try {
        const app = createServer();

        // Enhanced error handling
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

        // CRITICAL: Bulletproof middleware integration
        server.middlewares.use((req, res, next) => {
          // Skip ALL Vite internal requests to prevent interference
          if (
            req.url?.includes("/@vite") ||
            req.url?.includes("/@react-refresh") ||
            req.url?.includes("/@fs/") ||
            req.url?.includes("/node_modules/") ||
            req.url?.includes("/__vite") ||
            req.url?.includes(".map") ||
            req.url?.includes("/@id/") ||
            req.url?.includes("/client/")
          ) {
            return next();
          }

          // Pass to Express app only for real routes
          app(req, res, next);
        });

        console.log("✅ BULLETPROOF Express server configured successfully");
      } catch (error) {
        console.error("❌ Error configuring Express server:", error);
      }
    },
  };
}

// ENTERPRISE Development Enhancement Plugin
function enterpriseDevelopmentPlugin(): Plugin {
  let lastHotUpdateTime = 0;
  const hotUpdateCooldown = 3000; // 3 seconds minimum between hot updates
  const loggedMessages = new Set<string>();

  return {
    name: "enterprise-development-plugin",
    apply: "serve",

    configureServer(server) {
      // Professional development logging
      server.middlewares.use((req, res, next) => {
        const start = Date.now();

        res.on("finish", () => {
          const duration = Date.now() - start;
          const isViteInternal =
            req.url?.includes("/@vite") ||
            req.url?.includes("/node_modules/") ||
            req.url?.includes("/@react-refresh") ||
            req.url?.includes("/@fs/") ||
            req.url?.includes(".map");

          // Only log important requests or slow ones
          if (!isViteInternal && (duration > 50 || res.statusCode !== 200)) {
            const logKey = `${req.method} ${req.url} ${res.statusCode}`;
            if (!loggedMessages.has(logKey)) {
              console.log(
                `[${res.statusCode}] ${req.method} ${req.url} - ${duration}ms`,
              );
              loggedMessages.add(logKey);
              // Clear log cache periodically
              setTimeout(() => loggedMessages.delete(logKey), 10000);
            }
          }
        });

        next();
      });

      console.log("✅ ENTERPRISE development enhancements activated");
    },

    handleHotUpdate(ctx) {
      const now = Date.now();

      // AGGRESSIVE hot update throttling to prevent loops
      if (now - lastHotUpdateTime < hotUpdateCooldown) {
        console.log(
          `🔄 Hot update THROTTLED: ${ctx.file.replace(process.cwd(), "")}`,
        );
        return []; // Return empty array to prevent update
      }

      lastHotUpdateTime = now;

      // Only allow hot updates for specific file types
      const allowedExtensions = [".ts", ".tsx", ".js", ".jsx", ".css"];
      const fileExtension = path.extname(ctx.file);

      if (!allowedExtensions.includes(fileExtension)) {
        console.log(
          `🔄 Hot update BLOCKED for non-allowed file: ${ctx.file.replace(process.cwd(), "")}`,
        );
        return [];
      }

      console.log(
        `🔄 Hot update ALLOWED: ${ctx.file.replace(process.cwd(), "")}`,
      );
      return ctx.modules;
    },
  };
}

// ENTERPRISE Production Optimization Plugin
function enterpriseProductionPlugin(): Plugin {
  return {
    name: "enterprise-production-plugin",
    apply: "build",
    generateBundle(options, bundle) {
      const chunks = Object.values(bundle).filter(
        (chunk) => chunk.type === "chunk",
      );
      console.log(`📦 ENTERPRISE: Generated ${chunks.length} chunks`);

      chunks.forEach((chunk) => {
        if (chunk.type === "chunk") {
          console.log(
            `   📦 ${chunk.fileName}: ${(chunk.code.length / 1024).toFixed(2)}KB`,
          );
        }
      });
    },
  };
}
