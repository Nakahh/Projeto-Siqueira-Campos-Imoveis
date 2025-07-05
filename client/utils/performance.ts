// Siqueira Campos Imóveis - KRYONIX Technology
// Performance Monitoring and Error Tracking System
// Enterprise-grade performance utilities

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactiveTime: number;
  memoryUsage?: number;
  errors: ErrorLog[];
}

export interface ErrorLog {
  id: string;
  timestamp: number;
  message: string;
  stack?: string;
  context: string;
  level: "error" | "warn" | "info";
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private startTime: number;
  private metrics: PerformanceMetrics;
  private errorLogs: ErrorLog[] = [];
  private initialized: boolean = false;

  constructor() {
    if (this.initialized) return; // Prevenir múltiplas inicializações

    this.startTime = performance.now();
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      interactiveTime: 0,
      errors: [],
    };
    this.setupErrorTracking();
    this.initialized = true;
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  markLoadComplete(): void {
    this.metrics.loadTime = performance.now() - this.startTime;
    this.sendMetrics("load_complete", { loadTime: this.metrics.loadTime });
  }

  markRenderComplete(): void {
    this.metrics.renderTime = performance.now() - this.startTime;
    this.sendMetrics("render_complete", {
      renderTime: this.metrics.renderTime,
    });
  }

  markInteractive(): void {
    this.metrics.interactiveTime = performance.now() - this.startTime;
    this.sendMetrics("interactive", {
      interactiveTime: this.metrics.interactiveTime,
    });
  }

  logError(error: Error | string, context: string = "unknown"): void {
    const errorLog: ErrorLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      message: typeof error === "string" ? error : error.message,
      stack: typeof error !== "string" ? error.stack : undefined,
      context,
      level: "error",
    };

    this.errorLogs.push(errorLog);
    this.metrics.errors = this.errorLogs;

    // Send to monitoring service
    this.sendMetrics("error", errorLog);

    console.error(`[SIQUEIRA] Error in ${context}:`, error);
  }

  logWarning(message: string, context: string = "unknown"): void {
    const warningLog: ErrorLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      message,
      context,
      level: "warn",
    };

    this.errorLogs.push(warningLog);
    this.sendMetrics("warning", warningLog);

    console.warn(`[SIQUEIRA] Warning in ${context}:`, message);
  }

  getMetrics(): PerformanceMetrics {
    if (typeof window !== "undefined" && (window.performance as any)?.memory) {
      this.metrics.memoryUsage = (
        window.performance as any
      ).memory.usedJSHeapSize;
    }
    return { ...this.metrics };
  }

  private setupErrorTracking(): void {
    if (typeof window === "undefined") return;

    // Global error handler
    window.addEventListener("error", (event) => {
      this.logError(event.error || event.message, "global_error");
    });

    // Unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      this.logError(event.reason, "unhandled_promise");
    });
  }

  private sendMetrics(type: string, data: any): void {
    // Only send important metrics to avoid spam
    const importantTypes = [
      "load_complete",
      "render_complete",
      "interactive",
      "error",
    ];

    // In a real application, you would send this to your monitoring service
    // For now, we'll log to console in development only for important metrics
    if (
      process.env.NODE_ENV === "development" &&
      importantTypes.includes(type)
    ) {
      console.log(`[SIQUEIRA METRICS] ${type}:`, data);
    }

    // Store in sessionStorage for debugging (throttled)
    if (typeof window !== "undefined" && importantTypes.includes(type)) {
      const existingMetrics = JSON.parse(
        sessionStorage.getItem("siqueira_metrics") || "[]",
      );
      existingMetrics.push({
        type,
        data,
        timestamp: Date.now(),
      });

      // Keep only last 50 metrics instead of 100
      if (existingMetrics.length > 50) {
        existingMetrics.splice(0, existingMetrics.length - 50);
      }

      sessionStorage.setItem(
        "siqueira_metrics",
        JSON.stringify(existingMetrics),
      );
    }
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Utility hooks for React components
export function usePerformanceMetrics() {
  return {
    markLoadComplete: () => performanceMonitor.markLoadComplete(),
    markRenderComplete: () => performanceMonitor.markRenderComplete(),
    markInteractive: () => performanceMonitor.markInteractive(),
    logError: (error: Error | string, context?: string) =>
      performanceMonitor.logError(error, context),
    logWarning: (message: string, context?: string) =>
      performanceMonitor.logWarning(message, context),
    getMetrics: () => performanceMonitor.getMetrics(),
  };
}

// Debug utilities
declare global {
  interface Window {
    SiqueiraPerformance: {
      getMetrics: () => PerformanceMetrics;
      clearMetrics: () => void;
      exportMetrics: () => string;
    };
  }
}

if (typeof window !== "undefined") {
  window.SiqueiraPerformance = {
    getMetrics: () => performanceMonitor.getMetrics(),
    clearMetrics: () => {
      sessionStorage.removeItem("siqueira_metrics");
    },
    exportMetrics: () => {
      const metrics = sessionStorage.getItem("siqueira_metrics");
      return metrics || "{}";
    },
  };
}
