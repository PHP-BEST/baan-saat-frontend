import type { Service } from '@/interfaces/Service';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

class Cache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private defaultTTL = DEFAULT_TTL;

  set(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);

    if (!item) return false;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  cleanExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

export const servicesCache = new Cache<Service[]>();
export const serviceCache = new Cache<Service>();

setInterval(() => {
  serviceCache.cleanExpired();
  servicesCache.cleanExpired();
}, DEFAULT_TTL);
