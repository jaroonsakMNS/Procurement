import { ArrowRight } from 'lucide-react'
import DonutChart from '../components/charts/DonutChart'
import StockProgress from '../components/charts/StockProgress'
import KpiCards from '../components/dashboard/KpiCards'
import StatusBadge from '../components/dashboard/StatusBadge'
import { formatCurrency, formatDate, isOverdue } from '../lib/format'
import type {
  DashboardKpis,
  InventoryItem,
  PendingDelivery,
  PendingPayment,
  PendingPurchaseItem,
  PurchaseOrder,
  VendorJob,
} from '../types/procurement'

interface DashboardViewProps {
  kpis: DashboardKpis
  jobs: VendorJob[]
  purchaseOrders: PurchaseOrder[]
  inventory: InventoryItem[]
  pendingItems: PendingPurchaseItem[]
  pendingPayments: PendingPayment[]
  pendingDeliveries: PendingDelivery[]
  paidPoNumbers: string[]
  onNavigate: (view: string) => void
}

const JOB_CHART_SEGMENTS = [
  { label: 'พร้อมเปิด PO', color: '#14b8a6', key: 'ready_for_po' },
  { label: 'เปิด PO แล้ว', color: '#94a3b8', key: 'po_created' },
]

const PO_CHART_SEGMENTS = [
  { label: 'ร่าง', color: '#94a3b8', key: 'draft' },
  { label: 'รอผู้จัดการอนุมัติ', color: '#fbbf24', key: 'pending_approval' },
  { label: 'ส่งให้ร้านค้า', color: '#0ea5e9', key: 'sent_to_vendor' },
  { label: 'รับเข้าคลัง', color: '#10b981', key: 'delivered' },
]

function ChartLegend({ segments }: { segments: Array<{ label: string; color: string; value: number }> }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {segments.map((s) => (
        <li key={s.label} className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-slate-600">{s.label}</span>
          </span>
          <span className="text-xs font-semibold tabular-nums text-slate-800">{s.value}</span>
        </li>
      ))}
    </ul>
  )
}

