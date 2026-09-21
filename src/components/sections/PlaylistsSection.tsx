import { SectionHeader } from '@/components/ui'
import { PlaylistCard } from '@/components/releases/PlaylistCard'
import { getPlaylists } from '@/data'

/* Curated Culture SZN playlists from the synced catalog. Omitted entirely when none exist — no filler. */
export function PlaylistsSection() {
  const playlists = getPlaylists()
  if (playlists.length === 0) return null
  return (
    <section className="section-szn" aria-labelledby="playlists-heading">
      <div className="container-szn">
        <SectionHeader id="playlists-heading" title="Playlists" subtitle="Curated by the collective, refreshed from Spotify every day." />
        <ul className="grid gap-6 md:grid-cols-2">
          {playlists.map((p) => <li key={p.id}><PlaylistCard playlist={p} /></li>)}
        </ul>
      </div>
    </section>
  )
}
