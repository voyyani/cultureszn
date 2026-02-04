import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Button, Text, Badge, SectionHeader } from '@/components/ui'
import { SocialLinks, ReleaseCard } from '@/components/shared'
import { getMemberBySlug, getReleasesByArtist } from '@/data'
import { staggerContainer, fadeInUp } from '@/lib/motion'

export function Member() {
  const { slug } = useParams<{ slug: string }>()
  const member = getMemberBySlug(slug!)
  const memberReleases = slug ? getReleasesByArtist(slug) : []

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-[family-name:var(--font-heading)] font-bold mb-4">
            Member Not Found
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-end pb-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${member.coverImage || member.image})`,
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
            {/* Back Button */}
            <motion.div variants={fadeInUp} className="mb-8">
              <Link to="/#members">
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={18} />
                  Back to Members
                </Button>
              </Link>
            </motion.div>

            {/* Name & Role */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl font-[family-name:var(--font-heading)] font-bold mb-4"
            >
              {member.name}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-burnt-orange font-medium mb-6"
            >
              {member.role}
            </motion.p>

            {/* Social Links */}
            <motion.div variants={fadeInUp}>
              <SocialLinks links={member.social} size="lg" />
            </motion.div>
          </motion.div>
        </div>
      </section>

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

            <motion.p
              variants={fadeInUp}
              className="text-lg text-text-secondary leading-relaxed mb-8"
            >
              {member.bio}
            </motion.p>

            {/* Tags */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-3 mb-8"
            >
              {member.tags.map((tag) => (
                <Badge key={tag} variant="default" size="md">
                  {tag}
                </Badge>
              ))}
            </motion.div>

            {/* Joined Date */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-2 text-text-muted"
            >
              <Calendar size={16} />
              <Text size="sm" color="muted">
                Joined Culture SZN in{' '}
                {new Date(member.joinedDate).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Discography Section */}
      {memberReleases.length > 0 && (
        <section className="section-szn bg-gradient-subtle">
          <div className="container-szn">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp}>
                <SectionHeader
                  title="Discography"
                  subtitle={`Explore ${member.name}'s projects and releases.`}
                  centered={false}
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {memberReleases.map((release) => (
                  <motion.div key={release.id} variants={fadeInUp}>
                    <ReleaseCard release={release} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
