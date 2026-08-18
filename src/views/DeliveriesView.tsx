import { CheckCircle, Package, Truck } from 'lucide-react'
import StatusBadge from '../components/dashboard/StatusBadge'
import { formatCurrency, formatDate, isOverdue } from '../lib/format'
import type { PendingDelivery, PurchaseOrder } from '../types/procurement'

interface DeliveriesViewProps {
  purchaseOrders: PurchaseOrder[]
  pendingDeliveries: PendingDelivery[]
  onMarkDelivered: (poNumber: string) => void
}

export default function DeliveriesView({
  purchaseOrders,
  pendingDeliveries,
  onMarkDelivered,
}: DeliveriesViewProps) {
  const sentPOs = purchaseOrders.filter((po) => po.stage === 'sent_to_vendor')

  const totalValue = sentPOs.reduce((sum, po) => sum + po.amount, 0)
  const overdueCount = sentPOs.filter((po) => {
    const delivery = pendingDeliveries.find((d) => d.poNumber === po.poNumber)
    return delivery ? isOverdue(delivery.expectedDate) : false
  }).length

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1 bg-sky-500" />
          <div className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-sky-50 p-2.5 text-sky-600">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">รอรับของ</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{sentPOs.length}</p>
              <p className="text-xs text-slate-500">ใบสั่งซื้อที่อยู่ระหว่างจัดส่ง</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1 bg-teal-500" />
          <div className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">มูลค่ารวม</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(totalValue)}</p>
              <p className="text-xs text-slate-500">สินค้าระหว่างทาง</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className={`h-1 ${overdueCount > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          <div className="flex items-center gap-4 p-5">
            <div className={`rounded-xl p-2.5 ${overdueCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">เกินกำหนด</p>
              <p className={`mt-1 text-2xl font-bold ${overdueCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {overdueCount}
              </p>
              <p className="text-xs text-slate-500">รายการที่ส่งช้ากว่ากำหนด</p>
            </div>
          </div>
        </div>
      </div>

      {/* POs awaiting delivery */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">ใบสั่งซื้อที่รอรับของ (Sent to Vendor)</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            PO ที่ส่งให้ร้านค้าแล้วและรอการจัดส่งสินค้าเข้าคลัง — กด "รับของ" เพื่อ Stock-In อัตโนมัติ
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">เลขที่ PO</th>
                <th className="px-5 py-3 font-medium">ร้านค้า (Vendor)</th>
                <th className="px-5 py-3 font-medium">รายการสินค้า</th>
                <th className="px-5 py-3 font-medium">วันคาดว่าจะส่ง</th>
                <th className="px-5 py-3 text-right font-medium">มูลค่า</th>
                <th className="px-5 py-3 font-medium">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sentPOs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                    ไม่มี PO ที่รอรับของในขณะนี้
                  </td>
                </tr>
              ) : (
                sentPOs.map((po) => {
                  const delivery = pendingDeliveries.find((d) => d.poNumber === po.poNumber)
                  const overdue = delivery ? isOverdue(delivery.expectedDate) : false

                  return (
                    <tr key={po.poNumber} className={overdue ? 'bg-rose-50/40' : 'hover:bg-slate-50/80'}>
                      <td className="px-5 py-3 font-medium whitespace-nowrap text-slate-800">
                        {po.poNumber}
                      </td>
                      <td className="px-5 py-3 text-slate-700">{po.vendorName}</td>
                      <td className="px-5 py-3 text-slate-600">
                        <p>{po.lines.length} รายการ</p>
                        <p className="text-xs text-slate-400">
                          {po.lines
                            .slice(0, 2)
                            .map((l) => l.partNo)
                            .join(', ')}
                          {po.lines.length > 2 ? ` +${po.lines.length - 2}` : ''}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        {delivery ? (
                          <div>
                            <p className={overdue ? 'font-medium text-rose-700' : 'text-slate-700'}>
                              {formatDate(delivery.expectedDate)}
                            </p>
                            <StatusBadge status={delivery.progress} />
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold whitespace-nowrap text-teal-700">
                        {formatCurrency(po.amount)}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => onMarkDelivered(po.poNumber)}
                          className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
                        >
                          รับของเข้าคลัง
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Additional delivery tracking */}
      {pendingDeliveries.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">ติดตามการจัดส่ง (Delivery Tracking)</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              รายละเอียดสถานะการจัดส่งแยกตาม PO
            </p>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">เลขที่ PO</th>
                  <th className="px-5 py-3 font-medium">รายการสินค้า</th>
                  <th className="px-5 py-3 font-medium">วันที่คาดว่าจะได้รับ</th>
                  <th className="px-5 py-3 font-medium">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3 font-medium whitespace-nowrap text-slate-800">
                      {delivery.poNumber}
                    </td>
                    <td className="px-5 py-3 text-slate-700">{delivery.itemDetails}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                      {formatDate(delivery.expectedDate)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={delivery.progress} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
