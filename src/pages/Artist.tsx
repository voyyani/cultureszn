/**
 * Artist Page Component
 * 
 * Premium artist profile page using JSON source of truth.
 * Features cinematic hero, streaming bar, SEO, and rich content sections.
 */

import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button, Text, Badge } from '@/components/ui'
import { SocialLinks, ShareButton } from '@/components/shared'
import { 
  ArtistHero, 
  StreamingBar, 
  DiscographySection, 
  ArtistSEO
} from '@/components/artist'
import { getArtistProfile, getStreamingLinks, getMemberBySlug } from '@/data'
import { staggerContainer, fadeInUp } from '@/lib/motion'

export function Artist() {
  const { slug } = useParams<{ slug: string }>()
  
  // Try JSON-driven artist first, fall back to legacy member
  const artist = slug ? getArtistProfile(slug) : null
  const legacyMember = slug ? getMemberBySlug(slug) : undefined
  const streamingLinks = slug ? getStreamingLinks(slug) : []
  const aboutParagraphs = artist?.longBio
    ? artist.longBio.split('\n\n').map((paragraph) => paragraph.trim()).filter(Boolean)
    : []

  // If JSON artist exists, use premium view
  if (artist) {
    // Share data for Web Share API
    const shareData = {
      title: `${artist.name} | Culture SZN`,
      text: `Check out ${artist.name} on Culture SZN — ${artist.genres.join(', ')} artist from ${artist.country}`,
      url: typeof window !== 'undefined' ? window.location.href : `https://cultureszn.com/artists/${artist.slug}`,
    }

    return (
      <div className="min-h-screen">
        {/* SEO Meta Tags & JSON-LD */}
        <ArtistSEO artist={artist} />

        {/* Floating Share Button (Mobile) */}
        <div className="md:hidden">
          <ShareButton data={shareData} variant="floating" />
        </div>

        {/* Cinematic Hero */}
        <ArtistHero artist={artist} />

        {/* Streaming Quick Links Bar */}
        <StreamingBar links={streamingLinks} artistName={artist.name} />

        {/* About Section */}
        <section className="section-szn">
          <div className="container-szn">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="max-w-4xl"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl font-[family-name:var(--font-heading)] font-bold mb-6"
              >
                About
              </motion.h2>

              {aboutParagraphs.map((paragraph, index) => (
                <motion.p
                  key={`${artist.slug}-about-${index}`}
                  variants={fadeInUp}
                  className={`text-lg text-text-secondary leading-relaxed ${index === aboutParagraphs.length - 1 ? 'mb-8' : 'mb-6'}`}
                >
                  {paragraph}
                </motion.p>
              ))}

              {/* Tags */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-3 mb-8"
              >
                {artist.tags.map((tag) => (
                  <Badge key={tag} variant="default" size="md">
                    {tag}
                  </Badge>
                ))}
              </motion.div>

              {/* Affiliations */}
              {artist.affiliations.length > 0 && (
                <motion.div variants={fadeInUp} className="text-text-muted">
                  <Text size="sm" color="muted">
                    Affiliated with: {artist.affiliations.join(', ')}
                  </Text>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Discography Section */}
        <DiscographySection 
          releases={artist.releases}
          projects={artist.projects}
          artistName={artist.name}
        />

        {/* Footer Meta */}
        <section className="py-8 border-t border-white/5">
          <div className="container-szn">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Text color="muted" size="sm">
                Last updated: {artist.lastUpdated}
                {artist.isVerified && ' • ✓ Verified Profile'}
              </Text>

              {/* Desktop Share Button */}
              <div className="hidden md:block">
                <ShareButton data={shareData} variant="button" size="sm" />
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Fallback to legacy member view if no JSON artist
  if (!legacyMember) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-[family-name:var(--font-heading)] font-bold mb-4">
            Artist Not Found
          </h1>
          <Text color="secondary" className="mb-8">
            The creative you're looking for doesn't exist or has been moved.
          </Text>
          <Link to="/">
            <Button variant="primary">
              <ArrowLeft size={20} />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Legacy member view (for non-JSON members)
  return (
    <div className="min-h-screen">
      {/* Simplified hero for legacy members */}
      <section className="relative min-h-[70vh] flex items-end pb-16">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${legacyMember.coverImage || legacyMember.image})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/70 to-matte-black/30" />
        </div>

        <div className="container-szn relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <Link to="/#members">
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={18} />
                  Back to Members
                </Button>
              </Link>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl font-[family-name:var(--font-heading)] font-bold mb-4"
            >
              {legacyMember.name}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-burnt-orange font-medium mb-6"
            >
              {legacyMember.role}
            </motion.p>

            <motion.div variants={fadeInUp}>
              <SocialLinks links={legacyMember.social} size="lg" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="section-szn">
        <div className="container-szn">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-[family-name:var(--font-heading)] font-bold mb-6"
            >
              About
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-text-secondary leading-relaxed mb-8"
            >
              {legacyMember.bio}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-3"
            >
              {legacyMember.tags.map((tag) => (
                <Badge key={tag} variant="default" size="md">
                  {tag}
                </Badge>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
