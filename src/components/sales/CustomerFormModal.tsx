import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Customer } from '../../types/procurement'

interface CustomerFormModalProps {
  open: boolean
  initial?: Customer
  onClose: () => void
  onSubmit: (customer: Omit<Customer, 'id'> & { id?: string }) => void
}

const empty: Omit<Customer, 'id'> = {
  code: '',
  name: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  taxId: '',
  creditTermDays: 30,
  active: true,
}

const fieldClass =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20'

export default function CustomerFormModal({ open, initial, onClose, onSubmit }: CustomerFormModalProps) {
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      return
    }

    setForm(
      initial
        ? {
            code: initial.code,
            name: initial.name,
            contactPerson: initial.contactPerson,
            phone: initial.phone,
            email: initial.email,
            address: initial.address,
            taxId: initial.taxId,
            creditTermDays: initial.creditTermDays,
            active: initial.active,
          }
        : empty,
    )
    setError('')
  }, [open, initial])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <form
        className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
        onSubmit={(event) => {
          event.preventDefault()
          if (!form.name.trim() || !form.contactPerson.trim() || !form.phone.trim()) {
            setError('กรุณากรอกชื่อลูกค้า, ผู้ติดต่อ และโทรศัพท์')
            return
          }
          onSubmit({ ...form, id: initial?.id })
        }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-sky-700 uppercase">Customer</p>
            <h3 className="text-base font-semibold text-slate-900">{initial ? 'แก้ไขลูกค้า' : 'เพิ่มลูกค้าใหม่'}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="ปิด">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
          <label className="text-xs font-medium text-slate-600">
            รหัสลูกค้า
            <input
              value={form.code}
              onChange={(event) => setForm({ ...form, code: event.target.value })}
              className={fieldClass}
              placeholder="C-2026-005"
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            เครดิต (วัน)
            <input
              type="number"
              min={0}
              value={form.creditTermDays}
              onChange={(event) => setForm({ ...form, creditTermDays: Number(event.target.value) || 0 })}
              className={fieldClass}
            />
          </label>
          <label className="text-xs font-medium text-slate-600 sm:col-span-2">
            ชื่อลูกค้า
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className={fieldClass}
              placeholder="บจก. ..."
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            ผู้ติดต่อ
            <input
              value={form.contactPerson}
              onChange={(event) => setForm({ ...form, contactPerson: event.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            โทรศัพท์
            <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={fieldClass} />
          </label>
          <label className="text-xs font-medium text-slate-600 sm:col-span-2">
            อีเมล
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="text-xs font-medium text-slate-600 sm:col-span-2">
            ที่อยู่
            <textarea
              rows={2}
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="text-xs font-medium text-slate-600 sm:col-span-2">
            เลขผู้เสียภาษี
            <input value={form.taxId} onChange={(event) => setForm({ ...form, taxId: event.target.value })} className={fieldClass} />
          </label>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <span
              className={`relative h-6 w-11 cursor-pointer rounded-full transition ${form.active ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={form.active}
                onChange={(event) => setForm({ ...form, active: event.target.checked })}
              />
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${form.active ? 'translate-x-5' : ''}`}
              />
            </span>
            ใช้งานได้
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
              ยกเลิก
            </button>
            <button type="submit" className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
              บันทึก
            </button>
          </div>
        </div>
        {error ? <p className="px-6 pb-4 text-xs text-rose-600">{error}</p> : null}
      </form>
    </div>
  )
}
