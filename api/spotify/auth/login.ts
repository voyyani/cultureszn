/**
 * Spotify OAuth Login Endpoint
 * 
 * Initiates the Spotify OAuth flow with PKCE for secure authentication.
 * Generates code verifier and challenge, stores in session, redirects to Spotify.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'

/**
 * Generate a cryptographically secure code verifier for PKCE
 */
function generateCodeVerifier(): string {
  return crypto
    .randomBytes(32)
    .toString('base64url')
}

/**
 * Generate code challenge from verifier using SHA256
 */
function generateCodeChallenge(verifier: string): string {
  return crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url')
}

/**
 * OAuth scopes required for full playback control
 */
const SPOTIFY_SCOPES = [
  'streaming',                      // Web Playback SDK
  'user-read-email',                // User profile
  'user-read-private',              // User profile
  'user-read-playback-state',       // Current playback
  'user-modify-playback-state',     // Control playback
  'user-read-currently-playing',    // Now playing
  'user-library-read',              // Saved tracks
  'user-library-modify',            // Save/unsave tracks
  'user-top-read',                  // Top artists & tracks
  'playlist-read-private',          // User playlists
  'playlist-modify-public',         // Create playlists
  'playlist-modify-private',        // Modify playlists
  'user-read-recently-played',      // Listening history
].join(' ')

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Generate PKCE code verifier and challenge
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = generateCodeChallenge(codeVerifier)

    // Store code verifier in HTTP-only cookie for callback
    res.setHeader('Set-Cookie', [
      `spotify_code_verifier=${codeVerifier}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
      `spotify_auth_state=${crypto.randomBytes(16).toString('hex')}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`
    ])

    // Build Spotify authorization URL
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${process.env.VERCEL_URL || 'http://localhost:5173'}/api/spotify/auth/callback`
    
    const params = new URLSearchParams({
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      response_type: 'code',
      redirect_uri: redirectUri,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      scope: SPOTIFY_SCOPES,
      show_dialog: 'false',
    })

    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`

    // Redirect to Spotify for authorization
    res.status(302).setHeader('Location', authUrl).end()
  } catch (error) {
    console.error('Spotify OAuth login error:', error)
    res.status(500).json({ 
      error: 'Failed to initiate Spotify authentication',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
