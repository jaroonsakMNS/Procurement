import { LayoutGrid, Mail, MapPin, Pencil, Phone, Plus, Search, Table2, Trash2, ContactRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { initials } from '../../lib/permissions'
import type { Customer } from '../../types/procurement'
import CustomerFormModal from './CustomerFormModal'

interface CustomerDirectoryProps {
  customers: Customer[]
  canEdit?: boolean
  onSave: (customer: Omit<Customer, 'id'> & { id?: string }) => void
  onDelete: (customerId: string) => void
}

const AVATAR = ['bg-sky-500', 'bg-violet-500', 'bg-teal-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500']

function avatarColor(name: string) {
  const sum = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR[sum % AVATAR.length]
}

function companyInitials(name: string) {
  return initials(name.replace(/^บจก\.|^หจก\.\s*/, ''))
}

type StatusFilter = 'all' | 'active' | 'inactive'
type ViewMode = 'cards' | 'table'

export default function CustomerDirectory({ customers, canEdit = true, onSave, onDelete }: CustomerDirectoryProps) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | undefined>()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [view, setView] = useState<ViewMode>('cards')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return customers.filter((item) => {
      if (status === 'active' && !item.active) return false
      if (status === 'inactive' && item.active) return false
      if (!needle) return true
      return [item.code, item.name, item.contactPerson, item.phone, item.email, item.taxId, item.address]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
  }, [customers, query, status])

  const selected = customers.find((item) => item.id === selectedId)
  const activeCount = customers.filter((item) => item.active).length

  function openCreate() {
    setEditing(undefined)
    setOpen(true)
  }

  function openEdit(customer: Customer) {
    setEditing(customer)
    setOpen(true)
  }

  return (
    <section id="customers" className="scroll-mt-24 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-wide text-sky-700 uppercase">Sales · CRM</p>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900">
            <ContactRound className="h-5 w-5 text-sky-600" />
            ฐานข้อมูลลูกค้า
          </h2>
          <p className="mt-1 text-sm text-slate-500">รายชื่อ ข้อมูลติดต่อ เครดิต และสถานะใช้งาน</p>
        </div>
        {canEdit ? (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-sky-700"
          >
            <Plus className="h-4 w-4" />
            เพิ่มลูกค้า
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'ทั้งหมด', value: customers.length, tone: 'bg-white' },
          { label: 'ใช้งาน', value: activeCount, tone: 'bg-emerald-50' },
          { label: 'ระงับ', value: customers.length - activeCount, tone: 'bg-slate-100' },
        ].map((item) => (
          <article key={item.label} className={`rounded-2xl border border-slate-200/80 ${item.tone} px-4 py-3 shadow-sm`}>
            <p className="text-xs text-slate-500">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ค้นหาชื่อ, ผู้ติดต่อ, โทร, รหัส, เลขผู้เสียภาษี..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-9 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
            />
          </label>
          <div className="flex rounded-full bg-slate-100 p-1 text-xs font-medium">
            {(
              [
                ['all', 'ทั้งหมด'],
                ['active', 'ใช้งาน'],
                ['inactive', 'ระงับ'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setStatus(id)}
                className={`rounded-full px-3 py-1.5 ${status === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
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
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-400">
          ไม่พบลูกค้าตามเงื่อนไขที่ค้นหา
        </div>
      ) : view === 'cards' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => setSelectedId(customer.id)}
              className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                selectedId === customer.id ? 'border-sky-400 ring-2 ring-sky-200' : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold text-white ${avatarColor(customer.name)}`}
                  >
                    {companyInitials(customer.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{customer.name}</p>
                    <p className="text-xs text-slate-400">{customer.code}</p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    customer.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {customer.active ? 'ใช้งาน' : 'ระงับ'}
                </span>
              </div>
              <div className="mt-4 space-y-1.5 text-sm text-slate-600">
                <p>{customer.contactPerson}</p>
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone className="h-3.5 w-3.5" />
                  {customer.phone}
                </p>
                <p className="flex items-center gap-1.5 truncate text-xs text-slate-500">
                  <Mail className="h-3.5 w-3.5" />
                  {customer.email || '-'}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>เครดิต {customer.creditTermDays} วัน</span>
                <span className="font-mono">{customer.taxId || '-'}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">ลูกค้า</th>
                  <th className="px-4 py-3 font-medium">ผู้ติดต่อ</th>
                  <th className="px-4 py-3 font-medium">โทร / อีเมล</th>
                  <th className="px-4 py-3 font-medium">เครดิต</th>
                  <th className="px-4 py-3 font-medium">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((customer) => (
                  <tr
                    key={customer.id}
                    className="cursor-pointer hover:bg-sky-50/50"
                    onClick={() => setSelectedId(customer.id)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{customer.name}</p>
                      <p className="text-xs text-slate-400">{customer.code}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{customer.contactPerson}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <p>{customer.phone}</p>
                      <p className="text-xs text-slate-400">{customer.email}</p>
                    </td>
                    <td className="px-4 py-3">{customer.creditTermDays} วัน</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          customer.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {customer.active ? 'ใช้งาน' : 'ระงับ'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40" onClick={() => setSelectedId(null)}>
          <aside
            className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-100 bg-gradient-to-br from-sky-50 to-white px-6 py-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold text-white ${avatarColor(selected.name)}`}
                  >
                    {companyInitials(selected.name)}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{selected.code}</p>
                    <h3 className="text-lg font-semibold text-slate-900">{selected.name}</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
                >
                  ปิด
                </button>
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 text-sm">
              <p className="flex items-start gap-2 text-slate-600">
                <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                <span>
                  {selected.contactPerson}
                  <br />
                  {selected.phone}
                </span>
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" />
                {selected.email || '-'}
              </p>
              <p className="flex items-start gap-2 text-slate-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                {selected.address || '-'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">เครดิต</p>
                  <p className="mt-1 font-semibold">{selected.creditTermDays} วัน</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">เลขผู้เสียภาษี</p>
                  <p className="mt-1 font-mono text-xs font-semibold">{selected.taxId || '-'}</p>
                </div>
              </div>
            </div>
            {canEdit ? (
              <div className="flex gap-2 border-t border-slate-100 px-6 py-4">
                <button
                  type="button"
                  onClick={() => openEdit(selected)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-sky-600 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
                >
                  <Pencil className="h-4 w-4" />
                  แก้ไข
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`ลบลูกค้า ${selected.name}?`)) {
                      onDelete(selected.id)
                      setSelectedId(null)
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-xl border border-rose-200 px-3 py-2.5 text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}

      <CustomerFormModal
        open={open}
        initial={editing}
        onClose={() => setOpen(false)}
        onSubmit={(customer) => {
          onSave(customer)
          setOpen(false)
        }}
      />
    </section>
  )
}
