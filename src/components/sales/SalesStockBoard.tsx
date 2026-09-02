import { LayoutGrid, Plus, Search, Table2, Tag, Trash2, TriangleAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatCurrency } from '../../lib/format'
import type { InventoryItem, SalesStockItem } from '../../types/procurement'
import StatusBadge from '../dashboard/StatusBadge'

interface SalesStockBoardProps {
  inventory: InventoryItem[]
  salesItems: SalesStockItem[]
  canEdit?: boolean
  onAdd: (sku: string, sellPrice: number) => void
  onUpdate: (sku: string, patch: Partial<SalesStockItem>) => void
  onRemove: (sku: string) => void
}

type StockFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
type ViewMode = 'cards' | 'table'

function stockStatus(qty: number, minStock: number): StockFilter {
  if (qty <= 0) return 'out_of_stock'
  if (qty <= minStock) return 'low_stock'
  return 'in_stock'
}

function marginPct(cost: number, sell: number) {
  if (cost <= 0) return sell > 0 ? 100 : 0
  return Math.round(((sell - cost) / cost) * 100)
}

export default function SalesStockBoard({
  inventory,
  salesItems,
  canEdit = true,
  onAdd,
  onUpdate,
  onRemove,
}: SalesStockBoardProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<StockFilter>('all')
  const [view, setView] = useState<ViewMode>('cards')
  const [addSku, setAddSku] = useState('')
  const [addPrice, setAddPrice] = useState('')

  const catalog = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return salesItems
      .map((sale) => {
        const stock = inventory.find((item) => item.sku === sale.sku)
        const qty = stock?.currentStock ?? 0
        const status = stockStatus(qty, stock?.minStock ?? 0)
        return { sale, stock, qty, status }
      })
      .filter((row) => {
        if (filter !== 'all' && row.status !== filter) return false
        if (!needle) return true
        const haystack = `${row.sale.sku} ${row.stock?.partNo ?? ''} ${row.stock?.description ?? ''} ${row.sale.note ?? ''}`.toLowerCase()
        return haystack.includes(needle)
      })
  }, [salesItems, inventory, query, filter])

  const availableToAdd = inventory.filter((item) => !salesItems.some((sale) => sale.sku === item.sku))
  const totalQty = catalog.reduce((sum, row) => sum + row.qty, 0)
  const sellValue = catalog.reduce((sum, row) => sum + row.qty * row.sale.sellPrice, 0)
  const lowCount = catalog.filter((row) => row.status !== 'in_stock').length

  function handleAdd() {
    if (!addSku) return
    const stock = inventory.find((item) => item.sku === addSku)
    const price = Number(addPrice) || Math.round((stock?.unitPrice ?? 0) * 1.4)
    onAdd(addSku, price)
    setAddSku('')
    setAddPrice('')
  }

  return (
    <section id="sales-stock" className="scroll-mt-24 space-y-4">
      <div>
        <p className="text-xs font-medium tracking-wide text-sky-700 uppercase">Sales · Catalog</p>
        <h2 className="mt-1 flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900">
          <Tag className="h-5 w-5 text-sky-600" />
          สต็อกที่ต้องการขาย
        </h2>
        <p className="mt-1 text-sm text-slate-500">เลือกสินค้าจากคลังมาขาย ตั้งราคา และดูคงเหลือแบบเรียลไทม์จากคลัง</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm">
          <p className="text-xs text-slate-500">รายการพร้อมขาย</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{catalog.length}</p>
        </article>
        <article className="rounded-2xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm">
          <p className="text-xs text-slate-500">จำนวนในคลังรวม</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{totalQty}</p>
        </article>
        <article className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-4 shadow-sm">
          <p className="text-xs text-emerald-700">มูลค่าตามราคาขาย</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-900">{formatCurrency(sellValue)}</p>
        </article>
        <article className="rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-4 shadow-sm">
          <p className="flex items-center gap-1 text-xs text-rose-700">
            <TriangleAlert className="h-3.5 w-3.5" />
            ต่ำ / หมด
          </p>
          <p className="mt-1 text-2xl font-semibold text-rose-900">{lowCount}</p>
        </article>
      </div>

      {canEdit ? (
        <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/50 p-4">
          <p className="mb-3 text-xs font-semibold tracking-wide text-sky-800 uppercase">เพิ่มสินค้าจากคลัง</p>
          <div className="flex flex-wrap items-end gap-3">
            <label className="min-w-[240px] flex-1 text-xs font-medium text-slate-600">
              สินค้าในคลัง
              <select
                value={addSku}
                onChange={(event) => {
                  const sku = event.target.value
                  setAddSku(sku)
                  const stock = inventory.find((item) => item.sku === sku)
                  setAddPrice(stock ? String(Math.round(stock.unitPrice * 1.4)) : '')
                }}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
              >
                <option value="">เลือกสินค้าในคลัง...</option>
                {availableToAdd.map((item) => (
                  <option key={item.sku} value={item.sku}>
                    {item.partNo} · คงเหลือ {item.currentStock} {item.unit} · {item.location}
                  </option>
                ))}
              </select>
            </label>
            <label className="w-36 text-xs font-medium text-slate-600">
              ราคาขาย
              <input
                type="number"
                min={0}
                value={addPrice}
                onChange={(event) => setAddPrice(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
              />
            </label>
            <button
              type="button"
              disabled={!addSku}
              onClick={handleAdd}
              className="inline-flex items-center gap-1 rounded-full bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-500"
            >
              <Plus className="h-4 w-4" />
              ใส่รายการขาย
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <label className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหา Part No / รายละเอียด / SKU..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-9 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
          />
        </label>
        <div className="flex flex-wrap rounded-full bg-slate-100 p-1 text-xs font-medium">
          {(
            [
              ['all', 'ทั้งหมด'],
              ['in_stock', 'มีของ'],
              ['low_stock', 'สต็อกต่ำ'],
              ['out_of_stock', 'หมด'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded-full px-3 py-1.5 ${filter === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl border border-slate-200 p-1">
          <button
            type="button"
            onClick={() => setView('cards')}
            className={`rounded-lg p-1.5 ${view === 'cards' ? 'bg-sky-50 text-sky-700' : 'text-slate-400'}`}
            aria-label="มุมมองการ์ด"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView('table')}
            className={`rounded-lg p-1.5 ${view === 'table' ? 'bg-sky-50 text-sky-700' : 'text-slate-400'}`}
            aria-label="มุมมองตาราง"
          >
            <Table2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {catalog.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-400">
          ยังไม่มีสินค้าในรายการขาย
        </div>
      ) : view === 'cards' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {catalog.map(({ sale, stock, qty, status }) => {
            const cost = stock?.unitPrice ?? 0
            const margin = marginPct(cost, sale.sellPrice)
            const cap = Math.max(stock?.minStock ?? 1, qty, 1)
            const fill = Math.min(100, Math.round((qty / (cap * 1.5 || 1)) * 100))
            return (
              <article
                key={sale.sku}
                className={`rounded-2xl border bg-white p-5 shadow-sm ${
                  status === 'out_of_stock'
                    ? 'border-rose-200'
                    : status === 'low_stock'
                      ? 'border-amber-200'
                      : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{stock?.partNo ?? sale.sku}</p>
                    <p className="mt-1 text-xs text-slate-500">{stock?.description ?? sale.sku}</p>
                  </div>
                  <StatusBadge status={status} />
                </div>
                {sale.note ? <p className="mt-2 rounded-lg bg-sky-50 px-2 py-1 text-[11px] text-sky-800">{sale.note}</p> : null}

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>
                      คงเหลือ {qty} {stock?.unit ?? ''}
                    </span>
                    <span>ขั้นต่ำ {stock?.minStock ?? 0}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        status === 'out_of_stock' ? 'bg-rose-400' : status === 'low_stock' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.max(fill, qty > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">ชั้นวาง {stock?.location ?? '-'}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-400">ต้นทุน</p>
                    <p className="mt-0.5 font-medium tabular-nums">{formatCurrency(cost)}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="text-[11px] text-emerald-700">กำไรขั้นต้น</p>
                    <p className={`mt-0.5 font-semibold ${margin < 0 ? 'text-rose-600' : 'text-emerald-800'}`}>{margin}%</p>
                  </div>
                </div>

                <div className="mt-4 flex items-end gap-2">
                  <label className="flex-1 text-xs font-medium text-slate-500">
                    ราคาขาย
                    {canEdit ? (
                      <input
                        type="number"
                        min={0}
                        value={sale.sellPrice}
                        onChange={(event) => onUpdate(sale.sku, { sellPrice: Number(event.target.value) || 0 })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold tabular-nums"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-semibold">{formatCurrency(sale.sellPrice)}</p>
                    )}
                  </label>
                  <label className="w-20 text-xs font-medium text-slate-500">
                    ขั้นต่ำขาย
                    {canEdit ? (
                      <input
                        type="number"
                        min={1}
                        value={sale.minSellQty}
                        onChange={(event) => onUpdate(sale.sku, { minSellQty: Number(event.target.value) || 1 })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-2 py-2 text-sm tabular-nums"
                      />
                    ) : (
                      <p className="mt-1 text-sm">{sale.minSellQty}</p>
                    )}
                  </label>
                  {canEdit ? (
                    <button
                      type="button"
                      onClick={() => onRemove(sale.sku)}
                      className="mb-0.5 rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-700"
                      aria-label="นำออกจากรายการขาย"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">สินค้า</th>
                  <th className="px-4 py-3 text-right font-medium">คงเหลือ</th>
                  <th className="px-4 py-3 text-right font-medium">ต้นทุน</th>
                  <th className="px-4 py-3 text-right font-medium">ราคาขาย</th>
                  <th className="px-4 py-3 text-right font-medium">มาร์จิ้น</th>
                  <th className="px-4 py-3 font-medium">สถานะ</th>
                  {canEdit ? <th className="px-4 py-3 text-right font-medium">จัดการ</th> : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {catalog.map(({ sale, stock, qty, status }) => {
                  const cost = stock?.unitPrice ?? 0
                  const margin = marginPct(cost, sale.sellPrice)
                  return (
                    <tr key={sale.sku} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{stock?.partNo ?? sale.sku}</p>
                        <p className="text-xs text-slate-400">{stock?.description ?? sale.sku}</p>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {qty} {stock?.unit ?? ''}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-500">{formatCurrency(cost)}</td>
                      <td className="px-4 py-3 text-right">
                        {canEdit ? (
                          <input
                            type="number"
                            min={0}
                            value={sale.sellPrice}
                            onChange={(event) => onUpdate(sale.sku, { sellPrice: Number(event.target.value) || 0 })}
                            className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-right text-sm"
                          />
                        ) : (
                          <span className="tabular-nums">{formatCurrency(sale.sellPrice)}</span>
                        )}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${margin < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {margin}%
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={status} />
                      </td>
                      {canEdit ? (
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => onRemove(sale.sku)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
