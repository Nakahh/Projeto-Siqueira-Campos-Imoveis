// Siqueira Campos Imóveis - KRYONIX Technology
// Loop Detection and Prevention System

interface LoopDetectionConfig {
  maxCalls: number;
  timeWindow: number; // milliseconds
  enabled: boolean;
}

class LoopDetector {
  private static instance: LoopDetector;
  private callCounts = new Map<string, { count: number; lastReset: number }>();
  private config: LoopDetectionConfig = {
    maxCalls: 10,
    timeWindow: 5000, // 5 seconds
    enabled: process.env.NODE_ENV === "development",
  };

  static getInstance(): LoopDetector {
    if (!LoopDetector.instance) {
      LoopDetector.instance = new LoopDetector();
    }
    return LoopDetector.instance;
  }

  checkForLoop(functionName: string): boolean {
    if (!this.config.enabled) return false;

    const now = Date.now();
    const callData = this.callCounts.get(functionName) || {
      count: 0,
      lastReset: now,
    };

    // Reset counter if time window has passed
    if (now - callData.lastReset > this.config.timeWindow) {
      callData.count = 0;
      callData.lastReset = now;
    }

    callData.count++;
    this.callCounts.set(functionName, callData);

    // Check if loop detected
    if (callData.count > this.config.maxCalls) {
      console.error(
        `🔴 [LOOP DETECTED] Function "${functionName}" called ${callData.count} times in ${this.config.timeWindow}ms`,
      );
      console.trace("Stack trace:");

      // Reset counter to prevent spam
      callData.count = 0;
      callData.lastReset = now;

      return true;
    }

    return false;
  }

  getStats(): Array<{ function: string; count: number; lastReset: number }> {
    return Array.from(this.callCounts.entries()).map(([func, data]) => ({
      function: func,
      count: data.count,
      lastReset: data.lastReset,
    }));
  }

  reset(): void {
    this.callCounts.clear();
  }

  configure(config: Partial<LoopDetectionConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export const loopDetector = LoopDetector.getInstance();

// Hook for React components
export function useLoopDetection(functionName: string) {
  return {
    checkLoop: () => loopDetector.checkForLoop(functionName),
    getStats: () => loopDetector.getStats(),
    reset: () => loopDetector.reset(),
  };
}

// Decorator for functions
export function detectLoops(functionName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if (loopDetector.checkForLoop(`${functionName}.${propertyKey}`)) {
        console.warn(
          `Preventing potential infinite loop in ${functionName}.${propertyKey}`,
        );
        return;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

// Debug utilities
if (typeof window !== "undefined") {
  (window as any).SiqueiraLoopDetector = {
    getStats: () => loopDetector.getStats(),
    reset: () => loopDetector.reset(),
    configure: (config: Partial<LoopDetectionConfig>) =>
      loopDetector.configure(config),
  };
}
