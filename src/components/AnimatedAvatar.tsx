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
// ORBITAL AVATAR
// ============================================
function AnimatedAvatar() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set())
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (imagesLoaded.size >= 10 && !isPlaying) setIsPlaying(true)
  }, [imagesLoaded.size, isPlaying])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % TOTAL_FRAMES)
    }, 1000 / FRAME_RATE)
    return () => clearInterval(interval)
  }, [isPlaying])

  useEffect(() => {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.onload = () => setImagesLoaded(prev => new Set(prev).add(i))
      img.src = getFrameUrl(i)
    }
  }, [])

  const progress = Math.round((imagesLoaded.size / TOTAL_FRAMES) * 100)

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: 340, height: 340 }}
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: 0,
          background: 'radial-gradient(circle, rgba(0,212,255,0.15) 20%, rgba(168,85,247,0.1) 40%, transparent 70%)',
          filter: 'blur(30px)',
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Anneau 1 — dashed, cyan, 320px, horaire 20s */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 320, height: 320, border: '1px dashed rgba(0,212,255,0.3)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Anneau 2 — dotted, vert, 260px, anti-horaire 15s */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 260, height: 260, border: '1px dotted rgba(0,255,136,0.25)' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      {/* Anneau 3 — solid, violet, 200px, horaire 25s */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 200, height: 200, border: '1px solid rgba(168,85,247,0.2)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* Particule cyan — radius 160px, 8s */}
      <motion.div
        className="absolute"
        style={{ width: 320, height: 320 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute rounded-full bg-cyan-400"
          style={{
            width: 10, height: 10,
            top: 'calc(50% - 5px)', left: -5,
            boxShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff',
          }}
        />
      </motion.div>

      {/* Particule verte — radius 130px, 12s reverse */}
      <motion.div
        className="absolute"
        style={{ width: 260, height: 260 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute rounded-full bg-green-400"
          style={{
            width: 8, height: 8,
            top: 'calc(50% - 4px)', left: -4,
            boxShadow: '0 0 8px #00ff88, 0 0 16px #00ff88',
          }}
        />
      </motion.div>

      {/* Particule violette — radius 100px, 10s */}
      <motion.div
        className="absolute"
        style={{ width: 200, height: 200 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute rounded-full bg-purple-400"
          style={{
            width: 6, height: 6,
            top: 'calc(50% - 3px)', left: -3,
            boxShadow: '0 0 6px #a855f7, 0 0 12px #a855f7',
          }}
        />
      </motion.div>

      {/* Data line — haut */}
      <motion.div
        className="absolute"
        style={{
          width: 2, height: 30,
          top: 'calc(50% - 100px)', left: 'calc(50% - 1px)',
          background: 'linear-gradient(to top, rgba(0,212,255,0.8), transparent)',
        }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
      />

      {/* Data line — bas */}
      <motion.div
        className="absolute"
        style={{
          width: 2, height: 30,
          top: 'calc(50% + 70px)', left: 'calc(50% - 1px)',
          background: 'linear-gradient(to bottom, rgba(0,255,136,0.8), transparent)',
        }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Data line — gauche */}
      <motion.div
        className="absolute"
        style={{
          width: 30, height: 2,
          top: 'calc(50% - 1px)', left: 'calc(50% - 100px)',
          background: 'linear-gradient(to left, rgba(0,212,255,0.8), transparent)',
        }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Data line — droite */}
      <motion.div
        className="absolute"
        style={{
          width: 30, height: 2,
          top: 'calc(50% - 1px)', left: 'calc(50% + 70px)',
          background: 'linear-gradient(to right, rgba(168,85,247,0.8), transparent)',
        }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      {/* Cercle central — 140px avec frames */}
      <motion.div
        className="relative rounded-full overflow-hidden bg-[#0a0a0f]"
        style={{
          width: 140, height: 140,
          border: '1px solid rgba(0,212,255,0.4)',
          zIndex: 10,
        }}
        animate={{
          boxShadow: [
            '0 0 40px rgba(0,212,255,0.3)',
            '0 0 40px rgba(0,255,136,0.3)',
            '0 0 40px rgba(0,212,255,0.3)',
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f] z-20">
            <div className="text-center">
              <div className="text-cyan-400 text-xs mb-1">Chargement...</div>
              <div className="text-green-400 font-mono text-xs">{progress}%</div>
            </div>
          </div>
        )}
        {Array.from({ length: TOTAL_FRAMES }, (_, i) => (
          <img
            key={i}
            src={getFrameUrl(i)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: i === currentFrame && isPlaying ? 1 : 0, transition: 'opacity 0.02s' }}
          />
        ))}
      </motion.div>

      {/* Badge n8n — haut centre */}
      <motion.div
        className="absolute px-2 py-1 rounded-lg bg-[#12121a] border border-cyan-500/30 text-xs text-cyan-400"
        style={{ top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        n8n
      </motion.div>

      {/* Badge Docker — bas droite */}
      <motion.div
        className="absolute px-2 py-1 rounded-lg bg-[#12121a] border border-green-500/30 text-xs text-green-400"
        style={{ bottom: 16, right: 16, zIndex: 20 }}
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        Docker
      </motion.div>

      {/* Badge IA — bas gauche */}
      <motion.div
        className="absolute px-2 py-1 rounded-lg bg-[#12121a] border border-purple-500/30 text-xs text-purple-400"
        style={{ bottom: 16, left: 16, zIndex: 20 }}
        animate={{ y: [0, 5, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        IA
      </motion.div>
    </motion.div>
  )
}

export { AnimatedAvatar }
