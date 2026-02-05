/**
 * CollaborationNetwork Component
 * 
 * Showcases artistic connections with collab cards, evidence links,
 * and Culture SZN special badges. Designed for future D3.js graph integration.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Music2, 
  Link as LinkIcon, 
  Sparkles,
  ExternalLink,
  Network,
  Star,
  ChevronRight
} from 'lucide-react'
import { SectionHeader, Badge, Text } from '@/components/ui'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import type { NormalizedCollaboration } from '@/types/artist'

interface CollaborationNetworkProps {
  collaborations: NormalizedCollaboration[]
  artistName: string
}

// Culture SZN member slugs for linking (reserved for future use)
// const cultureSZNMembers = ['wavy-srf', 'sire', 'xiix', 'culture-szn']

// Generate avatar gradient based on name
function getAvatarGradient(name: string): string {
  const gradients = [
    'from-burnt-orange to-amber-500',
    'from-sunset-purple to-pink-500',
    'from-deep-purple to-blue-500',
    'from-emerald-500 to-teal-500',
    'from-rose-500 to-orange-500',
  ]
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return gradients[index % gradients.length]
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function CollaborationNetwork({ collaborations, artistName }: CollaborationNetworkProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  if (collaborations.length === 0) {
    return null
  }

  // Sort collaborations: Culture SZN first, then by track count
  const sortedCollabs = [...collaborations].sort((a, b) => {
    if (a.isCultureSZN && !b.isCultureSZN) return -1
    if (!a.isCultureSZN && b.isCultureSZN) return 1
    return b.tracks.length - a.tracks.length
  })

  // Calculate stats
  const totalCollabs = collaborations.length
  const totalTracks = collaborations.reduce((acc, c) => acc + c.tracks.length, 0)
  const cultureSZNCollabs = collaborations.filter(c => c.isCultureSZN).length

  return (
    <section className="section-szn">
      <div className="container-szn">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="mb-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <SectionHeader
                title="Collaboration Network"
                subtitle="Artists and collectives that have shaped the sound."
                centered={false}
              />

              {/* Stats Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <Users size={16} className="text-burnt-orange" />
                  <span className="text-sm text-text-secondary">
                    {totalCollabs} {totalCollabs === 1 ? 'Collaborator' : 'Collaborators'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <Music2 size={16} className="text-sunset-purple" />
                  <span className="text-sm text-text-secondary">
                    {totalTracks} {totalTracks === 1 ? 'Track' : 'Tracks'}
                  </span>
                </div>
                {cultureSZNCollabs > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-burnt-orange/20 to-sunset-purple/20 border border-burnt-orange/30">
                    <Sparkles size={16} className="text-burnt-orange" />
                    <span className="text-sm text-white">
                      {cultureSZNCollabs} Culture SZN
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Network Visualization Placeholder */}
          <motion.div
            variants={fadeInUp}
            className="mb-10 p-8 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 text-center"
          >
            <div className="relative w-48 h-48 mx-auto mb-6">
              {/* Central Node (Artist) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-burnt-orange to-sunset-purple flex items-center justify-center shadow-lg shadow-burnt-orange/30 z-10">
                <span className="text-lg font-bold text-white">{getInitials(artistName)}</span>
              </div>

              {/* Orbital Nodes (Collaborators) */}
              {sortedCollabs.slice(0, 6).map((collab, index) => {
                const angle = (index / Math.min(sortedCollabs.length, 6)) * 2 * Math.PI - Math.PI / 2
                const radius = 72
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius
                const name = collab.artists[0]

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    className={`absolute w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(name)} flex items-center justify-center text-xs font-semibold text-white shadow-md ${collab.isCultureSZN ? 'ring-2 ring-burnt-orange ring-offset-2 ring-offset-matte-black' : ''}`}
                    style={{
                      left: `calc(50% + ${x}px - 20px)`,
                      top: `calc(50% + ${y}px - 20px)`,
                    }}
                    title={name}
                  >
                    {getInitials(name)}
                  </motion.div>
                )
              })}

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full">
                {sortedCollabs.slice(0, 6).map((_, index) => {
                  const angle = (index / Math.min(sortedCollabs.length, 6)) * 2 * Math.PI - Math.PI / 2
                  const radius = 72
                  const x = Math.cos(angle) * radius + 96
                  const y = Math.sin(angle) * radius + 96

                  return (
                    <motion.line
                      key={index}
                      x1="96"
                      y1="96"
                      x2={x}
                      y2={y}
                      stroke="url(#lineGradient)"
                      strokeWidth="1"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.3 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                    />
                  )
                })}
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF6B35" />
                    <stop offset="100%" stopColor="#6A11CB" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <Text color="muted" size="sm" className="flex items-center justify-center gap-2">
              <Network size={14} />
              Interactive network visualization coming soon
            </Text>
          </motion.div>

          {/* Collaboration Cards */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {sortedCollabs.map((collab, index) => {
              const isExpanded = expandedIndex === index
              const artistNames = collab.artists.join(' × ')

              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className={`relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    collab.isCultureSZN
                      ? 'bg-gradient-to-br from-burnt-orange/10 to-sunset-purple/5 border-burnt-orange/30 hover:border-burnt-orange/50'
                      : 'bg-white/[0.03] border-white/5 hover:border-sunset-purple/30'
                  }`}
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                >
                  {/* Culture SZN Badge */}
                  {collab.isCultureSZN && (
                    <div className="absolute -top-3 -right-3">
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-burnt-orange to-sunset-purple p-0.5"
                      >
                        <div className="w-full h-full rounded-full bg-matte-black flex items-center justify-center">
                          <Star size={14} className="text-burnt-orange" />
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Avatar Group */}
                    <div className="flex -space-x-3">
                      {collab.artists.slice(0, 3).map((artist, i) => (
                        <div
                          key={i}
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(artist)} flex items-center justify-center text-sm font-semibold text-white border-2 border-matte-black`}
                          title={artist}
                        >
                          {getInitials(artist)}
                        </div>
                      ))}
                      {collab.artists.length > 3 && (
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white border-2 border-matte-black">
                          +{collab.artists.length - 3}
                        </div>
                      )}
                    </div>

                    {/* Names & Badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {collab.isCultureSZN && (
                          <Badge variant="gradient" size="sm">
                            Culture SZN
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold truncate">
                        {artistNames}
                      </h3>
                      <Text color="muted" size="sm">
                        {collab.tracks.length} {collab.tracks.length === 1 ? 'track' : 'tracks'} together
                      </Text>
                    </div>

                    {/* Expand Indicator */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      className="text-text-muted"
                    >
                      <ChevronRight size={20} />
                    </motion.div>
                  </div>

                  {/* Track Evidence (Expandable) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-white/10">
                          <Text size="sm" color="muted" className="mb-3 flex items-center gap-2">
                            <LinkIcon size={14} />
                            Evidence Tracks
                          </Text>
                          <div className="space-y-2">
                            {collab.tracks.map((track, trackIndex) => (
                              <motion.div
                                key={trackIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: trackIndex * 0.05 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                              >
                                <div className="w-8 h-8 rounded bg-gradient-to-br from-burnt-orange/30 to-sunset-purple/30 flex items-center justify-center">
                                  <Music2 size={14} className="text-burnt-orange" />
                                </div>
                                <span className="flex-1 text-sm text-text-secondary group-hover:text-white transition-colors">
                                  "{track}"
                                </span>
                                <ExternalLink size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Preview Tracks (When Collapsed) */}
                  {!isExpanded && (
                    <div className="flex flex-wrap gap-2">
                      {collab.tracks.slice(0, 2).map((track, trackIndex) => (
                        <span
                          key={trackIndex}
                          className="text-sm text-text-secondary bg-white/5 px-3 py-1 rounded-full truncate max-w-[180px]"
                        >
                          "{track}"
                        </span>
                      ))}
                      {collab.tracks.length > 2 && (
                        <span className="text-sm text-text-muted px-3 py-1">
                          +{collab.tracks.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>

          {/* Future D3 Visualization Note */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 text-center"
          >
            <Text color="muted" size="sm" className="flex items-center justify-center gap-2">
              <Sparkles size={14} className="text-sunset-purple" />
              Full network graph with D3.js visualization coming in Phase 8
            </Text>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
