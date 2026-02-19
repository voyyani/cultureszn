/**
 * Phase 4 Integration Examples
 * 
 * Demonstrates how to use all Phase 4 features together.
 */

import { enhancedSpotifyClient } from '@/lib/spotify/enhanced-client'
import { SpotifyErrorBoundary } from '@/components/spotify/SpotifyErrorBoundary'
import { SpotifyHealthDashboard } from '@/components/spotify/SpotifyHealthDashboard'
import { performanceMonitor } from '@/lib/spotify/performance'
import { spotifyRateLimiter } from '@/lib/spotify/rate-limiter'

// ============================================================================
// EXAMPLE 1: Basic Usage with Enhanced Client
// ============================================================================

export async function Example1_BasicUsage() {
  try {
    // All resilience patterns applied automatically!
    const response = await enhancedSpotifyClient.getTrack('3n3Ppam7vgaVa1iaRUc9Lp')
    
    console.log('Track:', response.data.title)
    console.log('Was cached?', response.cached)
    console.log('Response time:', response.responseTime, 'ms')
    console.log('From cache?', response.fromCache)
  } catch (error) {
    console.error('Error fetching track:', error)
    // Error already logged to performance monitor
  }
}

// ============================================================================
// EXAMPLE 2: Batch Requests with Automatic Rate Limiting
// ============================================================================

export async function Example2_BatchRequests() {
  const trackIds = [
    '3n3Ppam7vgaVa1iaRUc9Lp',
    '0VjIjW4GlUZAMYd2vXMi3b',
    '6rqhFgbbKwnb9MLmUQDhG6',
  ]

  try {
    // Automatically rate-limited and cached
    const response = await enhancedSpotifyClient.getTracks(trackIds)
    
    console.log('Fetched tracks:', response.data.length)
    console.log('Some from cache?', response.cached)
  } catch (error) {
    console.error('Error fetching tracks:', error)
  }
}

// ============================================================================
// EXAMPLE 3: React Component with Error Boundary
// ============================================================================

export function Example3_ErrorBoundary() {
  return (
    <SpotifyErrorBoundary
      onError={(error, errorInfo) => {
        // Custom error handling
        console.error('Spotify component error:', error)
        console.error('Component stack:', errorInfo.componentStack)
      }}
    >
      {/* Your Spotify components here */}
      <YourSpotifyComponent />
    </SpotifyErrorBoundary>
  )
}

function YourSpotifyComponent() {
  // Component that might throw errors
  return <div>Spotify content</div>
}

// ============================================================================
// EXAMPLE 4: Monitoring Health Metrics
// ============================================================================

export function Example4_HealthMetrics() {
  const metrics = enhancedSpotifyClient.getMetrics()
  
  console.log('=== Spotify Health Metrics ===')
  console.log('Performance:', {
    avgResponseTime: metrics.performance.api.avgResponseTime,
    requests: metrics.performance.api.requests,
    errorRate: metrics.performance.api.errorRate,
  })
  
  console.log('Cache:', {
    hitRate: metrics.performance.cache.hitRate,
    hits: metrics.performance.cache.hits,
    misses: metrics.performance.cache.misses,
  })
  
  console.log('Rate Limit:', {
    used: metrics.rateLimit.used,
    remaining: metrics.rateLimit.remaining,
    queueSize: metrics.rateLimit.queueSize,
  })
  
  console.log('Circuit Breaker:', {
    state: metrics.circuitBreaker.state,
    failures: metrics.circuitBreaker.failures,
  })
}

// ============================================================================
// EXAMPLE 5: Health Dashboard in App
// ============================================================================

export function Example5_HealthDashboard() {
  return (
    <div className="app">
      {/* Your app content */}
      
      {/* Health dashboard (dev mode only, bottom-right) */}
      <SpotifyHealthDashboard />
    </div>
  )
}

// ============================================================================
// EXAMPLE 6: Manual Performance Tracking
// ============================================================================

