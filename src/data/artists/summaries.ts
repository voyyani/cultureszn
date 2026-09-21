import type { ArtistSummary } from '@/types/artist'

/**
 * Lightweight artist index, hand-maintained. Everything the Home, Artists index, cards and
 * share previews need without loading a full profile. `summaries.test.ts` asserts each entry
 * matches its full profile, so a profile edit that drifts from this file fails the build.
 */
export const ARTIST_SUMMARIES: ArtistSummary[] = [
  {
    slug: "xiix",
    name: "XiiX",
    role: "Hip-Hop Artist",
    location: "Sabaki",
    country: "Kenya",
    image: "https://res.cloudinary.com/dph79ptoz/image/upload/v1770287296/SaveClip.App_621681944_18107153134673313_6513464581845031078_n_qdthcw.jpg",
    coverImage: "https://res.cloudinary.com/dph79ptoz/image/upload/v1770287296/SaveClip.App_621681944_18107153134673313_6513464581845031078_n_qdthcw.jpg",
    shortBio: "XiiX is a Kenya-based hip-hop artist from Sabaki known for poetic, genre-flexible rap and frequent collaborations with Culture Szn.",
    genres: [
      "Hip-Hop",
      "Rap"
    ],
    tags: [
      "Kenyan Hip-Hop",
      "East African Rap",
      "Poetic Rap"
    ],
    social: {
      spotify: "https://open.spotify.com/artist/4JwhMRnhXNf44gaWN2VlDO",
      apple: "https://music.apple.com/us/artist/xiix-music/1757687727",
      soundcloud: "https://soundcloud.com/xiix-int",
      youtube: "https://www.youtube.com/@XiiXint",
      instagram: "https://www.instagram.com/___xi.ix___/"
    }
  },
  {
    slug: "wavy",
    name: "Wavy Srf",
    role: "Hip-Hop/Rap Artist",
    location: "Kenya",
    country: "Kenya",
    image: "https://res.cloudinary.com/dph79ptoz/image/upload/v1770293994/SnapInsta.to_291419379_142530201716480_9088295563240532924_n_ds2fzn.jpg",
    coverImage: "https://res.cloudinary.com/dph79ptoz/image/upload/v1770293994/SnapInsta.to_291419379_142530201716480_9088295563240532924_n_ds2fzn.jpg",
    shortBio: "Wavy Srf moves through Culture SZN like a signature: a featured voice and writer threading the XiiX-era releases.",
    genres: [
      "Hip-Hop/Rap"
    ],
    tags: [
      "Hip-Hop/Rap"
    ],
    social: {
      spotify: "https://open.spotify.com/artist/3QMURgEXnTL7FbNgfYsYEd",
      apple: "https://music.apple.com/us/artist/wavy-srf/1625954701"
    }
  },
  {
    slug: "pipi",
    name: "Pipí Ciagi",
    role: "Multidisciplinary Creator",
    location: "Sabaki",
    country: "Kenya",
    image: "https://res.cloudinary.com/dph79ptoz/image/upload/v1770293574/SaveClip.App_463469409_864466395441315_4754677673088593617_n_dgxte1.jpg",
    coverImage: "https://res.cloudinary.com/dph79ptoz/image/upload/v1770293574/SaveClip.App_463469409_864466395441315_4754677673088593617_n_dgxte1.jpg",
    shortBio: "Pipí Ciagi is a multidisciplinary creator from Sabaki — a fashion designer, creative director, and recording artist connected to Culture SZN through key collaborations like “SABAKI” with XiiX.",
    genres: [
      "Multidisciplinary Creator",
      "Fashion",
      "Music"
    ],
    tags: [
      "Multidisciplinary Creator",
      "Fashion",
      "Music",
      "Fashion Designer",
      "Creative Director",
      "Recording Artist",
      "bold silhouettes",
      "texture-driven detailing",
      "street-meets-editorial balance"
    ],
    social: {
      apple: "https://music.apple.com/pl/artist/pip%C3%AD-ciagi/1650424672",
      soundcloud: "https://soundcloud.com/pipi_ciagi/tracks"
    }
  }
]
