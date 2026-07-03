import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { GiSpiderWeb, GiBodyBalance, GiEyeTarget, GiBrain } from 'react-icons/gi'
import { FaBolt } from 'react-icons/fa'
import { MdSensors } from 'react-icons/md'

const powers = [
  {
    icon: <GiSpiderWeb size={36} />,
    name: 'Web-Slinging',
    stat: 98,
    desc: 'Engineered web-shooters capable of holding several tons. Swings at over 90mph through the city grid.',
    color: '#e62429',
  },
  {
    icon: <GiBodyBalance size={36} />,
    name: 'Wall-Crawling',
    stat: 100,
    desc: 'Van der Waals forces on every fingertip. Scales any surface — glass, steel, concrete — effortlessly.',
    color: '#c9a84c',
  },
  {
    icon: <MdSensors size={36} />,
    name: 'Spider-Sense',
    stat: 95,
    desc: 'Precognitive danger detection. Milliseconds of early warning that have saved his life countless times.',
    color: '#4488ff',
  },
  {
    icon: <FaBolt size={36} />,
    name: 'Super Agility',
    stat: 97,
    desc: 'Reflexes 40× faster than the average human. Performs acrobatic feats no trained athlete could match.',
    color: '#44ddaa',
  },
  {
    icon: <GiEyeTarget size={36} />,
    name: 'Enhanced Vision',
    stat: 88,
    desc: 'Night-adapted eyesight, peripheral range beyond normal human limits, tracks micro-movements.',
    color: '#cc44ff',
  },
  {
    icon: <GiBrain size={36} />,
    name: 'Genius Intellect',
    stat: 96,
    desc: 'Mastery of quantum mechanics, organic chemistry, and electrical engineering. Self-taught by 17.',
    color: '#ff9944',
  },
]

const containerV = { hidden:{}, show:{ transition:{ staggerChildren:.12 } } }
const cardV = {
  hidden:{ opacity:0, y:50, scale:.92 },
  show:  { opacity:1, y:0,  scale:1, transition:{ duration:.65, ease:'easeOut' } }
}

function StatBar({ value, color }) {
  return (
    <div className="stat-track">
      <motion.div
        className="stat-fill"
        style={{ background: color }}
        initial={{ width:0 }}
        whileInView={{ width:`${value}%` }}
        viewport={{ once:true }}
        transition={{ duration:1.1, ease:'easeOut', delay:.3 }}
      />
      <span className="stat-value">{value}</span>
    </div>
  )
}

export default function PowersSection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })

  return (
    <section id="powers" ref={ref} className="section powers-section">
      <div className="section-inner section-inner--col">

        <motion.div className="section-header"
          initial={{ opacity:0, y:40 }} animate={inView?{opacity:1,y:0}:{}}
          transition={{ duration:.8 }}>
          <span className="section-label">Abilities</span>
          <h2 className="section-title text-center">Beyond Human<br/><span className="text-red">Capabilities</span></h2>
          <p className="section-body text-center max-w-2xl mx-auto">
            Each ability honed through years of real-world experience. The numbers represent
            peak performance in field conditions.
          </p>
        </motion.div>

        <motion.div className="powers-grid"
          variants={containerV} initial="hidden" animate={inView?'show':'hidden'}>
          {powers.map(p => (
            <motion.div key={p.name} className="power-card"
              variants={cardV}
              whileHover={{ y:-6, boxShadow:`0 12px 40px ${p.color}33` }}>
              <div className="power-icon" style={{ color:p.color }}>{p.icon}</div>
              <h3 className="power-name">{p.name}</h3>
              <p className="power-desc">{p.desc}</p>
              <div className="power-stat-label">
                <span>Power Rating</span>
                <span style={{ color:p.color }}>{p.stat}%</span>
              </div>
              <StatBar value={p.stat} color={p.color} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
