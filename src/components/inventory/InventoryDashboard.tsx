import { Warehouse } from 'lucide-react'
import type { InventoryItem } from '../../types/procurement'
import StatusBadge from '../dashboard/StatusBadge'

interface InventoryDashboardProps {
  items: InventoryItem[]
}

export default function InventoryDashboard({ items }: InventoryDashboardProps) {
  const lowStock = items.filter((item) => item.currentStock <= item.minStock).length

  return (
    <section id="inventory" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Warehouse className="h-4 w-4 text-teal-700" />
            ระบบคลังสินค้า (Inventory / Warehouse)
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            ยอดคงเหลือ, จุดสั่งซื้อ, หน่วยนับ และตำแหน่งจัดเก็บ (Shelf/Bin)
          </p>
        </div>
        <p className="text-xs text-rose-600">{lowStock} รายการสต็อกต่ำ</p>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">SKU / Part No</th>
              <th className="px-4 py-3 font-medium">รายละเอียด</th>
              <th className="px-4 py-3 text-right font-medium">Current Stock</th>
              <th className="px-4 py-3 text-right font-medium">Min Stock</th>
              <th className="px-4 py-3 font-medium">หน่วย (UOM)</th>
              <th className="px-4 py-3 font-medium">ตำแหน่ง (Location)</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const status =
                item.currentStock <= 0 ? 'out_of_stock' : item.currentStock <= item.minStock ? 'low_stock' : 'in_stock'

              return (
                <tr key={item.sku} className={status !== 'in_stock' ? 'bg-rose-50/40' : undefined}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{item.partNo}</p>
                    <p className="text-xs text-slate-400">{item.mnsPartNo}</p>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-slate-600">{item.description}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium">{item.currentStock}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-500">{item.minStock}</td>
                  <td className="px-4 py-3 text-slate-600">{item.unit}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{item.location}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
