import { useState } from 'react'
import { formatCurrency, formatDateTime } from '../../lib/format'
import type {
  GoodsReceipt,
  PoStage,
  ProcessActionLog,
  PurchaseOrder,
  WorkGroupId,
} from '../../types/procurement'
import PoStageActionModal from './PoStageActionModal'
import ReceiveGoodsModal from './ReceiveGoodsModal'
import StatusBadge from './StatusBadge'

const STAGES: Array<{ id: PoStage; title: string; hint: string }> = [
  { id: 'draft', title: 'ร่าง', hint: 'Draft' },
  { id: 'pending_approval', title: 'รอผู้จัดการอนุมัติ', hint: 'Pending Manager Approval' },
  { id: 'sent_to_vendor', title: 'ส่งให้ร้านค้า', hint: 'Sent to Vendor' },
  { id: 'delivered', title: 'รับเข้าคลัง', hint: 'Delivered / Goods Receipt' },
]

interface PurchaseOrderBoardProps {
  purchaseOrders: PurchaseOrder[]
  workGroup: WorkGroupId
  canSubmit?: boolean
  canApprove?: boolean
  canReceive?: boolean
  onSubmitForApproval: (poNumber: string, submitted: ProcessActionLog, created?: ProcessActionLog) => void
  onApprove: (poNumber: string, approved: ProcessActionLog) => void
  onReceive: (poNumber: string, receipt: GoodsReceipt) => void
}

function ActorLine({ label, log }: { label: string; log?: ProcessActionLog }) {
  if (!log) {
    return null
  }

  return (
    <p className="text-[11px] leading-relaxed text-slate-500">
      <span className="font-medium text-slate-600">{label}:</span> {log.actor.name}
      {log.actor.position ? ` · ${log.actor.position}` : ''}
      {log.actor.employeeId ? ` · ${log.actor.employeeId}` : ''}
      <span className="block text-slate-400">
        บันทึกโดย {log.recordedBy.name} ({log.recordedBy.workGroupLabel}) · {formatDateTime(log.at)}
      </span>
      {log.note ? <span className="block">{log.note}</span> : null}
    </p>
  )
}

export default function PurchaseOrderBoard({
  purchaseOrders,
  workGroup,
  canSubmit = true,
  canApprove = true,
  canReceive = true,
  onSubmitForApproval,
  onApprove,
  onReceive,
}: PurchaseOrderBoardProps) {
  const [actionPo, setActionPo] = useState<PurchaseOrder | null>(null)

  return (
    <section
      id="purchase-orders"
      className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">กระบวนการเปิดใบสั่งซื้อ (ตามรายการสินค้า)</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          เดินทีละขั้น — บันทึกผู้จัดทำ, ผู้ขออนุมัติ, ผู้อนุมัติ และผู้รับของทุกครั้ง
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
                        {po.lines.map((line) => (
                          <li key={`${po.poNumber}-${line.partNo}-${line.jobId ?? 'none'}`}>
                            {line.partNo} · {line.description} × {line.qty}
                            {line.jobId ? ` · ${line.jobId}` : ''}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-sm font-medium text-teal-700">{formatCurrency(po.amount)}</p>

                      <div className="mt-2 space-y-1 border-t border-slate-100 pt-2">
                        <ActorLine label="ผู้จัดทำ" log={po.created} />
                        <ActorLine label="ผู้ส่งขออนุมัติ" log={po.submitted} />
                        <ActorLine label="ผู้อนุมัติ" log={po.approved} />
                        {po.receipt ? (
                          <p className="text-[11px] leading-relaxed text-slate-500">
                            <span className="font-medium text-slate-600">ผู้รับของ:</span> {po.receipt.receiver.name}
                            {po.receipt.receiver.position ? ` · ${po.receipt.receiver.position}` : ''}
                            {po.receipt.receiver.employeeId ? ` · ${po.receipt.receiver.employeeId}` : ''}
                            <span className="block text-slate-400">
                              บันทึกโดย {po.receipt.recordedBy.name} ({po.receipt.recordedBy.workGroupLabel}) ·{' '}
                              {formatDateTime(po.receipt.receivedAt)}
                            </span>
                            {po.receipt.qtyNote ? <span className="block">{po.receipt.qtyNote}</span> : null}
                            {po.receipt.location ? <span className="block">สถานที่: {po.receipt.location}</span> : null}
                            {po.receipt.note ? <span className="block">{po.receipt.note}</span> : null}
                          </p>
                        ) : null}
                      </div>

                      {po.stage === 'draft' && canSubmit ? (
                        <button
                          type="button"
                          onClick={() => setActionPo(po)}
                          className="mt-2 w-full rounded-lg bg-amber-50 px-2 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
                        >
                          ส่งขออนุมัติ
                        </button>
                      ) : null}
                      {po.stage === 'pending_approval' && canApprove ? (
                        <button
                          type="button"
                          onClick={() => setActionPo(po)}
                          className="mt-2 w-full rounded-lg bg-sky-50 px-2 py-1.5 text-xs font-medium text-sky-800 hover:bg-sky-100"
                        >
                          อนุมัติและส่งร้านค้า
                        </button>
                      ) : null}
                      {po.stage === 'sent_to_vendor' && canReceive ? (
                        <button
                          type="button"
                          onClick={() => setActionPo(po)}
                          className="mt-2 w-full rounded-lg bg-teal-50 px-2 py-1.5 text-xs font-medium text-teal-800 hover:bg-teal-100"
                        >
                          รับของเข้าคลัง (Delivered)
                        </button>
                      ) : null}
                      {po.stage === 'delivered' ? (
                        <p className="mt-2 text-[11px] text-emerald-700">Goods Receipt บันทึกแล้ว</p>
                      ) : null}
                    </article>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {actionPo?.stage === 'draft' ? (
        <PoStageActionModal
          purchaseOrder={actionPo}
          workGroup={workGroup}
          title="ส่งขออนุมัติใบสั่งซื้อ"
          actorTitle="ผู้ส่งขออนุมัติ"
          actorPosition="เจ้าหน้าที่จัดซื้อ"
          includeCreator={!actionPo.created}
          onClose={() => setActionPo(null)}
          onSubmit={({ actorLog, createdLog }) => {
            onSubmitForApproval(actionPo.poNumber, actorLog, createdLog)
            setActionPo(null)
          }}
        />
      ) : null}

      {actionPo?.stage === 'pending_approval' ? (
        <PoStageActionModal
          purchaseOrder={actionPo}
          workGroup={workGroup}
          title="อนุมัติใบสั่งซื้อและส่งร้านค้า"
          actorTitle="ผู้อนุมัติ"
          actorPosition="ผู้จัดการจัดซื้อ"
          includeCreator={false}
          onClose={() => setActionPo(null)}
          onSubmit={({ actorLog }) => {
            onApprove(actionPo.poNumber, actorLog)
            setActionPo(null)
          }}
        />
      ) : null}

      {actionPo?.stage === 'sent_to_vendor' ? (
        <ReceiveGoodsModal
          delivery={{
            id: actionPo.poNumber,
            poNumber: actionPo.poNumber,
            itemDetails: actionPo.lines
              .map((line) => `${line.partNo} ${line.description} × ${line.qty}`)
              .join(', '),
            expectedDate: new Date().toISOString().slice(0, 10),
            progress: 'ready',
          }}
          workGroup={workGroup}
          onClose={() => setActionPo(null)}
          onSubmit={(receipt) => {
            onReceive(actionPo.poNumber, receipt)
            setActionPo(null)
          }}
        />
      ) : null}
    </section>
  )
}
