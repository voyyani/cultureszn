/**
 * Extract Spotify IDs Script
 * 
 * Extracts Spotify track and album IDs from existing artist JSON data
 * and creates a mapping file for the sync service.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface SpotifyMapping {
  slug: string
  artistName: string
  spotifyArtistId: string
  releases: Array<{
    title: string
    spotifyTrackId?: string
    spotifyAlbumId?: string
    url: string
    type: string
  }>
}

/**
 * Extract Spotify ID from URL
 */
function extractSpotifyId(url: string): { type: 'track' | 'album' | null; id: string | null } {
  if (!url) return { type: null, id: null }

  // Extract from: https://open.spotify.com/track/5tVA6TkbaAH9QKT5av252t
  const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/)
  if (trackMatch) return { type: 'track', id: trackMatch[1] }

  // Extract from: https://open.spotify.com/album/xyz
  const albumMatch = url.match(/album\/([a-zA-Z0-9]+)/)
  if (albumMatch) return { type: 'album', id: albumMatch[1] }

  return { type: null, id: null }
}

/**
 * Load and parse artist JSON files
 */
function loadArtistData(slug: string): any {
  try {
    const filePath = path.join(__dirname, `../src/data/artists/${slug}.json`)
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Failed to load ${slug}.json:`, error)
    return null
  }
}

/**
 * Extract mappings from artist data
 */
function extractMappings(artistData: any, slug: string): SpotifyMapping | null {
  if (!artistData) return null

  const mapping: SpotifyMapping = {
    slug,
    artistName: artistData.identity?.display_name || slug,
    spotifyArtistId: artistData.profiles?.spotify?.artist_id || '',
    releases: [],
  }

  // Extract from discography highlights
  if (artistData.discography?.highlights) {
    for (const release of artistData.discography.highlights) {
      const spotifyUrl = 
        release.links?.spotify_track || 
        release.links?.spotify_album || 
        release.links?.spotify ||
        ''

      if (spotifyUrl) {
        const { type, id } = extractSpotifyId(spotifyUrl)
        if (id) {
          mapping.releases.push({
            title: release.title,
            spotifyTrackId: type === 'track' ? id : undefined,
            spotifyAlbumId: type === 'album' ? id : undefined,
            url: spotifyUrl,
            type: release.type || 'single',
          })
        }
      }
    }
  }

  // Extract from projects
  if (artistData.discography?.projects) {
    for (const project of artistData.discography.projects) {
      const spotifyUrl = 
        project.links?.spotify_album || 
        project.links?.spotify ||
        ''

      if (spotifyUrl) {
        const { type, id } = extractSpotifyId(spotifyUrl)
        if (id) {
          mapping.releases.push({
            title: project.title,
            spotifyTrackId: type === 'track' ? id : undefined,
            spotifyAlbumId: type === 'album' ? id : undefined,
            url: spotifyUrl,
            type: project.type || 'album',
          })
        }
      }
    }
  }

  return mapping
}

/**
 * Main extraction function
 */
async function extractAllSpotifyIds() {
  console.log('🔍 Extracting Spotify IDs from artist data...\n')

  const artists = ['xiix', 'wavy', 'pipi']
  const mappings: SpotifyMapping[] = []

  for (const slug of artists) {
    console.log(`Processing ${slug}...`)
    const artistData = loadArtistData(slug)
    const mapping = extractMappings(artistData, slug)

    if (mapping) {
      mappings.push(mapping)
      console.log(`  ✅ Found ${mapping.releases.length} releases`)
      console.log(`  📌 Artist ID: ${mapping.spotifyArtistId || 'NOT FOUND'}`)
    }
  }

  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '../data')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write mappings to file
  const outputPath = path.join(outputDir, 'spotify-mappings.json')
  fs.writeFileSync(
    outputPath,
    JSON.stringify(mappings, null, 2)
  )

  // Write summary
  const totalReleases = mappings.reduce((sum, m) => sum + m.releases.length, 0)
  const totalArtists = mappings.filter(m => m.spotifyArtistId).length

  const summary = {
    extractedAt: new Date().toISOString(),
    totalArtists: mappings.length,
    artistsWithSpotifyId: totalArtists,
    totalReleases,
    artists: mappings.map(m => ({
      slug: m.slug,
      name: m.artistName,
      spotifyId: m.spotifyArtistId,
      releaseCount: m.releases.length,
    })),
  }

  const summaryPath = path.join(outputDir, 'spotify-mappings-summary.json')
  fs.writeFileSync(
    summaryPath,
    JSON.stringify(summary, null, 2)
  )

  console.log('\n✅ Extraction complete!')
  console.log(`\n📊 Summary:`)
  console.log(`   Total artists: ${mappings.length}`)
  console.log(`   Artists with Spotify ID: ${totalArtists}`)
  console.log(`   Total releases: ${totalReleases}`)
  console.log(`\n📁 Output files:`)
  console.log(`   ${outputPath}`)
  console.log(`   ${summaryPath}`)

  return mappings
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  extractAllSpotifyIds().catch(console.error)
}

export { extractAllSpotifyIds, extractSpotifyId }
