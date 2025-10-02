import { Alert, Platform } from 'react-native';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();
  private static metrics: Array<{ name: string; duration: number; timestamp: number }> = [];

  static startTimer(name: string): void {
    this.timers.set(name, Date.now());
  }

  static endTimer(name: string): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      console.warn(`⚠️ Timer '${name}' was not started`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.timers.delete(name);
    
    // Store metric
    this.metrics.push({
      name,
      duration,
      timestamp: Date.now(),
    });

    // Log slow operations
    if (duration > 1000) {
      console.warn(`🐌 Slow operation: ${name} took ${duration}ms`);
    } else if (duration > 500) {
      console.log(`⚡ ${name} took ${duration}ms`);
    }

    return duration;
  }

  static getMetrics(): Array<{ name: string; duration: number; timestamp: number }> {
    return [...this.metrics];
  }

  static clearMetrics(): void {
    this.metrics = [];
    this.timers.clear();
  }

  static logSummary(): void {
    if (this.metrics.length === 0) {
      console.log('📊 No performance metrics recorded');
      return;
    }

    const totalTime = this.metrics.reduce((sum, metric) => sum + metric.duration, 0);
    const avgTime = totalTime / this.metrics.length;
    const slowest = this.metrics.reduce((prev, current) => 
      prev.duration > current.duration ? prev : current
    );

    console.log('📊 Performance Summary:');
    console.log(`   Total operations: ${this.metrics.length}`);
    console.log(`   Total time: ${totalTime}ms`);
    console.log(`   Average time: ${Math.round(avgTime)}ms`);
    console.log(`   Slowest: ${slowest.name} (${slowest.duration}ms)`);
  }
}

// Memory management utilities
export class MemoryManager {
  private static listeners: Set<() => void> = new Set();
  private static timers: Set<NodeJS.Timeout> = new Set();
  private static intervals: Set<NodeJS.Timeout> = new Set();

  static addCleanupListener(callback: () => void): void {
    this.listeners.add(callback);
  }

  static removeCleanupListener(callback: () => void): void {
    this.listeners.delete(callback);
  }

  static trackTimer(timer: NodeJS.Timeout): NodeJS.Timeout {
    this.timers.add(timer);
    return timer;
  }

  static trackInterval(interval: NodeJS.Timeout): NodeJS.Timeout {
    this.intervals.add(interval);
    return interval;
  }

  static cleanup(): void {
    // Clear all tracked timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();

    // Clear all tracked intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();

    // Call cleanup listeners
    this.listeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('❌ Cleanup listener error:', error);
      }
    });
    this.listeners.clear();

    console.log('🧹 Memory cleanup completed');
  }

  static getMemoryInfo(): { timers: number; intervals: number; listeners: number } {
    return {
      timers: this.timers.size,
      intervals: this.intervals.size,
      listeners: this.listeners.size,
    };
  }
}

// Cache management utilities
export class CacheManager {
  private static cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private static defaultTTL = 5 * 60 * 1000; // 5 minutes

  static set(key: string, data: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    // Auto-cleanup expired entries
    setTimeout(() => this.cleanup(), ttl + 1000);
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  static has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  static getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Development utilities
export const DevUtils = {
  // Log component render
  logRender: (componentName: string, props?: any) => {
    if (__DEV__) {
      console.log(`🔄 ${componentName} rendered`, props ? { props } : '');
    }
  },

  // Log navigation
  logNavigation: (from: string, to: string, params?: any) => {
    if (__DEV__) {
      console.log(`🧭 Navigation: ${from} → ${to}`, params ? { params } : '');
    }
  },

  // Log API calls
  logAPI: (method: string, endpoint: string, duration?: number) => {
    if (__DEV__) {
      const durationText = duration ? ` (${duration}ms)` : '';
      console.log(`📡 API ${method} ${endpoint}${durationText}`);
    }
  },

  // Performance warning
  warnPerformance: (operation: string, duration: number, threshold: number = 1000) => {
    if (duration > threshold) {
      console.warn(`⚠️ Performance: ${operation} took ${duration}ms (threshold: ${threshold}ms)`);
    }
  },
};

// Global error handler
export const setupGlobalErrorHandler = () => {
  if (Platform.OS !== 'web') {
    const originalHandler = ErrorUtils.getGlobalHandler();
    
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      console.error('🚨 Global Error:', error);
      
      if (__DEV__) {
        // In development, show the error
        originalHandler(error, isFatal);
      } else {
        // In production, log and continue
        console.error('Production Error:', error);
        
        if (!isFatal) {
          // For non-fatal errors, just log
          return;
        }
      }
      
      // Call original handler for fatal errors
      originalHandler(error, isFatal);
    });
  }
};