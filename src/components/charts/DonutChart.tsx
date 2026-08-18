interface Segment {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  segments: Segment[]
  centerLabel?: string
  size?: number
  strokeWidth?: number
}

export default function DonutChart({
  segments,
  centerLabel = 'รายการ',
  size = 132,
  strokeWidth = 20,
}: DonutChartProps) {
  const r = (size - strokeWidth) / 2 - 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  const gap = 4

  const total = segments.reduce((sum, s) => sum + s.value, 0)

  if (total === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize={11}>
          ไม่มีข้อมูล
        </text>
      </svg>
    )
  }

  let cumulative = 0
  const slices = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const dash = Math.max(0, (s.value / total) * circumference - gap)
      const dashOffset = circumference / 4 - cumulative
      cumulative += (s.value / total) * circumference
      return { ...s, dash, dashOffset }
    })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((slice, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={slice.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${slice.dash} ${circumference}`}
          strokeDashoffset={slice.dashOffset}
          strokeLinecap="butt"
        />
      ))}
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fill="#0f172a"
        fontSize={22}
        fontWeight={700}
      >
        {total}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" fontSize={10}>
        {centerLabel}
      </text>
    </svg>
  )
}
