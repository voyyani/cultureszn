import type { SpotifyCatalog } from '@/lib/catalog'

export const fixtureCatalog: SpotifyCatalog = {
  syncedAt: '2026-09-01T03:00:00.000Z',
  artists: {
    xiix: {
      spotifyArtistId: '4JwhMRnhXNf44gaWN2VlDO',
      albums: [
        {
          id: '5EC55CH3Tybf6kNJS0415L', name: 'SIXXTAPE', albumType: 'album', releaseDate: '2025-05-29',
          coverUrl: 'https://i.scdn.co/image/sixx.jpg', url: 'https://open.spotify.com/album/5EC55CH3Tybf6kNJS0415L', totalTracks: 2,
          tracks: [
            { id: 't1', name: 'INTRO', durationMs: 90000, trackNumber: 1, url: 'u1', artists: ['XiiX'] },
            { id: 't2', name: 'SABAKI', durationMs: 180000, trackNumber: 2, url: 'u2', artists: ['XiiX', 'Pipí'] },
          ],
        },
        {
          id: 'NEWDROP00000000000000A', name: 'NEW DROP', albumType: 'single', releaseDate: '2026-09-01',
          coverUrl: 'https://i.scdn.co/image/new.jpg', url: 'https://open.spotify.com/album/NEWDROP00000000000000A', totalTracks: 1,
          tracks: [{ id: 't3', name: 'NEW DROP', durationMs: 200000, trackNumber: 1, url: 'u3', artists: ['XiiX'] }],
        },
      ],
    },
  },
  playlists: [],
}
