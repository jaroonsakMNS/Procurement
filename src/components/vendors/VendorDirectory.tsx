import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Vendor } from '../../types/procurement'
import VendorFormModal from './VendorFormModal'

interface VendorDirectoryProps {
  vendors: Vendor[]
  onSave: (vendor: Omit<Vendor, 'id'> & { id?: string }) => void
  onDelete: (vendorId: string) => void
}

export default function VendorDirectory({ vendors, onSave, onDelete }: VendorDirectoryProps) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Vendor | undefined>()

  return (
    <section id="vendors" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">ฐานข้อมูลร้านค้า (Vendor Database)</h2>
          <p className="mt-0.5 text-xs text-slate-500">เพิ่ม แก้ไข ลบ และดูรายละเอียดผู้ขายสำหรับสร้าง PO</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(undefined)
            setOpen(true)
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          เพิ่มร้านค้า
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">ร้านค้า</th>
              <th className="px-4 py-3 font-medium">ผู้ติดต่อ</th>
              <th className="px-4 py-3 font-medium">โทร / อีเมล</th>
              <th className="px-4 py-3 font-medium">ที่อยู่</th>
              <th className="px-4 py-3 font-medium">Tax ID</th>
              <th className="px-4 py-3 text-right font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-medium text-slate-800">{vendor.name}</td>
                <td className="px-4 py-3 text-slate-600">{vendor.contactPerson}</td>
                <td className="px-4 py-3 text-slate-600">
                  <p>{vendor.phone}</p>
                  <p className="text-xs text-slate-400">{vendor.email}</p>
                </td>
                <td className="max-w-xs px-4 py-3 text-slate-500">{vendor.address}</td>
                <td className="px-4 py-3 font-mono text-xs">{vendor.taxId}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(vendor)
                        setOpen(true)
                      }}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`ลบร้านค้า ${vendor.name}?`)) {
                          onDelete(vendor.id)
                        }
                      }}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <VendorFormModal
        open={open}
        initial={editing}
        onClose={() => setOpen(false)}
        onSubmit={(vendor) => {
          onSave(vendor)
          setOpen(false)
        }}
      />
    </section>
  )
}
