import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardImage, CardContent, Badge, Text } from '@/components/ui'
import type { NormalizedArtist } from '@/types/artist'

interface ArtistCardProps {
  artist: NormalizedArtist
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showFallback = imageFailed || !artist.image

  return (
    <Link to={`/artists/${artist.slug}`}>
      <Card variant="bordered" className="h-full border border-white/5">
        <CardImage className="h-[350px]">
          {showFallback ? (
            <div className="w-full h-full bg-gradient-to-br from-burnt-orange/30 via-sunset-purple/20 to-deep-purple/30 flex items-center justify-center">
              <span className="text-5xl font-[family-name:var(--font-heading)] font-bold text-white/80">
                {artist.name.trim().charAt(0) || '?'}
              </span>
            </div>
          ) : (
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover"
              onError={() => setImageFailed(true)}
            />
          )}
        </CardImage>
        <CardContent>
          <h3 className="text-xl font-[family-name:var(--font-heading)] font-bold mb-2 text-text-primary">
            {artist.name}
          </h3>
          <Text color="orange" weight="medium" className="mb-3">
            {artist.role}
          </Text>
          <Text color="secondary" size="sm" className="mb-4 line-clamp-2">
            {artist.shortBio}
          </Text>
          <div className="flex flex-wrap gap-2">
            {artist.tags.slice(0, 3).map((tag) => (
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
