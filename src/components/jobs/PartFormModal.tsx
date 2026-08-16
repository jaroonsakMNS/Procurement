import { useEffect, useState } from 'react'
import type { EquipmentOrderStatus, JobEquipmentItem } from '../../types/procurement'

type PartFormValues = Omit<JobEquipmentItem, 'id' | 'jobId'>

interface PartFormModalProps {
  open: boolean
  title: string
  initial?: JobEquipmentItem
  onClose: () => void
  onSubmit: (values: PartFormValues) => void
}

const emptyForm: PartFormValues = {
  mnsPartNo: '',
  partNo: '',
  description: '',
  qty: 1,
  storeQty: 0,
  neededDate: new Date().toISOString().slice(0, 10),
  unitPrice: 0,
  status: 'pending_order',
}

const fieldClass =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30'

export default function PartFormModal({ open, title, initial, onClose, onSubmit }: PartFormModalProps) {
  const [form, setForm] = useState<PartFormValues>(emptyForm)

  useEffect(() => {
    if (!open) {
      return
    }

    if (initial) {
      setForm({
        mnsPartNo: initial.mnsPartNo,
        partNo: initial.partNo,
        description: initial.description,
        qty: initial.qty,
        storeQty: initial.storeQty,
        neededDate: initial.neededDate,
        unitPrice: initial.unitPrice,
        status: initial.status,
      })
      return
    }

    setForm(emptyForm)
  }, [open, initial])

  if (!open) {
    return null
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSubmit({
      ...form,
      qty: Number(form.qty) || 0,
      storeQty: Number(form.storeQty) || 0,
      unitPrice: Number(form.unitPrice) || 0,
    })
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-medium text-slate-600">
              Mns Part No
              <input
                required
                value={form.mnsPartNo}
                onChange={(event) => setForm({ ...form, mnsPartNo: event.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="text-xs font-medium text-slate-600">
              Part No / ชื่ออะไหล่
              <input
                required
                value={form.partNo}
                onChange={(event) => setForm({ ...form, partNo: event.target.value })}
                className={fieldClass}
              />
            </label>
          </div>

          <label className="block text-xs font-medium text-slate-600">
            สเปก / รายละเอียด (Specifications)
            <textarea
              required
              rows={2}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className={fieldClass}
            />
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className="text-xs font-medium text-slate-600">
              จำนวน (QTY)
              <input
                type="number"
                min={0}
                value={form.qty}
                onChange={(event) => setForm({ ...form, qty: Number(event.target.value) })}
                className={fieldClass}
              />
            </label>
            <label className="text-xs font-medium text-slate-600">
              Store QTY
              <input
                type="number"
                min={0}
                value={form.storeQty}
                onChange={(event) => setForm({ ...form, storeQty: Number(event.target.value) })}
                className={fieldClass}
              />
            </label>
            <label className="text-xs font-medium text-slate-600">
              ราคาต่อหน่วย (Price)
              <input
                type="number"
                min={0}
                value={form.unitPrice}
                onChange={(event) => setForm({ ...form, unitPrice: Number(event.target.value) })}
                className={fieldClass}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-medium text-slate-600">
              วันที่ต้องการของ
              <input
                type="date"
                value={form.neededDate}
                onChange={(event) => setForm({ ...form, neededDate: event.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="text-xs font-medium text-slate-600">
              สถานะ
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value as EquipmentOrderStatus })
                }
                className={fieldClass}
              >
                <option value="pending_order">รอสั่งซื้อ</option>
                <option value="ordered">สั่งซื้อแล้ว</option>
                <option value="issued">เบิกจ่ายแล้ว</option>
                <option value="received">รับของแล้ว</option>
              </select>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
