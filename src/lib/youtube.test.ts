import { describe, it, expect } from 'vitest'
import { youtubeId, youtubeThumb } from './youtube'

describe('youtubeId', () => {
  it.each([
    ['https://youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1s', 'dQw4w9WgXcQ'],
    ['https://youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://open.spotify.com/album/x', null],
    [undefined, null],
  ])('%s → %s', (url, id) => expect(youtubeId(url)).toBe(id))
  it('builds the thumbnail URL', () => expect(youtubeThumb('abc')).toBe('https://i.ytimg.com/vi/abc/hqdefault.jpg'))
})
