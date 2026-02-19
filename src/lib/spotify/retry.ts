/**
 * Spotify API Retry Logic with Exponential Backoff
 * 
 * Handles transient failures gracefully with intelligent retry strategies.
 * Implements exponential backoff with jitter to avoid thundering herd.
 */

interface RetryConfig {
  maxRetries: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
  retryableStatusCodes: number[]
  onRetry?: (attempt: number, error: any) => void
}

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504], // Timeout, Rate limit, Server errors
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(
  attempt: number,
  config: RetryConfig
): number {
  const exponentialDelay =
    config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1)

  // Add jitter (±25%)
  const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1)
  const delayWithJitter = exponentialDelay + jitter

  return Math.min(delayWithJitter, config.maxDelayMs)
}

/**
 * Check if error is retryable
 */
function isRetryable(error: any, config: RetryConfig): boolean {
  // Network errors are retryable
  if (error.name === 'TypeError' || error.message?.includes('fetch')) {
    return true
  }

  // Check HTTP status codes
  if (error.status && config.retryableStatusCodes.includes(error.status)) {
    return true
  }

  // Check if Spotify API returned rate limit
  if (error.status === 429) {
    return true
  }

  return false
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Retry an async function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const fullConfig = { ...DEFAULT_CONFIG, ...config }
  let lastError: any

  for (let attempt = 1; attempt <= fullConfig.maxRetries + 1; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Don't retry if not retryable
      if (!isRetryable(error, fullConfig)) {
        throw error
      }

      // Don't retry if last attempt
      if (attempt > fullConfig.maxRetries) {
        console.error(`[Retry] All ${fullConfig.maxRetries} retries failed`)
        throw error
      }

      const delay = calculateDelay(attempt, fullConfig)

      // Handle rate limit retry-after header
      if (error.status === 429 && error.headers?.['retry-after']) {
        const retryAfter = parseInt(error.headers['retry-after'], 10) * 1000
        console.warn(`[Retry] Rate limited, waiting ${retryAfter}ms`)
        await sleep(retryAfter)
        continue
      }

      console.warn(
        `[Retry] Attempt ${attempt}/${fullConfig.maxRetries} failed. Retrying in ${Math.round(delay)}ms...`,
        error.message
      )

      fullConfig.onRetry?.(attempt, error)

      await sleep(delay)
    }
  }

  throw lastError
}

/**
 * Retry decorator for class methods
 */
export function Retry(config: Partial<RetryConfig> = {}) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      return retryWithBackoff(
        () => originalMethod.apply(this, args),
        config
      )
    }

    return descriptor
  }
}

/**
 * Circuit breaker pattern to prevent cascading failures
 */
class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  private threshold: number
  private timeout: number

  constructor(
    threshold: number = 5,
    timeout: number = 60000 // 1 minute
  ) {
    this.threshold = threshold
    this.timeout = timeout
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // If circuit is open, check if timeout has passed
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        console.log('[CircuitBreaker] Attempting half-open state')
        this.state = 'HALF_OPEN'
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await fn()

      // Success - reset circuit
      if (this.state === 'HALF_OPEN') {
        console.log('[CircuitBreaker] Closing circuit after successful call')
        this.state = 'CLOSED'
        this.failures = 0
      }

      return result
    } catch (error) {
      this.failures++
      this.lastFailureTime = Date.now()

      // Open circuit if threshold reached
      if (this.failures >= this.threshold) {
        console.error(
          `[CircuitBreaker] Opening circuit after ${this.failures} failures`
        )
        this.state = 'OPEN'
      }

      throw error
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
    }
  }

  reset() {
    this.failures = 0
    this.lastFailureTime = 0
    this.state = 'CLOSED'
  }
}

// Export circuit breaker instance
export const spotifyCircuitBreaker = new CircuitBreaker()
