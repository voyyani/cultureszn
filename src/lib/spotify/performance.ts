/**
 * Spotify Performance Monitoring Service
 * 
 * Tracks API performance, cache hit rates, and user engagement metrics.
 * Provides real-time insights into Spotify integration health.
 */

interface PerformanceMetric {
  operation: string
  duration: number
  timestamp: number
  success: boolean
  cached?: boolean
  error?: string
}

interface CacheMetrics {
  hits: number
  misses: number
  hitRate: number
  totalRequests: number
}

interface APIMetrics {
  requests: number
  errors: number
  avgResponseTime: number
  errorRate: number
}

class SpotifyPerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private maxMetrics = 1000 // Keep last 1000 metrics
  private apiMetrics: Map<string, number[]> = new Map()
  private apiErrors: Map<string, number> = new Map()

  /**
   * Record an API operation performance
   */
  recordOperation(
    operation: string,
    startTime: number,
    success: boolean,
    cached: boolean = false,
    error?: string
  ): void {
    const duration = Date.now() - startTime

    const metric: PerformanceMetric = {
      operation,
      duration,
      timestamp: Date.now(),
      success,
      cached,
      error,
    }

    this.metrics.push(metric)

    // Track API-specific metrics
    if (!this.apiMetrics.has(operation)) {
      this.apiMetrics.set(operation, [])
      this.apiErrors.set(operation, 0)
    }

    this.apiMetrics.get(operation)!.push(duration)

    if (!success) {
      this.apiErrors.set(operation, (this.apiErrors.get(operation) || 0) + 1)
    }

    // Trim old metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // Log slow operations (> 1s)
    if (duration > 1000) {
      console.warn(`[Performance] Slow operation: ${operation} took ${duration}ms`)
    }

    // Log errors
    if (!success) {
      console.error(`[Performance] Failed operation: ${operation}`, error)
    }

    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'spotify_api_call', {
        operation,
        duration,
        success,
        cached,
      })
    }
  }

  /**
   * Get cache performance metrics
   */
  getCacheMetrics(): CacheMetrics {
    const cachedMetrics = this.metrics.filter((m) => m.cached)
    const uncachedMetrics = this.metrics.filter((m) => !m.cached)

    const hits = cachedMetrics.length
    const misses = uncachedMetrics.length
    const totalRequests = hits + misses

    return {
      hits,
      misses,
      hitRate: totalRequests > 0 ? (hits / totalRequests) * 100 : 0,
      totalRequests,
    }
  }

  /**
   * Get API performance metrics
   */
  getAPIMetrics(operation?: string): APIMetrics {
    if (operation) {
      const durations = this.apiMetrics.get(operation) || []
      const errors = this.apiErrors.get(operation) || 0

      return {
        requests: durations.length,
        errors,
        avgResponseTime:
          durations.length > 0
            ? durations.reduce((a, b) => a + b, 0) / durations.length
            : 0,
        errorRate: durations.length > 0 ? (errors / durations.length) * 100 : 0,
      }
    }

    // Overall metrics
    const allDurations = Array.from(this.apiMetrics.values()).flat()
    const allErrors = Array.from(this.apiErrors.values()).reduce((a, b) => a + b, 0)

    return {
      requests: allDurations.length,
      errors: allErrors,
      avgResponseTime:
        allDurations.length > 0
          ? allDurations.reduce((a, b) => a + b, 0) / allDurations.length
          : 0,
      errorRate: allDurations.length > 0 ? (allErrors / allDurations.length) * 100 : 0,
    }
  }

  /**
   * Get percentile response time
   */
  getPercentile(operation: string, percentile: number): number {
    const durations = this.apiMetrics.get(operation)
    if (!durations || durations.length === 0) return 0

    const sorted = [...durations].sort((a, b) => a - b)
    const index = Math.ceil((percentile / 100) * sorted.length) - 1
    return sorted[index] || 0
  }

  /**
   * Get performance summary for dashboard
   */
  getSummary() {
    const cacheMetrics = this.getCacheMetrics()
    const apiMetrics = this.getAPIMetrics()

    const recentErrors = this.metrics
      .filter((m) => !m.success && Date.now() - m.timestamp < 60000) // Last minute
      .length

    const topOperations = Array.from(this.apiMetrics.entries())
      .map(([operation, durations]) => ({
        operation,
        calls: durations.length,
        avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
        p95: this.getPercentile(operation, 95),
        errors: this.apiErrors.get(operation) || 0,
      }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 5)

    return {
      cache: cacheMetrics,
      api: apiMetrics,
      recentErrors,
      topOperations,
      timestamp: Date.now(),
    }
  }

  /**
   * Export metrics for external monitoring (Datadog, New Relic, etc.)
   */
  exportMetrics() {
    return {
      metrics: this.metrics.slice(-100), // Last 100 operations
      summary: this.getSummary(),
      timestamp: Date.now(),
    }
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics = []
    this.apiMetrics.clear()
    this.apiErrors.clear()
  }

  /**
   * Check if service is healthy
   */
  isHealthy(): boolean {
    const recentMetrics = this.metrics.filter(
      (m) => Date.now() - m.timestamp < 60000 // Last minute
    )

    if (recentMetrics.length === 0) return true // No recent activity

    const errorRate =
      (recentMetrics.filter((m) => !m.success).length / recentMetrics.length) * 100

    const avgDuration =
      recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length

    // Unhealthy if >10% error rate or >2s avg response time
    return errorRate < 10 && avgDuration < 2000
  }
}

// Export singleton instance
export const performanceMonitor = new SpotifyPerformanceMonitor()

/**
 * Decorator to automatically track function performance
 */
export function trackPerformance(operation: string) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now()
      let success = true
      let error: string | undefined

      try {
        const result = await originalMethod.apply(this, args)
        return result
      } catch (err) {
        success = false
        error = err instanceof Error ? err.message : String(err)
        throw err
      } finally {
        performanceMonitor.recordOperation(operation, startTime, success, false, error)
      }
    }

    return descriptor
  }
}

/**
 * Helper to measure async operations
 */
export async function measureAsync<T>(
  operation: string,
  fn: () => Promise<T>,
  cached: boolean = false
): Promise<T> {
  const startTime = Date.now()
  let success = true
  let error: string | undefined

  try {
    const result = await fn()
    return result
  } catch (err) {
    success = false
    error = err instanceof Error ? err.message : String(err)
    throw err
  } finally {
    performanceMonitor.recordOperation(operation, startTime, success, cached, error)
  }
}
