import { useMemo, useState } from 'react'
import { formatCurrency } from '../../lib/format'
import type { PendingPurchaseItem, Vendor, VendorPriceComparison } from '../../types/procurement'
import StatusBadge from '../dashboard/StatusBadge'
import VendorComparisonForm from './VendorComparisonForm'

interface PendingPurchaseBoardProps {
  items: PendingPurchaseItem[]
  vendors: Vendor[]
  onGeneratePo: (
    pendingIds: number[],
    vendorId: string,
    quotedPrices: Record<number, number>,
    comparison: VendorPriceComparison,
  ) => string
}

export default function PendingPurchaseBoard({ items, vendors, onGeneratePo }: PendingPurchaseBoardProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const openItems = items.filter((item) => item.status === 'pending')
  const selectedParts = openItems.filter((item) => selectedIds.includes(item.id))
  const selectedTotal = useMemo(
    () => selectedParts.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
    [selectedParts],
  )

  return (
    <section
      id="pending-purchase"
      className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">รายการรอจัดซื้อ (Parts Pending Purchase)</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            เลือกอะไหล่แล้วต้องเปรียบเทียบราคา 3 ร้านค้าก่อน จึงจะ Generate PO ได้
          </p>
        </div>
      </header>

      <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 px-5 py-3">
        <button
          type="button"
          disabled={selectedIds.length === 0 || vendors.length < 3}
          onClick={() => setCompareOpen(true)}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-500"
        >
          เปรียบเทียบราคา 3 ร้าน (Compare Quotes)
        </button>
        <p className="text-sm text-slate-500">
          เลือก {selectedIds.length} รายการ · {formatCurrency(selectedTotal)}
        </p>
        {vendors.length < 3 ? (
          <p className="text-xs text-rose-600">ต้องมีร้านค้าในฐานข้อมูลอย่างน้อย 3 ราย</p>
        ) : null}
      </div>

      {notice ? <p className="mx-5 mt-3 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">{notice}</p> : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={openItems.length > 0 && openItems.every((item) => selectedIds.includes(item.id))}
                  onChange={(event) =>
                    setSelectedIds(event.target.checked ? openItems.map((item) => item.id) : [])
                  }
                  aria-label="เลือกทั้งหมด"
                />
              </th>
              <th className="px-4 py-3 font-medium">Part No</th>
              <th className="px-4 py-3 font-medium">รายละเอียด</th>
              <th className="px-4 py-3 font-medium">จ๊อบอ้างอิง</th>
              <th className="px-4 py-3 text-right font-medium">QTY</th>
              <th className="px-4 py-3 text-right font-medium">ราคาประมาณ</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  ไม่มีรายการรอจัดซื้อ
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      disabled={item.status !== 'pending'}
                      checked={selectedIds.includes(item.id)}
                      onChange={() =>
                        setSelectedIds((current) =>
                          current.includes(item.id)
                            ? current.filter((id) => id !== item.id)
                            : [...current, item.id],
                        )
                      }
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{item.partNo}</td>
                  <td className="max-w-xs px-4 py-3 text-slate-600">{item.description}</td>
                  <td className="px-4 py-3 text-slate-500">{item.jobId ?? '-'}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{item.qty}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                    {item.poNumber ? <p className="mt-1 text-[11px] text-slate-400">{item.poNumber}</p> : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <VendorComparisonForm
        open={compareOpen}
        parts={selectedParts}
        vendors={vendors}
        onClose={() => setCompareOpen(false)}
        onGeneratePo={(vendorId, quotedPrices, comparison) => {
          const message = onGeneratePo(selectedIds, vendorId, quotedPrices, comparison)
          setNotice(message)
          setSelectedIds([])
          setCompareOpen(false)
          return message
        }}
      />
    </section>
  )
}