export async function Example6_ManualTracking() {
  const startTime = Date.now()
  
  try {
    // Your custom operation
    await customSpotifyOperation()
    
    // Record success
    performanceMonitor.recordOperation(
      'custom_operation',
      startTime,
      true,
      false
    )
  } catch (error) {
    // Record failure
    performanceMonitor.recordOperation(
      'custom_operation',
      startTime,
      false,
      false,
      error instanceof Error ? error.message : 'Unknown error'
    )
    throw error
  }
}

async function customSpotifyOperation() {
  // Your operation
}

// ============================================================================
// EXAMPLE 7: Check Service Health Before Critical Operations
// ============================================================================

export async function Example7_HealthCheck() {
  const isHealthy = await enhancedSpotifyClient.healthCheck()
  
  if (!isHealthy) {
    console.warn('Spotify service is unhealthy, showing fallback UI')
    // Show fallback UI or cached data
    return
  }
  
  // Proceed with Spotify operations
  await performCriticalOperation()
}

async function performCriticalOperation() {
  // Your critical operation
}

// ============================================================================
// EXAMPLE 8: Monitor Rate Limit Before Bulk Operations
// ============================================================================

export async function Example8_RateLimitMonitoring() {
  const status = spotifyRateLimiter.getStatus()
  
  console.log('Rate limit status:', {
    used: status.used,
    remaining: status.remaining,
    utilization: status.utilizationPercent,
    queueSize: status.queueSize,
  })
  
  if (status.utilizationPercent > 90) {
    console.warn('Rate limit nearly exhausted, waiting...')
    await new Promise(resolve => setTimeout(resolve, status.resetIn))
  }
  
  // Now safe to proceed
  await bulkOperation()
}

async function bulkOperation() {
  // Your bulk operation
}

// ============================================================================
// EXAMPLE 9: Export Metrics for External Monitoring
// ============================================================================

export function Example9_ExportMetrics() {
  const exportedMetrics = performanceMonitor.exportMetrics()
  
  // Send to external monitoring service
  sendToDatadog(exportedMetrics)
  // Or Sentry, New Relic, etc.
  
  console.log('Exported metrics:', exportedMetrics)
}

function sendToDatadog(_metrics: any) {
  // Implementation for your monitoring service
}

// ============================================================================
// EXAMPLE 10: Complete Real-World Integration
// ============================================================================

export function Example10_CompleteIntegration() {
  return (
    <SpotifyErrorBoundary>
      <div className="app-container">
        {/* Your app */}
        <MusicPlayer />
        
        {/* Health monitoring (dev only) */}
        <SpotifyHealthDashboard />
      </div>
    </SpotifyErrorBoundary>
  )
}

function MusicPlayer() {
  const [track, setTrack] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const loadTrack = async (trackId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Enhanced client handles:
      // - Caching
      // - Rate limiting
      // - Retries
      // - Circuit breaking
      // - Performance tracking
      const response = await enhancedSpotifyClient.getTrack(trackId)
      setTrack(response.data)
      
      // Log performance info
      if (response.cached) {
        console.log('🚀 Instant load from cache!')
      } else {
        console.log(`⏱️ Loaded in ${response.responseTime}ms`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load track')
      // Error already tracked in performance monitor
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {track && <div>Now playing: {track.title}</div>}
    </div>
  )
}

// Helper for React useState
import React from 'react'

// ============================================================================
// USAGE GUIDELINES
// ============================================================================

/*
 * 1. ALWAYS use SpotifyErrorBoundary around Spotify components
 * 2. PREFER enhancedSpotifyClient over basic spotifyClient
 * 3. ENABLE SpotifyHealthDashboard during development
 * 4. MONITOR metrics in production via exportMetrics()
 * 5. CHECK healthCheck() before critical operations
 * 6. TRUST the automatic resilience patterns
 * 7. DON'T manually retry - it's handled automatically
 * 8. DON'T worry about rate limits - they're managed
 * 9. DO log performance metrics for optimization
 * 10. DO export metrics to your monitoring service
 */
