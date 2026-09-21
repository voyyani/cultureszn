import { describe, it, expect } from 'vitest'
import { primaryPlayback, realImage } from './playback'

describe('primaryPlayback', () => {
  it('prefers YouTube', () => {
    expect(primaryPlayback({ streamingLinks: { youtube: 'https://youtu.be/JhOVIyWeqLM', spotify: 'https://open.spotify.com/album/1Qbztqv7IDwQolRJquhxMk' } })).toEqual({ kind: 'youtube', url: 'https://youtu.be/JhOVIyWeqLM' })
  })
  it('falls back to the Spotify album id from the link', () => {
    expect(primaryPlayback({ streamingLinks: { spotify: 'https://open.spotify.com/album/1Qbztqv7IDwQolRJquhxMk' } })).toEqual({ kind: 'spotify', type: 'album', id: '1Qbztqv7IDwQolRJquhxMk' })
  })
  it('uses the catalog album id when merged', () => {
    expect(primaryPlayback({ streamingLinks: {}, spotifyAlbumId: 'abc' })).toEqual({ kind: 'spotify', type: 'album', id: 'abc' })
  })
  it('returns links when nothing is embeddable', () => {
    expect(primaryPlayback({ streamingLinks: { soundcloud: 'https://soundcloud.com/x' } })).toEqual({ kind: 'links' })
  })
})

describe('realImage', () => {
  it('rejects the placeholder', () => expect(realImage('/images/artists/placeholder.svg')).toBeNull())
  it('passes real URLs', () => expect(realImage('https://res.cloudinary.com/x/image/upload/v1/a.jpg')).toBe('https://res.cloudinary.com/x/image/upload/v1/a.jpg'))
})
