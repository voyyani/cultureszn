/**
 * LoadingSpinner Component
 * 
 * Reusable loading spinner for async states
 */

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <motion.div
      className={`${sizeMap[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  )
}

/**
 * LoadingSkeleton Component
 * 
 * Animated skeleton loader for content placeholders
 */

interface LoadingSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  className?: string
}

export function LoadingSkeleton({ 
  variant = 'rectangular', 
  width = '100%', 
  height = '1rem',
  className = '' 
}: LoadingSkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div
      className={`bg-white/5 animate-pulse ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

/**
 * ErrorMessage Component
 * 
 * Consistent error display with retry option
 */

import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  error?: Error | string | null
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ error, onRetry, className = '' }: ErrorMessageProps) {
  const message = error instanceof Error ? error.message : error || 'An error occurred'

  return (
    <div className={`bg-red-500/10 border border-red-500/20 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-red-400 mb-1">
            Error
          </h4>
          <p className="text-sm text-red-300/80">
            {message}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 
                     text-red-400 text-sm font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * EmptyState Component
 * 
 * Display when no data is available
 */

import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ 
  icon, 
  title = 'No data available',
  description,
  action,
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="flex justify-center mb-4">
        {icon || <Inbox className="w-12 h-12 text-text-muted" />}
      </div>
      <h3 className="text-lg font-medium text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white 
                   font-medium rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
