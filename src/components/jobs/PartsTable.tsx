import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '../../lib/format'
import type { JobEquipmentItem } from '../../types/procurement'
import StatusBadge from '../dashboard/StatusBadge'

interface PartsTableProps {
  items: JobEquipmentItem[]
  selectedIds: number[]
  onToggle: (id: number) => void
  onToggleAll: (checked: boolean) => void
  onEdit: (item: JobEquipmentItem) => void
  onDelete: (item: JobEquipmentItem) => void
}

export default function PartsTable({
  items,
  selectedIds,
  onToggle,
  onToggleAll,
  onEdit,
  onDelete,
}: PartsTableProps) {
  const allSelected = items.length > 0 && items.every((item) => selectedIds.includes(item.id))

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
          <tr>
            <th className="px-3 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(event) => onToggleAll(event.target.checked)}
                aria-label="เลือกอะไหล่ทั้งหมด"
              />
            </th>
            <th className="px-3 py-3 font-medium">Part No</th>
            <th className="px-3 py-3 font-medium">ชื่อ / สเปก (Specifications)</th>
            <th className="px-3 py-3 text-right font-medium">QTY</th>
            <th className="px-3 py-3 text-right font-medium">ราคา (Price)</th>
            <th className="px-3 py-3 font-medium">สถานะ</th>
            <th className="px-3 py-3 text-right font-medium">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-3 py-8 text-center text-slate-400">
                ยังไม่มีอะไหล่ในจ๊อบนี้ — กดเพิ่มอะไหล่
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80">
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggle(item.id)}
                    aria-label={`เลือก ${item.partNo}`}
                  />
                </td>
                <td className="px-3 py-3 font-medium whitespace-nowrap text-slate-800">{item.partNo}</td>
                <td className="max-w-xs px-3 py-3 text-slate-600">
                  <p>{item.mnsPartNo}</p>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </td>
                <td className="px-3 py-3 text-right tabular-nums">{item.qty}</td>
                <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-teal-700"
                      aria-label={`แก้ไข ${item.partNo}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                      aria-label={`ลบ ${item.partNo}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
