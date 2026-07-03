import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { GiSpiderWeb } from 'react-icons/gi'
import { FaRegCircle } from 'react-icons/fa'

const facts = [
  { icon: '🕷', label: 'Origin',    text: 'A radioactive spider bite changed everything — granting abilities beyond human limits.' },
  { icon: '🧪', label: 'Science',   text: 'Genius-level intellect in physics, chemistry, and engineering. Self-made web-shooters.' },
  { icon: '🌆', label: 'City',      text: 'Sworn protector of New York City — every borough, every street, every rooftop.' },
  { icon: '⚖️', label: 'Code',      text: 'With great power comes great responsibility. A principle lived, not just spoken.' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: .18 } }
}
const item = {
  hidden: { opacity:0, x:-40 },
  show:   { opacity:1, x:0, transition:{ duration:.7, ease:'easeOut' } }
}

export default function AboutSection() {
  const ref   = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-100px' })

  return (
    <section id="about" ref={ref} className="section about-section">
      <div className="section-inner">

        {/* Left — text */}
        <motion.div className="about-text"
          initial={{ opacity:0, x:-60 }}
          animate={inView ? { opacity:1, x:0 } : {}}
          transition={{ duration:.9, ease:'easeOut' }}>

          <span className="section-label"><GiSpiderWeb className="inline mr-2" />Origin Story</span>
          <h2 className="section-title">From Ordinary<br/><span className="text-red">To Extraordinary</span></h2>
          <p className="section-body">
            Peter Parker — a brilliant, unassuming teenager — had his life transformed
            by a single moment. Now he carries a double life: student by day,
            protector of the city by night.
          </p>
          <p className="section-body mt-4">
            But being a hero means sacrifice. Every choice matters. Every second counts.
            The city's fate balances on a single strand of web.
          </p>

          <motion.a href="#powers" className="btn-primary inline-block mt-8"
            whileHover={{ scale:1.04 }} whileTap={{ scale:.97 }}>
            See His Powers →
          </motion.a>
        </motion.div>

        {/* Right — fact cards */}
        <motion.div className="about-facts"
          variants={container} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          {facts.map(f => (
            <motion.div key={f.label} className="fact-card" variants={item}
              whileHover={{ y:-4, boxShadow:'0 8px 32px rgba(230,36,41,.25)' }}>
              <span className="fact-icon">{f.icon}</span>
              <div>
                <h4 className="fact-label">{f.label}</h4>
                <p className="fact-text">{f.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
