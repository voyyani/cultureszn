/**
 * Spotify OAuth Callback Endpoint
 * 
 * Handles the OAuth redirect from Spotify, exchanges code for tokens,
 * and stores credentials securely.
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
 * Encrypt token for secure storage
 */
function encryptToken(token: string): string {
  const key = process.env.SPOTIFY_ENCRYPTION_KEY || 'default-dev-key-change-in-production'
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    crypto.scryptSync(key, 'salt', 32),
    crypto.randomBytes(16)
  )
  
  let encrypted = cipher.update(token, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag().toString('hex')
  
  return `${encrypted}:${authTag}`
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const { code, error, state } = req.query

    // Handle authorization denial
    if (error) {
      return res.redirect(`/?spotify_error=${error}`)
    }

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Missing authorization code' })
    }

    // Retrieve code verifier from cookie
    const cookies = parseCookies(req.headers.cookie)
    const codeVerifier = cookies.spotify_code_verifier
    
    if (!codeVerifier) {
      return res.status(400).json({ error: 'Missing code verifier. Please restart login flow.' })
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI || `${process.env.VERCEL_URL || 'http://localhost:5173'}/api/spotify/auth/callback`,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        code_verifier: codeVerifier,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Spotify token exchange failed:', errorData)
      return res.redirect('/?spotify_error=token_exchange_failed')
    }

    const tokens = await tokenResponse.json()

    // Fetch user profile
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    })

    const userData = await userResponse.json()

    // Calculate token expiry
    const expiresAt = Date.now() + (tokens.expires_in * 1000)

    // Store tokens in HTTP-only secure cookies
    const cookieOptions = 'HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000' // 30 days
    
    res.setHeader('Set-Cookie', [
      `spotify_access_token=${encryptToken(tokens.access_token)}; ${cookieOptions}`,
      `spotify_refresh_token=${encryptToken(tokens.refresh_token)}; ${cookieOptions}`,
      `spotify_token_expiry=${expiresAt}; ${cookieOptions}`,
      `spotify_user_id=${userData.id}; ${cookieOptions}`,
      `spotify_user_name=${encodeURIComponent(userData.display_name || userData.id)}; ${cookieOptions}`,
      `spotify_connected=true; Path=/; Max-Age=2592000`,
      // Clear verification cookies
      'spotify_code_verifier=; Max-Age=0; Path=/',
      'spotify_auth_state=; Max-Age=0; Path=/',
    ])

    // Send HTML that detects if it's in a popup and handles accordingly
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Connected</title>
          <meta charset="utf-8">
          <style>
            body {
              margin: 0;
              padding: 0;
              background: linear-gradient(135deg, #1DB954 0%, #191414 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
              color: white;
            }
            .success {
              text-align: center;
              animation: fadeIn 0.5s ease-in-out;
            }
            .icon {
              font-size: 64px;
              margin-bottom: 20px;
              animation: scaleIn 0.5s ease-in-out;
            }
            h1 {
              font-size: 32px;
              font-weight: 600;
              margin: 0 0 12px 0;
            }
            p {
              font-size: 16px;
              opacity: 0.8;
              margin: 0;
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              0% { transform: scale(0); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
          </style>
        </head>
        <body>
          <div class="success">
            <div class="icon">✓</div>
            <h1>Spotify Connected!</h1>
            <p id="message">Redirecting...</p>
          </div>
          <script>
            // Check if opened in popup (has window.opener)
            if (window.opener && !window.opener.closed) {
              document.getElementById('message').textContent = 'Closing window...';
              
              // Notify parent window of success
              try {
                window.opener.postMessage({ 
                  type: 'spotify_auth_success',
                  user: {
                    id: '${userData.id}',
                    name: '${userData.display_name || userData.id}'
                  }
                }, window.location.origin);
              } catch (error) {
                console.error('Failed to notify parent:', error);
              }
              
              // Close popup after brief delay
              setTimeout(() => {
                window.close();
              }, 1500);
            } else {
              // Fallback: redirect to home page
              setTimeout(() => {
                window.location.href = '/?spotify_connected=true';
              }, 1500);
            }
          </script>
        </body>
      </html>
    `)
  } catch (error) {
    console.error('Spotify OAuth callback error:', error)
    res.redirect('/?spotify_error=callback_failed')
  }
}
