import { Link } from 'react-router-dom'
import { Card, CardImage, CardContent, Badge, Text } from '@/components/ui'
import type { Member } from '@/types'

interface MemberCardProps {
  member: Member
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link to={`/members/${member.slug}`}>
      <Card variant="bordered" className="h-full border border-white/5">
        <CardImage className="h-[350px]">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        </CardImage>
        <CardContent>
          <h3 className="text-xl font-[family-name:var(--font-heading)] font-bold mb-2 text-text-primary">
            {member.name}
          </h3>
          <Text color="orange" weight="medium" className="mb-3">
            {member.role}
          </Text>
          <Text color="secondary" size="sm" className="mb-4 line-clamp-2">
            {member.bio}
          </Text>
          <div className="flex flex-wrap gap-2">
            {member.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
