import { Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { parseJobPartsFile, type DraftPart } from '../../lib/parseJobExcel'
import type { JobEquipmentItem, VendorJob } from '../../types/procurement'
import ExcelDropzone from './ExcelDropzone'
import PartFormModal from './PartFormModal'
import PartsTable from './PartsTable'

interface LocalPart extends DraftPart {
  localId: number
}

interface JobFormModalProps {
  open: boolean
  suggestedJobId: string
  vendors: string[]
  existingJobIds: string[]
  onClose: () => void
  onSubmit: (job: VendorJob, parts: DraftPart[]) => boolean
}

const fieldClass =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30'

export default function JobFormModal({
  open,
  suggestedJobId,
  vendors,
  existingJobIds,
  onClose,
  onSubmit,
}: JobFormModalProps) {
  const [jobId, setJobId] = useState(suggestedJobId)
  const [projectName, setProjectName] = useState('')
  const [vendorName, setVendorName] = useState('')
  const [description, setDescription] = useState('')
  const [parts, setParts] = useState<LocalPart[]>([])
  const [attachmentName, setAttachmentName] = useState('')
  const [importMessage, setImportMessage] = useState('')
  const [fileError, setFileError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [partFormOpen, setPartFormOpen] = useState(false)
  const [editingPart, setEditingPart] = useState<LocalPart | undefined>()
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  useEffect(() => {
    if (!open) {
      return
    }

    setJobId(suggestedJobId)
    setProjectName('')
    setVendorName('')
    setDescription('')
    setParts([])
    setAttachmentName('')
    setImportMessage('')
    setFileError('')
    setErrors({})
    setSelectedIds([])
    setPartFormOpen(false)
    setEditingPart(undefined)
  }, [open, suggestedJobId])

  if (!open) {
    return null
  }

  function validate(): boolean {
    const next: Record<string, string> = {}

    if (!jobId.trim()) {
      next.jobId = 'กรุณากรอก Job ID'
    } else if (existingJobIds.some((id) => id.toLowerCase() === jobId.trim().toLowerCase())) {
      next.jobId = `มี Job ID ${jobId.trim()} อยู่แล้ว`
    }

    if (!projectName.trim()) {
      next.projectName = 'กรุณากรอกชื่อโครงการ'
    }

    if (!vendorName.trim()) {
      next.vendorName = 'กรุณาเลือกร้านค้า'
    }

    if (!description.trim()) {
      next.description = 'กรุณากรอกรายละเอียดจ๊อบ'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleFile(file: File) {
    setFileError('')
    setAttachmentName(file.name)

    try {
      const imported = await parseJobPartsFile(file)
      if (imported.length === 0) {
        setImportMessage('แนบไฟล์แล้ว แต่ไม่พบแถวอะไหล่ที่นำเข้าได้')
        return
      }

      setParts((current) => {
        const start = current.reduce((max, item) => Math.max(max, item.localId), 0)
        return [
          ...current,
          ...imported.map((item, index) => ({ ...item, localId: start + index + 1 })),
        ]
      })
      setImportMessage(`แนบ ${file.name} และนำเข้าอะไหล่ ${imported.length} รายการ`)
    } catch (error) {
      setFileError(error instanceof Error ? error.message : 'อ่านไฟล์ Excel ไม่สำเร็จ')
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!validate()) {
      return
    }

    const created = onSubmit(
      {
        jobId: jobId.trim(),
        projectName: projectName.trim(),
        vendorName: vendorName.trim(),
        description: description.trim(),
        attachmentFileName: attachmentName || undefined,
        status: 'ready_for_po',
      },
      parts.map((part) => ({
        mnsPartNo: part.mnsPartNo,
        partNo: part.partNo,
        description: part.description,
        qty: part.qty,
        storeQty: part.storeQty,
        neededDate: part.neededDate,
        unitPrice: part.unitPrice,
        status: part.status,
      })),
    )

    if (!created) {
      setErrors({ jobId: `มี Job ID ${jobId.trim()} อยู่แล้ว` })
    }
  }

  const tableItems: JobEquipmentItem[] = parts.map((part) => ({
    ...part,
    id: part.localId,
    jobId,
  }))

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 sm:p-8">
      <div className="my-4 w-full max-w-5xl rounded-xl border border-slate-200 bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">เปิดจ๊อบใหม่ (Create Job)</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              กรอกข้อมูลจ๊อบ เพิ่มอะไหล่ด้วยมือ หรือนำเข้าจากไฟล์ Excel ก่อนบันทึก
            </p>
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

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="text-xs font-medium text-slate-600">
              Job ID
              <input
                value={jobId}
                onChange={(event) => setJobId(event.target.value)}
                className={fieldClass}
              />
              {errors.jobId ? <span className="mt-1 block text-rose-600">{errors.jobId}</span> : null}
            </label>

            <label className="text-xs font-medium text-slate-600">
              ร้านค้า (Vendor)
              <input
                list="create-job-vendors"
                value={vendorName}
                onChange={(event) => setVendorName(event.target.value)}
                placeholder="เลือกหรือพิมพ์ชื่อร้านค้า"
                className={fieldClass}
              />
              <datalist id="create-job-vendors">
                {vendors.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              {errors.vendorName ? (
                <span className="mt-1 block text-rose-600">{errors.vendorName}</span>
              ) : null}
            </label>

            <label className="text-xs font-medium text-slate-600 md:col-span-2">
              ชื่อโครงการ (Project Name)
              <input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="เช่น โครงการอาคารโรงงานบางนา"
                className={fieldClass}
              />
              {errors.projectName ? (
                <span className="mt-1 block text-rose-600">{errors.projectName}</span>
              ) : null}
            </label>

            <label className="text-xs font-medium text-slate-600 md:col-span-2">
              รายละเอียดจ๊อบ (Description)
              <textarea
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="สรุปขอบเขตงาน วัตถุประสงค์การจัดซื้อ หรือหมายเหตุ"
                className={fieldClass}
              />
              {errors.description ? (
                <span className="mt-1 block text-rose-600">{errors.description}</span>
              ) : null}
            </label>
          </section>

          <ExcelDropzone
            fileName={attachmentName}
            importMessage={importMessage}
            error={fileError}
            onFile={handleFile}
            onClear={() => {
              setAttachmentName('')
              setImportMessage('')
              setFileError('')
            }}
            onInvalidType={() => setFileError('รองรับเฉพาะไฟล์ .xlsx, .xls หรือ .csv')}
          />

          <section className="overflow-hidden rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">อะไหล่ในจ๊อบ (Spare Parts)</h4>
                <p className="text-xs text-slate-500">เพิ่ม แก้ไข ลบรายการก่อนบันทึกจ๊อบ — {parts.length} รายการ</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingPart(undefined)
                  setPartFormOpen(true)
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                เพิ่มอะไหล่ (Add)
              </button>
            </div>

            <PartsTable
              items={tableItems}
              selectedIds={selectedIds}
              onToggle={(id) =>
                setSelectedIds((current) =>
                  current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
                )
              }
              onToggleAll={(checked) => setSelectedIds(checked ? parts.map((item) => item.localId) : [])}
              onEdit={(item) => {
                const match = parts.find((part) => part.localId === item.id)
                setEditingPart(match)
                setPartFormOpen(true)
              }}
              onDelete={(item) => {
                setParts((current) => current.filter((part) => part.localId !== item.id))
                setSelectedIds((current) => current.filter((id) => id !== item.id))
              }}
            />
          </section>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              เปิดจ๊อบใหม่
            </button>
          </div>
        </form>
      </div>

      <PartFormModal
        open={partFormOpen}
        title={editingPart ? 'แก้ไขอะไหล่ (Edit Part)' : 'เพิ่มอะไหล่ (Add Part)'}
        initial={
          editingPart
            ? { ...editingPart, id: editingPart.localId, jobId }
            : undefined
        }
        onClose={() => {
          setPartFormOpen(false)
          setEditingPart(undefined)
        }}
        onSubmit={(values) => {
          if (editingPart) {
            setParts((current) =>
              current.map((part) =>
                part.localId === editingPart.localId ? { ...values, localId: part.localId } : part,
              ),
            )
          } else {
            setParts((current) => [
              ...current,
              {
                ...values,
                localId: current.reduce((max, item) => Math.max(max, item.localId), 0) + 1,
              },
            ])
          }

          setPartFormOpen(false)
          setEditingPart(undefined)
        }}
      />
    </div>
  )
}
