// Type definitions for spotify-web-api-node
declare module 'spotify-web-api-node' {
  export default class SpotifyWebApi {
    constructor(options?: {
      clientId?: string
      clientSecret?: string
      redirectUri?: string
      accessToken?: string
      refreshToken?: string
    })

    setAccessToken(accessToken: string): void
    getAccessToken(): string | undefined
    
    clientCredentialsGrant(): Promise<{ body: { access_token: string; expires_in: number } }>
    
    getTrack(trackId: string): Promise<{ body: any }>
    getTracks(trackIds: string[]): Promise<{ body: { tracks: any[] } }>
    getArtist(artistId: string): Promise<{ body: any }>
    getArtistTopTracks(artistId: string, market: string): Promise<{ body: { tracks: any[] } }>
    getArtistAlbums(artistId: string, options?: any): Promise<{ body: any }>
    searchTracks(query: string, options?: { limit?: number }): Promise<{ body: { tracks?: { items: any[] } } }>
    searchArtists(query: string, options?: { limit?: number }): Promise<{ body: { artists?: { items: any[] } } }>
  }
}
