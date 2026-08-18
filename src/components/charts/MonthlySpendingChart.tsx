import { formatCurrency } from '../../lib/format'

interface SpendingPoint {
  monthLabel: string
  total: number
}

interface MonthlySpendingChartProps {
  points: SpendingPoint[]
}

export default function MonthlySpendingChart({ points }: MonthlySpendingChartProps) {
  const max = Math.max(...points.map((point) => point.total), 1)

  return (
    <div className="space-y-4">
      <div className="flex h-48 items-end gap-3">
        {points.map((point) => {
          const height = `${Math.max(10, Math.round((point.total / max) * 100))}%`
          return (
            <div key={point.monthLabel} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex h-full w-full items-end rounded-xl bg-slate-50 px-2 pb-2">
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-teal-600 to-sky-400"
                  style={{ height }}
                  title={`${point.monthLabel}: ${formatCurrency(point.total)}`}
                />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-medium text-slate-700">{point.monthLabel}</p>
                <p className="text-[10px] text-slate-400">{formatCurrency(point.total)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
