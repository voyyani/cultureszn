/**
 * CollaborationOrbit - World-Class Physics Visualization
 * 
 * A premium, physics-based collaboration network using:
 * - Spring physics with proper force simulation
 * - Draggable nodes with momentum and velocity
 * - Dynamic connection lines with gradients
 * - Magnetic attraction/repulsion between nodes
 * - Particle effects on interactions
 * - Smooth staggered entry animations
 * 
 * This is the capstone visualization for the artist profile.
 */

import { 
  useRef, 
  useState, 
  useEffect, 
  useCallback
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music2, Sparkles, ExternalLink, X } from 'lucide-react'
import { Text, Badge } from '@/components/ui'
import type { NormalizedCollaboration } from '@/types/artist'

interface CollaborationOrbitProps {
  collaborations: NormalizedCollaboration[]
  artistName: string
  artistImage?: string
}

interface Node {
  id: string
  name: string
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  mass: number
  tracks: string[]
  isCultureSZN: boolean
  isCenter: boolean
  color: string
}

interface PhysicsConfig {
  friction: number
  springStrength: number
  springLength: number
  repulsionStrength: number
  centerAttraction: number
  maxVelocity: number
  boundaryPadding: number
}

// Physics configuration for world-class feel
const PHYSICS: PhysicsConfig = {
  friction: 0.92,
  springStrength: 0.008,
  springLength: 140,
  repulsionStrength: 2500,
  centerAttraction: 0.0008,
  maxVelocity: 8,
  boundaryPadding: 60,
}

// Color palette for collaborators
const COLORS = [
  { bg: '#FF6B35', glow: 'rgba(255, 107, 53, 0.4)' },
  { bg: '#9D4EDD', glow: 'rgba(157, 78, 221, 0.4)' },
  { bg: '#00D9FF', glow: 'rgba(0, 217, 255, 0.4)' },
  { bg: '#FF006E', glow: 'rgba(255, 0, 110, 0.4)' },
  { bg: '#FFBE0B', glow: 'rgba(255, 190, 11, 0.4)' },
  { bg: '#8338EC', glow: 'rgba(131, 56, 236, 0.4)' },
  { bg: '#3A86FF', glow: 'rgba(58, 134, 255, 0.4)' },
  { bg: '#FB5607', glow: 'rgba(251, 86, 7, 0.4)' },
]

