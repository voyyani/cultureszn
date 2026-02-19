/**
 * Playback Control Endpoint
 * 
 * Controls Spotify playback (play, pause, skip, seek, transfer devices).
 * Requires user authentication and premium account.
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
    const { action } = req.query

    // Play
    if (action === 'play') {
      const { uris, contextUri, deviceId, positionMs } = req.body || {}

      const body: any = {}
      if (uris) body.uris = uris
      if (contextUri) body.context_uri = contextUri
      if (positionMs !== undefined) body.position_ms = positionMs

      const url = deviceId 
        ? `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`
        : 'https://api.spotify.com/v1/me/player/play'

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.status === 204) {
        return res.status(200).json({ success: true, message: 'Playback started' })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Playback failed')
      }

      return res.status(200).json({ success: true })
    }

    // Pause
    if (action === 'pause') {
      const { deviceId } = req.query

      const url = deviceId 
        ? `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`
        : 'https://api.spotify.com/v1/me/player/pause'

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (response.status === 204) {
        return res.status(200).json({ success: true, message: 'Playback paused' })
      }

      return res.status(200).json({ success: true })
    }

    // Skip to next
    if (action === 'next') {
      const response = await fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (response.status === 204) {
        return res.status(200).json({ success: true, message: 'Skipped to next track' })
      }

      return res.status(200).json({ success: true })
    }

    // Skip to previous
    if (action === 'previous') {
      const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (response.status === 204) {
        return res.status(200).json({ success: true, message: 'Skipped to previous track' })
      }

      return res.status(200).json({ success: true })
    }

    // Seek to position
    if (action === 'seek') {
      const { positionMs } = req.body || req.query

      if (!positionMs) {
        return res.status(400).json({ error: 'Position required' })
      }

      const response = await fetch(
        `https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      if (response.status === 204) {
        return res.status(200).json({ success: true, message: 'Seeked to position' })
      }

      return res.status(200).json({ success: true })
    }

    // Transfer playback
    if (action === 'transfer') {
      const { deviceIds, play } = req.body || {}

      if (!deviceIds || !Array.isArray(deviceIds)) {
        return res.status(400).json({ error: 'Device IDs array required' })
      }

      const response = await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_ids: deviceIds,
          play: play !== false,
        }),
      })

      if (response.status === 204) {
        return res.status(200).json({ success: true, message: 'Playback transferred' })
      }

      return res.status(200).json({ success: true })
    }

    // Get current playback state
    if (action === 'state' || req.method === 'GET') {
      const response = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (response.status === 204) {
        return res.status(200).json({ 
          success: true,
          isPlaying: false,
          noActiveDevice: true 
        })
      }

      if (!response.ok) {
        throw new Error(`Failed to get playback state: ${response.status}`)
      }

      const state = await response.json()
      
      return res.status(200).json({
        success: true,
        isPlaying: state.is_playing,
        currentTrack: state.item ? {
          id: state.item.id,
          title: state.item.name,
          artists: state.item.artists.map((a: any) => a.name),
          album: state.item.album.name,
          coverArt: state.item.album.images[0]?.url,
          durationMs: state.item.duration_ms,
        } : null,
        progressMs: state.progress_ms,
        device: state.device,
        shuffleState: state.shuffle_state,
        repeatState: state.repeat_state,
      })
    }

    res.status(400).json({ error: 'Invalid action' })
  } catch (error) {
    console.error('Playback control error:', error)
    
    if (error instanceof Error && error.message === 'Not authenticated') {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    
    if (error instanceof Error && error.message === 'Token expired. Please refresh.') {
      return res.status(401).json({ error: 'Token expired', refresh: true })
    }

    res.status(500).json({ 
      error: 'Playback control failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
