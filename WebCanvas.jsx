import { useEffect, useRef } from 'react'

export default function WebCanvas({ active, spread }) {
  const canvasRef  = useRef(null)
  const activeRef  = useRef(active)
  const spreadRef  = useRef(spread)
  const spreadProg = useRef(0)
  const strandsRef = useRef([])
  const rafRef     = useRef(null)

  useEffect(() => { activeRef.current = active  }, [active])
  useEffect(() => { spreadRef.current = spread  }, [spread])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    const buildStrands = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      const W = canvas.width, H = canvas.height
      const anchors = [
        {x:W*.04,y:H*.28},{x:W*.18,y:H*.14},{x:W*.33,y:H*.26},{x:W*.50,y:H*.10},
        {x:W*.63,y:H*.20},{x:W*.78,y:H*.16},{x:W*.94,y:H*.28},
        {x:W*.10,y:H*.50},{x:W*.40,y:H*.44},{x:W*.68,y:H*.46},{x:W*.90,y:H*.38},
        {x:W*.25,y:H*.35},{x:W*.55,y:H*.30},{x:W*.82,y:H*.28},
      ]
      const strands = []
      anchors.forEach((a, i) => {
        for (let j = i+1; j < anchors.length; j++) {
          const b = anchors[j]
          const dist = Math.hypot(b.x - a.x, b.y - a.y)
          if (dist < W * .38 && Math.random() < .55) {
            const sag  = dist * (.08 + Math.random() * .1)
            const midX = (a.x + b.x)/2 + (Math.random()-.5) * 40
            const midY = (a.y + b.y)/2 + sag
            strands.push({ a, b, cx: midX, cy: midY, phase: Math.random()*Math.PI*2 })
          }
        }
      })
      strandsRef.current = strands
    }
    buildStrands()
    window.addEventListener('resize', buildStrands)

    const bezierPt = (p0, p1, p2, t) =>
      (1-t)**2*p0 + 2*(1-t)*t*p1 + t**2*p2

    const drawRadialWeb = (W, H, prog) => {
      const cx = W/2, cy = H/2
      const maxR = Math.hypot(W, H) * .65
      const spokes = 18, rings = 12
      ctx.save()
      ctx.globalAlpha = Math.min(prog * 2.2, 1) * .5

      for (let i = 0; i < spokes; i++) {
        const a = (i/spokes)*Math.PI*2
        ctx.beginPath(); ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(a)*maxR*prog, cy + Math.sin(a)*maxR*prog)
        ctx.strokeStyle = 'rgba(210,228,255,.55)'; ctx.lineWidth = .75; ctx.stroke()
      }
      for (let r = 1; r <= rings; r++) {
        const radius = (r/rings)*maxR*prog; if (radius <= 0) continue
        ctx.beginPath()
        for (let i = 0; i <= spokes; i++) {
          const a = (i/spokes)*Math.PI*2
          const px = cx + Math.cos(a)*radius, py = cy + Math.sin(a)*radius
          i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py)
        }
        ctx.closePath(); ctx.strokeStyle='rgba(210,228,255,.45)'; ctx.lineWidth=.6; ctx.stroke()
      }

      if (prog > .55) {
        const fade = (prog - .55) / .45
        ctx.globalAlpha = fade * .85
        ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H)
      }
      ctx.restore()
    }

    const draw = (ts) => {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      if (activeRef.current && strandsRef.current.length) {
        const time = ts * .001
        strandsRef.current.forEach(s => {
          const sway = Math.sin(time * .7 + s.phase) * 5
          const cx   = s.cx + sway, cy = s.cy + sway * .4

          ctx.beginPath()
          ctx.moveTo(s.a.x, s.a.y)
          ctx.quadraticCurveTo(cx, cy, s.b.x, s.b.y)
          ctx.strokeStyle = 'rgba(200,220,255,.22)'
          ctx.lineWidth = .9
          ctx.shadowColor = 'rgba(180,210,255,.25)'; ctx.shadowBlur = 3
          ctx.stroke(); ctx.shadowBlur = 0

          // cross threads
          for (let i=1; i<=4; i++) {
            const ft = i/5
            const sx = bezierPt(s.a.x, cx, s.b.x, ft)
            const sy = bezierPt(s.a.y, cy, s.b.y, ft)
            const ex = bezierPt(s.a.x, cx, s.b.x, ft+.08)
            const ey = bezierPt(s.a.y, cy, s.b.y, ft+.08)
            const drop = 12 + Math.sin(time+ft*8)*5
            ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex+(Math.random()-.5)*3, ey+drop)
            ctx.strokeStyle = 'rgba(200,220,255,.1)'; ctx.lineWidth=.45; ctx.stroke()
          }
        })
      }

      if (spreadRef.current) {
        spreadProg.current = Math.min(spreadProg.current + .014, 1)
        drawRadialWeb(W, H, spreadProg.current)
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', buildStrands) }
  }, [])

  return (
    <canvas ref={canvasRef}
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:10, pointerEvents:'none' }} />
  )
}
