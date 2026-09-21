const UPLOAD = '/image/upload/'

/** Insert `f_auto,q_auto,w_<w>[,ar_<ar>,c_fill]` after `/upload/` for Cloudinary URLs; leave others unchanged. */
export function cloudinary(url: string, { w, ar }: { w: number; ar?: string }): string {
  if (!url.includes('res.cloudinary.com') || !url.includes(UPLOAD)) return url
  const t = ['f_auto', 'q_auto', `w_${w}`, ...(ar ? [`ar_${ar}`, 'c_fill'] : [])].join(',')
  return url.replace(UPLOAD, `${UPLOAD}${t}/`)
}

export const cloudinarySrcSet = (url: string, widths: number[], ar?: string) =>
  widths.map((w) => `${cloudinary(url, { w, ar })} ${w}w`).join(', ')
