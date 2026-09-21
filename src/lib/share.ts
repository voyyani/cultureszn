export interface ShareData { title: string; text: string; url: string }

export function shareLinks({ text, url }: ShareData) {
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    copy: url,
  }
}
