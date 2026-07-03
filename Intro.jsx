import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import useAudio from '../../hooks/useAudio'
import useRain  from '../../hooks/useRain'
import CityCanvas from './CityCanvas'
import WebCanvas  from './WebCanvas'
import './Intro.css'

/*
  TIMELINE
  0–1s   : black, heartbeat, wind
  1–2s   : rain starts
  2–3s   : cinematic bars + fog
  3–6s   : lightning + thunder, city skyline, camera fly
  6–10s  : webs vibrate, orchestral builds
  10–14s : camera circles rooftop
  14–18s : wings burst → ULTIMATE → SPIDER-MAN forges in → tagline
  18–20s : web spread + dissolve
  20–22s : overlay fades → homepage
*/

export default function Intro({ onComplete }) {
  const wrapRef     = useRef(null)
  const rainRef     = useRef(null)
  const lightRef    = useRef(null)
  const barTopRef   = useRef(null)
  const barBotRef   = useRef(null)
  const wingsRef    = useRef(null)
  const marvelRef   = useRef(null)
  const ultimateRef = useRef(null)
  const titleRef    = useRef(null)
  const tagRef      = useRef(null)

  const [cameraT,    setCameraT]    = useState(0)
  const [webActive,  setWebActive]  = useState(false)
  const [webSpread,  setWebSpread]  = useState(false)
  const [rainActive, setRainActive] = useState(false)
  const [fogVisible, setFogVisible] = useState(false)

  const { start: startAudio, stop: stopAudio, thunder } = useAudio()
  useRain(rainRef, { active: rainActive, intensity: 1.15 })

  const skip = useCallback(() => {
    gsap.killTweensOf('*')
    stopAudio()
    onComplete()
  }, [stopAudio, onComplete])

  useEffect(() => {
    const timers = []
    const at = (ms, fn) => timers.push(setTimeout(fn, ms))

    at(100,  () => startAudio())
    at(1000, () => setRainActive(true))

    // 2s — bars + fog
    at(2000, () => {
      gsap.to(barTopRef.current, { height: '7vh', duration: 1.2, ease: 'power2.inOut' })
      gsap.to(barBotRef.current, { height: '7vh', duration: 1.2, ease: 'power2.inOut' })
      setFogVisible(true)
    })

    // 3s — double lightning flash
    at(3000, () => {
      thunder()
      gsap.fromTo(lightRef.current, { opacity: 1 }, { opacity: 0, duration: 0.18, ease: 'power2.out' })
    })
    at(3300, () =>
      gsap.fromTo(lightRef.current, { opacity: 0.6 }, { opacity: 0, duration: 0.12 })
    )

    // 3.5s — camera fly (14s travel)
    at(3500, () => {
      const startMs = performance.now()
      const dur = 14000
      const tick = () => {
        const p = Math.min((performance.now() - startMs) / dur, 1)
        const e = p < 0.5 ? 4*p**3 : 1-(-2*p+2)**3/2
        setCameraT(e)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })

    at(6000, () => setWebActive(true))

    // 14s — wings burst in from sides
    at(14000, () => {
      gsap.fromTo(wingsRef.current,
        { opacity: 0, scaleX: 0.2, scaleY: 0.5 },
        { opacity: 1, scaleX: 1,   scaleY: 1, duration: 0.55, ease: 'back.out(1.8)' }
      )
    })

    // 14.4s — MARVEL banner drops in
    at(14400, () => {
      gsap.fromTo(marvelRef.current,
        { opacity: 0, y: -20, scaleX: 0.6 },
        { opacity: 1, y: 0,   scaleX: 1, duration: 0.5, ease: 'back.out(2)' }
      )
    })

    // 14.8s — ULTIMATE slides up
    at(14800, () => {
      gsap.fromTo(ultimateRef.current,
        { opacity: 0, y: 35, scaleX: 0.7 },
        { opacity: 1, y: 0,  scaleX: 1, duration: 0.65, ease: 'back.out(1.6)' }
      )
    })

    // 15.4s — SPIDER-MAN slams in
    at(15400, () => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, scaleX: 0.4, scaleY: 1.5, filter: 'blur(10px)' },
        { opacity: 1, scaleX: 1,   scaleY: 1,   filter: 'blur(0px)',
          duration: 0.9, ease: 'back.out(1.3)' }
      )
    })

    // 16.6s — tagline
    at(16600, () => {
      gsap.fromTo(tagRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0,  duration: 1.4, ease: 'power2.out' }
      )
    })

    // 17.8s — web spread
    at(17800, () => setWebSpread(true))

    // 19.2s — dissolve title stack
    at(19200, () => {
      gsap.to([wingsRef.current, marvelRef.current, ultimateRef.current, titleRef.current, tagRef.current],
        { opacity: 0, y: -20, stagger: 0.06, duration: 0.75, ease: 'power2.in' }
      )
    })

    // 20.5s — fade overlay → homepage
    at(20500, () => {
      gsap.to(wrapRef.current, {
        opacity: 0, duration: 1.4, ease: 'power2.inOut',
        onComplete: () => { stopAudio(); onComplete() },
      })
    })

    return () => {
      timers.forEach(clearTimeout)
      gsap.killTweensOf([
        wrapRef.current, barTopRef.current, barBotRef.current,
        lightRef.current, wingsRef.current, marvelRef.current,
        ultimateRef.current, titleRef.current, tagRef.current,
      ])
    }
  }, [])

  return (
    <div ref={wrapRef} className="intro-wrap">

      {/* Rain */}
      <canvas ref={rainRef} className="intro-canvas" style={{ zIndex: 3 }} />

      {/* City fly-through */}
      <CityCanvas cameraT={cameraT} />

      {/* Web strands */}
      <WebCanvas active={webActive} spread={webSpread} />

      {/* Lightning */}
      <div ref={lightRef} className="intro-lightning" style={{ opacity: 0 }} />

      {/* Fog */}
      <div className={`intro-fog ${fogVisible ? 'intro-fog--on' : ''}`} />

      {/* Cinematic bars */}
      <div ref={barTopRef} className="intro-bar intro-bar-top" />
      <div ref={barBotRef} className="intro-bar intro-bar-bot" />

      {/* Vignette */}
      <div className="intro-vignette" />

      {/* ── Title Card ── */}
      <div className="intro-title-wrap">

        {/* Red geometric wing shapes behind title */}
        <WingSVG ref={wingsRef} />

        {/* MARVEL banner */}
        <div ref={marvelRef} className="intro-marvel-banner" style={{ opacity: 0 }}>
          MARVEL
        </div>

        {/* ULTIMATE */}
        <div ref={ultimateRef} className="intro-ultimate" style={{ opacity: 0 }}>
          ULTIMATE
        </div>

        {/* SPIDER-MAN */}
        <h1 ref={titleRef} className="intro-title" style={{ opacity: 0 }}>
          SPIDER-MAN
        </h1>

        {/* Tagline */}
        <p ref={tagRef} className="intro-tag" style={{ opacity: 0 }}>
          "The city needs hope. Heroes answer the call."
        </p>
      </div>

      {/* Skip */}
      <button className="intro-skip" onClick={skip}>Skip ▶</button>
    </div>
  )
}