function getColorForNode(name: string, index: number): typeof COLORS[0] {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return COLORS[(hash + index) % COLORS.length]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Clamp velocity
function clampVelocity(v: number, max: number): number {
  return Math.max(-max, Math.min(max, v))
}

// Distance between two points
function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

export function CollaborationOrbit({ 
  collaborations, 
  artistName,
  artistImage 
}: CollaborationOrbitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const nodesRef = useRef<Node[]>([])
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 })
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedNode, setDraggedNode] = useState<Node | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [, forceUpdate] = useState({})

  // Initialize nodes
  const initializeNodes = useCallback(() => {
    if (!containerRef.current) return

    const { width, height } = dimensions
    const centerX = width / 2
    const centerY = height / 2

    // Create center node (artist)
    const centerNode: Node = {
      id: 'center',
      name: artistName,
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      radius: 50,
      mass: 10,
      tracks: [],
      isCultureSZN: false,
      isCenter: true,
      color: '#FF6B35',
    }

    // Create collaborator nodes
    const collabNodes: Node[] = collaborations.map((collab, index) => {
      const name = collab.artists.join(' & ')
      const angle = (index / collaborations.length) * Math.PI * 2
      const dist = 120 + Math.random() * 60
      const color = getColorForNode(name, index)
      
      // Size based on track count
      const baseRadius = 28
      const trackBonus = Math.min(collab.tracks.length * 4, 16)
      const radius = baseRadius + trackBonus

      return {
        id: `collab-${index}`,
        name,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius,
        mass: 1 + collab.tracks.length * 0.5,
        tracks: collab.tracks,
        isCultureSZN: collab.isCultureSZN,
        isCenter: false,
        color: color.bg,
      }
    })

    nodesRef.current = [centerNode, ...collabNodes]
    setIsInitialized(true)
  }, [collaborations, artistName, dimensions])

  // Physics simulation step
  const simulate = useCallback(() => {
    const nodes = nodesRef.current
    if (nodes.length < 2) return

    const { width, height } = dimensions
    const centerNode = nodes[0]

    nodes.forEach((node, i) => {
      if (node.isCenter || (isDragging && draggedNode?.id === node.id)) return

      // Reset forces
      let fx = 0
      let fy = 0

      // Spring force to center (connection)
      const dxCenter = centerNode.x - node.x
      const dyCenter = centerNode.y - node.y
      const distCenter = distance(node.x, node.y, centerNode.x, centerNode.y)
      
      if (distCenter > 0) {
        const springForce = (distCenter - PHYSICS.springLength) * PHYSICS.springStrength
        fx += (dxCenter / distCenter) * springForce
        fy += (dyCenter / distCenter) * springForce
      }

      // Repulsion from other nodes
      nodes.forEach((other, j) => {
        if (i === j || other.isCenter) return

        const dx = node.x - other.x
        const dy = node.y - other.y
        const dist = distance(node.x, node.y, other.x, other.y)
        const minDist = node.radius + other.radius + 20

        if (dist < minDist * 3 && dist > 0) {
          const repulsion = PHYSICS.repulsionStrength / (dist * dist)
          fx += (dx / dist) * repulsion
          fy += (dy / dist) * repulsion
        }
      })

      // Gentle center attraction to keep network cohesive
      fx += (width / 2 - node.x) * PHYSICS.centerAttraction
      fy += (height / 2 - node.y) * PHYSICS.centerAttraction

      // Apply forces to velocity
      node.vx = (node.vx + fx / node.mass) * PHYSICS.friction
      node.vy = (node.vy + fy / node.mass) * PHYSICS.friction

      // Clamp velocity
      node.vx = clampVelocity(node.vx, PHYSICS.maxVelocity)
      node.vy = clampVelocity(node.vy, PHYSICS.maxVelocity)

      // Update position
      node.x += node.vx
      node.y += node.vy

      // Boundary constraints with bounce
      const padding = PHYSICS.boundaryPadding + node.radius
      if (node.x < padding) {
        node.x = padding
        node.vx *= -0.5
      }
      if (node.x > width - padding) {
        node.x = width - padding
        node.vx *= -0.5
      }
      if (node.y < padding) {
        node.y = padding
        node.vy *= -0.5
      }
      if (node.y > height - padding) {
        node.y = height - padding
        node.vy *= -0.5
      }
    })
  }, [dimensions, isDragging, draggedNode])

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const nodes = nodesRef.current
    const dpr = window.devicePixelRatio || 1

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    const centerNode = nodes[0]
    if (centerNode) {
      nodes.slice(1).forEach((node) => {
        const isHighlighted = hoveredNode?.id === node.id || selectedNode?.id === node.id

        // Create gradient for connection line
        const gradient = ctx.createLinearGradient(
          centerNode.x * dpr, centerNode.y * dpr,
          node.x * dpr, node.y * dpr
        )

        if (isHighlighted) {
          gradient.addColorStop(0, 'rgba(255, 107, 53, 0.8)')
          gradient.addColorStop(1, node.color)
        } else {
          gradient.addColorStop(0, 'rgba(255, 107, 53, 0.2)')
          gradient.addColorStop(1, `${node.color}40`)
        }

        ctx.beginPath()
        ctx.strokeStyle = gradient
        ctx.lineWidth = isHighlighted ? 3 * dpr : 1.5 * dpr
        ctx.moveTo(centerNode.x * dpr, centerNode.y * dpr)
        
        // Draw curved line using quadratic bezier
        const midX = (centerNode.x + node.x) / 2
        const midY = (centerNode.y + node.y) / 2
        const offset = 20 * Math.sin(Date.now() * 0.001 + nodes.indexOf(node))
        
        ctx.quadraticCurveTo(
          (midX + offset) * dpr, 
          (midY - offset) * dpr, 
          node.x * dpr, 
          node.y * dpr
        )
        ctx.stroke()

        // Draw energy particles along the line
        if (isHighlighted) {
          const particleCount = 3
          for (let i = 0; i < particleCount; i++) {
            const t = ((Date.now() * 0.002 + i / particleCount) % 1)
            const px = centerNode.x + (node.x - centerNode.x) * t
            const py = centerNode.y + (node.y - centerNode.y) * t
            
            ctx.beginPath()
            ctx.fillStyle = node.color
            ctx.arc(px * dpr, py * dpr, 3 * dpr, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })
    }
  }, [hoveredNode, selectedNode])

  // Animation loop
  useEffect(() => {
    if (!isInitialized) return

    let lastTime = performance.now()
    const targetFPS = 60
    const frameTime = 1000 / targetFPS

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime

      if (deltaTime >= frameTime) {
        simulate()
        draw()
        forceUpdate({})
        lastTime = currentTime - (deltaTime % frameTime)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isInitialized, simulate, draw])

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const width = Math.min(rect.width, 800)
        const height = Math.max(400, Math.min(500, window.innerHeight * 0.6))
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Initialize nodes when dimensions change
  useEffect(() => {
    if (dimensions.width > 0) {
      initializeNodes()
    }
  }, [dimensions, initializeNodes])

  // Set up canvas DPR
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = dimensions.width * dpr
    canvas.height = dimensions.height * dpr
    canvas.style.width = `${dimensions.width}px`
    canvas.style.height = `${dimensions.height}px`
  }, [dimensions])

  // Mouse/touch handlers
  const getPointerPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }, [])

  const findNodeAtPosition = useCallback((x: number, y: number): Node | null => {
    const nodes = nodesRef.current
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i]
      if (distance(x, y, node.x, node.y) <= node.radius) {
        return node
      }
    }
    return null
  }, [])

  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPointerPosition(e)
    const node = findNodeAtPosition(pos.x, pos.y)
    
    if (node && !node.isCenter) {
      setIsDragging(true)
      setDraggedNode(node)
      node.vx = 0
      node.vy = 0
    }
  }, [getPointerPosition, findNodeAtPosition])

  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPointerPosition(e)

    if (isDragging && draggedNode) {
      // Update dragged node position with some smoothing
      draggedNode.x += (pos.x - draggedNode.x) * 0.3
      draggedNode.y += (pos.y - draggedNode.y) * 0.3
    } else {
      const node = findNodeAtPosition(pos.x, pos.y)
      setHoveredNode(node)
    }
  }, [isDragging, draggedNode, getPointerPosition, findNodeAtPosition])

  const handlePointerUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging && draggedNode) {
      // Add velocity based on last movement
      const pos = getPointerPosition(e)
      draggedNode.vx = (pos.x - draggedNode.x) * 0.2
      draggedNode.vy = (pos.y - draggedNode.y) * 0.2
    }

    if (!isDragging) {
      const pos = getPointerPosition(e)
      const node = findNodeAtPosition(pos.x, pos.y)
      if (node && !node.isCenter) {
        setSelectedNode(node)
      } else {
        setSelectedNode(null)
      }
    }

    setIsDragging(false)
    setDraggedNode(null)
  }, [isDragging, draggedNode, getPointerPosition, findNodeAtPosition])

  const handlePointerLeave = useCallback(() => {
    setHoveredNode(null)
    if (isDragging) {
      setIsDragging(false)
      setDraggedNode(null)
    }
  }, [isDragging])

  if (collaborations.length === 0) return null

  const nodes = nodesRef.current

  return (
    <section className="section-szn overflow-hidden">
      <div className="container-szn">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-bold mb-3">
            <span className="text-gradient">Collaboration</span> Network
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            Drag to interact • Click to explore • The stronger the connection, the closer the orbit
          </p>
        </motion.div>

        {/* Visualization Container */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 overflow-hidden backdrop-blur-sm"
          style={{ 
            width: dimensions.width, 
            height: dimensions.height,
            cursor: isDragging ? 'grabbing' : hoveredNode ? 'grab' : 'default',
          }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerLeave}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {/* Ambient glow background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-burnt-orange/10 rounded-full blur-[100px]" />
          </div>

          {/* Canvas for connections */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ width: dimensions.width, height: dimensions.height }}
          />

          {/* Render nodes as DOM elements for better interaction */}
          {nodes.map((node, index) => {
            const isHovered = hoveredNode?.id === node.id
            const isSelected = selectedNode?.id === node.id
            const isHighlighted = isHovered || isSelected

            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHighlighted ? 1.15 : 1,
                  opacity: 1,
                  x: node.x - node.radius,
                  y: node.y - node.radius,
                }}
                transition={{
                  scale: { type: 'spring', stiffness: 400, damping: 25 },
                  opacity: { duration: 0.3, delay: index * 0.08 },
                  x: { type: 'spring', stiffness: 200, damping: 25 },
                  y: { type: 'spring', stiffness: 200, damping: 25 },
                }}
                className="absolute pointer-events-none"
                style={{
                  width: node.radius * 2,
                  height: node.radius * 2,
                }}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: node.isCenter 
                      ? 'radial-gradient(circle, rgba(255, 107, 53, 0.4) 0%, transparent 70%)'
                      : `radial-gradient(circle, ${node.color}40 0%, transparent 70%)`,
                    filter: 'blur(15px)',
                  }}
                  animate={{
                    scale: isHighlighted ? 1.5 : 1,
                    opacity: isHighlighted ? 1 : 0.5,
                  }}
                />

                {/* Node circle */}
                <motion.div
                  className={`
                    absolute inset-0 rounded-full flex items-center justify-center
                    ${node.isCenter ? 'shadow-2xl shadow-burnt-orange/30' : 'shadow-xl'}
                    ${node.isCultureSZN && !node.isCenter ? 'ring-2 ring-burnt-orange ring-offset-2 ring-offset-transparent' : ''}
                  `}
                  style={{
                    background: node.isCenter
                      ? 'linear-gradient(135deg, #FF6B35 0%, #9D4EDD 100%)'
                      : node.color,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {node.isCenter && artistImage ? (
                    <img 
                      src={artistImage} 
                      alt={node.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span 
                      className="font-bold text-white select-none"
                      style={{ fontSize: node.isCenter ? '1.25rem' : '0.75rem' }}
                    >
                      {getInitials(node.name)}
                    </span>
                  )}

                  {/* Culture SZN sparkle */}
                  {node.isCultureSZN && !node.isCenter && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-burnt-orange flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles size={10} className="text-white" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Label */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                  style={{ top: node.radius * 2 + 8 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHighlighted || node.isCenter ? 1 : 0.7 }}
                >
                  <span 
                    className={`text-xs font-medium ${isHighlighted ? 'text-white' : 'text-text-muted'}`}
                  >
                    {node.name}
                  </span>
                  {!node.isCenter && node.tracks.length > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <Music2 size={10} className="text-burnt-orange" />
                      <span className="text-[10px] text-burnt-orange">
                        {node.tracks.length}
                      </span>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )
          })}

          {/* Instructions overlay (fades after interaction) */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isDragging || selectedNode ? 0 : 0.6 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm pointer-events-none"
          >
            <span className="text-xs text-text-muted">
              {isDragging ? 'Release to drop' : 'Drag nodes to explore'}
            </span>
          </motion.div>
        </motion.div>

        {/* Selected node detail panel */}
        <AnimatePresence>
          {selectedNode && !selectedNode.isCenter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="mt-6 max-w-md mx-auto"
            >
              <div 
                className="relative p-6 rounded-2xl border backdrop-blur-sm"
                style={{
                  background: `linear-gradient(135deg, ${selectedNode.color}10 0%, transparent 50%)`,
                  borderColor: `${selectedNode.color}30`,
                }}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X size={16} className="text-text-muted" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className={`w-14 h-14 rounded-full flex items-center justify-center ${selectedNode.isCultureSZN ? 'ring-2 ring-burnt-orange ring-offset-2 ring-offset-matte-black' : ''}`}
                    style={{ background: selectedNode.color }}
                  >
                    <span className="text-lg font-bold text-white">
                      {getInitials(selectedNode.name)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {selectedNode.name}
                    </h3>
                    {selectedNode.isCultureSZN && (
                      <Badge variant="gradient" size="sm" className="mt-1">
                        <Sparkles size={12} className="mr-1" />
                        Culture SZN
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Tracks */}
                <div>
                  <Text size="sm" color="muted" className="mb-2">
                    Collaborations with {artistName}
                  </Text>
                  <div className="space-y-2">
                    {selectedNode.tracks.map((track, i) => (
                      <motion.div
                        key={track}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: `${selectedNode.color}30` }}
                        >
                          <Music2 size={14} style={{ color: selectedNode.color }} />
                        </div>
                        <span className="flex-1 text-sm text-text-primary font-medium">
                          {track}
                        </span>
                        <ExternalLink 
                          size={14} 
                          className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" 
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center gap-6"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {collaborations.length}
            </div>
            <Text size="sm" color="muted">Collaborators</Text>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold text-burnt-orange">
              {collaborations.reduce((acc, c) => acc + c.tracks.length, 0)}
            </div>
            <Text size="sm" color="muted">Tracks</Text>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold text-sunset-purple">
              {collaborations.filter(c => c.isCultureSZN).length}
            </div>
            <Text size="sm" color="muted">Culture SZN</Text>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
