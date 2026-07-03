import { useEffect, useRef } from 'react'

export default function CityCanvas({ cameraT }) {
  const canvasRef  = useRef(null)
  const camRef     = useRef(cameraT)
  const cityRef    = useRef(null)
  const rafRef     = useRef(null)

  useEffect(() => { camRef.current = cameraT }, [cameraT])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    const build = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      const W = canvas.width, H = canvas.height

      // 5 depth layers far→near
      const defs = [
        { n: 24, yBase:.68, hMin:.20, hMax:.50, wMin:28, wMax:65,  px:.06, alpha:.35, lit:.35 },
        { n: 20, yBase:.72, hMin:.28, hMax:.58, wMin:36, wMax:80,  px:.15, alpha:.55, lit:.45 },
        { n: 16, yBase:.76, hMin:.38, hMax:.68, wMin:50, wMax:110, px:.28, alpha:.72, lit:.55 },
        { n: 12, yBase:.80, hMin:.48, hMax:.78, wMin:70, wMax:150, px:.48, alpha:.88, lit:.65 },
        { n:  7, yBase:.84, hMin:.58, hMax:.88, wMin:100,wMax:210, px:.72, alpha:1.0, lit:.72 },
      ]

      const layers = defs.map(def => {
        const buildings = []
        let x = -300
        while (x < W + 300) {
          const bW = def.wMin + Math.random() * (def.wMax - def.wMin)
          const bH = (def.hMin + Math.random() * (def.hMax - def.hMin)) * H
          const bY = def.yBase * H - bH
          const wCols = Math.max(1, Math.floor(bW / 11))
          const wRows = Math.max(1, Math.floor(bH / 15))
          const windows = []
          for (let r = 0; r < wRows; r++)
            for (let c = 0; c < wCols; c++)
              if (Math.random() < def.lit)
                windows.push({
                  c, r,
                  col: Math.random()<.12?'#ff5555':Math.random()<.1?'#4499ff':'#ffe87a',
                  on: Math.random() < .88,
                  flicker: Math.random() < .04,
                })
          buildings.push({ x, bW, bH, bY, windows, wCols, wRows })
          x += bW + 2 + Math.random() * 10
        }
        return { ...def, buildings, W, H }
      })

      cityRef.current = layers
    }

    build()
    window.addEventListener('resize', build)

    const lerp = (a, b, t) => Math.round(a + (b - a) * t)

    const draw = () => {
      const t  = camRef.current
      const layers = cityRef.current
      if (!layers) { rafRef.current = requestAnimationFrame(draw); return }
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // ── Sky ──
      const sp = Math.min(t * 1.6, 1)
      const sky = ctx.createLinearGradient(0, 0, 0, H)
      sky.addColorStop(0,   `rgb(${lerp(0,3,sp)},${lerp(0,5,sp)},${lerp(0,18,sp)})`)
      sky.addColorStop(.55, `rgb(${lerp(0,7,sp)},${lerp(0,11,sp)},${lerp(0,38,sp)})`)
      sky.addColorStop(1,   `rgb(${lerp(0,18,sp)},${lerp(0,28,sp)},${lerp(0,75,sp)})`)
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, W, H)

      // ── Stars ──
      if (sp > .2) {
        const starAlpha = Math.min((sp - .2) / .5, 1) * .6
        ctx.fillStyle = `rgba(255,255,255,${starAlpha})`
        for (let i = 0; i < 120; i++) {
          // deterministic positions via cheap hash
          const sx = ((i * 1237 + 499) % W)
          const sy = ((i * 2311 + 137) % (H * .55))
          const sr = .5 + (i % 3) * .4
          ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill()
        }
      }

      // ── Moon ──
      if (sp > .25) {
        const ma = Math.min((sp - .25) / .4, 1) * .95
        const mx = W * .74 - t * W * .09
        const my = H * .16
        ctx.save(); ctx.globalAlpha = ma
        const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 85)
        mg.addColorStop(0, 'rgba(215,228,255,.28)'); mg.addColorStop(1, 'transparent')
        ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, 85, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = '#e8ecf8'; ctx.beginPath(); ctx.arc(mx, my, 26, 0, Math.PI*2); ctx.fill()
        ctx.restore()
      }

      // ── Buildings ──
      layers.forEach(layer => {
        const ox = -t * layer.px * W
        const oy =  t * layer.px * H * .03

        layer.buildings.forEach(b => {
          const bx = b.x + ox
          const by = b.bY + oy

          // body
          const g = ctx.createLinearGradient(bx, by, bx + b.bW, by + b.bH)
          g.addColorStop(0,   `rgba(14,20,44,${layer.alpha})`)
          g.addColorStop(.5,  `rgba(9,14,33,${layer.alpha})`)
          g.addColorStop(1,   `rgba(4,7,20,${layer.alpha})`)
          ctx.fillStyle = g; ctx.fillRect(bx, by, b.bW, b.bH)

          // glass edge
          ctx.strokeStyle = `rgba(45,75,160,${layer.alpha * .35})`
          ctx.lineWidth = .7; ctx.strokeRect(bx, by, b.bW, b.bH)

          // windows
          const cw = b.bW / b.wCols
          const ch = b.bH / b.wRows
          b.windows.forEach(w => {
            if (w.flicker && Math.random() < .003) w.on = !w.on
            if (!w.on) return
            ctx.globalAlpha = layer.alpha * (.45 + Math.random() * .08)
            ctx.fillStyle = w.col
            ctx.fillRect(bx + w.c*cw + cw*.18, by + w.r*ch + ch*.18, cw*.64, ch*.6)
            ctx.globalAlpha = 1
          })
        })
      })

      // ── Road reflections ──
      if (t > .25) {
        const ra = Math.min((t - .25) / .4, 1) * .3
        // street glow puddles
        ;[
          { x: W*.2,  col: 'rgba(255,60,60,'  },
          { x: W*.48, col: 'rgba(60,230,110,'  },
          { x: W*.76, col: 'rgba(255,160,30,'  },
        ].forEach(l => {
          const gr = ctx.createRadialGradient(l.x, H*.97, 0, l.x, H*.97, 70)
          gr.addColorStop(0, l.col + (ra*.7) + ')')
          gr.addColorStop(1, 'transparent')
          ctx.fillStyle = gr
          ctx.fillRect(l.x - 70, H*.88, 140, H*.12)
        })
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', build) }
  }, [])

  return (
    <canvas ref={canvasRef}
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:1 }} />
  )
}
