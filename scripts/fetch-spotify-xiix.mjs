import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const MARKET = process.env.SPOTIFY_MARKET || 'US'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables.')
  process.exit(1)
}

const xiixPath = path.resolve(__dirname, '../src/data/artists/xiix.json')
const xiixRaw = await fs.readFile(xiixPath, 'utf8')
const xiixData = JSON.parse(xiixRaw)

const ARTIST_ID = process.env.SPOTIFY_ARTIST_ID || xiixData?.profiles?.spotify?.artist_id

if (!ARTIST_ID) {
  console.error('Missing Spotify artist ID. Provide SPOTIFY_ARTIST_ID or add profiles.spotify.artist_id in xiix.json.')
  process.exit(1)
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function getToken() {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Token request failed (${response.status}): ${text}`)
  }

  const data = await response.json()
  return data.access_token
}

async function fetchJson(url, token, retries = 3) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 429 && retries > 0) {
    const retryAfter = Number(response.headers.get('Retry-After') || '1')
    await delay(retryAfter * 1000)
    return fetchJson(url, token, retries - 1)
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Request failed (${response.status}): ${text}`)
  }

  return response.json()
}

async function fetchPaged(url, token, itemKey = 'items') {
  let nextUrl = url
  const items = []

  while (nextUrl) {
    const data = await fetchJson(nextUrl, token)
    const pageItems = data[itemKey] || []
    items.push(...pageItems)
    nextUrl = data.next
  }

  return items
}

async function fetchAlbumsBatch(ids, token) {
  const url = `https://api.spotify.com/v1/albums?ids=${ids.join(',')}&market=${MARKET}`
  const data = await fetchJson(url, token)
  return data.albums || []
}

function chunkArray(list, size) {
  const chunks = []
  for (let i = 0; i < list.length; i += size) {
    chunks.push(list.slice(i, i + size))
  }
  return chunks
}

const token = await getToken()

const artistInfo = await fetchJson(`https://api.spotify.com/v1/artists/${ARTIST_ID}`, token)

const albumItems = await fetchPaged(
  `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?include_groups=album,single,appears_on,compilation&limit=50&market=${MARKET}`,
  token
)

const albumGroupById = new Map()
const albumIds = []

albumItems.forEach((album) => {
  if (!album?.id) return
  if (!albumGroupById.has(album.id)) {
    albumGroupById.set(album.id, album.album_group || album.album_type || 'album')
    albumIds.push(album.id)
  }
})

const albumDetails = []
for (const batch of chunkArray(albumIds, 20)) {
  const albums = await fetchAlbumsBatch(batch, token)
  albumDetails.push(...albums)
}

const albumMap = new Map()
albumDetails.forEach((album) => {
  if (!album?.id) return
  albumMap.set(album.id, {
    id: album.id,
    name: album.name,
    album_type: album.album_type,
    album_group: albumGroupById.get(album.id) || album.album_type,
    release_date: album.release_date,
    release_date_precision: album.release_date_precision,
    total_tracks: album.total_tracks,
    images: album.images || [],
    external_urls: album.external_urls || {},
    artists: (album.artists || []).map((artist) => ({
      id: artist.id,
      name: artist.name,
      spotify_url: artist.external_urls?.spotify,
    })),
  })
})

const trackMap = new Map()

for (const albumId of albumIds) {
  const album = albumMap.get(albumId)
  if (!album) continue

  const tracks = await fetchPaged(
    `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50&market=${MARKET}`,
    token
  )

  tracks.forEach((track) => {
    const trackKey = track.id || `${albumId}:${track.track_number}:${track.name}`
    const existing = trackMap.get(trackKey)
    const albumRef = {
      id: albumId,
      name: album.name,
      album_type: album.album_type,
      album_group: album.album_group,
      release_date: album.release_date,
      release_date_precision: album.release_date_precision,
      images: album.images,
      external_urls: album.external_urls,
    }

    if (existing) {
      existing.albums.push(albumRef)
      return
    }

    trackMap.set(trackKey, {
      id: track.id || null,
      name: track.name,
      duration_ms: track.duration_ms,
      explicit: track.explicit,
      track_number: track.track_number,
      disc_number: track.disc_number,
      preview_url: track.preview_url,
      is_local: track.is_local,
      external_urls: track.external_urls || {},
      artists: (track.artists || []).map((artist) => ({
        id: artist.id,
        name: artist.name,
        spotify_url: artist.external_urls?.spotify,
      })),
      albums: [albumRef],
    })
  })
}

const output = {
  schema_version: '1.0.0',
  generated_at: new Date().toISOString(),
  market: MARKET,
  source: 'spotify_web_api',
  artist: {
    id: artistInfo.id,
    name: artistInfo.name,
    spotify_url: artistInfo.external_urls?.spotify,
  },
  stats: {
    album_count: albumMap.size,
    track_count: trackMap.size,
  },
  albums: Array.from(albumMap.values()),
  tracks: Array.from(trackMap.values()),
}

const outputPath = path.resolve(__dirname, '../src/data/artists/xiix.spotify.json')
await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')

console.log(`Wrote ${output.tracks.length} tracks across ${output.albums.length} albums to ${outputPath}`)
