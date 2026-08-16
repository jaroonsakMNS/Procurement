import { MoreHorizontal } from 'lucide-react'
import { daysRelativeLabel, formatNeededDate } from '../../lib/format'
import type { JobEquipmentItem } from '../../types/procurement'
import StatusBadge from './StatusBadge'

interface JobOrderedEquipmentProps {
  items: JobEquipmentItem[]
}

export default function JobOrderedEquipment({ items }: JobOrderedEquipmentProps) {
  return (
    <section
      id="job-equipment"
      className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">อุปกรณ์ในจ๊อบที่สั่งซื้อแล้ว</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Job Equipment — อะไหล่ในจ๊อบที่สถานะสั่งซื้อแล้ว (Ordered)
          </p>
        </div>
        <p className="text-xs text-slate-400">{items.length} รายการ</p>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Mns Part No</th>
              <th className="px-4 py-3 font-medium">Part No</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 text-right font-medium">QTY</th>
              <th className="px-4 py-3 text-right font-medium">Store QTY</th>
              <th className="px-4 py-3 font-medium">จำนวนวัน</th>
              <th className="px-4 py-3 font-medium">วันที่ต้องการของ</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 text-right font-medium">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-400">
                  ไม่พบอุปกรณ์ที่ตรงกับการค้นหา
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const relative = daysRelativeLabel(item.neededDate)
                const shortOnStock = item.storeQty < item.qty

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-slate-800">
                      {item.mnsPartNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-700">{item.partNo}</td>
                    <td className="max-w-xs px-4 py-3 text-slate-600">{item.description}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-800">{item.qty}</td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums ${
                        shortOnStock ? 'font-medium text-rose-700' : 'text-slate-800'
                      }`}
                    >
                      {item.storeQty}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${relative.overdue ? 'text-rose-600' : 'text-slate-600'}`}>
                      {relative.text}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                      {formatNeededDate(item.neededDate)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label={`จัดการ ${item.partNo}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
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
  )
}
