/**
 * Spotify Token Endpoint (for Web Playback SDK)
 * 
 * Returns the decrypted access token for use in the Web Playback SDK.
 * This is necessary because the SDK needs the raw token, not encrypted.
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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const cookies = parseCookies(req.headers.cookie)
    const encryptedToken = cookies.spotify_access_token
    const tokenExpiry = parseInt(cookies.spotify_token_expiry || '0')

    if (!encryptedToken) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // Check if token is expired
    if (Date.now() >= tokenExpiry) {
      return res.status(401).json({ 
        error: 'Token expired',
        expired: true 
      })
    }

    // Decrypt and return token
    const accessToken = decryptToken(encryptedToken)

    // Return with cache headers to prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')

    res.status(200).json({
      access_token: accessToken,
      expires_at: tokenExpiry,
    })
  } catch (error) {
    console.error('Token retrieval error:', error)
    res.status(500).json({ 
      error: 'Failed to retrieve token',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
