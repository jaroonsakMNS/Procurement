import { useEffect, useState } from 'react'
import type { Vendor } from '../../types/procurement'

interface VendorFormModalProps {
  open: boolean
  initial?: Vendor
  onClose: () => void
  onSubmit: (vendor: Omit<Vendor, 'id'> & { id?: string }) => void
}

const empty: Omit<Vendor, 'id'> = {
  name: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  taxId: '',
}

const fieldClass =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30'

export default function VendorFormModal({ open, initial, onClose, onSubmit }: VendorFormModalProps) {
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      return
    }

    setForm(
      initial
        ? {
            name: initial.name,
            contactPerson: initial.contactPerson,
            phone: initial.phone,
            email: initial.email,
            address: initial.address,
            taxId: initial.taxId,
          }
        : empty,
    )
    setError('')
  }, [open, initial])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">
      <form
        className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl"
        onSubmit={(event) => {
          event.preventDefault()
          if (!form.name.trim() || !form.contactPerson.trim() || !form.phone.trim() || !form.taxId.trim()) {
            setError('กรุณากรอกชื่อร้านค้า, ผู้ติดต่อ, โทรศัพท์ และเลขผู้เสียภาษี')
            return
          }

          onSubmit({ ...form, id: initial?.id })
        }}
      >
        <h3 className="text-sm font-semibold text-slate-900">
          {initial ? 'แก้ไขร้านค้า (Edit Vendor)' : 'เพิ่มร้านค้า (Add Vendor)'}
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-xs font-medium text-slate-600 sm:col-span-2">
            ชื่อร้านค้า (Vendor Name)
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={fieldClass} />
          </label>
          <label className="text-xs font-medium text-slate-600">
            ผู้ติดต่อ (Contact Person)
            <input
              value={form.contactPerson}
              onChange={(event) => setForm({ ...form, contactPerson: event.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            โทรศัพท์ (Phone)
            <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={fieldClass} />
          </label>
          <label className="text-xs font-medium text-slate-600 sm:col-span-2">
            อีเมล (Email)
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="text-xs font-medium text-slate-600 sm:col-span-2">
            ที่อยู่ (Address)
            <textarea
              rows={2}
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="text-xs font-medium text-slate-600 sm:col-span-2">
            เลขผู้เสียภาษี (Tax ID)
            <input value={form.taxId} onChange={(event) => setForm({ ...form, taxId: event.target.value })} className={fieldClass} />
          </label>
        </div>
        {error ? <p className="mt-3 text-xs text-rose-600">{error}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
            ยกเลิก
          </button>
          <button type="submit" className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700">
            บันทึก
          </button>
        </div>
      </form>
    </div>
  )
}
