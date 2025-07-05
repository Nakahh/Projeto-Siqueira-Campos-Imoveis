import { defineConfig, Plugin, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// Enhanced Vite Configuration for Siqueira Campos Imóveis
// Enterprise-grade setup by KRYONIX Technology
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const isProd = mode === "production";

  const config: UserConfig = {
    // Server configuration with enhanced performance
    server: {
      host: "::",
      port: parseInt(process.env.PORT || "8080"),
      strictPort: false,
      hmr: {
        port: parseInt(process.env.PORT || "8080"),
        overlay: isDev,
      },
      // Enhanced middleware handling
      middlewareMode: false,
      fs: {
        // Allow serving files outside of root for better development
        allow: [".."],
      },
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
            // Split vendor chunks for better caching
            vendor: ["react", "react-dom"],
            router: ["react-router-dom"],
            ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
            utils: ["date-fns", "clsx", "tailwind-merge"],
          },
        },
      },
      // Enhanced chunk size warnings
      chunkSizeWarningLimit: 1000,
    },

    // Enhanced dependency optimization
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
      force: isDev,
      // Exclude problematic dependencies
      exclude: ["fsevents"],
    },

    // Enhanced plugin configuration
    plugins: [
      // React plugin with advanced options
      react({
        // Enhanced React refresh
        fastRefresh: isDev,
        // JSX runtime optimization
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: isDev ? [] : [],
        },
      }),

      // Express plugin with error handling
      expressServerPlugin(),

      // Custom plugin for development enhancements
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

    // Enhanced environment variables
    define: {
      __DEV__: isDev,
      __PROD__: isProd,
      __VERSION__: JSON.stringify("2.0.0"),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    // Performance optimizations
    esbuild: {
      target: "es2020",
      logOverride: {
        "this-is-undefined-in-esm": "silent",
      },
    },

    // Enhanced preview server for production testing
    preview: {
      port: 8080,
      host: "::",
    },
  };

  return config;
});

// Enhanced Express server plugin with robust error handling
function expressServerPlugin(): Plugin {
  return {
    name: "express-server-plugin",
    apply: "serve",
    configureServer(server) {
      try {
        const app = createServer();

        // Enhanced error handling middleware for development
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

        // Add Express app as middleware to Vite dev server
        server.middlewares.use(app);

        console.log("✅ Express server plugin configured successfully");
      } catch (error) {
        console.error("❌ Error configuring Express server plugin:", error);
      }
    },
  };
}

// Development enhancements plugin
function developmentEnhancementsPlugin(): Plugin {
  return {
    name: "development-enhancements",
    apply: "serve",
    configureServer(server) {
      // Enhanced development logging
      server.middlewares.use((req, res, next) => {
        const start = Date.now();

        res.on("finish", () => {
          const duration = Date.now() - start;
          const isAsset =
            req.url?.includes("/assets/") ||
            req.url?.includes("/node_modules/");

          // Only log non-asset requests and slow requests
          if (!isAsset || duration > 100) {
            console.log(
              `[${res.statusCode}] ${req.method} ${req.url} - ${duration}ms`,
            );
          }
        });

        next();
      });

      console.log("✅ Development enhancements activated");
    },

    handleHotUpdate(ctx) {
      // Enhanced hot reload handling
      console.log(`🔄 Hot reload: ${ctx.file.replace(process.cwd(), "")}`);
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
      // Log bundle information
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
