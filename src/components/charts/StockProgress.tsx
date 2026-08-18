interface StockProgressProps {
  partNo: string
  description: string
  current: number
  min: number
  unit: string
}

export default function StockProgress({
  partNo,
  description,
  current,
  min,
  unit,
}: StockProgressProps) {
  const referenceMax = Math.max(min * 3, 1)
  const percent = Math.min(100, Math.round((current / referenceMax) * 100))

  const isEmpty = current <= 0
  const isLow = !isEmpty && current <= min

  const barColor = isEmpty ? 'bg-rose-500' : isLow ? 'bg-amber-400' : 'bg-teal-500'
  const countColor = isEmpty ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-600'

  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-700">{partNo}</p>
          <p className="truncate text-[10px] text-slate-400">{description}</p>
        </div>
        <p className={`shrink-0 text-xs font-bold tabular-nums ${countColor}`}>
          {current}
          <span className="font-normal text-slate-400">/{min} {unit}</span>
        </p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
