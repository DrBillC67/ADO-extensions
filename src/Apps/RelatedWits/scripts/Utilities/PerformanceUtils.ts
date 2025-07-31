import { WorkItem } from 'TFS/WorkItemTracking/Contracts';
import { IFilterState } from 'VSSUI/Utilities/Filter';

/**
 * Performance utilities for RelatedWits extension
 */

// Cache for work item data
const workItemCache = new Map<number, WorkItem>();
const filterCache = new Map<string, WorkItem[]>();

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Memoization utility for expensive operations
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Work item caching utilities
export class WorkItemCache {
  private static instance: WorkItemCache;
  private cache = new Map<number, { item: WorkItem; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): WorkItemCache {
    if (!WorkItemCache.instance) {
      WorkItemCache.instance = new WorkItemCache();
    }
    return WorkItemCache.instance;
  }

  set(id: number, item: WorkItem): void {
    this.cache.set(id, { item, timestamp: Date.now() });
  }

  get(id: number): WorkItem | null {
    const cached = this.cache.get(id);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(id);
      return null;
    }
    
    return cached.item;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Filter optimization utilities
export class FilterOptimizer {
  private static instance: FilterOptimizer;
  private filterCache = new Map<string, WorkItem[]>();
  private readonly CACHE_SIZE_LIMIT = 100;

  static getInstance(): FilterOptimizer {
    if (!FilterOptimizer.instance) {
      FilterOptimizer.instance = new FilterOptimizer();
    }
    return FilterOptimizer.instance;
  }

  private generateCacheKey(items: WorkItem[], filterState: IFilterState): string {
    const itemIds = items.map(item => item.id).sort().join(',');
    const filterString = JSON.stringify(filterState);
    return `${itemIds}-${filterString}`;
  }

  applyFilters(items: WorkItem[], filterState: IFilterState): WorkItem[] {
    const cacheKey = this.generateCacheKey(items, filterState);
    
    if (this.filterCache.has(cacheKey)) {
      return this.filterCache.get(cacheKey)!;
    }

    const filteredItems = this.performFiltering(items, filterState);
    
    // Cache the result
    if (this.filterCache.size >= this.CACHE_SIZE_LIMIT) {
      const firstKey = this.filterCache.keys().next().value;
      this.filterCache.delete(firstKey);
    }
    
    this.filterCache.set(cacheKey, filteredItems);
    return filteredItems;
  }

  private performFiltering(items: WorkItem[], filterState: IFilterState): WorkItem[] {
    if (!filterState || Object.keys(filterState).length === 0) {
      return items;
    }

    return items.filter(item => {
      return Object.entries(filterState).every(([field, value]) => {
        const fieldValue = item.fields[field];
        if (!fieldValue) return false;
        
        if (typeof value === 'string') {
          return fieldValue.toString().toLowerCase().includes(value.toLowerCase());
        }
        
        return fieldValue === value;
      });
    });
  }

  clearCache(): void {
    this.filterCache.clear();
  }
}

// Virtualization utilities for large lists
export class VirtualizationHelper {
  static calculateVisibleRange(
    containerHeight: number,
    itemHeight: number,
    scrollTop: number,
    totalItems: number
  ): { startIndex: number; endIndex: number; visibleCount: number } {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount, totalItems - 1);
    
    return {
      startIndex: Math.max(0, startIndex),
      endIndex,
      visibleCount: endIndex - startIndex + 1
    };
  }

  static getVirtualizedItems<T>(
    items: T[],
    startIndex: number,
    endIndex: number,
    itemHeight: number
  ): { items: T[]; offsetTop: number } {
    const visibleItems = items.slice(startIndex, endIndex + 1);
    const offsetTop = startIndex * itemHeight;
    
    return {
      items: visibleItems,
      offsetTop
    };
  }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static measurements = new Map<string, number[]>();

  static startTimer(name: string): void {
    const startTime = performance.now();
    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
    this.measurements.get(name)!.push(startTime);
  }

  static endTimer(name: string): number {
    const endTime = performance.now();
    const measurements = this.measurements.get(name);
    
    if (!measurements || measurements.length === 0) {
      console.warn(`No start timer found for: ${name}`);
      return 0;
    }
    
    const startTime = measurements.pop()!;
    const duration = endTime - startTime;
    
    // Log performance data in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance [${name}]: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  static getAverageTime(name: string): number {
    const measurements = this.measurements.get(name);
    if (!measurements || measurements.length === 0) return 0;
    
    const sum = measurements.reduce((acc, time) => acc + time, 0);
    return sum / measurements.length;
  }

  static clearMeasurements(): void {
    this.measurements.clear();
  }
}

// Lazy loading utilities
export class LazyLoader<T> {
  private items: T[] = [];
  private loadedCount = 0;
  private readonly batchSize: number;
  private isLoading = false;

  constructor(batchSize = 20) {
    this.batchSize = batchSize;
  }

  setItems(items: T[]): void {
    this.items = items;
    this.loadedCount = 0;
  }

  async loadNextBatch(): Promise<T[]> {
    if (this.isLoading || this.loadedCount >= this.items.length) {
      return [];
    }

    this.isLoading = true;
    
    // Simulate async loading
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const startIndex = this.loadedCount;
    const endIndex = Math.min(startIndex + this.batchSize, this.items.length);
    const batch = this.items.slice(startIndex, endIndex);
    
    this.loadedCount = endIndex;
    this.isLoading = false;
    
    return batch;
  }

  getLoadedItems(): T[] {
    return this.items.slice(0, this.loadedCount);
  }

  hasMore(): boolean {
    return this.loadedCount < this.items.length;
  }

  reset(): void {
    this.loadedCount = 0;
    this.isLoading = false;
  }
}

// Memory management utilities
export class MemoryManager {
  private static readonly MEMORY_THRESHOLD = 50 * 1024 * 1024; // 50MB

  static checkMemoryUsage(): { used: number; total: number; percentage: number } {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const used = memory.usedJSHeapSize;
      const total = memory.totalJSHeapSize;
      const percentage = (used / total) * 100;
      
      return { used, total, percentage };
    }
    
    return { used: 0, total: 0, percentage: 0 };
  }

  static shouldCleanup(): boolean {
    const { percentage } = this.checkMemoryUsage();
    return percentage > 80; // Cleanup if memory usage > 80%
  }

  static cleanup(): void {
    // Clear caches
    WorkItemCache.getInstance().clear();
    FilterOptimizer.getInstance().clearCache();
    
    // Clear performance measurements
    PerformanceMonitor.clearMeasurements();
    
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
  }
}

// Export utilities for better tree shaking
export const performanceUtils = {
  debounce,
  throttle,
  memoize,
  WorkItemCache,
  FilterOptimizer,
  VirtualizationHelper,
  PerformanceMonitor,
  LazyLoader,
  MemoryManager
}; 