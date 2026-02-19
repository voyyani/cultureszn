/**
 * Latest Releases Error Handling
 * 
 * Comprehensive error handling for the latest releases endpoint.
 * Provides graceful degradation and informative error messages.
 */

/**
 * Error codes for latest releases API
 */
export const LatestReleasesErrorCode = {
  SPOTIFY_API_UNAVAILABLE: 'SPOTIFY_API_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_PARAMETERS: 'INVALID_PARAMETERS',
  NETWORK_ERROR: 'NETWORK_ERROR',
  CACHE_READ_FAILED: 'CACHE_READ_FAILED',
  CACHE_WRITE_FAILED: 'CACHE_WRITE_FAILED',
  NO_RELEASES_FOUND: 'NO_RELEASES_FOUND',
  PARTIAL_DATA: 'PARTIAL_DATA',
} as const

export type LatestReleasesErrorCode = typeof LatestReleasesErrorCode[keyof typeof LatestReleasesErrorCode]

/**
 * Error response interface
 */
export interface LatestReleasesError {
  code: typeof LatestReleasesErrorCode[keyof typeof LatestReleasesErrorCode]
  message: string
  fallback: boolean
  timestamp: string
  details?: any
}

/**
 * Create error response
 */
export function createErrorResponse(
  code: LatestReleasesErrorCode,
  message: string,
  fallback = false,
  details?: any
): LatestReleasesError {
  return {
    code,
    message,
    fallback,
    timestamp: new Date().toISOString(),
    details,
  }
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  // Network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return true
  }
  
  // Spotify API rate limits (429)
  if (error.statusCode === 429 || error.status === 429) {
    return true
  }
  
  // Temporary server errors (500, 502, 503, 504)
  if (error.statusCode >= 500 && error.statusCode < 600) {
    return true
  }
  
  return false
}

/**
 * Extract error message from various error types
 */
export function extractErrorMessage(error: any): string {
  // Standard Error
  if (error instanceof Error) {
    return error.message
  }
  
  // HTTP error response
  if (error.body && error.body.error) {
    return error.body.error.message || 'Spotify API error'
  }
  
  // Generic object with message
  if (typeof error === 'object' && error.message) {
    return error.message
  }
  
  // String error
  if (typeof error === 'string') {
    return error
  }
  
  return 'Unknown error occurred'
}

/**
 * Log error with context
 */
export function logError(
  context: string,
  error: any,
  metadata?: Record<string, any>
): void {
  const message = extractErrorMessage(error)
  const timestamp = new Date().toISOString()
  
  console.error(`[${timestamp}] [${context}] Error:`, {
    message,
    error: error.stack || error,
    metadata,
    isRetryable: isRetryableError(error),
  })
  
  // TODO: Send to Sentry or other error tracking service
  // if (typeof Sentry !== 'undefined') {
  //   Sentry.captureException(error, {
  //     tags: { context },
  //     extra: metadata,
  //   })
  // }
}

/**
 * Validate request parameters
 */
export function validateLatestReleasesParams(params: {
  limit?: any
  artistSlug?: any
}): { valid: boolean; error?: LatestReleasesError } {
  // Validate limit
  if (params.limit !== undefined) {
    const limit = parseInt(params.limit)
    
    if (isNaN(limit)) {
      return {
        valid: false,
        error: createErrorResponse(
          LatestReleasesErrorCode.INVALID_PARAMETERS,
          'Limit must be a number'
        ),
      }
    }
    
    if (limit < 1 || limit > 50) {
      return {
        valid: false,
        error: createErrorResponse(
          LatestReleasesErrorCode.INVALID_PARAMETERS,
          'Limit must be between 1 and 50'
        ),
      }
    }
  }
  
  // Validate artistSlug
  if (params.artistSlug !== undefined) {
    const artistSlug = params.artistSlug
    
    if (typeof artistSlug !== 'string' || artistSlug.trim() === '') {
      return {
        valid: false,
        error: createErrorResponse(
          LatestReleasesErrorCode.INVALID_PARAMETERS,
          'Artist slug must be a non-empty string'
        ),
      }
    }
    
    // Validate slug format (lowercase alphanumeric with hyphens)
    if (!/^[a-z0-9-]+$/.test(artistSlug)) {
      return {
        valid: false,
        error: createErrorResponse(
          LatestReleasesErrorCode.INVALID_PARAMETERS,
          'Artist slug must contain only lowercase letters, numbers, and hyphens'
        ),
      }
    }
  }
  
  return { valid: true }
}
