export interface SiteConfig {
  name: string
  tagline: string
  description: string
  url: string
  locale: string
  timeZone: string
  whatsappCommunityUrl: string
  socials: { instagram?: string; youtube?: string; spotify?: string; tiktok?: string }
  spotifyPlaylistIds: string[]
}

export const SITE: SiteConfig = {
  name: 'Culture SZN',
  tagline: "Nairobi's Creative Ecosystem",
  description:
    "Culture SZN is the multidisciplinary ecosystem amplifying Nairobi's next-generation creatives — where music, design, and cultural expression converge.",
  url: 'https://cultureszn.com',
  locale: 'en-KE',
  timeZone: 'Africa/Nairobi',
  /** WhatsApp community invite. Empty string hides every WhatsApp CTA (no dead ends). */
  whatsappCommunityUrl: '',
  /** Verified public profiles only. Unverified handles stay out. */
  socials: {},
  /** Curated Culture SZN Spotify playlist IDs (22-char). Empty until supplied. */
  spotifyPlaylistIds: [],
}
