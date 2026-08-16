import { useMemo, useState } from 'react'
import { Plus, ShoppingCart, X } from 'lucide-react'
import { formatCurrency } from '../../lib/format'
import type { JobEquipmentItem, VendorJob } from '../../types/procurement'
import StatusBadge from '../dashboard/StatusBadge'
import PartFormModal from './PartFormModal'
import PartsTable from './PartsTable'

interface JobDetailsProps {
  job: VendorJob
  parts: JobEquipmentItem[]
  notice?: string | null
  onClose: () => void
  onSavePart: (part: Omit<JobEquipmentItem, 'id'> & { id?: number }) => void
  onDeletePart: (partId: number) => void
  onRequestPurchase: (partIds: number[]) => void
}

export default function JobDetails({
  job,
  parts,
  notice,
  onClose,
  onSavePart,
  onDeletePart,
  onRequestPurchase,
}: JobDetailsProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<JobEquipmentItem | undefined>()

  const selectedTotal = useMemo(
    () =>
      parts
        .filter((item) => selectedIds.includes(item.id))
        .reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
    [parts, selectedIds],
  )

  function handleToggle(id: number) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 sm:p-8">
      <div className="my-4 w-full max-w-5xl rounded-xl border border-slate-200 bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs text-slate-400">รายละเอียดจ๊อบ (Job Details)</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">{job.jobId}</h2>
            <p className="text-sm text-slate-600">{job.projectName}</p>
            {job.description ? (
              <p className="mt-1 max-w-2xl text-sm text-slate-500">{job.description}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>{job.vendorName}</span>
              <StatusBadge status={job.status} />
              {job.attachmentFileName ? (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                  ไฟล์แนบ: {job.attachmentFileName}
                </span>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="ปิด"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {notice ? (
          <p className="mx-5 mt-4 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">{notice}</p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">อะไหล่ในจ๊อบ (Spare Parts)</h3>
            <p className="text-xs text-slate-500">เพิ่ม แก้ไข ลบ หรือส่งรายการที่ขาดไปยังรายการรอจัดซื้อ</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEditing(undefined)
                setFormOpen(true)
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              เพิ่มอะไหล่ (Add)
            </button>
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={() => onRequestPurchase(selectedIds)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              <ShoppingCart className="h-4 w-4" />
              ส่งไปรอจัดซื้อ (Pending Purchase)
            </button>
          </div>
        </div>

        <PartsTable
          items={parts}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          onToggleAll={(checked) => setSelectedIds(checked ? parts.map((item) => item.id) : [])}
          onEdit={(item) => {
            setEditing(item)
            setFormOpen(true)
          }}
          onDelete={(item) => {
            if (window.confirm(`ลบอะไหล่ ${item.partNo} ออกจากจ๊อบนี้?`)) {
              onDeletePart(item.id)
              setSelectedIds((current) => current.filter((id) => id !== item.id))
            }
          }}
        />

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm">
          <p className="text-slate-500">เลือกแล้ว {selectedIds.length} รายการ</p>
          <p className="font-medium text-teal-700">ยอดรอจัดซื้อ: {formatCurrency(selectedTotal)}</p>
        </footer>
      </div>

      <PartFormModal
        open={formOpen}
        title={editing ? 'แก้ไขอะไหล่ (Edit Part)' : 'เพิ่มอะไหล่ (Add Part)'}
        initial={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={(values) => {
          onSavePart({ ...values, id: editing?.id, jobId: job.jobId })
          setFormOpen(false)
          setEditing(undefined)
        }}
      />
    </div>
  )
}
