import { AlertTriangle, BellRing, Clock3, PackageSearch } from 'lucide-react'

export interface AlertFeedItem {
  id: string
  title: string
  detail: string
  level: 'high' | 'medium' | 'info'
  type: 'stock' | 'payment' | 'approval' | 'delivery'
}

interface AlertFeedProps {
  items: AlertFeedItem[]
}

const LEVEL_CLASS = {
  high: 'bg-rose-50 text-rose-700 ring-rose-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
} as const

const TYPE_ICON = {
  stock: AlertTriangle,
  payment: Clock3,
  approval: BellRing,
  delivery: PackageSearch,
} as const

export default function AlertFeed({ items }: AlertFeedProps) {
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
          ไม่มีการแจ้งเตือนเร่งด่วนในขณะนี้
        </p>
      ) : (
        items.map((item) => {
          const Icon = TYPE_ICON[item.type]
          return (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-start gap-3">
                <div className={`rounded-xl p-2 ring-1 ring-inset ${LEVEL_CLASS[item.level]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.detail}</p>
                </div>
              </div>
            </article>
          )
        })
      )}
    </div>
  )
}
