interface MiniSparklineProps {
  data: number[]
  positive?: boolean
  width?: number
  height?: number
}

const MiniSparkline = ({
  data,
  positive = true,
  width = 88,
  height = 36,
}: MiniSparklineProps) => {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const padding = 4
  const innerW = width - padding * 2
  const innerH = height - padding * 2

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * innerW
    const y = padding + innerH - ((v - min) / range) * innerH
    return `${x},${y}`
  })

  const linePath = `M ${points.join(" L ")}`
  const areaPath = `${linePath} L ${padding + innerW},${padding + innerH} L ${padding},${padding + innerH} Z`

  const stroke = positive ? "#00a651" : "#e53935"
  const fill = positive ? "rgba(0, 166, 81, 0.12)" : "rgba(229, 57, 53, 0.1)"

  return (
    <svg
      className="mini-sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
    >
      <path d={areaPath} fill={fill} />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MiniSparkline
