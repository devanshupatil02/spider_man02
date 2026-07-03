import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import useRain from '../../hooks/useRain'
import WebDecor from './WebDecor'

/* Simple fog plane rendered in Three.js */
function SceneFog() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <Stars
        radius={120}
        depth={55}
        count={3500}
        factor={4}
        saturation={0.25}
        fade
        speed={0.35}
      />
      {/* Dim directional light for atmosphere */}
      <directionalLight position={[0, 5, -10]} intensity={0.08} color="#3355aa" />
    </>
  )
}

export default function HeroSection() {
  const sectionRef = useRef(null)
  const rainRef    = useRef(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useRain(rainRef, { active: true, intensity: 0.85 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const bgY   = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const opac  = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  useEffect(() => {
    const move = (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 16
      const y = (e.clientY / window.innerHeight - 0.5) * 10
      setMouse({ x, y })
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <section id="home" ref={sectionRef} className="hero-section">

      {/* Three.js stars background */}
      <motion.div className="hero-three" style={{ y: bgY }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]}>
          <SceneFog />
        </Canvas>
      </motion.div>

      {/* Rain canvas */}
      <canvas ref={rainRef} className="hero-rain" />

      {/* City gradient + mouse-parallax glow */}
      <motion.div
        className="hero-city-glow"
        style={{
          transform: `perspective(900px) rotateX(${mouse.y * 0.07}deg) rotateY(${mouse.x * 0.07}deg)`,
        }}
      />

      {/* Animated particles overlay */}
      <ParticleLayer />

      {/* Web corner accents */}
      <WebDecor position="top-left" />
      <WebDecor position="top-right" />

      {/* Hero text content */}
      <motion.div className="hero-content" style={{ y: textY, opacity: opac }}>
        <motion.div
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9 }}
        >
          New York City&rsquo;s Greatest Hero
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 1.1, ease: [0.2, 0.8, 0.3, 1] }}
        >
          SPIDER-MAN
        </motion.h1>

        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9 }}
        >
          &ldquo;The city needs hope. Heroes answer the call.&rdquo;
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8 }}
        >
          <motion.a
            href="#about"
            className="btn-primary"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Explore Story
          </motion.a>
          <motion.a
            href="#powers"
            className="btn-ghost"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            See Powers
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll"
        animate={{ y: [0, 9, 0] }}
        transition={{ repeat: Infinity, duration: 1.9 }}
      >
        <div className="hero-scroll-dot" />
        <span>Scroll</span>
      </motion.div>
    </section>
  )
}

/* Floating ambient particles */
function ParticleLayer() {
  const particles = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: `${5 + Math.random() * 90}%`,
    y: `${10 + Math.random() * 80}%`,
    size: 1.5 + Math.random() * 2.5,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 6,
  }))

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', overflow: 'hidden',
    }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: 'rgba(174,214,241,0.55)',
            boxShadow: `0 0 ${p.size * 3}px rgba(174,214,241,0.4)`,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
