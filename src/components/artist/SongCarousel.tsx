/**
 * SongCarousel Component
 * 
 * World-class horizontal carousel for displaying songs
 * with smooth scrolling, drag support, and navigation controls.
 * Displays 4 songs at a time on desktop.
 */

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Music2, ExternalLink } from 'lucide-react'
import type { NormalizedRelease } from '@/types/artist'

import { formatDate } from '@/lib/format'
interface SongCarouselProps {
  releases: NormalizedRelease[]
}


const CARD_WIDTH = 280
const CARD_GAP = 16

function getCardsPerView() {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return 2
  }
  return 4
}

export function SongCarousel({ releases }: SongCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(getCardsPerView())
  const x = useMotionValue(0)

  // Calculate total pages
  const totalCards = releases.length
  const maxIndex = Math.max(0, totalCards - cardsPerView)

  // Calculate container width dynamically
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
      setCardsPerView(getCardsPerView())
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Calculate card width based on container (responsive)
  const responsiveCardWidth = containerWidth > 0
    ? (containerWidth - (CARD_GAP * (cardsPerView - 1))) / cardsPerView
    : CARD_WIDTH
  
  // Navigation handlers
  const goToIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex))
    setCurrentIndex(clampedIndex)
    animate(x, -clampedIndex * (responsiveCardWidth + CARD_GAP), {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    })
  }
  
  const goNext = () => goToIndex(currentIndex + 1)
  const goPrev = () => goToIndex(currentIndex - 1)
  
  // Drag handling
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    const offset = info.offset.x
    const velocity = info.velocity.x
    
    // Determine direction based on velocity and offset
    if (offset < -50 || velocity < -500) {
      goNext()
    } else if (offset > 50 || velocity > 500) {
      goPrev()
    } else {
      // Snap back to current position
      goToIndex(currentIndex)
    }
  }
  
  // Progress indicator
  const progressWidth = useTransform(
    x,
    [0, -maxIndex * (responsiveCardWidth + CARD_GAP)],
    ['0%', '100%']
  )

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="absolute -top-16 right-0 flex items-center gap-2 z-10">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className={`
            p-3 rounded-full border transition-all duration-300
            ${currentIndex === 0
              ? 'border-white/10 text-white/20 cursor-not-allowed'
              : 'border-white/20 text-white hover:border-burnt-orange hover:text-burnt-orange hover:bg-burnt-orange/10'
            }
          `}
          aria-label="Previous songs"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goNext}
          disabled={currentIndex >= maxIndex}
          className={`
            p-3 rounded-full border transition-all duration-300
            ${currentIndex >= maxIndex
              ? 'border-white/10 text-white/20 cursor-not-allowed'
              : 'border-white/20 text-white hover:border-burnt-orange hover:text-burnt-orange hover:bg-burnt-orange/10'
            }
          `}
          aria-label="Next songs"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Carousel Container */}
      <div 
        ref={containerRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <motion.div
          className="flex"
          style={{ x, gap: CARD_GAP }}
          drag="x"
          dragConstraints={{
            left: -maxIndex * (responsiveCardWidth + CARD_GAP),
            right: 0,
          }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        >
          {releases.map((release, index) => (
            <SongCard 
              key={release.id} 
              release={release} 
              index={index}
              width={responsiveCardWidth}
              isDragging={isDragging}
            />
          ))}
        </motion.div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-burnt-orange to-sunset-purple rounded-full"
          style={{ width: progressWidth }}
        />
      </div>
      
      {/* Dots Navigation (for mobile) */}
      <div className="flex justify-center gap-2 mt-4 md:hidden">
        {Array.from({ length: Math.ceil(totalCards / cardsPerView) }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToIndex(i * cardsPerView)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${Math.floor(currentIndex / cardsPerView) === i 
                ? 'bg-burnt-orange w-6' 
                : 'bg-white/20 hover:bg-white/40'
              }
            `}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

/* ============================================
   Song Card Component
   ============================================ */

interface SongCardProps {
  release: NormalizedRelease
  index: number
  width: number
  isDragging: boolean
}

function SongCard({ release, index, width, isDragging }: SongCardProps) {
  const hasLinks = release.links.youtube || release.links.soundcloud || release.links.spotify || release.links.apple
  const primaryLink = release.links.youtube || release.links.soundcloud || release.links.spotify || release.links.apple
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      style={{ width, minWidth: width }}
      className="group"
    >
      <div 
        className={`
          relative h-full p-4 rounded-2xl
          bg-gradient-to-br from-white/[0.05] to-white/[0.02]
          border border-white/10 hover:border-burnt-orange/40
          transition-all duration-300
          ${isDragging ? '' : 'hover:scale-[1.02] hover:shadow-xl hover:shadow-burnt-orange/10'}
        `}
      >
        {/* Cover Art / Gradient Placeholder */}
        <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-burnt-orange/20 via-sunset-purple/20 to-burnt-orange/10">
          {release.coverArt ? (
            <img 
              src={release.coverArt} 
              alt={release.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music2 size={48} className="text-white/20" />
            </div>
          )}
          
          {/* Play Overlay */}
          {hasLinks && !isDragging && (
            <a
              href={primaryLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => isDragging && e.preventDefault()}
              className="
                absolute inset-0 flex items-center justify-center
                bg-black/60 opacity-0 group-hover:opacity-100
                transition-opacity duration-300
              "
            >
              <div className="w-14 h-14 rounded-full bg-burnt-orange flex items-center justify-center shadow-lg shadow-burnt-orange/30 transform scale-90 group-hover:scale-100 transition-transform">
                <Play size={24} className="text-white ml-1" fill="white" />
              </div>
            </a>
          )}
          
          {/* Type Badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-black/60 backdrop-blur-sm text-white/80">
              {release.type}
            </span>
          </div>
        </div>
        
        {/* Release Info */}
        <div className="space-y-1">
          <h4 className="font-semibold text-white text-sm leading-tight line-clamp-2 group-hover:text-burnt-orange transition-colors">
            {release.title}
          </h4>
          
          {release.featuredArtists.length > 0 && (
            <p className="text-xs text-text-muted line-clamp-1">
              feat. {release.featuredArtists.join(', ')}
            </p>
          )}
          
          <p className="text-xs text-text-muted/60">
            {formatDate(release.releaseDate, { month: 'short' })}
          </p>
        </div>
        
        {/* Platform Links */}
        {hasLinks && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
            {release.links.spotify && (
              <a
                href={release.links.spotify}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => isDragging && e.preventDefault()}
                className="p-2 rounded-lg bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors"
                aria-label="Listen on Spotify"
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
                onClick={(e) => isDragging && e.preventDefault()}
                className="p-2 rounded-lg bg-[#FA2D48]/10 text-[#FA2D48] hover:bg-[#FA2D48]/20 transition-colors"
                aria-label="Listen on Apple Music"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </a>
            )}
            {release.links.soundcloud && (
              <a
                href={release.links.soundcloud}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => isDragging && e.preventDefault()}
                className="p-2 rounded-lg bg-[#FF5500]/10 text-[#FF5500] hover:bg-[#FF5500]/20 transition-colors"
                aria-label="Listen on SoundCloud"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.05-.1-.084-.1zm-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c.014.057.045.094.09.094.044 0 .074-.037.09-.094l.21-1.308-.225-1.332c-.016-.057-.046-.094-.09-.094zm1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.12.105.12.061 0 .12-.061.12-.12l.24-2.443-.24-2.578c0-.061-.06-.104-.12-.104zm.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.138.149.138.075 0 .135-.061.15-.138l.225-2.529-.225-2.655c-.015-.075-.06-.135-.135-.135zm1.065.202c-.09 0-.149.075-.149.165l-.176 2.625.176 2.516c0 .09.059.165.149.165.091 0 .166-.075.166-.165l.196-2.516-.196-2.625c0-.09-.075-.165-.166-.165zm.988-.202c-.1 0-.165.09-.18.18l-.165 2.68.18 2.518c.016.09.09.165.18.165.09 0 .165-.075.18-.165l.195-2.518-.195-2.68c-.015-.09-.09-.18-.195-.18zm1.016-.203c-.104 0-.194.09-.194.195l-.135 2.7.15 2.505c0 .105.09.195.18.195.104 0 .194-.09.194-.195l.165-2.505-.165-2.7c0-.105-.09-.195-.195-.195zm1.035.195c0-.12-.1-.21-.209-.21-.105 0-.21.09-.225.21l-.136 2.504.136 2.49c.016.12.12.21.225.21.109 0 .209-.09.209-.21l.165-2.49-.165-2.504zm.959-.992c-.119 0-.224.105-.224.225l-.136 3.495.136 2.459c0 .12.104.224.224.224.12 0 .225-.104.225-.224l.149-2.459-.149-3.495c0-.12-.104-.225-.225-.225zm1.064.45c-.135 0-.239.105-.239.24l-.12 3.045.12 2.445c0 .135.104.24.239.24.12 0 .24-.105.24-.24l.135-2.445-.135-3.045c0-.135-.12-.24-.24-.24zm1.05.315c-.15 0-.255.12-.255.255l-.105 2.73.105 2.43c0 .15.105.27.255.27.136 0 .255-.12.255-.27l.121-2.43-.121-2.73c0-.135-.12-.255-.255-.255zm1.066.36c-.165 0-.285.135-.285.285l-.091 2.37.091 2.385c0 .165.12.3.285.3.151 0 .285-.135.285-.3l.105-2.385-.105-2.37c0-.15-.135-.285-.285-.285zm1.036-.21c-.166 0-.301.135-.301.3l-.076 2.565.076 2.354c0 .181.135.316.301.316.165 0 .3-.135.315-.316l.09-2.354-.09-2.565c-.015-.165-.15-.3-.315-.3zm1.096.405c-.181 0-.315.15-.315.33l-.061 2.16.061 2.31c0 .181.134.33.315.33.18 0 .314-.149.33-.33l.075-2.31-.075-2.16c-.016-.18-.15-.33-.33-.33zm3.592.195c-.345 0-.675.061-.975.18-.195-2.175-2.055-3.885-4.35-3.885-.585 0-1.155.12-1.665.315-.195.075-.255.165-.255.33v7.78c0 .18.135.33.3.345h6.945c1.545 0 2.805-1.26 2.805-2.805 0-1.56-1.26-2.805-2.805-2.805v.045z"/>
                </svg>
              </a>
            )}
            {release.links.youtube && (
              <a
                href={release.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => isDragging && e.preventDefault()}
                className="p-2 rounded-lg bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000]/20 transition-colors"
                aria-label="Watch on YouTube"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
            {!hasLinks && (
              <span className="text-xs text-text-muted/50 flex items-center gap-1">
                <ExternalLink size={12} />
                Coming soon
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default SongCarousel