/* ── SVG wing shapes — the red geometric wings from the logo ── */
import { forwardRef } from 'react'
const WingSVG = forwardRef(function WingSVG(_, ref) {
  return (
    <svg
      ref={ref}
      className="intro-title-wings"
      viewBox="0 0 900 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      {/* Left wing */}
      <path
        d="M 380 160 L 60 60 L 10 160 L 60 260 Z"
        fill="#e62429"
        opacity="0.85"
      />
      <path
        d="M 380 160 L 100 80 L 55 160 L 100 240 Z"
        fill="#b81c20"
        opacity="0.6"
      />
      {/* Left wing inner accent */}
      <path
        d="M 370 160 L 140 100 L 100 160 L 140 220 Z"
        fill="none"
        stroke="#ff4444"
        strokeWidth="1.5"
        opacity="0.5"
      />
      {/* Left diamond eye */}
      <path d="M 330 160 L 290 130 L 250 160 L 290 190 Z" fill="#e62429" opacity="0.9" />
      <path d="M 325 160 L 290 136 L 255 160 L 290 184 Z" fill="#ff3333" opacity="0.5" />

      {/* Right wing */}
      <path
        d="M 520 160 L 840 60 L 890 160 L 840 260 Z"
        fill="#e62429"
        opacity="0.85"
      />
      <path
        d="M 520 160 L 800 80 L 845 160 L 800 240 Z"
        fill="#b81c20"
        opacity="0.6"
      />
      {/* Right wing inner accent */}
      <path
        d="M 530 160 L 760 100 L 800 160 L 760 220 Z"
        fill="none"
        stroke="#ff4444"
        strokeWidth="1.5"
        opacity="0.5"
      />
      {/* Right diamond eye */}
      <path d="M 570 160 L 610 130 L 650 160 L 610 190 Z" fill="#e62429" opacity="0.9" />
      <path d="M 575 160 L 610 136 L 645 160 L 610 184 Z" fill="#ff3333" opacity="0.5" />

      {/* Center web circle */}
      <circle cx="450" cy="160" r="90" fill="none" stroke="#e62429" strokeWidth="2" opacity="0.4" />
      <circle cx="450" cy="160" r="60" fill="none" stroke="#e62429" strokeWidth="1.5" opacity="0.3" />
      {/* Web spokes */}
      {[0,30,60,90,120,150].map(deg => {
        const rad = (deg * Math.PI) / 180
        return (
          <line key={deg}
            x1={450} y1={160}
            x2={450 + Math.cos(rad) * 90} y2={160 + Math.sin(rad) * 90}
            stroke="#e62429" strokeWidth="1" opacity="0.3"
          />
        )
      })}

      {/* Glow overlay */}
      <ellipse cx="450" cy="160" rx="420" ry="140"
        fill="url(#wingGlow)" opacity="0.35" />
      <defs>
        <radialGradient id="wingGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#e62429" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#e62429" stopOpacity="0"   />
        </radialGradient>
      </defs>
    </svg>
  )
})
