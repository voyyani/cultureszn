/**
 * DiscographySection Component
 * 
 * World-class discography display with albums/EPs prominently featured,
 * singles carousel, and timeline visualization.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Disc3, 
  Music2, 
  Mic2, 
  Clock, 
  Grid3X3, 
  List,
  Play,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { SectionHeader, Badge } from '@/components/ui'
import { SongCarousel } from './SongCarousel'
import { staggerContainer, fadeInUp } from '@/lib/motion'
import type { NormalizedRelease, NormalizedProject } from '@/types/artist'

interface DiscographySectionProps {
  releases: NormalizedRelease[]
  projects: NormalizedProject[]
  artistName: string
}

// View mode types
type ViewMode = 'grid' | 'timeline'

// Group releases by year
function groupByYear(releases: NormalizedRelease[]): Record<string, NormalizedRelease[]> {
  return releases.reduce((acc, release) => {
    const year = new Date(release.releaseDate).getFullYear().toString()
    if (!acc[year]) acc[year] = []
    acc[year].push(release)
    return acc
  }, {} as Record<string, NormalizedRelease[]>)
}

// Album Card Component - Large, prominent display for albums/EPs
function AlbumCard({ project }: { project: NormalizedProject }) {
  const [expanded, setExpanded] = useState(false)
  
  const typeColors = {
    album: 'from-sunset-purple to-burnt-orange',
    ep: 'from-burnt-orange to-golden-hour',
    mixtape: 'from-golden-hour to-sunset-purple'
  }
  
  const gradient = typeColors[project.type as keyof typeof typeColors] || typeColors.album
  const hasCoverArt = Boolean(project.coverArt)
  
  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-burnt-orange/40 transition-all duration-300 group"
    >
      {/* Album Header with Gradient */}
      <div className={`relative h-48 p-6 overflow-hidden ${hasCoverArt ? '' : `bg-gradient-to-br ${gradient}`}`}>
        {hasCoverArt && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${project.coverArt})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/55 to-black/70" />
          </>
        )}
        {/* Decorative circles */}
        <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-2xl ${hasCoverArt ? 'bg-white/5' : 'bg-white/10'}`} />
        <div className={`absolute -left-10 -bottom-10 w-32 h-32 rounded-full blur-xl ${hasCoverArt ? 'bg-black/40' : 'bg-black/20'}`} />
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <Badge variant="default" size="sm" className="bg-black/30 backdrop-blur-sm border-none">
              {project.type.toUpperCase()}
            </Badge>
            {project.releaseDate && (
              <span className="text-sm text-white/80 font-medium">
                {new Date(project.releaseDate).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'short'
                })}
              </span>
            )}
          </div>
          
          <div>
            <h3 className="text-3xl font-[family-name:var(--font-heading)] font-bold text-white tracking-tight">
              {project.title}
            </h3>
            <p className="text-white/70 text-sm mt-1">
              {project.tracks?.length || project.trackCount || 0} tracks
            </p>
          </div>
        </div>
      </div>
      
      {/* Album Content */}
      <div className="p-5">
        {/* Platform Links */}
        {project.links && (project.links.spotify || project.links.apple) && (
          <div className="flex items-center gap-2 mb-4">
            {project.links.spotify && (
              <a
                href={project.links.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1DB954] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Spotify
              </a>
            )}
            {project.links.apple && (
              <a
                href={project.links.apple}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FA2D48] to-[#FB5C74] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple Music
              </a>
            )}
          </div>
        )}
        
        {/* Tracklist Toggle */}
        {project.tracks && project.tracks.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full py-2 text-text-secondary hover:text-white transition-colors"
            >
              <span className="text-sm font-medium">Tracklist</span>
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            <motion.div
              initial={false}
              animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-1">
                {project.tracks.map((track, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors group/track"
                  >
                    <span className="w-5 text-xs text-text-muted font-mono">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-sm text-text-secondary group-hover/track:text-white transition-colors">
                      {track}
                    </span>
                    <Play size={14} className="opacity-0 group-hover/track:opacity-50 transition-opacity" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function DiscographySection({ 
  releases, 
  projects, 
  artistName 
}: DiscographySectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Sort releases by date (newest first) - these are the singles
  const sortedReleases = [...releases].sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  )

  // Sort projects by date (newest first)
  const sortedProjects = [...projects].sort(
    (a, b) => {
      if (!a.releaseDate) return 1
      if (!b.releaseDate) return -1
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    }
  )

  // Group by year for timeline view
  const releasesByYear = groupByYear(sortedReleases)
  const years = Object.keys(releasesByYear).sort((a, b) => parseInt(b) - parseInt(a))

  if (releases.length === 0 && projects.length === 0) {
    return null
  }

  return (
    <section className="section-szn bg-gradient-subtle">
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
                title="Discography"
                subtitle={`Explore ${artistName}'s complete catalog — ${projects.length} projects, ${releases.length} singles.`}
                centered={false}
              />

              {/* View Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-burnt-orange text-white' 
                        : 'text-text-muted hover:text-white'
                    }`}
                    title="Grid View"
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'timeline' 
                        ? 'bg-burnt-orange text-white' 
                        : 'text-text-muted hover:text-white'
                    }`}
                    title="Timeline View"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Albums & EPs Section - Featured prominently */}
          {projects.length > 0 && (
            <motion.div variants={fadeInUp} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Disc3 className="text-sunset-purple" size={24} />
                <h3 className="text-2xl font-[family-name:var(--font-heading)] font-bold">
                  Albums & EPs
                </h3>
                <Badge variant="gradient" size="sm">
                  {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProjects.map((project) => (
                  <AlbumCard key={project.id} project={project} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Singles Section */}
          {releases.length > 0 && (
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-3 mb-6">
                <Mic2 className="text-burnt-orange" size={24} />
                <h3 className="text-2xl font-[family-name:var(--font-heading)] font-bold">
                  Singles
                </h3>
                <Badge variant="default" size="sm">
                  {releases.length} tracks
                </Badge>
              </div>

              {/* Grid View - Carousel */}
              {viewMode === 'grid' && (
                <SongCarousel releases={sortedReleases} />
              )}

              {/* Timeline View */}
              {viewMode === 'timeline' && (
                <div className="relative">
                  {/* Vertical Timeline Line */}
                  <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-burnt-orange via-sunset-purple to-transparent" />

                  {years.map((year, yearIndex) => (
                    <motion.div
                      key={year}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: yearIndex * 0.1 }}
                      className="relative mb-12"
                    >
                      {/* Year Marker */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative z-10 w-8 md:w-16 h-8 rounded-full bg-burnt-orange flex items-center justify-center shadow-lg shadow-burnt-orange/30">
                          <Clock size={16} className="text-white" />
                        </div>
                        <h4 className="text-2xl md:text-3xl font-[family-name:var(--font-heading)] font-bold text-burnt-orange">
                          {year}
                        </h4>
                        <Badge variant="default" size="sm">
                          {releasesByYear[year].length} {releasesByYear[year].length === 1 ? 'release' : 'releases'}
                        </Badge>
                      </div>

                      {/* Releases for this year */}
                      <div className="ml-12 md:ml-24 space-y-4">
                        {releasesByYear[year].map((release, index) => (
                          <motion.div
                            key={release.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:border-burnt-orange/30 transition-all group"
                          >
                            {/* Mini Cover */}
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-burnt-orange/20 to-sunset-purple/20">
                              {release.coverArt ? (
                                <img 
                                  src={release.coverArt} 
                                  alt={release.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Music2 size={24} className="text-white/30" />
                                </div>
                              )}
                            </div>

                            {/* Release Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs uppercase tracking-wider text-burnt-orange font-medium">
                                  single
                                </span>
                                <span className="text-text-muted text-xs">
                                  {new Date(release.releaseDate).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </div>
                              <h5 className="font-semibold text-white group-hover:text-burnt-orange transition-colors truncate">
                                {release.title}
                              </h5>
                              {release.featuredArtists.length > 0 && (
                                <p className="text-sm text-text-muted truncate">
                                  feat. {release.featuredArtists.join(', ')}
                                </p>
                              )}
                            </div>

                            {/* Quick Links */}
                            <div className="flex items-center gap-2">
                              {release.links.spotify && (
                                <a
                                  href={release.links.spotify}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors"
                                >
                                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                  </svg>
                                </a>
                              )}
                              {release.links.apple && (
                                <a
                                  href={release.links.apple}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg bg-[#FA2D48]/10 text-[#FA2D48] hover:bg-[#FA2D48]/20 transition-colors"
                                >
                                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                  </svg>
                                </a>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Empty State */}
          {releases.length === 0 && projects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Music2 size={48} className="mx-auto mb-4 text-text-muted/30" />
              <p className="text-text-muted">
                No releases found.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
