import { SpotifyEmbed } from '@/components/media'
import type { CatalogPlaylist } from '@/lib/catalog'

export function PlaylistCard({ playlist }: { playlist: CatalogPlaylist }) {
  return (
    <article className="rounded-szn border border-line bg-bg-raised p-4 sm:p-5">
      <h3 className="text-xl">{playlist.name}</h3>
      <p className="label mt-1 text-sm text-fg-muted">{playlist.trackCount} tracks</p>
      {playlist.description && <p className="mt-3 text-fg-muted">{playlist.description}</p>}
      <div className="mt-4">
        <SpotifyEmbed type="playlist" id={playlist.id} title={playlist.name} poster={playlist.coverUrl} />
      </div>
    </article>
  )
}
