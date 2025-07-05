// Siqueira Campos Imóveis - KRYONIX Technology
// Intelligent Caching System for Enterprise Performance

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  key: string;
}

interface CacheOptions {
  ttl?: number; // Default 5 minutes
  maxSize?: number; // Default 100 items
  persistToStorage?: boolean; // Use localStorage for persistence
}

class IntelligentCache {
  private static instance: IntelligentCache;
  private cache = new Map<string, CacheItem<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes
  private readonly maxSize = 100;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanup();
    this.loadFromStorage();
  }

  static getInstance(): IntelligentCache {
    if (!IntelligentCache.instance) {
      IntelligentCache.instance = new IntelligentCache();
    }
    return IntelligentCache.instance;
  }

  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const ttl = options.ttl || this.defaultTTL;
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      key,
    };

    // Remove oldest items if cache is full
    if (this.cache.size >= (options.maxSize || this.maxSize)) {
      this.removeOldest();
    }

    this.cache.set(key, item);

    // Persist to storage if requested
    if (options.persistToStorage && typeof window !== "undefined") {
      try {
        localStorage.setItem(`siqueira_cache_${key}`, JSON.stringify(item));
      } catch (error) {
        console.warn("[CACHE] Failed to persist to localStorage:", error);
      }
    }

    console.log(`[CACHE] Set item: ${key} (TTL: ${ttl}ms)`);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      console.log(`[CACHE] Miss: ${key}`);
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key);
      console.log(`[CACHE] Expired: ${key}`);
      return null;
    }

    console.log(`[CACHE] Hit: ${key}`);
    return item.data as T;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);

    // Remove from localStorage if exists
    if (typeof window !== "undefined") {
      localStorage.removeItem(`siqueira_cache_${key}`);
    }

    if (deleted) {
      console.log(`[CACHE] Deleted: ${key}`);
    }

    return deleted;
  }

  clear(): void {
    this.cache.clear();

    // Clear all cache items from localStorage
    if (typeof window !== "undefined") {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("siqueira_cache_")) {
          localStorage.removeItem(key);
        }
      });
    }

    console.log("[CACHE] Cleared all items");
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key);
      return false;
    }

    return true;
  }

  size(): number {
    return this.cache.size;
  }

  getStats(): {
    size: number;
    items: Array<{ key: string; age: number; ttl: number }>;
  } {
    const items = Array.from(this.cache.values()).map((item) => ({
      key: item.key,
      age: Date.now() - item.timestamp,
      ttl: item.ttl,
    }));

    return {
      size: this.cache.size,
      items,
    };
  }

  private removeOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  private startCleanup(): void {
    // Clean expired items every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const keysToDelete: string[] = [];

      for (const [key, item] of this.cache) {
        if (now - item.timestamp > item.ttl) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach((key) => this.delete(key));

      if (keysToDelete.length > 0) {
        console.log(
          `[CACHE] Cleanup: removed ${keysToDelete.length} expired items`,
        );
      }
    }, 60000); // 1 minute
  }

  private loadFromStorage(): void {
    if (typeof window === "undefined") return;

    try {
      const keys = Object.keys(localStorage);
      let loadedCount = 0;

      keys.forEach((key) => {
        if (key.startsWith("siqueira_cache_")) {
          const cacheKey = key.replace("siqueira_cache_", "");
          const itemData = localStorage.getItem(key);

          if (itemData) {
            try {
              const item: CacheItem<any> = JSON.parse(itemData);

              // Check if not expired
              if (Date.now() - item.timestamp <= item.ttl) {
                this.cache.set(cacheKey, item);
                loadedCount++;
              } else {
                // Remove expired item from localStorage
                localStorage.removeItem(key);
              }
            } catch (error) {
              // Remove corrupted item
              localStorage.removeItem(key);
            }
          }
        }
      });

      if (loadedCount > 0) {
        console.log(`[CACHE] Loaded ${loadedCount} items from storage`);
      }
    } catch (error) {
      console.warn("[CACHE] Failed to load from storage:", error);
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Export singleton instance
export const cache = IntelligentCache.getInstance();

// React hook for cache operations
export function useCache() {
  return {
    set: <T>(key: string, data: T, options?: CacheOptions) =>
      cache.set(key, data, options),
    get: <T>(key: string) => cache.get<T>(key),
    delete: (key: string) => cache.delete(key),
    clear: () => cache.clear(),
    has: (key: string) => cache.has(key),
    stats: () => cache.getStats(),
  };
}

// Cached fetch wrapper
export async function cachedFetch<T>(
  url: string,
  options: RequestInit & { cacheOptions?: CacheOptions } = {},
): Promise<T> {
  const cacheKey = `fetch_${url}_${JSON.stringify(options)}`;

  // Try to get from cache first
  const cached = cache.get<T>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from network
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the result
    cache.set(cacheKey, data, options.cacheOptions);

    return data;
  } catch (error) {
    console.error(`[CACHE] Fetch failed for ${url}:`, error);
    throw error;
  }
}

// Global cache utilities for debugging
declare global {
  interface Window {
    SiqueiraCache: {
      get: <T>(key: string) => T | null;
      set: <T>(key: string, data: T, options?: CacheOptions) => void;
      delete: (key: string) => boolean;
      clear: () => void;
      stats: () => any;
    };
  }
}

if (typeof window !== "undefined") {
  window.SiqueiraCache = {
    get: <T>(key: string) => cache.get<T>(key),
    set: <T>(key: string, data: T, options?: CacheOptions) =>
      cache.set(key, data, options),
    delete: (key: string) => cache.delete(key),
    clear: () => cache.clear(),
    stats: () => cache.getStats(),
  };
}
