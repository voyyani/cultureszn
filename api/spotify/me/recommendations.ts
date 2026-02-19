/**
 * Personalized Recommendations Endpoint
 * 
 * Generates personalized track recommendations based on seeds.
 * Uses Spotify's recommendation engine with Culture SZN artists as seeds.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'

/**
 * Parse cookies from request header
 */
function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {}
  
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [name, value] = cookie.trim().split('=')
    cookies[name] = value
    return cookies
  }, {} as Record<string, string>)
}

/**
 * Decrypt token from storage
 */
function decryptToken(encryptedToken: string): string {
  try {
    const key = process.env.SPOTIFY_ENCRYPTION_KEY || 'default-dev-key-change-in-production'
    const [encrypted, authTag, ivHex] = encryptedToken.split(':')
    
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      crypto.scryptSync(key, 'salt', 32),
      Buffer.from(ivHex, 'hex')
    )
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'))
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  } catch (error) {
    throw new Error('Failed to decrypt token')
  }
}

/**
 * Get user access token from cookies
 */
async function getUserAccessToken(req: VercelRequest): Promise<string> {
  const cookies = parseCookies(req.headers.cookie)
  const encryptedToken = cookies.spotify_access_token
  const tokenExpiry = parseInt(cookies.spotify_token_expiry || '0')

  if (!encryptedToken) {
    throw new Error('Not authenticated')
  }

  if (Date.now() >= tokenExpiry) {
    throw new Error('Token expired. Please refresh.')
  }

  return decryptToken(encryptedToken)
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const accessToken = await getUserAccessToken(req)

    const {
      seed_artists = '',
      seed_tracks = '',
      seed_genres = 'afrobeats,hip-hop,african',
      limit = '20',
      market = 'US',
    } = req.query

    // Build seed parameters
    const params = new URLSearchParams()
    
    if (seed_artists) params.append('seed_artists', seed_artists as string)
    if (seed_tracks) params.append('seed_tracks', seed_tracks as string)
    if (seed_genres) params.append('seed_genres', seed_genres as string)
    
    params.append('limit', limit as string)
    params.append('market', market as string)
    
    // Optional tunable attributes for Culture SZN vibe
    params.append('min_energy', '0.4')
    params.append('min_danceability', '0.5')
    params.append('target_popularity', '50')

    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Spotify recommendations error:', error)
      throw new Error(`Spotify API error: ${response.status}`)
    }

    const data = await response.json()
    
    return res.status(200).json({
      success: true,
      recommendations: data.tracks.map((track: any) => ({
        id: track.id,
        title: track.name,
        artists: track.artists.map((a: any) => ({
          id: a.id,
          name: a.name,
        })),
        album: {
          id: track.album.id,
          name: track.album.name,
          coverArt: track.album.images[0]?.url,
          releaseDate: track.album.release_date,
        },
        durationMs: track.duration_ms,
        explicit: track.explicit,
        popularity: track.popularity,
        previewUrl: track.preview_url,
        externalUrl: track.external_urls.spotify,
      })),
      seeds: data.seeds,
      total: data.tracks.length,
    })
  } catch (error) {
    console.error('Recommendations error:', error)
    
    if (error instanceof Error && error.message === 'Not authenticated') {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    
    if (error instanceof Error && error.message === 'Token expired. Please refresh.') {
      return res.status(401).json({ error: 'Token expired', refresh: true })
    }

    res.status(500).json({ 
      error: 'Failed to get recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
