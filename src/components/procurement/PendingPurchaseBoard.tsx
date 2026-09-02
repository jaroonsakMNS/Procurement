import { useMemo, useState } from 'react'
import { Filter, X } from 'lucide-react'
import { formatCurrency } from '../../lib/format'
import type { PendingPurchaseItem, Vendor, VendorJob } from '../../types/procurement'
import StatusBadge from '../dashboard/StatusBadge'
import VendorComparisonForm from './VendorComparisonForm'

interface PendingPurchaseBoardProps {
  items: PendingPurchaseItem[]
  jobs?: VendorJob[]
  vendors: Vendor[]
  canOperate?: boolean
  onGeneratePo: (pendingIds: number[], vendorId: string, quotedPrices: Record<number, number>) => string
}

export default function PendingPurchaseBoard({
  items,
  jobs = [],
  vendors,
  canOperate = true,
  onGeneratePo,
}: PendingPurchaseBoardProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [selectedJobId, setSelectedJobId] = useState('')
  const [jobQuery, setJobQuery] = useState('')

  const jobsById = useMemo(() => new Map(jobs.map((job) => [job.jobId, job])), [jobs])

  const jobOptions = useMemo(() => {
    const ids = new Set<string>()
    items.forEach((item) => {
      if (item.jobId) ids.add(item.jobId)
    })
    jobs.forEach((job) => ids.add(job.jobId))
    return [...ids]
      .sort()
      .map((jobId) => ({
        jobId,
        projectName: jobsById.get(jobId)?.projectName ?? '',
      }))
  }, [items, jobs, jobsById])

  const visibleItems = useMemo(() => {
    const query = jobQuery.trim().toLowerCase()
    return items.filter((item) => {
      if (selectedJobId && item.jobId !== selectedJobId) return false
      if (!query) return true
      const projectName = item.jobId ? (jobsById.get(item.jobId)?.projectName ?? '') : ''
      const haystack = `${item.jobId ?? ''} ${projectName}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [items, selectedJobId, jobQuery, jobsById])

  const openItems = visibleItems.filter((item) => item.status === 'pending')
  const selectedParts = openItems.filter((item) => selectedIds.includes(item.id))
  const selectedTotal = useMemo(
    () => selectedParts.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
    [selectedParts],
  )

  const hasActiveFilter = Boolean(selectedJobId || jobQuery.trim())
  const allVisibleSelected = openItems.length > 0 && openItems.every((item) => selectedIds.includes(item.id))

  function jobLabel(jobId?: string) {
    if (!jobId) return '-'
    const projectName = jobsById.get(jobId)?.projectName
    return projectName ? `${jobId} · ${projectName}` : jobId
  }

  function clearFilter() {
    setSelectedJobId('')
    setJobQuery('')
  }

  return (
    <section
      id="pending-purchase"
      className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">รายการรอจัดซื้อ (Parts Pending Purchase)</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            เลือกอะไหล่แล้วต้องเปรียบเทียบราคา 3 ร้านค้าก่อน จึงจะ Generate PO ได้ — กรองตามจ๊อบได้แม้ PO จะสร้างแบบรายการ
          </p>
        </div>
      </header>

      <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-600">
          <Filter className="h-3.5 w-3.5 text-teal-600" />
          กรองตามจ๊อบ (Job Filter)
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="min-w-[220px] flex-1">
            <span className="mb-1 block text-[11px] text-slate-500">เลือกจ๊อบ / โครงการ</span>
            <select
              value={selectedJobId}
              onChange={(event) => setSelectedJobId(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="">All Pending Parts — ทุกรายการรอจัดซื้อ</option>
              {jobOptions.map((option) => (
                <option key={option.jobId} value={option.jobId}>
                  {option.projectName ? `${option.jobId} — ${option.projectName}` : option.jobId}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-[200px] flex-1">
            <span className="mb-1 block text-[11px] text-slate-500">ค้นหา Job ID หรือชื่อโครงการ</span>
            <input
              type="search"
              value={jobQuery}
              onChange={(event) => setJobQuery(event.target.value)}
              placeholder="เช่น JOB-2026-0138 หรือ Rama 9"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>
          <button
            type="button"
            onClick={clearFilter}
            disabled={!hasActiveFilter}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            <X className="h-4 w-4" />
            ล้างตัวกรอง (All Pending Parts)
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          แสดง {visibleItems.length} จาก {items.length} รายการ
          {selectedJobId ? ` · จ๊อบ ${jobLabel(selectedJobId)}` : ''}
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 px-5 py-3">
        <button
          type="button"
          disabled={!canOperate || selectedParts.length === 0 || vendors.length < 3}
          onClick={() => setCompareOpen(true)}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-500"
        >
          เปรียบเทียบราคา 3 ร้าน (Compare Quotes)
        </button>
        <p className="text-sm text-slate-500">
          เลือก {selectedParts.length} รายการในมุมมองนี้ · {formatCurrency(selectedTotal)}
        </p>
        {vendors.length < 3 ? (
          <p className="text-xs text-rose-600">ต้องมีร้านค้าในฐานข้อมูลอย่างน้อย 3 ราย</p>
        ) : null}
      </div>

      {notice ? <p className="mx-5 mt-3 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">{notice}</p> : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={(event) =>
                    setSelectedIds((current) => {
                      const visibleIds = openItems.map((item) => item.id)
                      if (event.target.checked) {
                        return [...new Set([...current, ...visibleIds])]
                      }
                      return current.filter((id) => !visibleIds.includes(id))
                    })
                  }
                  aria-label="เลือกทั้งหมดในมุมมองนี้"
                />
              </th>
              <th className="px-4 py-3 font-medium">Part No</th>
              <th className="px-4 py-3 font-medium">รายละเอียด</th>
              <th className="px-4 py-3 font-medium">จ๊อบอ้างอิง</th>
              <th className="px-4 py-3 text-right font-medium">QTY</th>
              <th className="px-4 py-3 text-right font-medium">ราคาประมาณ</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  ไม่มีรายการรอจัดซื้อ
                </td>
              </tr>
            ) : visibleItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  ไม่พบรายการรอจัดซื้อของจ๊อบที่เลือก — กดล้างตัวกรองเพื่อดูทุกรายการ
                </td>
              </tr>
            ) : (
              visibleItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      disabled={item.status !== 'pending'}
                      checked={selectedIds.includes(item.id)}
                      onChange={() =>
                        setSelectedIds((current) =>
                          current.includes(item.id)
                            ? current.filter((id) => id !== item.id)
                            : [...current, item.id],
                        )
                      }
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{item.partNo}</td>
                  <td className="max-w-xs px-4 py-3 text-slate-600">{item.description}</td>
                  <td className="px-4 py-3 text-slate-500">{jobLabel(item.jobId)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{item.qty}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                    {item.poNumber ? <p className="mt-1 text-[11px] text-slate-400">{item.poNumber}</p> : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <VendorComparisonForm
        open={compareOpen}
        parts={selectedParts}
        vendors={vendors}
        onClose={() => setCompareOpen(false)}
        onGeneratePo={(vendorId, quotedPrices) => {
          const ids = selectedParts.map((item) => item.id)
          const message = onGeneratePo(ids, vendorId, quotedPrices)
          setNotice(message)
          setSelectedIds((current) => current.filter((id) => !ids.includes(id)))
          setCompareOpen(false)
          return message
        }}
      />
    </section>
  )
}
