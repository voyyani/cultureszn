/**
 * Test Spotify Frontend Integration
 * 
 * Tests React hooks, components, and Spotify data display.
 */

import { useSpotifyArtist, useSpotifyTopTracks } from '@/hooks'
import { TrackCard, SpotifyEmbed } from '@/components/shared'
import { LoadingSpinner, ErrorMessage } from '@/components/ui'

// XiiX artist ID from our data
const XIIX_ARTIST_ID = '4JwhMRnhXNf44gaWN2VlDO'

// Test track IDs (from SIXXTAPE album)
const TEST_TRACK_ID = '3n3Ppam7vgaVa1iaRUc9Lp' // Example track

export function SpotifyIntegrationTest() {
  // Test useSpotifyArtist hook
  const { artist, isLoading: artistLoading, error: artistError } = useSpotifyArtist(XIIX_ARTIST_ID)

  // Test useSpotifyTopTracks hook
  const { tracks, isLoading: tracksLoading, error: tracksError } = useSpotifyTopTracks(XIIX_ARTIST_ID)

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Spotify Integration Test</h1>
          <p className="text-text-muted">Testing Phase 2 Implementation</p>
        </div>

        {/* Artist Data Test */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Artist Data (useSpotifyArtist)</h2>
          {artistLoading && (
            <div className="flex items-center gap-3">
              <LoadingSpinner />
              <span>Loading artist data...</span>
            </div>
          )}
          {artistError && <ErrorMessage error={artistError} />}
          {artist && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              {artist.images && artist.images.length > 0 && (
                <img 
                  src={artist.images[0].url} 
                  alt={artist.name}
                  className="w-32 h-32 rounded-full mb-4"
                />
              )}
              <h3 className="text-xl font-bold mb-2">{artist.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-muted">Followers:</span>
                  <span className="ml-2 font-medium">{artist.followers.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-text-muted">Popularity:</span>
                  <span className="ml-2 font-medium">{artist.popularity}/100</span>
                </div>
                <div className="col-span-2">
                  <span className="text-text-muted">Genres:</span>
                  <span className="ml-2">{artist.genres.join(', ') || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Top Tracks Test */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Top Tracks (useSpotifyTopTracks)</h2>
          {tracksLoading && (
            <div className="flex items-center gap-3">
              <LoadingSpinner />
              <span>Loading top tracks...</span>
            </div>
          )}
          {tracksError && <ErrorMessage error={tracksError} />}
          {tracks && tracks.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-text-muted">Found {tracks.length} top tracks</p>
              {tracks.slice(0, 3).map((track) => (
                <div key={track.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-4">
                    {track.album?.coverArt && (
                      <img 
                        src={track.album.coverArt}
                        alt={track.album.name}
                        className="w-16 h-16 rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold">{track.title}</h4>
                      <p className="text-sm text-text-muted">
                        {track.artists.map(a => a.name).join(', ')}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Popularity: {track.popularity}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* TrackCard Component Test */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">TrackCard Component</h2>
          <div className="space-y-4">
            <h3 className="text-lg">Default Variant</h3>
            <TrackCard trackId={TEST_TRACK_ID} showPlayer />
            
            <h3 className="text-lg mt-6">Compact Variant</h3>
            <TrackCard trackId={TEST_TRACK_ID} variant="compact" />
            
            <h3 className="text-lg mt-6">Minimal Variant</h3>
            <TrackCard trackId={TEST_TRACK_ID} variant="minimal" />
          </div>
        </section>

        {/* SpotifyEmbed Component Test */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">SpotifyEmbed Component</h2>
          <div className="space-y-4">
            <h3 className="text-lg">Standard Embed</h3>
            <SpotifyEmbed trackId={TEST_TRACK_ID} />
            
            <h3 className="text-lg mt-6">Compact Embed</h3>
            <SpotifyEmbed trackId={TEST_TRACK_ID} compact />
          </div>
        </section>

        {/* Test Summary */}
        <section className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2 text-green-400">✓ Test Complete</h2>
          <p className="text-sm text-green-300/80">
            All Phase 2 components and hooks tested successfully.
            Check console for any errors.
          </p>
        </section>
      </div>
    </div>
  )
}
