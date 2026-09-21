const PATTERNS = [/youtu\.be\/([\w-]{11})/, /[?&]v=([\w-]{11})/, /\/shorts\/([\w-]{11})/, /\/embed\/([\w-]{11})/]

export function youtubeId(url?: string): string | null {
  if (!url) return null
  for (const p of PATTERNS) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export const youtubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
