/**
 * Test Spotify Integration
 * 
 * Verifies that Spotify client is working and can fetch data.
 */

import dotenv from 'dotenv'
import { spotifyClient, spotifySyncService } from '../src/lib/spotify/index'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function testSpotifyIntegration() {
  console.log('🧪 Testing Spotify Integration\n')
  console.log('=' .repeat(60))

  // Test 1: Get Artist (XiiX)
  console.log('\n📍 Test 1: Fetch Artist Data')
  console.log('-'.repeat(60))
  
  const artistId = '4JwhMRnhXNf44gaWN2VlDO' // XiiX
  const artist = await spotifyClient.getArtist(artistId)
  
  if (artist) {
    console.log('✅ Artist fetch successful!')
    console.log(`   Name: ${artist.name}`)
    console.log(`   Followers: ${artist.followers.toLocaleString()}`)
    console.log(`   Popularity: ${artist.popularity}/100`)
    console.log(`   Genres: ${artist.genres.join(', ') || 'N/A'}`)
    console.log(`   URL: ${artist.externalUrl}`)
  } else {
    console.log('❌ Failed to fetch artist')
    return
  }

  // Test 2: Get Top Tracks
  console.log('\n📍 Test 2: Fetch Top Tracks')
  console.log('-'.repeat(60))
  
  const topTracks = await spotifyClient.getArtistTopTracks(artistId, 'US')
  
  if (topTracks.length > 0) {
    console.log(`✅ Found ${topTracks.length} top tracks:`)
    topTracks.slice(0, 5).forEach((track, i) => {
      console.log(`   ${i + 1}. ${track.title}`)
      console.log(`      Album: ${track.album.name}`)
      console.log(`      Duration: ${Math.floor(track.durationMs / 60000)}:${String(Math.floor((track.durationMs % 60000) / 1000)).padStart(2, '0')}`)
      console.log(`      Popularity: ${track.popularity}/100`)
    })
  } else {
    console.log('❌ No tracks found')
  }

  // Test 3: Get Specific Track
  console.log('\n📍 Test 3: Fetch Specific Track')
  console.log('-'.repeat(60))
  
  if (topTracks.length > 0) {
    const track = await spotifyClient.getTrack(topTracks[0].id)
    
    if (track) {
      console.log('✅ Track fetch successful!')
      console.log(`   Title: ${track.title}`)
      console.log(`   Artists: ${track.artists.map(a => a.name).join(', ')}`)
      console.log(`   Album: ${track.album.name}`)
      console.log(`   Cover Art: ${track.album.coverArt ? '✅' : '❌'}`)
      console.log(`   Preview URL: ${track.previewUrl ? '✅' : '❌'}`)
      console.log(`   Explicit: ${track.explicit ? 'Yes' : 'No'}`)
      console.log(`   Release Date: ${track.album.releaseDate}`)
    }
  }

  // Test 4: Cache Statistics
  console.log('\n📍 Test 4: Cache Performance')
  console.log('-'.repeat(60))
  
  const cacheStats = spotifyClient.getCacheStats()
  console.log(`📦 Cache Statistics:`)
  console.log(`   Total keys: ${cacheStats.keys}`)
  console.log(`   Cache hits: ${cacheStats.hits}`)
  console.log(`   Cache misses: ${cacheStats.misses}`)
  
  const hitRate = cacheStats.hits + cacheStats.misses > 0
    ? ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1)
    : '0'
  console.log(`   Hit rate: ${hitRate}%`)

  // Test 5: Full Sync
  console.log('\n📍 Test 5: Run Full Sync')
  console.log('-'.repeat(60))
  
  await spotifySyncService.syncAll()

  console.log('\n' + '='.repeat(60))
  console.log('✅ All tests completed!')
  console.log('='.repeat(60))
}

// Run tests
testSpotifyIntegration().catch(error => {
  console.error('\n❌ Test failed:', error)
  process.exit(1)
})
