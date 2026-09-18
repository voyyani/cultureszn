const largestImage = (images = []) => [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url ?? ''

export function mapAlbum(raw) {
  return {
    id: raw.id,
    name: raw.name,
    albumType: raw.album_type,
    releaseDate: raw.release_date,
    coverUrl: largestImage(raw.images),
    url: raw.external_urls?.spotify ?? '',
    totalTracks: raw.total_tracks ?? 0,
    tracks: (raw.tracks?.items ?? [])
      .map((t) => ({
        id: t.id, name: t.name, durationMs: t.duration_ms, trackNumber: t.track_number,
        url: t.external_urls?.spotify ?? '', artists: (t.artists ?? []).map((a) => a.name),
      }))
      .sort((a, b) => a.trackNumber - b.trackNumber),
  }
}

export function mapPlaylist(raw) {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? '',
    coverUrl: largestImage(raw.images),
    url: raw.external_urls?.spotify ?? '',
    trackCount: raw.tracks?.total ?? 0,
    tracks: (raw.tracks?.items ?? [])
      .map((i) => i.track)
      .filter(Boolean)
      .map((t) => ({ id: t.id, name: t.name, artists: (t.artists ?? []).map((a) => a.name), durationMs: t.duration_ms, url: t.external_urls?.spotify ?? '' })),
  }
}

export function stripVolatile(catalog) {
  const rest = { ...catalog }
  delete rest.syncedAt
  return rest
}
