import { useEffect, useRef } from 'react'

export default function useRain(canvasRef, { active = true, intensity = 1 } = {}) {
  const activeRef = useRef(active)
  useEffect(() => { activeRef.current = active }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const drops = []
    const init = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      drops.length = 0
      const count = Math.floor((canvas.width / 12) * intensity)
      for (let i = 0; i < count; i++) {
        drops.push({
          x:   Math.random() * canvas.width,
          y:   Math.random() * canvas.height,
          len: 8 + Math.random() * 20,
          spd: 7 + Math.random() * 11,
          op:  0.12 + Math.random() * 0.3,
          w:   0.4 + Math.random() * 0.9,
        })
      }
    }
    init()
    window.addEventListener('resize', init)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (activeRef.current) {
        drops.forEach(d => {
          ctx.beginPath()
          ctx.moveTo(d.x, d.y)
          ctx.lineTo(d.x - d.len * 0.14, d.y + d.len)
          ctx.strokeStyle = `rgba(174,214,241,${d.op})`
          ctx.lineWidth = d.w
          ctx.stroke()
          d.y += d.spd; d.x -= d.spd * 0.14
          if (d.y > canvas.height + 20) { d.y = -20; d.x = Math.random() * canvas.width }
        })
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init) }
  }, [canvasRef, intensity])
}
