import { useMemo, useState } from 'react'
import { ChevronDown, Download, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'
import {
  TRACK_STATUS_META,
  buildJobStatusReport,
  statusPercent,
  summarizeGroups,
  type JobStatusGroup,
  type StatusCounts,
} from '../../lib/jobStatusReport'
import type {
  InventoryItem,
  JobEquipmentItem,
  PendingPurchaseItem,
  PurchaseOrder,
  VendorJob,
} from '../../types/procurement'
import StatusBadge from '../dashboard/StatusBadge'

interface JobEquipmentStatusReportProps {
  jobs: VendorJob[]
  equipment: JobEquipmentItem[]
  pendingItems: PendingPurchaseItem[]
  purchaseOrders: PurchaseOrder[]
  inventory: InventoryItem[]
}

function StatusDonut({ counts, total }: { counts: StatusCounts; total: number }) {
  let cursor = 0
  const stops = TRACK_STATUS_META.map((item) => {
    const pct = statusPercent(counts[item.id], total)
    const start = cursor
    cursor += pct
    const color =
      item.id === 'pending_quote'
        ? '#fbbf24'
        : item.id === 'po_issued'
          ? '#0ea5e9'
          : item.id === 'delivered_pending_payment'
            ? '#6366f1'
            : '#10b981'
    return `${color} ${start}% ${cursor}%`
  })

  return (
    <div
      className="h-28 w-28 rounded-full"
      style={{
        background: `conic-gradient(${stops.join(', ')})`,
        boxShadow: 'inset 0 0 0 22px white',
      }}
      aria-hidden
    />
  )
}

function BreakdownCards({ counts, total }: { counts: StatusCounts; total: number }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {TRACK_STATUS_META.map((item) => {
        const count = counts[item.id]
        const percent = statusPercent(count, total)
        return (
          <article
            key={item.id}
            className={`rounded-xl p-3 ring-1 ${item.card} ${item.ring}`}
          >
            <p className={`text-[11px] font-medium ${item.text}`}>{item.labelTh}</p>
            <p className="mt-0.5 text-[10px] text-slate-500">{item.labelEn}</p>
            <p className={`mt-2 text-xl font-bold tabular-nums ${item.text}`}>{count}</p>
            <p className="text-xs text-slate-500">{percent}%</p>
          </article>
        )
      })}
    </div>
  )
}

function StackedBar({ counts, total }: { counts: StatusCounts; total: number }) {
  return (
    <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
      {TRACK_STATUS_META.map((item) => (
        <span
          key={item.id}
          className={item.bar}
          style={{ width: `${statusPercent(counts[item.id], total)}%` }}
        />
      ))}
    </div>
  )
}

export default function JobEquipmentStatusReport({
  jobs,
  equipment,
  pendingItems,
  purchaseOrders,
  inventory,
}: JobEquipmentStatusReportProps) {
  const groups = useMemo(
    () => buildJobStatusReport(jobs, equipment, pendingItems, purchaseOrders, inventory),
    [jobs, equipment, pendingItems, purchaseOrders, inventory],
  )
  const summary = useMemo(() => summarizeGroups(groups), [groups])
  const [openJobId, setOpenJobId] = useState<string | null>(groups[0]?.jobId ?? null)

  function exportExcel() {
    const rows = groups.flatMap((group) =>
      group.parts.map((part) => ({
        JobId: group.jobId,
        Project: group.projectName,
        PartNo: part.partNo,
        Description: part.description,
        Qty: part.qty,
        StoreQty: part.storeQty,
        Status: part.trackStatus,
      })),
    )
    const sheet = XLSX.utils.json_to_sheet(rows)
    const book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, sheet, 'Job Status')
    XLSX.writeFile(book, 'job-equipment-status.xlsx')
  }

  function exportPdf() {
    window.print()
  }

  return (
    <section
      id="job-status-report"
      className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm print:border-0 print:shadow-none"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">แดชบอร์ดติดตามสถานะอุปกรณ์ตามจ๊อบ</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Job Equipment Status Report — รวมรายการจากหลาย PO แล้วจัดกลุ่มตามจ๊อบ
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button
            type="button"
            onClick={exportExcel}
            className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export Excel
          </button>
          <button
            type="button"
            onClick={exportPdf}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </header>

      <div className="space-y-4 border-b border-slate-100 px-5 py-4">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Total Items</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{summary.total}</p>
            <p className="text-xs text-slate-400">อะไหล่ทุกจ๊อบที่กำลังติดตาม</p>
          </article>
          <article className="rounded-xl border border-violet-200 bg-violet-50 p-4">
            <p className="text-xs text-violet-700">Overall Progress</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-violet-800">{summary.progressPct}%</p>
            <p className="text-xs text-violet-600">
              พร้อมใช้ {summary.readyCount}/{summary.total}
            </p>
          </article>
          <div className="flex items-center justify-center">
            <StatusDonut counts={summary.counts} total={summary.total} />
          </div>
        </div>
        <StackedBar counts={summary.counts} total={summary.total} />
        <BreakdownCards counts={summary.counts} total={summary.total} />
      </div>

      <div className="space-y-3 p-4">
        {groups.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">ยังไม่มีข้อมูลอุปกรณ์ตามจ๊อบ</p>
        ) : (
          groups.map((group) => (
            <JobCard
              key={group.jobId}
              group={group}
              open={openJobId === group.jobId}
              onToggle={() => setOpenJobId((current) => (current === group.jobId ? null : group.jobId))}
            />
          ))
        )}
      </div>
    </section>
  )
}

function JobCard({
  group,
  open,
  onToggle,
}: {
  group: JobStatusGroup
  open: boolean
  onToggle: () => void
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50"
      >
        <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-sky-600 transition ${open ? 'rotate-0' : '-rotate-90'}`} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">
            {group.jobId}: {group.projectName}
          </p>
          <p className="text-xs text-slate-500">
            {group.vendorName} · {group.readyCount}/{group.total} รายการพร้อมใช้
          </p>
          <div className="mt-2">
            <StackedBar counts={group.counts} total={group.total} />
          </div>
        </div>
        <span className="rounded-full border border-violet-200 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
          {group.progressPct}%
        </span>
      </button>

      {open ? (
        <div className="space-y-4 border-t border-slate-100 bg-slate-50/60 px-4 py-4">
          <div>
            <p className="text-xs font-semibold text-slate-600">Mini-Dashboard ของจ๊อบนี้</p>
            <p className="mt-1 text-sm text-slate-700">
              รวม {group.total} รายการที่ต้องใช้ในจ๊อบนี้
            </p>
            <div className="mt-3">
              <BreakdownCards counts={group.counts} total={group.total} />
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white text-xs text-slate-500 uppercase">
                <tr>
                  <th className="px-3 py-2 font-medium">Part No</th>
                  <th className="px-3 py-2 font-medium">รายละเอียด</th>
                  <th className="px-3 py-2 text-right font-medium">QTY</th>
                  <th className="px-3 py-2 text-right font-medium">Store</th>
                  <th className="px-3 py-2 font-medium">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {group.parts.map((part) => (
                  <tr key={part.key}>
                    <td className="px-3 py-2 font-medium text-slate-800">{part.partNo}</td>
                    <td className="px-3 py-2 text-slate-600">{part.description}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{part.qty}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{part.storeQty}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={part.trackStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </article>
  )
}
