import { Link } from 'react-router-dom'
import { Calendar, Clock } from 'lucide-react'
import { Card, CardContent, Text } from '@/components/ui'
import type { SZNal } from '@/types'

interface SZNalCardProps {
  sznal: SZNal
}

export function SZNalCard({ sznal }: SZNalCardProps) {
  return (
    <Link to={`/sznals/${sznal.slug}`}>
      <Card variant="bordered" className="h-full border border-white/5 hover:border-sunset-purple/30">
        <CardContent>
          <Text
            color="purple"
            weight="semibold"
            size="xs"
            className="uppercase tracking-wider mb-3"
          >
            {sznal.category}
          </Text>
          <h3 className="text-lg font-[family-name:var(--font-heading)] font-bold mb-3 text-text-primary leading-snug line-clamp-2">
            {sznal.title}
          </h3>
          <Text color="secondary" size="sm" className="mb-4 line-clamp-2">
            {sznal.excerpt}
          </Text>
          <div className="flex items-center justify-between pt-4 border-t border-white/5 text-text-muted text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(sznal.publishedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {sznal.readTime}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
