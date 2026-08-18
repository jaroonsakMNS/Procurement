import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { formatCurrency } from '../../lib/format'
import type { PendingPurchaseItem, Vendor, VendorPriceComparison } from '../../types/procurement'

const SLOTS = ['A', 'B', 'C'] as const
type Slot = (typeof SLOTS)[number]

interface QuoteCell {
  unitPrice: number
  leadDays: number
}

interface VendorComparisonFormProps {
  open: boolean
  parts: PendingPurchaseItem[]
  vendors: Vendor[]
  onClose: () => void
  onGeneratePo: (
    vendorId: string,
    quotedPrices: Record<number, number>,
    comparison: VendorPriceComparison,
  ) => string
}

const inputClass =
  'w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30'

export default function VendorComparisonForm({
  open,
  parts,
  vendors,
  onClose,
  onGeneratePo,
}: VendorComparisonFormProps) {
  const [vendorSlots, setVendorSlots] = useState<Record<Slot, string>>({ A: '', B: '', C: '' })
  const [quotes, setQuotes] = useState<Record<number, Record<Slot, QuoteCell>>>({})
  const [winner, setWinner] = useState<Slot | ''>('')
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  useEffect(() => {
    if (!open) {
      return
    }

    const defaults: Record<Slot, string> = {
      A: vendors[0]?.id ?? '',
      B: vendors[1]?.id ?? '',
      C: vendors[2]?.id ?? '',
    }
    setVendorSlots(defaults)
    setWinner('')
    setError('')
    setResult('')
    setQuotes(
      Object.fromEntries(
        parts.map((part) => [
          part.id,
          {
            A: { unitPrice: part.unitPrice, leadDays: 7 },
            B: { unitPrice: Math.round(part.unitPrice * 1.05), leadDays: 10 },
            C: { unitPrice: Math.round(part.unitPrice * 0.95), leadDays: 14 },
          },
        ]),
      ),
    )
  }, [open, parts, vendors])

  const slotVendors = useMemo(
    () =>
      SLOTS.map((slot) => ({
        slot,
        vendor: vendors.find((item) => item.id === vendorSlots[slot]),
      })),
    [vendorSlots, vendors],
  )

  const totals = useMemo(() => {
    const values: Record<Slot, number> = { A: 0, B: 0, C: 0 }
    for (const part of parts) {
      for (const slot of SLOTS) {
        values[slot] += part.qty * (quotes[part.id]?.[slot]?.unitPrice || 0)
      }
    }
    return values
  }, [parts, quotes])

  const lowestTotal = Math.min(totals.A, totals.B, totals.C)

  const uniqueVendors = new Set(SLOTS.map((slot) => vendorSlots[slot]).filter(Boolean))
  const comparisonReady =
    uniqueVendors.size === 3 &&
    parts.every((part) => SLOTS.every((slot) => (quotes[part.id]?.[slot]?.unitPrice || 0) > 0))

  function lowestSlotForPart(partId: number, qty: number): Slot | null {
    const cells = quotes[partId]
    if (!cells) {
      return null
    }

    let lowest: Slot = 'A'
    let min = qty * (cells.A.unitPrice || Infinity)
    for (const slot of SLOTS) {
      const value = qty * (cells[slot].unitPrice || Infinity)
      if (value < min) {
        min = value
        lowest = slot
      }
    }
    return lowest
  }

  function handleGenerate() {
    if (!comparisonReady) {
      setError('ต้องเลือกร้านค้า 3 รายที่ไม่ซ้ำกัน และกรอกราคาให้ครบทุกชิ้น')
      return
    }

    if (!winner) {
      setError('กรุณาเลือก Winning Vendor ก่อนสร้าง PO')
      return
    }

    const vendorId = vendorSlots[winner]
    const quotedPrices = Object.fromEntries(
      parts.map((part) => [part.id, quotes[part.id][winner].unitPrice]),
    )
    const comparison: VendorPriceComparison = {
      winnerVendorId: vendorId,
      quotes: SLOTS.map((slot) => ({
        vendorId: vendorSlots[slot],
        vendorName: slotVendors.find((item) => item.slot === slot)?.vendor?.name ?? `Vendor ${slot}`,
        total: totals[slot],
        lines: parts.map((part) => ({
          pendingId: part.id,
          unitPrice: quotes[part.id][slot].unitPrice,
          leadDays: quotes[part.id][slot].leadDays,
        })),
      })),
    }
    const message = onGeneratePo(vendorId, quotedPrices, comparison)
    setResult(message)
    setError('')
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 sm:p-8">
      <div className="my-4 w-full max-w-6xl rounded-xl border border-slate-200 bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">ใบเปรียบเทียบราคาสินค้า (Quotation Comparison)</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              ต้องเปรียบเทียบอย่างน้อย 3 ร้านค้า เลือก Winning Vendor แล้วจึงสร้าง PO ได้
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            aria-label="ปิด"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-5 p-5">
          <section className="grid gap-3 md:grid-cols-3">
            {SLOTS.map((slot) => (
              <label key={slot} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-600">
                Vendor {slot}
                <select
                  value={vendorSlots[slot]}
                  onChange={(event) => {
                    setVendorSlots((current) => ({ ...current, [slot]: event.target.value }))
                    setWinner('')
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="">เลือกจากฐานข้อมูลร้านค้า</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
                {slotVendors.find((item) => item.slot === slot)?.vendor ? (
                  <p className="mt-2 font-normal text-slate-500">
                    {slotVendors.find((item) => item.slot === slot)?.vendor?.contactPerson} ·{' '}
                    {slotVendors.find((item) => item.slot === slot)?.vendor?.phone}
                  </p>
                ) : null}
              </label>
            ))}
          </section>

          {uniqueVendors.size > 0 && uniqueVendors.size < 3 ? (
            <p className="text-xs text-rose-600">ต้องเลือกร้านค้า 3 รายที่ไม่ซ้ำกัน</p>
          ) : null}

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-3 py-3 font-medium">รายการอะไหล่</th>
                  <th className="px-3 py-3 text-right font-medium">QTY</th>
                  {SLOTS.map((slot) => (
                    <th key={slot} className="px-3 py-3 font-medium">
                      Vendor {slot}
                      <span className="mt-0.5 block font-normal text-slate-400">
                        {slotVendors.find((item) => item.slot === slot)?.vendor?.name ?? 'ยังไม่เลือก'}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parts.map((part) => {
                  const lowest = lowestSlotForPart(part.id, part.qty)

                  return (
                    <tr key={part.id}>
                      <td className="px-3 py-3">
                        <p className="font-medium text-slate-800">{part.partNo}</p>
                        <p className="text-xs text-slate-500">{part.description}</p>
                        {part.jobId ? <p className="text-[11px] text-slate-400">{part.jobId}</p> : null}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">{part.qty}</td>
                      {SLOTS.map((slot) => {
                        const cell = quotes[part.id]?.[slot]
                        const isLowest = lowest === slot

                        return (
                          <td
                            key={slot}
                            className={`px-3 py-3 ${isLowest ? 'bg-teal-50' : ''}`}
                          >
                            <label className="block text-[11px] text-slate-500">
                              ราคาต่อหน่วย
                              <input
                                type="number"
                                min={0}
                                value={cell?.unitPrice ?? 0}
                                onChange={(event) =>
                                  setQuotes((current) => {
                                    const existing = current[part.id]?.[slot] ?? { unitPrice: 0, leadDays: 0 }
                                    return {
                                      ...current,
                                      [part.id]: {
                                        ...current[part.id],
                                        [slot]: {
                                          ...existing,
                                          unitPrice: Number(event.target.value) || 0,
                                        },
                                      },
                                    }
                                  })
                                }
                                className={inputClass}
                              />
                            </label>
                            <label className="mt-2 block text-[11px] text-slate-500">
                              Lead time (วัน)
                              <input
                                type="number"
                                min={0}
                                value={cell?.leadDays ?? 0}
                                onChange={(event) =>
                                  setQuotes((current) => {
                                    const existing = current[part.id]?.[slot] ?? { unitPrice: 0, leadDays: 0 }
                                    return {
                                      ...current,
                                      [part.id]: {
                                        ...current[part.id],
                                        [slot]: {
                                          ...existing,
                                          leadDays: Number(event.target.value) || 0,
                                        },
                                      },
                                    }
                                  })
                                }
                                className={inputClass}
                              />
                            </label>
                            <p className={`mt-1 text-xs ${isLowest ? 'font-semibold text-teal-700' : 'text-slate-500'}`}>
                              รวม {formatCurrency(part.qty * (cell?.unitPrice || 0))}
                              {isLowest ? ' · ต่ำสุด' : ''}
                            </p>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 text-sm font-semibold">
                  <td className="px-3 py-3" colSpan={2}>
                    รวมทั้งใบเสนอราคา
                  </td>
                  {SLOTS.map((slot) => (
                    <td
                      key={slot}
                      className={`px-3 py-3 ${totals[slot] === lowestTotal && comparisonReady ? 'text-teal-700' : 'text-slate-800'}`}
                    >
                      {formatCurrency(totals[slot])}
                      {totals[slot] === lowestTotal && comparisonReady ? ' · ต่ำสุด' : ''}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          <section className="rounded-xl border border-slate-200 p-4">
            <h4 className="text-sm font-semibold text-slate-900">เลือก Winning Vendor</h4>
            <p className="mt-1 text-xs text-slate-500">ระบบไฮไลต์ราคาต่ำสุดแล้ว แต่ผู้จัดซื้อเป็นผู้เลือกผู้ชนะอย่างเป็นทางการ</p>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {SLOTS.map((slot) => {
                const vendor = slotVendors.find((item) => item.slot === slot)?.vendor
                const disabled = !vendor || !comparisonReady

                return (
                  <label
                    key={slot}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 text-sm ${
                      winner === slot ? 'border-teal-500 bg-teal-50' : 'border-slate-200'
                    } ${disabled ? 'opacity-50' : ''}`}
                  >
                    <input
                      type="radio"
                      name="winning-vendor"
                      disabled={disabled}
                      checked={winner === slot}
                      onChange={() => setWinner(slot)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-medium text-slate-800">
                        Vendor {slot} {vendor?.name ?? ''}
                      </span>
                      <span className="block text-xs text-slate-500">ยอดรวม {formatCurrency(totals[slot])}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {result ? <p className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">{result}</p> : null}

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              ปิด
            </button>
            <button
              type="button"
              disabled={!comparisonReady || !winner}
              onClick={handleGenerate}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              Generate PO
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
