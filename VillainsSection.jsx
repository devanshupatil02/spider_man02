import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const villains = [
  {
    name: 'Green Goblin',
    alias: 'Norman Osborn',
    threat: 'HIGH',
    desc: 'A brilliant industrialist twisted by an experimental formula. Controls a battle glider and deploys devastating pumpkin bombs.',
    col: '#55bb44',
    icon: '🎃',
  },
  {
    name: 'Doctor Octopus',
    alias: 'Otto Octavius',
    threat: 'HIGH',
    desc: 'A nuclear physicist bonded to four powerful adamantium tentacles. One of Spider-Man\'s most dangerous foes.',
    col: '#cc4444',
    icon: '🐙',
  },
  {
    name: 'Venom',
    alias: 'Eddie Brock',
    threat: 'EXTREME',
    desc: 'An alien symbiote bonded to a vengeful journalist. Knows every secret. Immune to spider-sense.',
    col: '#6633cc',
    icon: '🕸',
  },
  {
    name: 'Electro',
    alias: 'Max Dillon',
    threat: 'HIGH',
    desc: 'Living electricity. Can control and project massive electrical charges. Takes down power grids with ease.',
    col: '#4488ff',
    icon: '⚡',
  },
]

const threatColor = { HIGH:'#e69500', EXTREME:'#e62429' }

export default function VillainsSection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })

  return (
    <section id="villains" ref={ref} className="section villains-section">
      <div className="section-inner section-inner--col">

        <motion.div className="section-header"
          initial={{ opacity:0, y:40 }} animate={inView?{opacity:1,y:0}:{}}
          transition={{ duration:.8 }}>
          <span className="section-label">Rogues Gallery</span>
          <h2 className="section-title text-center">The<span className="text-red"> Enemies</span></h2>
          <p className="section-body text-center max-w-2xl mx-auto">
            Every hero is defined by the foes they face. These are the threats that push Spider-Man to his absolute limits.
          </p>
        </motion.div>

        <div className="villains-grid">
          {villains.map((v, i) => (
            <motion.div key={v.name} className="villain-card"
              initial={{ opacity:0, scale:.88 }}
              animate={inView ? { opacity:1, scale:1 } : {}}
              transition={{ delay:i*.15, duration:.65 }}
              whileHover={{ y:-6, boxShadow:`0 16px 48px ${v.col}44` }}>

              <div className="villain-icon-wrap" style={{ borderColor: v.col+'55', background: v.col+'11' }}>
                <span className="villain-icon">{v.icon}</span>
              </div>

              <div className="villain-body">
                <div className="villain-header">
                  <div>
                    <h3 className="villain-name">{v.name}</h3>
                    <p className="villain-alias">{v.alias}</p>
                  </div>
                  <span className="villain-threat" style={{ color: threatColor[v.threat], borderColor: threatColor[v.threat]+'55' }}>
                    ⚠ {v.threat}
                  </span>
                </div>
                <p className="villain-desc">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
