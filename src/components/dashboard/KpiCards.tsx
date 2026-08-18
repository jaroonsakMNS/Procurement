import { AlertTriangle, Briefcase, FileText, Package, ShoppingCart, Wallet } from 'lucide-react'
import { formatCurrency } from '../../lib/format'
import type { DashboardKpis } from '../../types/procurement'

interface KpiCardsProps {
  kpis: DashboardKpis
}

export default function KpiCards({ kpis }: KpiCardsProps) {
  const cards = [
    {
      label: 'จ๊อบพร้อมเปิด PO',
      hint: 'Jobs ready',
      value: kpis.vendorJobsReady,
      suffix: 'รายการ',
      icon: Briefcase,
      bar: 'bg-teal-500',
      accent: 'bg-teal-50 text-teal-600',
    },
    {
      label: 'รอจัดซื้อ',
      hint: 'Parts pending purchase',
      value: kpis.pendingPurchaseCount,
      suffix: 'รายการ',
      icon: ShoppingCart,
      bar: 'bg-amber-400',
      accent: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'สต็อกต่ำ',
      hint: 'Low stock alerts',
      value: kpis.lowStockCount,
      suffix: 'SKU',
      icon: AlertTriangle,
      bar: 'bg-rose-500',
      accent: 'bg-rose-50 text-rose-600',
    },
    {
      label: 'PO กำลังดำเนินการ',
      hint: 'POs in process',
      value: kpis.posInProcess,
      suffix: 'ใบ',
      icon: FileText,
      bar: 'bg-sky-500',
      accent: 'bg-sky-50 text-sky-600',
    },
    {
      label: 'ยอดค้างชำระ',
      hint: 'Pending payments',
      value: formatCurrency(kpis.pendingPaymentTotal),
      suffix: '',
      icon: Wallet,
      bar: 'bg-orange-500',
      accent: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'รอรับของเข้าคลัง',
      hint: 'Pending deliveries',
      value: kpis.pendingDeliveriesCount,
      suffix: 'รายการ',
      icon: Package,
      bar: 'bg-violet-500',
      accent: 'bg-violet-50 text-violet-600',
    },
  ]

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <article
            key={card.label}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            {/* Coloured accent bar */}
            <div className={`h-1 w-full ${card.bar}`} />

            <div className="p-5">
              {/* Icon + labels row */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase leading-tight tracking-wide text-slate-400">
                    {card.hint}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-slate-800">{card.label}</p>
                </div>
                <div className={`shrink-0 rounded-xl p-2.5 ${card.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              {/* Value */}
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </span>
                {card.suffix ? (
                  <span className="text-sm font-medium text-slate-400">{card.suffix}</span>
                ) : null}
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}
