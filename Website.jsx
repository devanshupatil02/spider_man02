import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import Navbar          from './Navbar'
import HeroSection     from './HeroSection'
import AboutSection    from './AboutSection'
import PowersSection   from './PowersSection'
import VillainsSection from './VillainsSection'
import GallerySection  from './GallerySection'
import Footer          from './Footer'
import './Website.css'

export default function Website({ visible, onReplay }) {
  const lenisRef = useRef(null)
  const rafRef   = useRef(null)

  useEffect(() => {
    if (!visible) return

    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })
    lenisRef.current = lenis

    const raf = (time) => {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafRef.current)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [visible])

  return (
    <div className={`website ${visible ? 'website--visible' : ''}`}>
      <Navbar onReplay={onReplay} />
      <HeroSection />
      <AboutSection />
      <PowersSection />
      <VillainsSection />
      <GallerySection />
      <Footer onReplay={onReplay} />
    </div>
  )
}