function SectionHeader({
  title,
  hint,
  viewId,
  onNavigate,
}: {
  title: string
  hint: string
  viewId: string
  onNavigate: (v: string) => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-400">{hint}</p>
      </div>
      <button
        type="button"
        onClick={() => onNavigate(viewId)}
        className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800"
      >
        ดูทั้งหมด <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export default function DashboardView({
  kpis,
  jobs,
  purchaseOrders,
  inventory,
  pendingPayments,
  paidPoNumbers,
  onNavigate,
}: DashboardViewProps) {
  const jobSegments = JOB_CHART_SEGMENTS.map((s) => ({
    ...s,
    value: jobs.filter((j) => j.status === s.key).length,
  }))

  const poSegments = PO_CHART_SEGMENTS.map((s) => ({
    ...s,
    value: purchaseOrders.filter((po) => po.stage === s.key).length,
  }))

  const lowStockItems = inventory
    .filter((item) => item.currentStock <= item.minStock)
    .sort((a, b) => (a.currentStock / Math.max(a.minStock, 1)) - (b.currentStock / Math.max(b.minStock, 1)))
    .slice(0, 6)

  const activePendingPayments = pendingPayments.filter((p) => !paidPoNumbers.includes(p.poNumber))
  const overduePayments = activePendingPayments.filter((p) => isOverdue(p.dueDate))
  const totalOutstanding = activePendingPayments.reduce((sum, p) => sum + p.amount, 0)

  const recentJobs = [...jobs].slice(0, 5)
  const recentOrders = [...purchaseOrders].slice(0, 4)

  return (
    <div className="space-y-6">
      <KpiCards kpis={kpis} />

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

        {/* Job Status Donut */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <SectionHeader title="สถานะจ๊อบ" hint="Job Status Distribution" viewId="jobs" onNavigate={onNavigate} />
          <div className="flex items-center gap-6 px-5 py-5">
            <DonutChart segments={jobSegments} centerLabel="จ๊อบ" />
            <div className="flex-1">
              <ChartLegend segments={jobSegments} />
            </div>
          </div>
        </div>

        {/* PO Pipeline Donut */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <SectionHeader title="ขั้นตอน PO" hint="Purchase Order Pipeline" viewId="po" onNavigate={onNavigate} />
          <div className="flex items-center gap-6 px-5 py-5">
            <DonutChart segments={poSegments} centerLabel="ใบสั่งซื้อ" />
            <div className="flex-1">
              <ChartLegend segments={poSegments} />
            </div>
          </div>
        </div>

        {/* Low Stock Levels */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden md:col-span-2 xl:col-span-1">
          <SectionHeader title="สต็อกที่ต้องจัดซื้อ" hint="Low Stock Alerts" viewId="inventory" onNavigate={onNavigate} />
          <div className="space-y-4 px-5 py-5">
            {lowStockItems.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">สต็อกทุกรายการอยู่ในระดับปลอดภัย</p>
            ) : (
              lowStockItems.map((item) => (
                <StockProgress
                  key={item.sku}
                  partNo={item.partNo}
                  description={item.description}
                  current={item.currentStock}
                  min={item.minStock}
                  unit={item.unit}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent activity row */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* Recent Jobs */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <SectionHeader title="งานล่าสุด" hint="Recent Jobs" viewId="jobs" onNavigate={onNavigate} />
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Job ID</th>
                  <th className="px-5 py-3 text-left font-medium">โครงการ</th>
                  <th className="px-5 py-3 text-left font-medium">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentJobs.map((job) => (
                  <tr key={job.jobId} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium whitespace-nowrap text-slate-800">{job.jobId}</td>
                    <td className="px-5 py-3 text-slate-600 max-w-[200px] truncate">{job.projectName}</td>
                    <td className="px-5 py-3"><StatusBadge status={job.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payments summary + Recent POs */}
        <div className="flex flex-col gap-5">
          {/* Payments alert */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <SectionHeader title="ยอดค้างชำระ" hint="Outstanding Payments" viewId="payments" onNavigate={onNavigate} />
            <div className="grid grid-cols-2 divide-x divide-slate-100 px-0 py-4">
              <div className="px-5">
                <p className="text-xs text-slate-400">ยอดรวมค้างชำระ</p>
                <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">{formatCurrency(totalOutstanding)}</p>
              </div>
              <div className="px-5">
                <p className="text-xs text-slate-400">เกินกำหนด (Overdue)</p>
                <p className={`mt-1 text-xl font-bold tracking-tight ${overduePayments.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                  {overduePayments.length} รายการ
                </p>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {activePendingPayments.slice(0, 3).map((p) => {
                const overdue = isOverdue(p.dueDate)
                return (
                  <div key={p.poNumber} className={`flex items-center justify-between px-5 py-2.5 ${overdue ? 'bg-rose-50/40' : ''}`}>
                    <div>
                      <p className="text-xs font-medium text-slate-800">{p.poNumber}</p>
                      <p className="text-[11px] text-slate-500">{p.vendorName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-800">{formatCurrency(p.amount)}</p>
                      <p className={`text-[11px] ${overdue ? 'text-rose-600' : 'text-slate-400'}`}>{formatDate(p.dueDate)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent POs */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <SectionHeader title="ใบสั่งซื้อล่าสุด" hint="Recent Purchase Orders" viewId="po" onNavigate={onNavigate} />
            <div className="divide-y divide-slate-100">
              {recentOrders.map((po) => (
                <div key={po.poNumber} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{po.poNumber}</p>
                    <p className="text-xs text-slate-500">{po.vendorName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-teal-700">{formatCurrency(po.amount)}</span>
                    <StatusBadge status={po.stage} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
