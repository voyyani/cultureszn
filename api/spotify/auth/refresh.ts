/**
 * Spotify Token Refresh Endpoint
 * 
 * Refreshes expired access tokens using the refresh token.
 * Automatically called when access token expires.
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
  const key = process.env.SPOTIFY_ENCRYPTION_KEY || 'default-dev-key-change-in-production'
  const [encrypted, authTag] = encryptedToken.split(':')
  
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    crypto.scryptSync(key, 'salt', 32),
    crypto.randomBytes(16)
  )
  
  decipher.setAuthTag(Buffer.from(authTag, 'hex'))
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

/**
 * Encrypt token for secure storage
 */
function encryptToken(token: string): string {
  const key = process.env.SPOTIFY_ENCRYPTION_KEY || 'default-dev-key-change-in-production'
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    crypto.scryptSync(key, 'salt', 32),
    iv
  )
  
  let encrypted = cipher.update(token, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag().toString('hex')
  
  return `${encrypted}:${authTag}:${iv.toString('hex')}`
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const cookies = parseCookies(req.headers.cookie)
    const encryptedRefreshToken = cookies.spotify_refresh_token

    if (!encryptedRefreshToken) {
      return res.status(401).json({ error: 'No refresh token found. Please login again.' })
    }

    // Decrypt refresh token
    const refreshToken = decryptToken(encryptedRefreshToken)

    // Request new access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Token refresh failed:', errorData)
      return res.status(401).json({ 
        error: 'Failed to refresh token',
        details: errorData 
      })
    }

    const tokens = await tokenResponse.json()
    const expiresAt = Date.now() + (tokens.expires_in * 1000)

    // Update cookies with new tokens
    const cookieOptions = 'HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000'
    
    const newCookies = [
      `spotify_access_token=${encryptToken(tokens.access_token)}; ${cookieOptions}`,
      `spotify_token_expiry=${expiresAt}; ${cookieOptions}`,
    ]

    // Update refresh token if provided (not always returned)
    if (tokens.refresh_token) {
      newCookies.push(`spotify_refresh_token=${encryptToken(tokens.refresh_token)}; ${cookieOptions}`)
    }

    res.setHeader('Set-Cookie', newCookies)

    res.status(200).json({
      success: true,
      expiresAt,
      message: 'Token refreshed successfully'
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({ 
      error: 'Failed to refresh token',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
