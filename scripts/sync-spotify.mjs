#!/usr/bin/env node
// Pulls artist discographies + curated playlists into src/data/generated/spotify-catalog.json.
// Client-credentials only. Never runs in the browser. Node 22, no dependencies.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { mapAlbum, mapPlaylist, stripVolatile } from './lib/spotify-map.mjs'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET')
  process.exit(1)
}

const SOURCES = path.resolve('src/data/spotify-sources.json')
const OUT = path.resolve('src/data/generated/spotify-catalog.json')
const API = 'https://api.spotify.com/v1'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  })
  if (!res.ok) throw new Error(`token ${res.status}: ${await res.text()}`)
  return (await res.json()).access_token
}

async function get(url, token, retries = 3) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (res.status === 429 && retries > 0) {
    await sleep(Number(res.headers.get('Retry-After') ?? '2') * 1000)
    return get(url, token, retries - 1)
  }
  if (!res.ok) throw new Error(`${url} → ${res.status}: ${await res.text()}`)
  return res.json()
}

async function fetchArtistAlbums(artistId, market, token) {
  const ids = []
  let url = `${API}/artists/${artistId}/albums?include_groups=album,single&market=${market}&limit=50`
  while (url) {
    const page = await get(url, token)
    ids.push(...page.items.map((a) => a.id))
    url = page.next
  }
  const albums = []
  for (let i = 0; i < ids.length; i += 20) {
    const batch = await get(`${API}/albums?ids=${ids.slice(i, i + 20).join(',')}&market=${market}`, token)
    albums.push(...batch.albums.filter(Boolean).map(mapAlbum))
  }
  return albums.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
}

async function fetchPlaylist(id, market, token) {
  const fields = 'id,name,description,external_urls,images,tracks.total,tracks.items(track(id,name,duration_ms,external_urls,artists(name)))'
  return mapPlaylist(await get(`${API}/playlists/${id}?market=${market}&fields=${encodeURIComponent(fields)}`, token))
}

const sources = JSON.parse(await readFile(SOURCES, 'utf8'))
const token = await getToken()
const catalog = { syncedAt: new Date().toISOString(), artists: {}, playlists: [] }
for (const { slug, spotifyArtistId } of sources.artists) {
  catalog.artists[slug] = { spotifyArtistId, albums: await fetchArtistAlbums(spotifyArtistId, sources.market, token) }
  console.log(`✓ ${slug}: ${catalog.artists[slug].albums.length} albums/singles`)
}
for (const id of sources.playlistIds) {
  catalog.playlists.push(await fetchPlaylist(id, sources.market, token))
  console.log(`✓ playlist ${id}`)
}

let previous = null
try { previous = JSON.parse(await readFile(OUT, 'utf8')) } catch { /* first run */ }
if (previous && JSON.stringify(stripVolatile(previous)) === JSON.stringify(stripVolatile(catalog))) {
  console.log('No catalog changes.')
  process.exit(0)
}
await mkdir(path.dirname(OUT), { recursive: true })
await writeFile(OUT, JSON.stringify(catalog, null, 2) + '\n')
console.log(`Wrote ${OUT}`)
