import type {
  InventoryItem,
  JobEquipmentItem,
  JobPartTrackStatus,
  PendingPurchaseItem,
  PurchaseOrder,
  VendorJob,
} from '../types/procurement'

export type StatusCounts = Record<JobPartTrackStatus, number>

export interface JobStatusPartRow {
  key: string
  jobId: string
  mnsPartNo: string
  partNo: string
  description: string
  qty: number
  storeQty: number
  trackStatus: JobPartTrackStatus
}

export interface JobStatusGroup {
  jobId: string
  projectName: string
  vendorName: string
  parts: JobStatusPartRow[]
  counts: StatusCounts
  total: number
  readyCount: number
  progressPct: number
}

const RANK: Record<JobPartTrackStatus, number> = {
  pending_quote: 1,
  po_issued: 2,
  delivered_pending_payment: 3,
  ready_for_use: 4,
}

export const TRACK_STATUS_META: Array<{
  id: JobPartTrackStatus
  labelTh: string
  labelEn: string
  bar: string
  card: string
  text: string
  ring: string
}> = [
  {
    id: 'pending_quote',
    labelTh: 'กำลังเสนอราคา',
    labelEn: 'Pending Quote',
    bar: 'bg-amber-400',
    card: 'bg-amber-50',
    text: 'text-amber-800',
    ring: 'ring-amber-200',
  },
  {
    id: 'po_issued',
    labelTh: 'สั่งซื้อแล้ว/รอรับของ',
    labelEn: 'PO Issued / Pending Delivery',
    bar: 'bg-sky-500',
    card: 'bg-sky-50',
    text: 'text-sky-800',
    ring: 'ring-sky-200',
  },
  {
    id: 'delivered_pending_payment',
    labelTh: 'รับของแล้ว/รอจ่ายเงิน',
    labelEn: 'Delivered / Pending Payment',
    bar: 'bg-indigo-500',
    card: 'bg-indigo-50',
    text: 'text-indigo-800',
    ring: 'ring-indigo-200',
  },
  {
    id: 'ready_for_use',
    labelTh: 'พร้อมใช้',
    labelEn: 'Ready for Use',
    bar: 'bg-emerald-500',
    card: 'bg-emerald-50',
    text: 'text-emerald-800',
    ring: 'ring-emerald-200',
  },
]

export function emptyCounts(): StatusCounts {
  return {
    pending_quote: 0,
    po_issued: 0,
    delivered_pending_payment: 0,
    ready_for_use: 0,
  }
}

export function statusPercent(count: number, total: number) {
  if (total <= 0) {
    return 0
  }
  return Math.round((count / total) * 100)
}

function betterStatus(current: JobPartTrackStatus | undefined, next: JobPartTrackStatus) {
  if (!current) {
    return next
  }
  return RANK[next] >= RANK[current] ? next : current
}

function partKey(jobId: string, partNo: string, mnsPartNo: string) {
  return `${jobId}::${mnsPartNo || partNo}`
}

export function buildJobStatusReport(
  jobs: VendorJob[],
  equipment: JobEquipmentItem[],
  pendingItems: PendingPurchaseItem[],
  purchaseOrders: PurchaseOrder[],
  inventory: InventoryItem[],
): JobStatusGroup[] {
  const statusByKey = new Map<string, JobPartTrackStatus>()
  const rows = new Map<string, JobStatusPartRow>()

  function upsert(
    jobId: string,
    partNo: string,
    mnsPartNo: string,
    description: string,
    qty: number,
    storeQty: number,
    status: JobPartTrackStatus,
  ) {
    const key = partKey(jobId, partNo, mnsPartNo)
    statusByKey.set(key, betterStatus(statusByKey.get(key), status))
    const existing = rows.get(key)
    if (!existing) {
      rows.set(key, {
        key,
        jobId,
        mnsPartNo,
        partNo,
        description,
        qty,
        storeQty,
        trackStatus: status,
      })
      return
    }
    existing.qty = Math.max(existing.qty, qty)
    existing.storeQty = Math.max(existing.storeQty, storeQty)
    if (!existing.description) {
      existing.description = description
    }
  }

  for (const item of equipment) {
    const stock = inventory.find(
      (entry) => entry.mnsPartNo === item.mnsPartNo || entry.partNo === item.partNo,
    )
    const storeQty = Math.max(item.storeQty, stock?.currentStock ?? 0)
    const ready = item.status === 'issued' || item.status === 'received' || storeQty >= item.qty
    upsert(
      item.jobId,
      item.partNo,
      item.mnsPartNo,
      item.description,
      item.qty,
      storeQty,
      ready ? 'ready_for_use' : item.status === 'ordered' ? 'po_issued' : 'pending_quote',
    )
  }

  for (const item of pendingItems) {
    if (!item.jobId) {
      continue
    }
    upsert(
      item.jobId,
      item.partNo,
      item.mnsPartNo,
      item.description,
      item.qty,
      0,
      item.status === 'on_po' ? 'po_issued' : 'pending_quote',
    )
  }

  for (const po of purchaseOrders) {
    const poStatus: JobPartTrackStatus =
      po.stage === 'delivered' ? 'delivered_pending_payment' : 'po_issued'
    for (const line of po.lines) {
      if (!line.jobId) {
        continue
      }
      upsert(line.jobId, line.partNo, line.mnsPartNo, line.description, line.qty, 0, poStatus)
    }
  }

  for (const row of rows.values()) {
    row.trackStatus = statusByKey.get(row.key) ?? 'pending_quote'
  }

  const jobsById = new Map(jobs.map((job) => [job.jobId, job]))
  const grouped = new Map<string, JobStatusPartRow[]>()
  for (const row of rows.values()) {
    const list = grouped.get(row.jobId) ?? []
    list.push(row)
    grouped.set(row.jobId, list)
  }

  return [...grouped.entries()]
    .map(([jobId, parts]) => {
      const job = jobsById.get(jobId)
      const counts = emptyCounts()
      for (const part of parts) {
        counts[part.trackStatus] += 1
      }
      const total = parts.length
      const readyCount = counts.ready_for_use
      return {
        jobId,
        projectName: job?.projectName ?? jobId,
        vendorName: job?.vendorName ?? '-',
        parts: parts.sort((a, b) => a.partNo.localeCompare(b.partNo)),
        counts,
        total,
        readyCount,
        progressPct: statusPercent(readyCount, total),
      }
    })
    .sort((a, b) => b.jobId.localeCompare(a.jobId))
}

export function summarizeGroups(groups: JobStatusGroup[]) {
  const counts = emptyCounts()
  let total = 0
  for (const group of groups) {
    total += group.total
    for (const key of Object.keys(counts) as JobPartTrackStatus[]) {
      counts[key] += group.counts[key]
    }
  }
  return {
    total,
    counts,
    readyCount: counts.ready_for_use,
    progressPct: statusPercent(counts.ready_for_use, total),
  }
}
