'use client'

import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Bot, 
  Code2, 
  Rocket, 
  TrendingUp, 
  Mail, 
  Linkedin, 
  Github, 
  Workflow,
  Container,
  Target,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Send,
  Award,
  ExternalLink,
  Download
} from 'lucide-react'
import { ChatBot } from '@/components/ChatBot'
import { AnimatedAvatar } from '@/components/AnimatedAvatar'

// ============================================
// CURSOR PARTICLE EFFECT
// ============================================
interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
}

function CursorParticles() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isEnabled, setIsEnabled] = useState(true)
  const particleId = useRef(0)
  const lastSpawn = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      
      const now = Date.now()
      if (now - lastSpawn.current > 30 && isEnabled) { // Throttle particle creation
        lastSpawn.current = now
        
        const colors = ['#00f5ff', '#00ff88', '#00d4aa', '#00e5ff']
        const newParticle: Particle = {
          id: particleId.current++,
          x: e.clientX,
          y: e.clientY,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4
        }
        
        setParticles(prev => [...prev.slice(-20), newParticle]) // Keep last 20 particles
      }
    }

    const handleClick = () => {
      // Burst effect on click
      const colors = ['#00f5ff', '#00ff88', '#00d4aa', '#00e5ff']
      const burstParticles: Particle[] = []
      
      for (let i = 0; i < 12; i++) {
        burstParticles.push({
          id: particleId.current++,
          x: mousePos.x + (Math.random() - 0.5) * 40,
          y: mousePos.y + (Math.random() - 0.5) * 40,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 12 + 6
        })
      }
      
      setParticles(prev => [...prev.slice(-15), ...burstParticles])
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [mousePos, isEnabled])

  // Clean up old particles
  useEffect(() => {
    const cleanup = setInterval(() => {
      setParticles(prev => prev.slice(-15))
    }, 100)
    
    return () => clearInterval(cleanup)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {/* Custom cursor glow */}
      <motion.div
        className="absolute w-6 h-6 rounded-full"
        animate={{
          x: mousePos.x - 12,
          y: mousePos.y - 12,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        style={{
          background: 'radial-gradient(circle, rgba(0, 245, 255, 0.4) 0%, transparent 70%)',
          filter: 'blur(2px)'
        }}
      />
      
      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x, 
              y: particle.y, 
              scale: 1, 
              opacity: 0.8 
            }}
            animate={{ 
              x: particle.x + (Math.random() - 0.5) * 60, 
              y: particle.y + 40 + Math.random() * 20, 
              scale: 0,
              opacity: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              background: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// SECTION WRAPPER
// ============================================
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// ============================================
// SKILL CARD COMPONENT
// ============================================
function SkillCard({ icon: Icon, title, items, delay }: { icon: React.ElementType; title: string; items: string[]; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="group relative p-6 rounded-2xl bg-gradient-to-br from-[#12121a] to-[#0d0d14] border border-[#1e1e2e] card-hover"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-green-500/20 border border-cyan-500/30">
            <Icon className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        
        <ul className="space-y-2">
          {items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: delay + i * 0.1 }}
              className="flex items-center gap-2 text-gray-400"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-green-400" />
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// ============================================
// PROJECT CARD COMPONENT
// ============================================
function ProjectCard({ title, description, features, index }: { title: string; description: string; features: string[]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#12121a] to-[#0d0d14] border border-[#1e1e2e] card-hover"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-all">{title}</h3>
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        
        <p className="text-gray-400 mb-4">{description}</p>
        
        <div className="space-y-2">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-2 text-sm text-gray-500"
            >
              <Sparkles className="w-3 h-3 text-green-400" />
              {feature}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// CERTIFICATION CARD
// ============================================
function CertificationCard({ url, title, index }: { url: string; title: string; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.a
      ref={ref}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#12121a] to-[#0d0d14] border border-[#1e1e2e] hover:border-cyan-500/50 transition-all"
    >
      <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-green-500/20 border border-cyan-500/30">
        <Award className="w-6 h-6 text-cyan-400" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">{title}</h4>
        <p className="text-sm text-gray-500">Coursera - Vérifié</p>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
    </motion.a>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function Home() {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden noise-overlay">
      {/* Cursor particles effect */}
      <CursorParticles />
      
      {/* Animated grid background */}
      <div className="fixed inset-0 grid-bg opacity-50 pointer-events-none" />
      
      {/* Gradient overlays */}
      <div className="fixed top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-cyan-500/10 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-green-500/10 to-transparent pointer-events-none" />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#1e1e2e]"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center">
              <span className="text-lg font-black text-[#0a0a0f]">BB</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">Bruno Bondron</span>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <a href="#about" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm hidden sm:block">À propos</a>
            <a href="#skills" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm hidden sm:block">Compétences</a>
            <a href="#projects" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm hidden sm:block">Projets</a>
            <motion.a
              href="/download"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 text-[#0a0a0f] font-semibold text-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Télécharger</span>
            </motion.a>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center pt-20 px-6"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12121a] border border-[#1e1e2e] mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-gray-400">Disponible pour de nouveaux projets</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            >
              <span className="text-white">Bruno</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400"> Bondron</span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-xl md:text-2xl text-gray-400 mb-6"
            >
              Développeur SaaS & Solutions IA pour PME
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-gray-500 text-lg mb-8 max-w-lg mx-auto lg:mx-0"
            >
              <span className="text-cyan-400">🔥 Créateur d'outils intelligents</span> pour la croissance des PME<br />
              <span className="text-green-400">⚙️ Architecte d'automatisations IA</span><br />
              <span className="text-cyan-400">🚀 Développeur SaaS</span> orienté performance business
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 245, 255, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-green-500 text-[#0a0a0f] font-semibold flex items-center gap-2"
              >
                Voir mes projets
                <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl border border-[#1e1e2e] text-white font-semibold hover:border-cyan-500/50 transition-colors"
              >
                Me contacter
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Animated Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex justify-center"
          >
            <AnimatedAvatar />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-sm">Défiler</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <Section id="about" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">À propos de moi</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-green-500 mx-auto rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative p-8 rounded-2xl bg-gradient-to-br from-[#12121a] to-[#0d0d14] border border-[#1e1e2e]"
          >
            <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-br from-cyan-500/5 to-green-500/5" />
            
            <div className="relative z-10">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Développeur passionné d'intelligence artificielle et d'automatisation, je conçois des <span className="text-cyan-400 font-semibold">outils SaaS sur mesure</span> pour aider les PME à gagner du temps, automatiser leurs processus et améliorer leur visibilité en ligne.
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Spécialisé dans les <span className="text-green-400 font-semibold">workflows intelligents avec n8n</span>, le déploiement via Docker et l'intégration d'agents IA (voix & texte), je transforme des besoins métiers concrets en solutions performantes et scalables.
              </p>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e]">
                <Target className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                  <span className="text-gray-500 text-sm">Objectif</span>
                  <p className="text-white font-medium">Développer un écosystème d'outils SaaS intelligents dédiés aux PME, combinant automatisation, IA et marketing digital.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Skills Section */}
      <Section id="skills" className="py-24 px-6 bg-gradient-to-b from-transparent via-[#0a0a0f] to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">Compétences</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-green-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <SkillCard
              icon={Bot}
              title="Intelligence Artificielle & Agents"
              items={[
                "Agents vocaux IA (voice bots automatisés)",
                "Automatisation intelligente",
                "Intégration d'API IA",
                "Orchestration de workflows avec n8n",
                "Expérimentation avec NVIDIA CUDA Toolkit",
              ]}
              delay={0.1}
            />
            <SkillCard
              icon={Code2}
              title="Développement & SaaS"
              items={[
                "Architecture SaaS",
                "Backend Python",
                "API REST",
                "Déploiement Docker",
                "Gestion serveurs VPS",
              ]}
              delay={0.2}
            />
            <SkillCard
              icon={TrendingUp}
              title="Marketing & Acquisition"
              items={[
                "Automatisation publicitaire",
                "Génération de leads",
                "Publication automatique réseaux sociaux",
                "Création d'outils internes pour PME",
              ]}
              delay={0.3}
            />
          </div>
        </div>
      </Section>

      {/* Projects Section */}
      <Section id="projects" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">Projets</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-green-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <ProjectCard
              title="Plateforme d'automatisation PME"
              description="Système centralisé permettant aux entreprises d'automatiser leurs processus métier."
              features={[
                "Gestion leads intelligente",
                "Publication automatique sur réseaux sociaux",
                "Notifications clients automatisées",
                "Synchronisation CRM",
              ]}
              index={0}
            />
            <ProjectCard
              title="Agent vocal IA pour entreprises"
              description="Assistant téléphonique intelligent capable d'interagir avec les prospects."
              features={[
                "Répondre aux appels",
                "Qualifier les prospects",
                "Prendre des rendez-vous",
                "Rediriger vers un commercial",
              ]}
              index={1}
            />
            <ProjectCard
              title="Outil SaaS de publication automatisée"
              description="Solution permettant aux PME de programmer et automatiser leurs publications sur plusieurs plateformes."
              features={[
                "Programmation multi-plateformes",
                "Publication en un clic",
                "Analytics intégrés",
                "Gestion de contenu centralisée",
              ]}
              index={2}
            />
            <ProjectCard
              title="Infrastructure IA conteneurisée"
              description="Déploiement d'environnements IA scalables via Docker."
              features={[
                "Exécution de modèles localement",
                "Déploiement sur serveur",
                "Scalabilité automatique",
                "Isolation des environnements",
              ]}
              index={3}
            />
          </div>
        </div>
      </Section>

      {/* Certifications Section */}
      <Section className="py-24 px-6 bg-gradient-to-b from-transparent via-[#0a0a0f] to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">Certifications</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-green-500 mx-auto rounded-full" />
          </motion.div>

          <div className="space-y-4">
            <CertificationCard
              url="https://coursera.org/verify/L6EY9DRHTKPB"
              title="Certification IA & Machine Learning"
              index={0}
            />
            <CertificationCard
              url="https://coursera.org/verify/RUDFZ7G8SPDS"
              title="Certification Deep Learning"
              index={1}
            />
          </div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section id="contact" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">Contact</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-green-500 mx-auto rounded-full" />
            <p className="text-gray-400 mt-4">Prêt à transformer vos idées en réalité ? Contactez-moi !</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Contact info */}
            <div className="space-y-4">
              <motion.a
                href="mailto:Noubs971@gmail.com"
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#12121a] border border-[#1e1e2e] hover:border-cyan-500/50 transition-all group"
              >
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email professionnel</p>
                  <p className="text-white group-hover:text-cyan-400 transition-colors">Noubs971@gmail.com</p>
                </div>
              </motion.a>

              <motion.a
                href="#"
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#12121a] border border-[#1e1e2e] hover:border-cyan-500/50 transition-all group"
              >
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <Linkedin className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">LinkedIn</p>
                  <p className="text-white group-hover:text-cyan-400 transition-colors">Bruno Bondron</p>
                </div>
              </motion.a>

              <motion.a
                href="#"
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#12121a] border border-[#1e1e2e] hover:border-green-500/50 transition-all group"
              >
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <Github className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">GitHub</p>
                  <p className="text-white group-hover:text-green-400 transition-colors">Voir mes projets</p>
                </div>
              </motion.a>
            </div>

            {/* Contact form */}
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="p-6 rounded-2xl bg-[#12121a] border border-[#1e1e2e] space-y-4"
            >
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Nom</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e] text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e] text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e] text-white focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                  placeholder="Décrivez votre projet..."
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0, 245, 255, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-green-500 text-[#0a0a0f] font-semibold flex items-center justify-center gap-2"
              >
                Envoyer
                <Send className="w-4 h-4" />
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 border-t border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center">
                <span className="text-sm font-black text-[#0a0a0f]">BB</span>
              </div>
              <span className="text-gray-500 text-sm">© 2025 Bruno Bondron. Tous droits réservés.</span>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.a
                href="mailto:Noubs971@gmail.com"
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2 rounded-lg bg-[#12121a] border border-[#1e1e2e] hover:border-cyan-500/50 transition-colors"
              >
                <Mail className="w-4 h-4 text-gray-400 hover:text-cyan-400 transition-colors" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2 rounded-lg bg-[#12121a] border border-[#1e1e2e] hover:border-cyan-500/50 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-gray-400 hover:text-cyan-400 transition-colors" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2 rounded-lg bg-[#12121a] border border-[#1e1e2e] hover:border-green-500/50 transition-colors"
              >
                <Github className="w-4 h-4 text-gray-400 hover:text-green-400 transition-colors" />
              </motion.a>
            </div>
          </div>
          
          {/* Mentions légales */}
          <div className="pt-4 border-t border-[#1e1e2e] text-center">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600">
              <a href="#" className="hover:text-gray-400 transition-colors">Mentions Légales</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-400 transition-colors">Politique de Confidentialité</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-400 transition-colors">CGU</a>
            </div>
            <p className="text-xs text-gray-700 mt-2">
              Hébergé par VPS - Développé avec ❤️ par Bruno Bondron
            </p>
          </div>
        </div>
      </footer>

      {/* AI Chatbot - Powered by Ollama (100% Free) */}
      <ChatBot />
    </div>
  )
}
