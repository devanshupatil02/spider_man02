import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const cards = [
  { title: 'Night Patrol',       sub: 'Manhattan rooftops',   bg: 'linear-gradient(135deg,#0a0f28 0%,#1a2f6e 100%)', accent:'#4488ff', emoji:'🌃' },
  { title: 'The Chase',          sub: 'High-speed pursuit',   bg: 'linear-gradient(135deg,#200505 0%,#6e1a1a 100%)', accent:'#e62429', emoji:'🚔' },
  { title: 'Web Architecture',   sub: 'Engineering precision', bg: 'linear-gradient(135deg,#050a10 0%,#1e3a2a 100%)', accent:'#44ddaa', emoji:'🕸' },
  { title: 'Above the Clouds',   sub: 'Skyline perspective',  bg: 'linear-gradient(135deg,#0a0a20 0%,#3a2a6e 100%)', accent:'#cc44ff', emoji:'☁️' },
  { title: 'The Confrontation',  sub: 'Street level battle',  bg: 'linear-gradient(135deg,#100808 0%,#4a2200 100%)', accent:'#ff9944', emoji:'⚡' },
  { title: 'Dawn Break',         sub: 'Hudson River sunrise',  bg: 'linear-gradient(135deg,#0a0808 0%,#3a1a0a 100%)', accent:'#c9a84c', emoji:'🌅' },
]

function GalleryCard({ card, index }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-60px' })
  const direction = index % 2 === 0 ? -50 : 50

  return (
    <motion.div
      ref={ref}
      className="gallery-card"
      style={{ background: card.bg }}
      initial={{ opacity:0, x:direction, scale:.93 }}
      animate={inView ? { opacity:1, x:0, scale:1 } : {}}
      transition={{ duration:.75, ease:'easeOut' }}
      whileHover={{ scale:1.03, y:-6, boxShadow:`0 20px 60px ${card.accent}44` }}
    >
      <div className="gallery-card-emoji">{card.emoji}</div>
      <div className="gallery-card-body">
        <div className="gallery-card-accent" style={{ background: card.accent }} />
        <h3 className="gallery-card-title">{card.title}</h3>
        <p  className="gallery-card-sub">{card.sub}</p>
      </div>
      <div className="gallery-card-glow" style={{ background: `radial-gradient(ellipse at 50% 120%, ${card.accent}33 0%, transparent 70%)` }} />
    </motion.div>
  )
}

export default function GallerySection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })

  return (
    <section id="gallery" ref={ref} className="section gallery-section">
      <div className="section-inner section-inner--col">

        <motion.div className="section-header"
          initial={{ opacity:0, y:40 }} animate={inView?{opacity:1,y:0}:{}}
          transition={{ duration:.8 }}>
          <span className="section-label">Moments</span>
          <h2 className="section-title text-center">In the<span className="text-red"> Field</span></h2>
          <p className="section-body text-center max-w-xl mx-auto">
            Every night is different. Every mission leaves a mark.
          </p>
        </motion.div>

        <div className="gallery-grid">
          {cards.map((card, i) => (
            <GalleryCard key={card.title} card={card} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
