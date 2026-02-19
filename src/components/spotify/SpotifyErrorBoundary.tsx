/**
 * Spotify Error Boundary Component
 * 
 * Catches errors in Spotify-related components and provides graceful fallback UI.
 * Prevents entire app from crashing due to Spotify integration issues.
 */

import React, { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class SpotifyErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[SpotifyErrorBoundary] Caught error:', error, errorInfo)

    this.setState({
      errorInfo,
    })

    // Call custom error handler
    this.props.onError?.(error, errorInfo)

    // Send to analytics/monitoring
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        component: 'SpotifyErrorBoundary',
      })
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white text-center mb-2">
                Spotify Integration Error
              </h3>

              {/* Error message */}
              <p className="text-text-secondary text-center mb-6">
                {this.state.error?.message || 'Something went wrong with Spotify playback'}
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={this.handleReset}
                  className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 
                           border border-white/20 rounded-lg flex items-center 
                           justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>

                <a
                  href="https://open.spotify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#1DB954] hover:bg-[#1DB954]/90 
                           rounded-lg flex items-center justify-center gap-2 
                           transition-colors text-black font-medium"
                >
                  Open Spotify
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Debug info (development only) */}
              {import.meta.env.DEV && (
                <details className="mt-4 text-xs">
                  <summary className="cursor-pointer text-text-muted hover:text-text-secondary">
                    Error Details
                  </summary>
                  <pre className="mt-2 p-2 bg-black/40 rounded text-text-muted overflow-auto">
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook to handle async errors in functional components
 */
export function useAsyncError() {
  const [, setError] = React.useState()

  return React.useCallback(
    (error: Error) => {
      setError(() => {
        throw error
      })
    },
    [setError]
  )
}
