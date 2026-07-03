import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { GiSpiderWeb } from 'react-icons/gi'

const links = ['Home','About','Powers','Villains','Gallery']

export default function Navbar({ onReplay }) {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    setOpen(false)
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--solid' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: .4, duration: .8, ease: 'easeOut' }}
    >
      {/* Logo */}
      <button className="nav-logo" onClick={() => scrollTo('home')}>
        <GiSpiderWeb className="nav-logo-icon" />
        <span>SPIDER<span className="nav-logo-accent">-</span>MAN</span>
      </button>

      {/* Desktop links */}
      <ul className="nav-links">
        {links.map(l => (
          <li key={l}>
            <button className="nav-link" onClick={() => scrollTo(l)}>
              {l}
              <span className="nav-link-line" />
            </button>
          </li>
        ))}
        <li>
          <button className="nav-replay" onClick={onReplay}>↺ Replay Intro</button>
        </li>
      </ul>

      {/* Mobile toggle */}
      <button className="nav-mobile-toggle" onClick={() => setOpen(o => !o)}>
        {open ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div className="nav-mobile-menu"
            initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-20 }} transition={{ duration:.25 }}>
            {links.map(l => (
              <button key={l} className="nav-mobile-link" onClick={() => scrollTo(l)}>{l}</button>
            ))}
            <button className="nav-mobile-link nav-replay" onClick={() => { setOpen(false); onReplay() }}>↺ Replay Intro</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
