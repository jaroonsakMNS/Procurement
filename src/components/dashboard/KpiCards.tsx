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
      accent: 'bg-teal-50 text-teal-700',
    },
    {
      label: 'รอจัดซื้อ',
      hint: 'Parts pending purchase',
      value: kpis.pendingPurchaseCount,
      suffix: 'รายการ',
      icon: ShoppingCart,
      accent: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'สต็อกต่ำ',
      hint: 'Low stock alerts',
      value: kpis.lowStockCount,
      suffix: 'SKU',
      icon: AlertTriangle,
      accent: 'bg-rose-50 text-rose-700',
    },
    {
      label: 'PO กำลังดำเนินการ',
      hint: 'POs in process',
      value: kpis.posInProcess,
      suffix: 'ใบ',
      icon: FileText,
      accent: 'bg-sky-50 text-sky-700',
    },
    {
      label: 'ยอดค้างชำระ',
      hint: 'Pending payments',
      value: formatCurrency(kpis.pendingPaymentTotal),
      suffix: '',
      icon: Wallet,
      accent: 'bg-orange-50 text-orange-700',
    },
    {
      label: 'รอรับของเข้าคลัง',
      hint: 'Pending deliveries',
      value: kpis.pendingDeliveriesCount,
      suffix: 'รายการ',
      icon: Package,
      accent: 'bg-violet-50 text-violet-700',
    },
  ]

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <article
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{card.label}</p>
                <p className="mt-0.5 text-xs text-slate-400">{card.hint}</p>
              </div>
              <div className={`rounded-lg p-2 ${card.accent}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
              {card.value}
              {card.suffix ? (
                <span className="ml-1 text-sm font-medium text-slate-400">{card.suffix}</span>
              ) : null}
            </p>
          </article>
        )
      })}
    </section>
  )
}
