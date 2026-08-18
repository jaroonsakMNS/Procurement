import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { useMemo, useState } from 'react'
import { daysRelativeLabel, formatNeededDate } from '../../lib/format'
import type { EquipmentOrderStatus, JobEquipmentItem, VendorJob } from '../../types/procurement'
import StatusBadge from './StatusBadge'

interface JobOrderedEquipmentProps {
  items: JobEquipmentItem[]
  jobs?: VendorJob[]
}

const STATUS_FILTERS: Array<{ id: 'all' | EquipmentOrderStatus; label: string }> = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'pending_order', label: 'รอสั่งซื้อ' },
  { id: 'ordered', label: 'สั่งซื้อแล้ว' },
  { id: 'received', label: 'รับของแล้ว' },
  { id: 'issued', label: 'เบิกจ่ายแล้ว' },
]

function ProgressBar({ percent }: { percent: number }) {
  const safePercent = Math.max(0, Math.min(100, percent))
  const barClass =
    safePercent >= 100 ? 'bg-emerald-500' : safePercent >= 60 ? 'bg-teal-500' : 'bg-amber-400'

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${barClass}`} style={{ width: `${safePercent}%` }} />
    </div>
  )
}

export default function JobOrderedEquipment({ items, jobs = [] }: JobOrderedEquipmentProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | EquipmentOrderStatus>('all')
  const [openJobIds, setOpenJobIds] = useState<string[]>([])

  const filteredItems = useMemo(
    () => items.filter((item) => statusFilter === 'all' || item.status === statusFilter),
    [items, statusFilter],
  )

  const groups = useMemo(() => {
    const byJob = filteredItems.reduce<Record<string, JobEquipmentItem[]>>((acc, item) => {
      acc[item.jobId] = [...(acc[item.jobId] ?? []), item]
      return acc
    }, {})

    return Object.entries(byJob).map(([jobId, jobItems]) => {
      const readyCount = jobItems.filter(
        (item) => item.status === 'received' || item.status === 'issued' || item.storeQty >= item.qty,
      ).length
      const readiness = jobItems.length === 0 ? 0 : Math.round((readyCount / jobItems.length) * 100)
      const job = jobs.find((entry) => entry.jobId === jobId)
      return { jobId, job, jobItems, readiness, readyCount, total: jobItems.length }
    })
  }, [filteredItems, jobs])

  function toggleJob(jobId: string) {
    setOpenJobIds((current) =>
      current.includes(jobId) ? current.filter((id) => id !== jobId) : [...current, jobId],
    )
  }

  return (
    <section
      id="job-equipment"
      className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">สถานะอุปกรณ์ตามจ๊อบ</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Job Equipment Progress — accordion ตามจ๊อบ พร้อม readiness percentage และ filters
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | EquipmentOrderStatus)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600"
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="space-y-4 p-4">
        {groups.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-400">
            ไม่พบอุปกรณ์ที่ตรงกับการกรอง
          </div>
        ) : (
          groups.map((group) => {
            const open = openJobIds.includes(group.jobId)
            return (
              <article key={group.jobId} className="overflow-hidden rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => toggleJob(group.jobId)}
                  className="flex w-full items-center justify-between gap-4 bg-slate-50 px-4 py-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{group.jobId}</h3>
                      {group.job ? <StatusBadge status={group.job.status} /> : null}
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {group.job?.projectName ?? 'ไม่พบชื่อโครงการ'} · พร้อมใช้งาน {group.readyCount}/{group.total} รายการ
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <ProgressBar percent={group.readiness} />
                      </div>
                      <p className="shrink-0 text-xs font-semibold text-slate-700">{group.readiness}%</p>
                    </div>
                  </div>
                  {open ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>

                {open ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-white text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-medium">Part No</th>
                          <th className="px-4 py-3 font-medium">Description</th>
                          <th className="px-4 py-3 text-right font-medium">Qty</th>
                          <th className="px-4 py-3 text-right font-medium">Store Qty</th>
                          <th className="px-4 py-3 font-medium">Readiness</th>
                          <th className="px-4 py-3 font-medium">Need Date</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {group.jobItems.map((item) => {
                          const relative = daysRelativeLabel(item.neededDate)
                          const readiness = Math.min(100, Math.round((item.storeQty / Math.max(item.qty, 1)) * 100))
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/80">
                              <td className="px-4 py-3 font-medium text-slate-800">{item.partNo}</td>
                              <td className="max-w-xs px-4 py-3 text-slate-600">{item.description}</td>
                              <td className="px-4 py-3 text-right tabular-nums">{item.qty}</td>
                              <td className="px-4 py-3 text-right tabular-nums">{item.storeQty}</td>
                              <td className="px-4 py-3">
                                <div className="space-y-1">
                                  <ProgressBar percent={readiness} />
                                  <p className="text-[11px] text-slate-500">{readiness}% ready</p>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <p className="text-slate-700">{formatNeededDate(item.neededDate)}</p>
                                <p className={`text-[11px] ${relative.overdue ? 'text-rose-600' : 'text-slate-400'}`}>
                                  {relative.text}
                                </p>
                              </td>
                              <td className="px-4 py-3">
                                <StatusBadge status={item.status} />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
