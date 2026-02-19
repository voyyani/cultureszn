/**
 * Spotify API Rate Limiter
 * 
 * Implements token bucket algorithm to prevent exceeding Spotify API rate limits.
 * Spotify limits: ~180 requests per minute (generous, actual limit is higher)
 */

interface RateLimiterConfig {
  maxRequests: number // Maximum requests per window
  windowMs: number // Time window in milliseconds
  queueEnabled: boolean // Enable request queueing
}

interface QueuedRequest {
  fn: () => Promise<any>
  resolve: (value: any) => void
  reject: (error: any) => void
  timestamp: number
}

class SpotifyRateLimiter {
  private requests: number[] = []
  private queue: QueuedRequest[] = []
  private processing = false
  private config: RateLimiterConfig

  constructor(config: Partial<RateLimiterConfig> = {}) {
    this.config = {
      maxRequests: config.maxRequests || 150, // Conservative limit
      windowMs: config.windowMs || 60000, // 1 minute
      queueEnabled: config.queueEnabled !== false,
    }

    // Process queue periodically
    if (this.config.queueEnabled) {
      setInterval(() => this.processQueue(), 100)
    }
  }

  /**
   * Check if we can make a request now
   */
  private canMakeRequest(): boolean {
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    // Remove old requests outside the window
    this.requests = this.requests.filter((timestamp) => timestamp > windowStart)

    return this.requests.length < this.config.maxRequests
  }

  /**
   * Record a request
   */
  private recordRequest(): void {
    this.requests.push(Date.now())
  }

  /**
   * Get time until next available slot
   */
  private getWaitTime(): number {
    if (this.canMakeRequest()) return 0

    const oldestRequest = this.requests[0]
    const windowStart = Date.now() - this.config.windowMs
    return oldestRequest - windowStart + 100 // Add small buffer
  }

  /**
   * Execute a function with rate limiting
   */
  async execute<T>(fn: () => Promise<T>, priority: 'high' | 'normal' = 'normal'): Promise<T> {
    // If we can make request immediately, do it
    if (this.canMakeRequest()) {
      this.recordRequest()
      return await fn()
    }

    // If queueing is disabled, throw error
    if (!this.config.queueEnabled) {
      throw new Error('Rate limit exceeded')
    }

    // Queue the request
    return new Promise<T>((resolve, reject) => {
      const queuedRequest: QueuedRequest = {
        fn,
        resolve,
        reject,
        timestamp: Date.now(),
      }

      // High priority requests go to front
      if (priority === 'high') {
        this.queue.unshift(queuedRequest)
      } else {
        this.queue.push(queuedRequest)
      }

      // Log if queue is getting large
      if (this.queue.length > 10) {
        console.warn(`[RateLimiter] Queue size: ${this.queue.length}`)
      }
    })
  }

  /**
   * Process queued requests
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return

    this.processing = true

    while (this.queue.length > 0 && this.canMakeRequest()) {
      const request = this.queue.shift()!

      // Check if request has timed out (5 minutes)
      if (Date.now() - request.timestamp > 300000) {
        request.reject(new Error('Request timeout'))
        continue
      }

      this.recordRequest()

      try {
        const result = await request.fn()
        request.resolve(result)
      } catch (error) {
        request.reject(error)
      }
    }

    this.processing = false
  }

  /**
   * Get current rate limit status
   */
  getStatus() {
    const now = Date.now()
    const windowStart = now - this.config.windowMs
    const activeRequests = this.requests.filter((t) => t > windowStart).length

    return {
      used: activeRequests,
      remaining: this.config.maxRequests - activeRequests,
      limit: this.config.maxRequests,
      resetIn: this.getWaitTime(),
      queueSize: this.queue.length,
      utilizationPercent: (activeRequests / this.config.maxRequests) * 100,
    }
  }

  /**
   * Clear the queue
   */
  clearQueue(): void {
    this.queue.forEach((req) => req.reject(new Error('Queue cleared')))
    this.queue = []
  }

  /**
   * Reset rate limiter
   */
  reset(): void {
    this.requests = []
    this.clearQueue()
  }
}

// Export singleton instance
export const spotifyRateLimiter = new SpotifyRateLimiter()

/**
 * Helper to wrap API calls with rate limiting
 */
export async function withRateLimit<T>(
  fn: () => Promise<T>,
  priority: 'high' | 'normal' = 'normal'
): Promise<T> {
  return spotifyRateLimiter.execute(fn, priority)
}
