import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardImage, CardContent, Text } from '@/components/ui'
import type { Release } from '@/types'

interface ReleaseCardProps {
  release: Release
  variant?: 'default' | 'compact'
}

export function ReleaseCard({
  release,
  variant = 'default',
}: ReleaseCardProps) {
  if (variant === 'compact') {
    return (
      <Link to={`/releases/${release.slug}`}>
        <motion.div
          className="relative flex items-center gap-5 p-5 bg-white/[0.03] rounded-[var(--radius-szn)]
                     border border-white/5 hover:bg-white/[0.07] transition-all duration-300 group"
          whileHover={{ x: 10 }}
        >
          <div className="relative w-[70px] h-[70px] rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={release.coverArt}
              alt={release.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-[family-name:var(--font-heading)] font-semibold text-text-primary truncate">
              {release.title}
            </h4>
            <Text color="secondary" size="sm">
              {release.artist} • {release.type.charAt(0).toUpperCase() + release.type.slice(1)}
            </Text>
            <Text color="muted" size="sm">
              {new Date(release.releaseDate).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </div>
        </motion.div>
      </Link>
    )
  }

  return (
    <Link to={`/releases/${release.slug}`}>
      <Card variant="bordered" className="h-full border border-white/5 group">
        <CardImage className="h-[250px] relative">
          <img
            src={release.coverArt}
            alt={release.title}
            className="w-full h-full object-cover"
          />
        </CardImage>
        <CardContent>
          <h3 className="text-lg font-[family-name:var(--font-heading)] font-bold mb-1 text-text-primary">
            {release.title}
          </h3>
          <Text color="orange" weight="medium" size="sm" className="mb-2">
            {release.artist}
          </Text>
          <Text color="muted" size="sm">
            {new Date(release.releaseDate).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </CardContent>
      </Card>
    </Link>
  )
}
