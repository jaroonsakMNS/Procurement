import { useState } from 'react'
import { formatDate, formatDateTime } from '../../lib/format'
import type { GoodsCondition, GoodsReceipt, PendingDelivery, WorkGroupId } from '../../types/procurement'
import ReceiveGoodsModal from './ReceiveGoodsModal'
import StatusBadge from './StatusBadge'

const CONDITION_LABEL: Record<GoodsCondition, string> = {
  complete: 'ครบถ้วน',
  partial: 'รับบางส่วน',
  damaged: 'มีของเสีย/ชำรุด',
}

interface PendingDeliveriesProps {
  deliveries: PendingDelivery[]
  workGroup: WorkGroupId
  canReceive?: boolean
  onReceive: (id: string, receipt: GoodsReceipt) => void
}

function PersonBlock({
  title,
  name,
  meta,
}: {
  title: string
  name: string
  meta: string[]
}) {
  return (
    <div>
      <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">{title}</p>
      <p className="mt-0.5 font-medium text-slate-800">{name}</p>
      {meta.filter(Boolean).map((line) => (
        <p key={line} className="text-[11px] text-slate-500">
          {line}
        </p>
      ))}
    </div>
  )
}

export default function PendingDeliveries({ deliveries, workGroup, canReceive = true, onReceive }: PendingDeliveriesProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeDelivery = deliveries.find((item) => item.id === activeId) ?? null

  return (
    <section
      id="deliveries"
      className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">รอรับของ</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Pending Deliveries — บันทึกผู้รับของและผู้กรอกรายละเอียดทุกครั้งที่รับเข้าคลัง
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-5 py-3 font-medium">เลขที่ PO</th>
              <th className="px-5 py-3 font-medium">รายการสินค้า (Item Details)</th>
              <th className="px-5 py-3 font-medium">วันส่งของคาดการณ์</th>
              <th className="px-5 py-3 font-medium">ผู้รับของ</th>
              <th className="px-5 py-3 font-medium">ผู้บันทึกรายละเอียด</th>
              <th className="px-5 py-3 font-medium">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  ไม่พบรายการที่ตรงกับการค้นหา
                </td>
              </tr>
            ) : (
              deliveries.map((item) => {
                const received = item.progress === 'received'
                const receipt = item.receipt

                return (
                  <tr key={item.id} className="align-top hover:bg-slate-50/80">
                    <td className="px-5 py-3 font-medium whitespace-nowrap text-slate-800">
                      {item.poNumber}
                    </td>
                    <td className="px-5 py-3 text-slate-700">{item.itemDetails}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                      {formatDate(item.expectedDate)}
                    </td>
                    <td className="px-5 py-3">
                      {receipt ? (
                        <PersonBlock
                          title="Receiver"
                          name={receipt.receiver.name}
                          meta={[
                            receipt.receiver.employeeId ? `รหัส ${receipt.receiver.employeeId}` : '',
                            [receipt.receiver.position, receipt.receiver.department].filter(Boolean).join(' · '),
                            receipt.receiver.phone,
                          ]}
                        />
                      ) : (
                        <span className="text-xs text-slate-400">ยังไม่ระบุผู้รับ</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {receipt ? (
                        <PersonBlock
                          title="Recorded by"
                          name={receipt.recordedBy.name}
                          meta={[
                            receipt.recordedBy.workGroupLabel,
                            `บันทึกเมื่อ ${formatDateTime(receipt.receivedAt)}`,
                          ]}
                        />
                      ) : (
                        <span className="text-xs text-slate-400">ยังไม่ได้กรอก</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={received ? 'received' : item.progress} />
                          <button
                            type="button"
                            disabled={received || !canReceive}
                            onClick={() => setActiveId(item.id)}
                            className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                          >
                            {received ? 'รับแล้ว' : 'รับของ (Receive)'}
                          </button>
                        </div>
                        {receipt ? (
                          <div className="max-w-xs text-[11px] leading-relaxed text-slate-500">
                            <p>
                              สภาพ: {CONDITION_LABEL[receipt.condition]}
                              {receipt.qtyNote ? ` · ${receipt.qtyNote}` : ''}
                            </p>
                            {receipt.location ? <p>สถานที่: {receipt.location}</p> : null}
                            {receipt.note ? <p>{receipt.note}</p> : null}
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {activeDelivery ? (
        <ReceiveGoodsModal
          delivery={activeDelivery}
          workGroup={workGroup}
          onClose={() => setActiveId(null)}
          onSubmit={(receipt) => {
            onReceive(activeDelivery.id, receipt)
            setActiveId(null)
          }}
        />
      ) : null}
    </section>
  )
}
