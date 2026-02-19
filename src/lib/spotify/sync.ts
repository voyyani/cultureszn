/**
 * Spotify Sync Service
 * 
 * Synchronizes artist and track data from Spotify API to local cache.
 * Designed to run on a schedule (hourly) to keep data fresh.
 */

import { spotifyClient } from './client'
import * as fs from 'fs'
import * as path from 'path'

interface SyncResult {
  success: boolean
  artistssynced: number
  tracksSynced: number
  errors: string[]
  timestamp: string
}

export class SpotifySyncService {
  private mappings: any[] = []

  /**
   * Load Spotify ID mappings
   */
  async loadMappings() {
    try {
      const mappingsPath = path.join(process.cwd(), 'data/spotify-mappings.json')
      const data = fs.readFileSync(mappingsPath, 'utf-8')
      this.mappings = JSON.parse(data)
      console.log(`📚 Loaded ${this.mappings.length} artist mappings`)
    } catch (error) {
      console.error('Failed to load Spotify mappings:', error)
      this.mappings = []
    }
  }

  /**
   * Sync single artist's data
   */
  async syncArtist(artistId: string, slug: string): Promise<{ tracks: number; artist: boolean }> {
    console.log(`\n🔄 Syncing artist: ${slug} (${artistId})`)

    try {
      // Fetch artist data
      const artist = await spotifyClient.getArtist(artistId)
      if (!artist) {
        console.error(`  ❌ Failed to fetch artist ${artistId}`)
        return { tracks: 0, artist: false }
      }

      console.log(`  ✅ Artist: ${artist.name}`)
      console.log(`     Followers: ${artist.followers.toLocaleString()}`)
      console.log(`     Popularity: ${artist.popularity}/100`)

      // Fetch top tracks
      const topTracks = await spotifyClient.getArtistTopTracks(artistId)
      console.log(`  ✅ Top tracks: ${topTracks.length}`)

      // Fetch albums
      const albums = await spotifyClient.getArtistAlbums(artistId)
      console.log(`  ✅ Albums: ${albums.length}`)

      return { tracks: topTracks.length, artist: true }
    } catch (error) {
      console.error(`  ❌ Error syncing ${slug}:`, error)
      return { tracks: 0, artist: false }
    }
  }

  /**
   * Sync specific tracks by ID
   */
  async syncTracks(trackIds: string[]): Promise<number> {
    if (trackIds.length === 0) return 0

    console.log(`\n🎵 Syncing ${trackIds.length} tracks...`)
    
    try {
      const tracks = await spotifyClient.getTracks(trackIds)
      console.log(`  ✅ Successfully synced ${tracks.length} tracks`)
      
      // Log track details
      tracks.forEach(track => {
        console.log(`     • ${track.title} - ${track.artists.map(a => a.name).join(', ')}`)
      })

      return tracks.length
    } catch (error) {
      console.error('  ❌ Error syncing tracks:', error)
      return 0
    }
  }

  /**
   * Sync all artists and their releases
   */
  async syncAll(): Promise<SyncResult> {
    console.log('🚀 Starting full Spotify sync...\n')

    const result: SyncResult = {
      success: true,
      artistssynced: 0,
      tracksSynced: 0,
      errors: [],
      timestamp: new Date().toISOString(),
    }

    // Load mappings if not already loaded
    if (this.mappings.length === 0) {
      await this.loadMappings()
    }

    // Sync each artist
    for (const mapping of this.mappings) {
      if (!mapping.spotifyArtistId) {
        console.log(`⚠️  Skipping ${mapping.slug} - no Spotify artist ID`)
        result.errors.push(`${mapping.slug}: No Spotify artist ID`)
        continue
      }

      try {
        // Sync artist
        const artistResult = await this.syncArtist(mapping.spotifyArtistId, mapping.slug)
        
        if (artistResult.artist) {
          result.artistssynced++
        }

        // Collect track IDs from releases
        const trackIds = mapping.releases
          .filter((r: any) => r.spotifyTrackId)
          .map((r: any) => r.spotifyTrackId)

        // Sync tracks
        if (trackIds.length > 0) {
          const tracksCount = await this.syncTracks(trackIds)
          result.tracksSynced += tracksCount
        }

        // Rate limiting - wait 500ms between artists
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error: any) {
        console.error(`❌ Error syncing ${mapping.slug}:`, error)
        result.errors.push(`${mapping.slug}: ${error.message}`)
        result.success = false
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 Sync Summary:')
    console.log('='.repeat(50))
    console.log(`✅ Artists synced: ${result.artistssynced}/${this.mappings.length}`)
    console.log(`✅ Tracks synced: ${result.tracksSynced}`)
    console.log(`❌ Errors: ${result.errors.length}`)
    if (result.errors.length > 0) {
      console.log('\nErrors:')
      result.errors.forEach(err => console.log(`  - ${err}`))
    }
    console.log('='.repeat(50))

    // Get cache stats
    const cacheStats = spotifyClient.getCacheStats()
    console.log('\n📦 Cache Statistics:')
    console.log(`   Keys: ${cacheStats.keys}`)
    console.log(`   Hits: ${cacheStats.hits}`)
    console.log(`   Misses: ${cacheStats.misses}`)
    console.log(`   Hit rate: ${cacheStats.keys > 0 ? ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1) : 0}%`)

    return result
  }

  /**
   * Quick sync for testing
   */
  async quickSync() {
    console.log('⚡ Quick sync - XiiX only\n')

    // Sync XiiX artist
    await this.syncArtist('4JwhMRnhXNf44gaWN2VlDO', 'xiix')

    // Sync known XiiX tracks
    const xiixTrackIds = [
      '5tVA6TkbaAH9QKT5av252t', // Example track ID
    ]

    await this.syncTracks(xiixTrackIds)
  }
}

// Export singleton
export const spotifySyncService = new SpotifySyncService()
