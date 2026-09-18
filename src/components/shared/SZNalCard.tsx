import { Link } from 'react-router-dom'
import { Calendar, Clock } from 'lucide-react'
import { Card, CardContent, Text } from '@/components/ui'
import type { SZNalMeta } from '@/content/sznals'
import { formatDate } from '@/lib/format'

interface SZNalCardProps {
  sznal: SZNalMeta
  /** false renders a non-link teaser (drafts never link — no dead ends). */
  asLink?: boolean
}

export function SZNalCard({ sznal, asLink = true }: SZNalCardProps) {
  const card = (
    <Card variant="bordered" className="h-full border border-white/5 hover:border-sunset-purple/30">
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <Text color="purple" weight="semibold" size="xs" className="uppercase tracking-wider">
            {sznal.category}
          </Text>
          {!asLink && (
            <Text size="xs" color="muted" className="uppercase tracking-wider">
              In the works
            </Text>
          )}
        </div>
        <h3 className="text-lg font-[family-name:var(--font-heading)] font-bold mb-3 text-text-primary leading-snug line-clamp-2">
          {sznal.title}
        </h3>
        <Text color="secondary" size="sm" className="mb-4 line-clamp-2">
          {sznal.excerpt}
        </Text>
        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-text-muted text-sm">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(sznal.publishedDate, { month: 'short' })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {sznal.readTime}
          </span>
        </div>
      </CardContent>
    </Card>
  )

  if (!asLink) return <div>{card}</div>
  return <Link to={`/sznals/${sznal.slug}`}>{card}</Link>
}
