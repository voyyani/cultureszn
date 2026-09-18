import type { SZNal } from '@/types'

export const sznals: SZNal[] = [
  {
    id: '1',
    slug: 'decoding-nairobis-sonic-signature',
    title: "Decoding Nairobi's Sonic Signature",
    excerpt: "How Xiix captures the city's unique frequencies and translates them into immersive soundscapes that define Culture SZN's sonic identity.",
    category: 'Sound & Culture',
    image: '',
    author: 'Culture SZN Editorial',
    publishedDate: '2025-12-15',
    readTime: '8 min read',
  },
  {
    id: '2',
    slug: 'pipis-visual-language-for-the-digital-age',
    title: "Pipi's Visual Language for the Digital Age",
    excerpt: "Exploring the design principles behind Culture SZN's striking visual identity system and how African aesthetics are being reimagined for global audiences.",
    category: 'Design & Visuals',
    image: '',
    author: 'Culture SZN Editorial',
    publishedDate: '2025-11-28',
    readTime: '6 min read',
  },
  {
    id: '3',
    slug: 'building-sustainable-creative-communities',
    title: 'Building Sustainable Creative Communities',
    excerpt: 'How Culture SZN is designing an ecosystem that supports multidisciplinary collaboration and nurtures the next generation of Nairobi creatives.',
    category: 'Ecosystem',
    image: '',
    author: 'Culture SZN Editorial',
    publishedDate: '2025-11-10',
    readTime: '10 min read',
  },
  {
    id: '4',
    slug: 'the-making-of-nairobi-nights',
    title: 'The Making of Nairobi Nights',
    excerpt: 'A behind-the-scenes look at the collaborative process between Xiix and Wavy, from initial concepts to the final master.',
    category: 'Behind The Scenes',
    image: '',
    author: 'Culture SZN Editorial',
    publishedDate: '2025-10-25',
    readTime: '12 min read',
  },
  {
    id: '5',
    slug: 'amapiano-meets-nairobi-underground',
    title: 'Amapiano Meets Nairobi Underground',
    excerpt: "Luna explores the fusion of South African Amapiano with Nairobi's burgeoning electronic scene, creating a new sonic territory.",
    category: 'Sound & Culture',
    image: '',
    author: 'Culture SZN Editorial',
    publishedDate: '2025-10-05',
    readTime: '7 min read',
  },
  {
    id: '6',
    slug: 'street-gospel-the-making-of-a-movement',
    title: 'Street Gospel: The Making of a Movement',
    excerpt: "Kevo opens up about his debut album, the stories behind the bars, and what it means to represent Nairobi's streets on a global stage.",
    category: 'Artist Spotlight',
    image: '',
    author: 'Culture SZN Editorial',
    publishedDate: '2025-09-18',
    readTime: '9 min read',
  },
]

export function getSZNalBySlug(slug: string): SZNal | undefined {
  return sznals.find((sznal) => sznal.slug === slug)
}

export function getAllSZNals(): SZNal[] {
  return sznals
}

export function getRecentSZNals(count: number = 3): SZNal[] {
  return [...sznals]
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, count)
}

export function getSZNalsByCategory(category: string): SZNal[] {
  return sznals.filter((sznal) => sznal.category === category)
}
