/**
 * Spotify Logout Endpoint
 * 
 * Clears all Spotify authentication cookies and ends the session.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Clear all Spotify-related cookies
  res.setHeader('Set-Cookie', [
    'spotify_access_token=; Max-Age=0; Path=/',
    'spotify_refresh_token=; Max-Age=0; Path=/',
    'spotify_token_expiry=; Max-Age=0; Path=/',
    'spotify_user_id=; Max-Age=0; Path=/',
    'spotify_user_name=; Max-Age=0; Path=/',
    'spotify_connected=; Max-Age=0; Path=/',
  ])

  if (req.method === 'POST') {
    return res.status(200).json({ 
      success: true,
      message: 'Logged out successfully'
    })
  }

  // Redirect to home page
  res.redirect('/?spotify_disconnected=true')
}
