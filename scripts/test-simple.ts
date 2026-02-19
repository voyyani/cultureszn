/**
 * Simple Spotify API Test
 * Tests if the credentials work and can authenticate
 */

/// <reference path="../src/types/spotify-web-api-node.d.ts" />

import SpotifyWebApi from 'spotify-web-api-node'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!
})

console.log('🧪 Testing Spotify API Credentials\n')
console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID?.substring(0, 10) + '...')
console.log('Client Secret:', process.env.SPOTIFY_CLIENT_SECRET?.substring(0, 10) + '...')
console.log('\n' + '='.repeat(60) + '\n')

async function test() {
  try {
    console.log('Attempting to get access token...')
    const data = await spotify.clientCredentialsGrant()
    
    console.log('✅ SUCCESS! Token obtained')
    console.log('Token:', data.body.access_token.substring(0, 20) + '...')
    console.log('Expires in:', data.body.expires_in, 'seconds')
    
    // Set the token and test a simple API call
    spotify.setAccessToken(data.body.access_token)
    
    console.log('\nTesting API call - searching for "XiiX"...')
    const searchResult = await spotify.searchArtists('XiiX', { limit: 5 })
    
    console.log('✅ API call successful!')
    console.log('Found', searchResult.body.artists?.items.length, 'artists')
    console.log('\nResults:')
    searchResult.body.artists?.items.forEach((artist: any, i: number) => {
      console.log(`  ${i + 1}. ${artist.name} (ID: ${artist.id})`)
      console.log(`     Followers: ${artist.followers?.total.toLocaleString()}`)
      console.log(`     Popularity: ${artist.popularity}/100`)
    })
    
  } catch (error: any) {
    console.log('\n❌ ERROR:', error.message)
    console.log('\nPossible reasons:')
    console.log('1. Client ID and/or Client Secret are incorrect')
    console.log('2. Spotify App is not approved/active')
    console.log('3. Network connectivity issues')
    console.log('\nPlease verify your credentials at:')
    console.log('https://developer.spotify.com/dashboard')
    
    if (error.body) {
      console.log('\nAPI Response:', error.body)
    }
  }
}

test()
