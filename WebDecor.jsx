export default function WebDecor({ position }) {
  const isRight = position === 'top-right'
  const spokes = [0,22,45,68,90]
  const rings  = [35,70,105,140,175]

  return (
    <svg
      className={`web-decor web-decor--${position}`}
      viewBox="0 0 200 200"
      fill="none"
      style={isRight ? { transform:'scaleX(-1)' } : {}}
    >
      {spokes.map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        return (
          <line key={i} x1="0" y1="0"
            x2={Math.cos(rad)*200} y2={Math.sin(rad)*200}
            stroke="rgba(200,220,255,.16)" strokeWidth=".7" />
        )
      })}
      {rings.map((r, i) => (
        <path key={i}
          d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`}
          stroke="rgba(200,220,255,.13)" strokeWidth=".6" fill="none" />
      ))}
    </svg>
  )
}
