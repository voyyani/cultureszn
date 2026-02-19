/**
 * Debug script to verify environment variables
 */

import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

console.log('Environment Variables Check:\n')
console.log('SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID ? `${process.env.SPOTIFY_CLIENT_ID.substring(0, 8)}...` : 'NOT SET')
console.log('SPOTIFY_CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET ? `${process.env.SPOTIFY_CLIENT_SECRET.substring(0, 8)}...` : 'NOT SET')
console.log('\nFull values (for debug):')
console.log('CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID)
console.log('CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET)
console.log('\nLength check:')
console.log('CLIENT_ID length:', process.env.SPOTIFY_CLIENT_ID?.length || 0)
console.log('CLIENT_SECRET length:', process.env.SPOTIFY_CLIENT_SECRET?.length || 0)
