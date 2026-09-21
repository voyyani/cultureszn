import { describe, it, expect } from 'vitest'
import { cloudinary, cloudinarySrcSet } from './cloudinary'

const src = 'https://res.cloudinary.com/dph79ptoz/image/upload/v1770302177/cover.png'

describe('cloudinary', () => {
  it('inserts transforms after /upload/', () => {
    expect(cloudinary(src, { w: 640 })).toBe('https://res.cloudinary.com/dph79ptoz/image/upload/f_auto,q_auto,w_640/v1770302177/cover.png')
    expect(cloudinary(src, { w: 640, ar: '1:1' })).toContain('f_auto,q_auto,w_640,ar_1:1,c_fill/')
  })
  it('leaves non-cloudinary URLs alone', () => expect(cloudinary('https://i.scdn.co/x.jpg', { w: 640 })).toBe('https://i.scdn.co/x.jpg'))
  it('builds a srcset', () => expect(cloudinarySrcSet(src, [320, 640])).toBe(`${cloudinary(src, { w: 320 })} 320w, ${cloudinary(src, { w: 640 })} 640w`))
})
