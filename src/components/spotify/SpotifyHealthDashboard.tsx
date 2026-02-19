/**
 * Spotify Health Dashboard Component
 * 
 * Real-time monitoring dashboard for Spotify integration health.
 * Shows performance metrics, cache stats, rate limits, and errors.
 */

import { useState, useEffect } from 'react'
import { Activity, Zap, Shield, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'
import { performanceMonitor } from '@/lib/spotify/performance'
import { spotifyRateLimiter } from '@/lib/spotify/rate-limiter'
import { spotifyCircuitBreaker } from '@/lib/spotify/retry'
import { spotifyCache } from '@/lib/spotify/cache'

export function SpotifyHealthDashboard() {
  const [metrics, setMetrics] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const updateMetrics = () => {
      const summary = performanceMonitor.getSummary()
      const rateLimitStatus = spotifyRateLimiter.getStatus()
      const circuitBreakerState = spotifyCircuitBreaker.getState()
      const cacheStats = spotifyCache.getStats()

      setMetrics({
        summary,
        rateLimitStatus,
        circuitBreakerState,
        cacheStats,
      })
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 5000) // Update every 5s

    return () => clearInterval(interval)
  }, [])

  // Only show in development or for admins
  if (!import.meta.env.DEV) return null

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-purple-600 hover:bg-purple-700 
                   rounded-full shadow-lg z-50 transition-colors"
        title="Spotify Health Dashboard"
      >
        <Activity className="w-5 h-5 text-white" />
      </button>
    )
  }

  if (!metrics) return null

  const isHealthy = performanceMonitor.isHealthy()
  const hitRate = metrics.summary.cache.hitRate

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[600px] overflow-y-auto 
                    bg-black/95 backdrop-blur-xl border border-white/20 rounded-lg 
                    shadow-2xl z-50">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Spotify Health
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-text-muted hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Overall Health Status */}
        <div
          className={`p-4 rounded-lg ${
            isHealthy ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isHealthy ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="font-semibold text-white">
              {isHealthy ? 'Healthy' : 'Degraded'}
            </span>
          </div>
          <p className="text-sm text-text-secondary">
            {metrics.summary.recentErrors > 0
              ? `${metrics.summary.recentErrors} errors in last minute`
              : 'All systems operational'}
          </p>
        </div>

        {/* Cache Metrics */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Cache Performance
          </h4>
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            <MetricRow label="Hit Rate" value={`${hitRate}%`} good={hitRate > 80} />
            <MetricRow label="Total Hits" value={metrics.cacheStats.hits.toString()} />
            <MetricRow label="Total Misses" value={metrics.cacheStats.misses.toString()} />
            <MetricRow label="Cache Size" value={`${metrics.cacheStats.ksize} keys`} />
          </div>
        </div>

        {/* API Performance */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            API Performance
          </h4>
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            <MetricRow
              label="Avg Response"
              value={`${Math.round(metrics.summary.api.avgResponseTime)}ms`}
              good={metrics.summary.api.avgResponseTime < 500}
            />
            <MetricRow label="Total Requests" value={metrics.summary.api.requests.toString()} />
            <MetricRow
              label="Error Rate"
              value={`${metrics.summary.api.errorRate.toFixed(2)}%`}
              good={metrics.summary.api.errorRate < 5}
            />
          </div>
        </div>

        {/* Rate Limiting */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-500" />
            Rate Limiting
          </h4>
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            <MetricRow
              label="Requests Used"
              value={`${metrics.rateLimitStatus.used}/${metrics.rateLimitStatus.limit}`}
            />
            <MetricRow
              label="Remaining"
              value={metrics.rateLimitStatus.remaining.toString()}
              good={metrics.rateLimitStatus.remaining > 50}
            />
            <MetricRow label="Queue Size" value={metrics.rateLimitStatus.queueSize.toString()} />
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  metrics.rateLimitStatus.utilizationPercent > 80 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${metrics.rateLimitStatus.utilizationPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Circuit Breaker */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            Circuit Breaker
          </h4>
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            <MetricRow
              label="State"
              value={metrics.circuitBreakerState.state}
              good={metrics.circuitBreakerState.state === 'CLOSED'}
            />
            <MetricRow label="Failures" value={metrics.circuitBreakerState.failures.toString()} />
          </div>
        </div>

        {/* Top Operations */}
        {metrics.summary.topOperations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Top Operations</h4>
            <div className="bg-white/5 rounded-lg p-3 space-y-2">
              {metrics.summary.topOperations.slice(0, 3).map((op: any) => (
                <div key={op.operation} className="text-xs">
                  <div className="flex justify-between text-text-secondary">
                    <span>{op.operation}</span>
                    <span>{op.calls} calls</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Avg: {Math.round(op.avgDuration)}ms</span>
                    <span>P95: {Math.round(op.p95)}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {
              performanceMonitor.reset()
              spotifyRateLimiter.reset()
              spotifyCircuitBreaker.reset()
            }}
            className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 
                     border border-white/20 rounded text-sm transition-colors"
          >
            Reset Metrics
          </button>
          <button
            onClick={() => {
              console.log('Exported metrics:', performanceMonitor.exportMetrics())
            }}
            className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 
                     rounded text-sm transition-colors"
          >
            Export JSON
          </button>
        </div>
      </div>
    </div>
  )
}

type MetricRowProps = {
  label: string
  value: string
  good?: boolean
}

function MetricRow({ label, value, good }: MetricRowProps) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-text-secondary">{label}</span>
      <span
        className={
          good === undefined
            ? 'text-white'
            : good
            ? 'text-green-400 font-medium'
            : 'text-red-400 font-medium'
        }
      >
        {value}
      </span>
    </div>
  )
}
