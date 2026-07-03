import { motion } from 'framer-motion'
import { GiSpiderWeb } from 'react-icons/gi'
import { FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa'

const links = ['Home', 'About', 'Powers', 'Villains', 'Gallery']

export default function Footer({ onReplay }) {
  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="site-footer">
      <div className="footer-web-line" />

      <div className="footer-inner">

        <motion.div
          className="footer-brand"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <GiSpiderWeb className="footer-logo-icon" />
          <span className="footer-logo-text">
            SPIDER<span className="text-red">-</span>MAN
          </span>
        </motion.div>

        <motion.p
          className="footer-quote"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          &ldquo;With great power comes great responsibility.&rdquo;
        </motion.p>

        <motion.div
          className="footer-links"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          {links.map(l => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="footer-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {l}
            </button>
          ))}
        </motion.div>

        <motion.div
          className="footer-social"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          {[FaGithub, FaTwitter, FaInstagram].map((Icon, i) => (
            <motion.a
              key={i}
              href="#"
              className="social-icon"
              whileHover={{ y: -3, color: '#e62429' }}
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </motion.div>

        {onReplay && (
          <motion.button
            onClick={onReplay}
            className="btn-ghost"
            style={{ fontSize: '.75rem', padding: '.5rem 1.4rem', marginTop: '.4rem' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.7 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            &#8635; Replay Intro
          </motion.button>
        )}

        <p className="footer-copy">
          © 2025 Spider-Man Universe · Fan-made cinematic experience · Not affiliated with Marvel
        </p>
      </div>
    </footer>
  )
}
