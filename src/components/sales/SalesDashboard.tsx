import { ArrowRight, ContactRound, Package, Tag, TriangleAlert, Wallet } from 'lucide-react'
import { formatCurrency } from '../../lib/format'
import { initials } from '../../lib/permissions'
import type { Customer, InventoryItem, SalesStockItem } from '../../types/procurement'

interface SalesDashboardProps {
  customers: Customer[]
  salesItems: SalesStockItem[]
  inventory: InventoryItem[]
}

const AVATAR = ['bg-sky-500', 'bg-violet-500', 'bg-teal-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500']

function avatarColor(name: string) {
  const sum = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR[sum % AVATAR.length]
}

export default function SalesDashboard({ customers, salesItems, inventory }: SalesDashboardProps) {
  const activeCustomers = customers.filter((item) => item.active)
  const catalog = salesItems.map((sale) => {
    const stock = inventory.find((item) => item.sku === sale.sku)
    const qty = stock?.currentStock ?? 0
    const status = qty <= 0 ? 'out' : qty <= (stock?.minStock ?? 0) ? 'low' : 'ok'
    return { sale, stock, qty, status }
  })
  const totalQty = catalog.reduce((sum, row) => sum + row.qty, 0)
  const sellValue = catalog.reduce((sum, row) => sum + row.qty * row.sale.sellPrice, 0)
  const alerts = catalog.filter((row) => row.status !== 'ok')
  const today = new Date().toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const kpis = [
    {
      label: 'ลูกค้าที่ใช้งาน',
      value: String(activeCustomers.length),
      hint: `จากทั้งหมด ${customers.length} ราย`,
      icon: ContactRound,
      tone: 'text-sky-600 bg-sky-50',
    },
    {
      label: 'SKU พร้อมขาย',
      value: String(catalog.length),
      hint: `${totalQty} ชิ้นในคลัง`,
      icon: Tag,
      tone: 'text-violet-600 bg-violet-50',
    },
    {
      label: 'มูลค่าตามราคาขาย',
      value: formatCurrency(sellValue),
      hint: 'คิดจากสต็อกคงเหลือ',
      icon: Wallet,
      tone: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'ต้องเติมสต็อก',
      value: String(alerts.length),
      hint: alerts.length ? 'ต่ำหรือหมด' : 'สต็อกปกติ',
      icon: TriangleAlert,
      tone: 'text-rose-600 bg-rose-50',
    },
  ]

  return (
    <section className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-xl sm:px-8">
        <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-10 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <p className="text-xs font-medium tracking-wide text-sky-200 uppercase">{today}</p>
        <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">พื้นที่ขายวันนี้</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          ดูลูกค้าที่ใช้งาน สต็อกที่ตั้งขาย และรายการที่ต้องเติมของ — ข้อมูลคลังดึงจากคลังจริง
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href="#customers"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-slate-900 hover:bg-sky-50"
          >
            เปิดฐานข้อมูลลูกค้า
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <a
            href="#sales-stock"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white ring-1 ring-white/20 hover:bg-white/15"
          >
            ดูสต็อกสำหรับขาย
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((card) => {
          const Icon = card.icon
          return (
            <article key={card.label} className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <span className={`rounded-xl p-2 ${card.tone}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{card.value}</p>
              <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
            </article>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">ลูกค้าล่าสุด</h3>
            <a href="#customers" className="text-xs font-medium text-sky-700 hover:underline">
              ดูทั้งหมด
            </a>
          </div>
          <ul className="divide-y divide-slate-100">
            {customers.slice(0, 4).map((customer) => (
              <li key={customer.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColor(customer.name)}`}
                >
                  {initials(customer.name.replace(/^บจก\.|^หจก\.\s*/, ''))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{customer.name}</p>
                  <p className="truncate text-xs text-slate-400">
                    {customer.contactPerson} · {customer.phone}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    customer.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {customer.active ? `${customer.creditTermDays} วัน` : 'ระงับ'}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-rose-600" />
            <h3 className="text-sm font-semibold text-slate-900">สินค้าที่ต้องเติม</h3>
          </div>
          {alerts.length === 0 ? (
            <p className="rounded-xl bg-emerald-50 px-3 py-4 text-sm text-emerald-800">สต็อกขายอยู่ในเกณฑ์ปกติ</p>
          ) : (
            <ul className="space-y-2">
              {alerts.slice(0, 5).map((row) => (
                <li key={row.sale.sku} className="rounded-xl bg-rose-50/70 px-3 py-2.5">
                  <p className="text-sm font-medium text-slate-800">{row.stock?.partNo ?? row.sale.sku}</p>
                  <p className="text-xs text-rose-700">
                    คงเหลือ {row.qty} · ขั้นต่ำ {row.stock?.minStock ?? 0} ·{' '}
                    {row.status === 'out' ? 'ของหมด' : 'สต็อกต่ำ'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  )
}
