import { formatCurrency } from '../../lib/format'
import type { PoStage, PurchaseOrder } from '../../types/procurement'
import StatusBadge from './StatusBadge'

const STAGES: Array<{ id: PoStage; title: string; hint: string }> = [
  { id: 'draft', title: 'ร่าง', hint: 'Draft' },
  { id: 'pending_approval', title: 'รอผู้จัดการอนุมัติ', hint: 'Pending Manager Approval' },
  { id: 'sent_to_vendor', title: 'ส่งให้ร้านค้า', hint: 'Sent to Vendor' },
  { id: 'delivered', title: 'รับเข้าคลัง', hint: 'Delivered / Goods Receipt' },
]

interface PurchaseOrderBoardProps {
  purchaseOrders: PurchaseOrder[]
  onMarkDelivered: (poNumber: string) => void
}

export default function PurchaseOrderBoard({ purchaseOrders, onMarkDelivered }: PurchaseOrderBoardProps) {
  return (
    <section
      id="purchase-orders"
      className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">กระบวนการเปิดใบสั่งซื้อ (ตามรายการสินค้า)</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Item-based PO — เมื่อสถานะเป็นรับเข้าคลัง ระบบจะ Stock-In อัตโนมัติ
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {STAGES.map((stage) => {
          const items = purchaseOrders.filter((po) => po.stage === stage.id)

          return (
            <div key={stage.id} className="rounded-lg bg-slate-50 p-3">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{stage.title}</p>
                  <p className="text-[11px] text-slate-400">{stage.hint}</p>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                  {items.length}
                </span>
              </div>

              <div className="space-y-2">
                {items.length === 0 ? (
                  <p className="px-1 py-6 text-center text-xs text-slate-400">ไม่มีรายการ</p>
                ) : (
                  items.map((po) => (
                    <article
                      key={po.poNumber}
                      className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800">{po.poNumber}</p>
                        <StatusBadge status={po.stage} />
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{po.vendorName}</p>
                      {po.note ? <p className="mt-1 text-[11px] text-slate-400">{po.note}</p> : null}
                      <p className="mt-1 text-xs text-slate-500">{po.lines.length} รายการสินค้า</p>
                      <ul className="mt-2 space-y-1 text-xs text-slate-500">
                        {po.lines.slice(0, 3).map((line) => (
                          <li key={`${po.poNumber}-${line.partNo}`}>
                            {line.partNo} × {line.qty}
                            {line.jobId ? ` · ${line.jobId}` : ''}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-sm font-medium text-teal-700">{formatCurrency(po.amount)}</p>
                      {po.stage !== 'delivered' ? (
                        <button
                          type="button"
                          onClick={() => onMarkDelivered(po.poNumber)}
                          className="mt-2 w-full rounded-lg bg-teal-50 px-2 py-1.5 text-xs font-medium text-teal-800 hover:bg-teal-100"
                        >
                          รับของเข้าคลัง (Delivered)
                        </button>
                      ) : (
                        <p className="mt-2 text-[11px] text-emerald-700">Goods Receipt บันทึกแล้ว</p>
                      )}
                    </article>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
