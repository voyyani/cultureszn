import { cloudinary, cloudinarySrcSet } from '@/lib/cloudinary'

const WIDTHS = [320, 480, 640, 960, 1280]

/** Responsive, lazy image through Cloudinary transforms; `priority` for the first viewport. */
export function CloudinaryImage({ src, alt, width, sizes, className, priority = false, ar }:
  { src: string; alt: string; width: number; sizes: string; className?: string; priority?: boolean; ar?: string }) {
  const isCloudinary = src.includes('res.cloudinary.com')
  return (
    <img
      src={cloudinary(src, { w: width, ar })}
      srcSet={isCloudinary ? cloudinarySrcSet(src, WIDTHS, ar) : undefined}
      sizes={isCloudinary ? sizes : undefined}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  )
}
