/**
 * Test Latest Releases API Endpoint
 * 
 * Run with: npx tsx scripts/test-latest-releases.ts
 */

import { getRecentReleases } from '../src/data/releases'
import { extractSpotifyIds, enrichStaticRelease } from '../src/lib/spotify/latest-releases'

console.log('🧪 Testing Latest Releases Integration...\n')

// Test 1: Extract Spotify IDs
console.log('Test 1: Extract Spotify IDs from static data')
console.log('=' .repeat(50))

const releases = getRecentReleases(5)
console.log(`Found ${releases.length} releases`)

const spotifyIds = extractSpotifyIds(releases)
console.log(`Extracted ${spotifyIds.length} Spotify IDs:`)
spotifyIds.forEach((id, i) => {
  console.log(`  ${i + 1}. ${id}`)
})

console.log('\n')

// Test 2: Enrich static releases
console.log('Test 2: Enrich static releases (fallback mode)')
console.log('='.repeat(50))

const enriched = releases.map(enrichStaticRelease)

enriched.forEach((release, i) => {
  console.log(`\n${i + 1}. ${release.title}`)
  console.log(`   Artist: ${release.artist}`)
  console.log(`   Type: ${release.type}`)
  console.log(`   Date: ${release.releaseDate}`)
  console.log(`   Spotify ID: ${release.spotifyId || 'N/A'}`)
  console.log(`   Spotify URI: ${release.spotifyUri || 'N/A'}`)
  console.log(`   Playable: ${release.isPlayable ? '✅' : '❌'}`)
  console.log(`   Source: ${release.source}`)
  console.log(`   Cover: ${release.coverArt.substring(0, 50)}...`)
})

console.log('\n')

// Test 3: Summary
console.log('Test 3: Summary')
console.log('='.repeat(50))

const withSpotifyId = enriched.filter(r => r.spotifyId).length
const playable = enriched.filter(r => r.isPlayable).length

console.log(`Total releases: ${enriched.length}`)
console.log(`With Spotify ID: ${withSpotifyId} (${((withSpotifyId / enriched.length) * 100).toFixed(1)}%)`)
console.log(`Playable: ${playable} (${((playable / enriched.length) * 100).toFixed(1)}%)`)

console.log('\n')
console.log('✅ Static data tests completed!')
console.log('\n')
console.log('Next steps:')
console.log('1. Start dev server: npm run dev')
console.log('2. Test API endpoint: curl http://localhost:5173/api/spotify/latest-releases')
console.log('3. Test with limit: curl http://localhost:5173/api/spotify/latest-releases?limit=5')
console.log('4. Test with artist filter: curl http://localhost:5173/api/spotify/latest-releases?artistSlug=xiix')
