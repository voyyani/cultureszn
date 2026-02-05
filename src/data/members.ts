import type { Member } from '@/types'
import { getArtistProfile } from './artists'

// Convert normalized artist to legacy Member format
function artistToMember(slug: string): Member | null {
  const artist = getArtistProfile(slug)
  if (!artist) return null

  return {
    id: slug,
    slug: artist.slug,
    name: artist.name,
    role: artist.role,
    bio: artist.longBio,
    image: artist.image,
    coverImage: artist.coverImage,
    tags: artist.tags,
    social: {
      instagram: artist.social.instagram,
      twitter: artist.social.twitter,
      spotify: artist.social.spotify,
      soundcloud: artist.social.soundcloud,
      youtube: artist.social.youtube,
    },
    joinedDate: '2023-01-15', // TODO: Add to artist JSON
  }
}

// JSON-driven members
const xiixMember = artistToMember('xiix')
const wavyMember = artistToMember('wavy')
const pipiMember = artistToMember('pipi')

export const members: Member[] = [
  // XiiX - JSON-driven (source of truth)
  ...(xiixMember ? [xiixMember] : []),
  // Wavy - JSON-driven (source of truth)
  ...(wavyMember ? [wavyMember] : []),
  // Pipi - JSON-driven (source of truth)
  ...(pipiMember ? [pipiMember] : []),
  // Other members - hardcoded (to be migrated)
  {
    id: '4',
    slug: 'kevo',
    name: 'Kevo',
    role: 'Rapper & Creative Director',
    bio: "Sharp-tongued wordsmith bringing raw energy and street wisdom to Culture SZN's sonic palette. Kevo's bars cut through with precision, addressing everything from systemic issues to personal triumphs. As creative director, he shapes the collective's artistic vision, ensuring every project maintains an authentic Nairobi perspective while pushing creative boundaries.",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
    coverImage: 'https://images.unsplash.com/photo-1571974599782-87624638275e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    tags: ['Rap', 'Lyricism', 'Creative Direction', 'Performance'],
    social: {
      instagram: 'https://instagram.com/kevo.szn',
      twitter: 'https://twitter.com/kevo_szn',
      spotify: 'https://open.spotify.com/artist/kevo',
    },
    joinedDate: '2023-03-10',
  },
  {
    id: '5',
    slug: 'luna',
    name: 'Luna',
    role: 'DJ & Sound Curator',
    bio: "Luna commands the decks with an encyclopedic knowledge of global sounds and an intuitive feel for crowd dynamics. Her sets seamlessly blend Amapiano, UK Garage, and Nairobi's underground electronic scene. As Culture SZN's sound curator, she discovers and champions emerging talent, building bridges between Nairobi and the global dance music community.",
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1364&q=80',
    coverImage: 'https://images.unsplash.com/photo-1571266028243-d220c6a9bd3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    tags: ['DJ', 'Curation', 'Electronic', 'Amapiano', 'Events'],
    social: {
      instagram: 'https://instagram.com/luna.szn',
      soundcloud: 'https://soundcloud.com/lunaszn',
    },
    joinedDate: '2023-04-05',
  },
]

export function getMemberBySlug(slug: string): Member | undefined {
  return members.find((member) => member.slug === slug)
}

export function getAllMembers(): Member[] {
  return members
}
