/**
 * User Library Endpoint
 * 
 * Manages user's saved tracks (library) with full CRUD operations.
 * GET - Fetch saved tracks
 * PUT - Save a track
 * DELETE - Remove a track
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

  // Check if token is expired
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

    // GET - Fetch user's saved tracks
    if (req.method === 'GET') {
      const { limit = '50', offset = '0' } = req.query

      const response = await fetch(
        `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`)
      }

      const data = await response.json()
      
      return res.status(200).json({
        success: true,
        tracks: data.items.map((item: any) => ({
          addedAt: item.added_at,
          track: {
            id: item.track.id,
            title: item.track.name,
            artists: item.track.artists.map((a: any) => ({
              id: a.id,
              name: a.name,
            })),
            album: {
              id: item.track.album.id,
              name: item.track.album.name,
              coverArt: item.track.album.images[0]?.url,
              releaseDate: item.track.album.release_date,
            },
            durationMs: item.track.duration_ms,
            explicit: item.track.explicit,
            popularity: item.track.popularity,
            previewUrl: item.track.preview_url,
            externalUrl: item.track.external_urls.spotify,
          },
        })),
        total: data.total,
        limit: data.limit,
        offset: data.offset,
      })
    }

    // PUT - Save track to library
    if (req.method === 'PUT') {
      const { trackId } = req.query

      if (!trackId || typeof trackId !== 'string') {
        return res.status(400).json({ error: 'Track ID required' })
      }

      const response = await fetch(
        `https://api.spotify.com/v1/me/tracks`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: [trackId] }),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to save track: ${response.status}`)
      }

      return res.status(200).json({
        success: true,
        message: 'Track saved to library',
        trackId,
      })
    }

    // DELETE - Remove track from library
    if (req.method === 'DELETE') {
      const { trackId } = req.query

      if (!trackId || typeof trackId !== 'string') {
        return res.status(400).json({ error: 'Track ID required' })
      }

      const response = await fetch(
        `https://api.spotify.com/v1/me/tracks`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: [trackId] }),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to remove track: ${response.status}`)
      }

      return res.status(200).json({
        success: true,
        message: 'Track removed from library',
        trackId,
      })
    }

    // Check if track is saved
    if (req.method === 'POST' && req.query.action === 'check') {
      const { trackIds } = req.body || {}

      if (!trackIds || !Array.isArray(trackIds)) {
        return res.status(400).json({ error: 'Track IDs array required' })
      }

      const response = await fetch(
        `https://api.spotify.com/v1/me/tracks/contains?ids=${trackIds.join(',')}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      const savedStates = await response.json()

      return res.status(200).json({
        success: true,
        saved: trackIds.reduce((acc, id, index) => {
          acc[id] = savedStates[index]
          return acc
        }, {} as Record<string, boolean>),
      })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('User library error:', error)
    
    if (error instanceof Error && error.message === 'Not authenticated') {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    
    if (error instanceof Error && error.message === 'Token expired. Please refresh.') {
      return res.status(401).json({ error: 'Token expired', refresh: true })
    }

    res.status(500).json({ 
      error: 'Failed to manage library',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
