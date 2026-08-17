import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { formatCurrency } from '../../lib/format'
import type { CartLine, InventoryItem, VendorJob } from '../../types/procurement'
import StatusBadge from '../dashboard/StatusBadge'

interface StoreCatalogProps {
  items: InventoryItem[]
  jobs: VendorJob[]
  onSubmit: (jobId: string, lines: CartLine[]) => string
}

export default function StoreCatalog({ items, jobs, onSubmit }: StoreCatalogProps) {
  const [query, setQuery] = useState('')
  const [jobId, setJobId] = useState(jobs[0]?.jobId ?? '')
  const [cart, setCart] = useState<CartLine[]>([])
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!jobs.some((job) => job.jobId === jobId)) {
      setJobId(jobs[0]?.jobId ?? '')
    }
  }, [jobs, jobId])

  const catalog = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return items.filter(
      (item) =>
        !normalized ||
        item.partNo.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized) ||
        item.mnsPartNo.toLowerCase().includes(normalized),
    )
  }, [items, query])

  function qtyInCart(sku: string) {
    return cart.find((line) => line.sku === sku)?.qty ?? 0
  }

  function setQty(sku: string, qty: number) {
    setCart((current) => {
      if (qty <= 0) {
        return current.filter((line) => line.sku !== sku)
      }

      if (current.some((line) => line.sku === sku)) {
        return current.map((line) => (line.sku === sku ? { ...line, qty } : line))
      }

      return [...current, { sku, qty }]
    })
  }

  return (
    <section id="store" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <ShoppingBag className="h-4 w-4 text-teal-700" />
          ร้านค้าภายใน / เบิกจ่ายอะไหล่ (Internal Store)
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          มีของในคลังจะเบิกเข้าจ๊อบทันที — ของไม่พอจะถูกส่งไปรายการรอจัดซื้ออัตโนมัติ
        </p>
      </header>

      <div className="grid gap-0 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 border-b border-slate-100 lg:border-r lg:border-b-0">
          <div className="px-5 py-3">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ค้นหาอะไหล่ในร้านค้า..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>
          <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2 xl:grid-cols-3">
            {catalog.map((item) => {
              const status =
                item.currentStock <= 0 ? 'out_of_stock' : item.currentStock <= item.minStock ? 'low_stock' : 'in_stock'

              return (
                <article key={item.sku} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-slate-800">{item.partNo}</p>
                    <StatusBadge status={status} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.description}</p>
                  <p className="mt-2 text-sm text-slate-700">
                    คงเหลือ {item.currentStock} {item.unit} · {item.location}
                  </p>
                  <p className="text-xs text-teal-700">{formatCurrency(item.unitPrice)}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setQty(item.sku, qtyInCart(item.sku) - 1)}
                      className="rounded-md border border-slate-200 p-1 text-slate-500 hover:bg-slate-50"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-sm tabular-nums">{qtyInCart(item.sku)}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.sku, qtyInCart(item.sku) + 1)}
                      className="rounded-md border border-slate-200 p-1 text-slate-500 hover:bg-slate-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <aside className="p-5">
          <h3 className="text-sm font-semibold text-slate-900">ตะกร้าเบิกจ่าย (Requisition)</h3>
          <label className="mt-3 block text-xs font-medium text-slate-600">
            จ๊อบที่ต้องการเบิก
            <select
              value={jobId}
              onChange={(event) => setJobId(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {jobs.map((job) => (
                <option key={job.jobId} value={job.jobId}>
                  {job.jobId} — {job.projectName}
                </option>
              ))}
            </select>
          </label>

          <ul className="mt-3 space-y-2">
            {cart.length === 0 ? (
              <li className="text-xs text-slate-400">ยังไม่มีสินค้าในตะกร้า</li>
            ) : (
              cart.map((line) => {
                const item = items.find((entry) => entry.sku === line.sku)
                return (
                  <li key={line.sku} className="flex items-start justify-between gap-2 text-sm">
                    <span>
                      {item?.partNo} × {line.qty}
                    </span>
                    <button type="button" onClick={() => setQty(line.sku, 0)} className="text-slate-400 hover:text-rose-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                )
              })
            )}
          </ul>

          {notice ? <p className="mt-3 rounded-lg bg-teal-50 px-3 py-2 text-xs text-teal-800">{notice}</p> : null}

          <button
            type="button"
            disabled={!jobId || cart.length === 0}
            onClick={() => {
              const message = onSubmit(jobId, cart)
              setNotice(message)
              setCart([])
            }}
            className="mt-4 w-full rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-500"
          >
            ยืนยันเบิกเข้าจ๊อบ
          </button>
        </aside>
      </div>
    </section>
  )
}
