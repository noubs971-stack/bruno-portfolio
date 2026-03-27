'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// ============================================
// ANIMATED FRAMES - LOCAL FILES
// ============================================
const TOTAL_FRAMES = 190
const FRAME_RATE = 24 // FPS

function getFrameUrl(index: number): string {
  const frameNum = index + 3 // frames start at 003
  const num = String(frameNum).padStart(3, '0')
  return `/frames/frame_${num}_delay-0.042s.webp`
}

// ============================================
// ANIMATED AVATAR WITH FRAMES
// ============================================
function AnimatedAvatar() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set())
  const [isPlaying, setIsPlaying] = useState(false)

  // Start animation once enough frames are loaded
  useEffect(() => {
    if (imagesLoaded.size >= 10 && !isPlaying) {
      setIsPlaying(true)
    }
  }, [imagesLoaded.size, isPlaying])

  // Animate frames
  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % TOTAL_FRAMES)
    }, 1000 / FRAME_RATE)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Preload images progressively
  useEffect(() => {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.onload = () => {
        setImagesLoaded(prev => new Set(prev).add(i))
      }
      img.src = getFrameUrl(i)
    }
  }, [])

  const progress = Math.round((imagesLoaded.size / TOTAL_FRAMES) * 100)

  return (
    <motion.div
      className="relative w-48 h-48 md:w-56 md:h-56"
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            '0 0 40px rgba(0, 245, 255, 0.3), 0 0 80px rgba(0, 255, 136, 0.2)',
            '0 0 60px rgba(0, 245, 255, 0.5), 0 0 100px rgba(0, 255, 136, 0.3)',
            '0 0 40px rgba(0, 245, 255, 0.3), 0 0 80px rgba(0, 255, 136, 0.2)',
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbit rings */}
      <motion.div
        className="absolute -inset-8 md:-inset-12 rounded-full border border-cyan-500/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full -top-1 left-1/2 -translate-x-1/2" style={{ boxShadow: '0 0 10px #00f5ff' }} />
      </motion.div>

      <motion.div
        className="absolute -inset-4 md:-inset-6 rounded-full border border-green-500/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute w-2 h-2 bg-green-400 rounded-full -top-1 left-1/4" style={{ boxShadow: '0 0 10px #00ff88' }} />
      </motion.div>

      {/* Avatar container */}
      <div className="relative w-full h-full rounded-full overflow-hidden bg-[#0a0a0f] border-2 border-cyan-500/50">
        {/* Loading indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f] z-20">
            <div className="text-center">
              <div className="text-cyan-400 text-sm mb-2">Chargement...</div>
              <div className="text-green-400 font-mono">{progress}%</div>
            </div>
          </div>
        )}
        
        {/* Frames */}
        {Array.from({ length: TOTAL_FRAMES }, (_, i) => (
          <img
            key={i}
            src={getFrameUrl(i)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: i === currentFrame && isPlaying ? 1 : 0,
              transition: 'opacity 0.02s'
            }}
          />
        ))}
      </div>

      {/* Floating tech badges */}
      <motion.div
        className="absolute -top-4 -right-4 px-2 py-1 rounded-lg bg-[#12121a] border border-cyan-500/30 text-xs text-cyan-400"
        animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        n8n
      </motion.div>

      <motion.div
        className="absolute -bottom-4 -left-4 px-2 py-1 rounded-lg bg-[#12121a] border border-green-500/30 text-xs text-green-400"
        animate={{ y: [0, 5, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        Docker
      </motion.div>

      <motion.div
        className="absolute top-1/2 -right-8 px-2 py-1 rounded-lg bg-[#12121a] border border-cyan-500/30 text-xs text-cyan-400"
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        IA
      </motion.div>
    </motion.div>
  )
}

export { AnimatedAvatar }
