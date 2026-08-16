import { useState } from 'react'
import { formatDate } from '../../lib/format'
import type { PendingDelivery } from '../../types/procurement'
import StatusBadge from './StatusBadge'

interface PendingDeliveriesProps {
  deliveries: PendingDelivery[]
}

export default function PendingDeliveries({ deliveries }: PendingDeliveriesProps) {
  const [receivedIds, setReceivedIds] = useState<Set<string>>(new Set())

  function handleReceive(id: string) {
    setReceivedIds((current) => new Set(current).add(id))
  }

  return (
    <section
      id="deliveries"
      className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">รอรับของ</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Pending Deliveries — สินค้าที่ซื้อแล้วและรอเข้าคลัง
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-5 py-3 font-medium">เลขที่ PO</th>
              <th className="px-5 py-3 font-medium">รายการสินค้า (Item Details)</th>
              <th className="px-5 py-3 font-medium">วันส่งของคาดการณ์</th>
              <th className="px-5 py-3 font-medium">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                  ไม่พบรายการที่ตรงกับการค้นหา
                </td>
              </tr>
            ) : (
              deliveries.map((item) => {
                const received = receivedIds.has(item.id) || item.progress === 'received'

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3 font-medium whitespace-nowrap text-slate-800">
                      {item.poNumber}
                    </td>
                    <td className="px-5 py-3 text-slate-700">{item.itemDetails}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-600">
                      {formatDate(item.expectedDate)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={received ? 'received' : item.progress} />
                        <button
                          type="button"
                          disabled={received}
                          onClick={() => handleReceive(item.id)}
                          className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                        >
                          {received ? 'รับแล้ว' : 'รับของ (Receive)'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
