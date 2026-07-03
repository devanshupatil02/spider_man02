import { useRef, useCallback } from 'react'

export default function useAudio() {
  const ctxRef   = useRef(null)
  const masterRef = useRef(null)
  const nodesRef  = useRef([])

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current  = new (window.AudioContext || window.webkitAudioContext)()
      const master = ctxRef.current.createGain()
      master.gain.setValueAtTime(0, ctxRef.current.currentTime)
      master.connect(ctxRef.current.destination)
      masterRef.current = master
    }
    return { ctx: ctxRef.current, master: masterRef.current }
  }

  const start = useCallback(() => {
    const { ctx, master } = getCtx()
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setValueAtTime(0, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 2.5)

    // ── Low city drone ──
    const drone = ctx.createOscillator()
    drone.type = 'sawtooth'
    drone.frequency.value = 42
    const dg = ctx.createGain(); dg.gain.value = 0.07
    const df = ctx.createBiquadFilter(); df.type = 'lowpass'; df.frequency.value = 110
    drone.connect(df); df.connect(dg); dg.connect(master)
    drone.start(); nodesRef.current.push(drone)

    // ── Wind noise ──
    const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    const wind = ctx.createBufferSource(); wind.buffer = buf; wind.loop = true
    const wf = ctx.createBiquadFilter(); wf.type = 'bandpass'; wf.frequency.value = 550; wf.Q.value = 0.6
    const wg = ctx.createGain()
    wg.gain.setValueAtTime(0, ctx.currentTime)
    wg.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 4)
    wg.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 10)
    wind.connect(wf); wf.connect(wg); wg.connect(master)
    wind.start(); nodesRef.current.push(wind)

    // ── Rain hiss ──
    const rbuf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate)
    const rd = rbuf.getChannelData(0)
    for (let i = 0; i < rd.length; i++) rd[i] = Math.random() * 2 - 1
    const rain = ctx.createBufferSource(); rain.buffer = rbuf; rain.loop = true
    const rf = ctx.createBiquadFilter(); rf.type = 'highpass'; rf.frequency.value = 3200
    const rg = ctx.createGain()
    rg.gain.setValueAtTime(0, ctx.currentTime)
    rg.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 2)
    rain.connect(rf); rf.connect(rg); rg.connect(master)
    rain.start(); nodesRef.current.push(rain)

    // ── Orchestral pad swells ──
    ;[55, 82.4, 110, 164.8].forEach((freq, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, ctx.currentTime)
      g.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 8 + i * 2.5)
      g.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 16)
      o.connect(g); g.connect(master); o.start(); nodesRef.current.push(o)
    })

    // ── Heartbeat (first 3s) ──
    ;[0.6, 0.9, 1.8, 2.1].forEach(t => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 55
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, ctx.currentTime + t)
      g.gain.linearRampToValueAtTime(0.3, ctx.currentTime + t + 0.04)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3)
      o.connect(g); g.connect(master)
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.35)
    })

    // ── Thunder at 3s ──
    setTimeout(() => thunder(), 3000)

    // ── Tension rise at 15s ──
    setTimeout(() => {
      if (!ctxRef.current) return
      const t2 = ctx.createOscillator(); t2.type = 'triangle'
      t2.frequency.setValueAtTime(110, ctx.currentTime)
      t2.frequency.linearRampToValueAtTime(220, ctx.currentTime + 5)
      const tg = ctx.createGain()
      tg.gain.setValueAtTime(0, ctx.currentTime)
      tg.gain.linearRampToValueAtTime(0.11, ctx.currentTime + 2.5)
      tg.gain.linearRampToValueAtTime(0, ctx.currentTime + 5)
      t2.connect(tg); tg.connect(master)
      t2.start(); t2.stop(ctx.currentTime + 5.5)
    }, 15000)
  }, [])

  const thunder = useCallback(() => {
    if (!ctxRef.current) return
    const ctx = ctxRef.current; const master = masterRef.current
    if (!master) return
    const o = ctx.createOscillator(); o.type = 'sawtooth'
    o.frequency.setValueAtTime(70, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(18, ctx.currentTime + 1.1)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.65, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4)
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 320
    o.connect(f); f.connect(g); g.connect(master)
    o.start(); o.stop(ctx.currentTime + 1.5)
  }, [])

  const stop = useCallback(() => {
    nodesRef.current.forEach(n => { try { n.stop() } catch(_) {} })
    nodesRef.current = []
    if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; masterRef.current = null }
  }, [])

  return { start, stop, thunder }
}
