export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function isOverdue(isoDate: string): boolean {
  const due = new Date(`${isoDate}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}

export function formatNeededDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function daysRelativeLabel(isoDate: string): { text: string; overdue: boolean } {
  const needed = new Date(`${isoDate}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const diffDays = Math.round((today.getTime() - needed.getTime()) / 86_400_000)

  if (diffDays > 0) {
    return { text: `เลยเวลามาแล้ว ${diffDays} วัน`, overdue: true }
  }

  if (diffDays === 0) {
    return { text: 'ถึงกำหนดวันนี้', overdue: false }
  }

  return { text: `เหลืออีก ${Math.abs(diffDays)} วัน`, overdue: false }
}

export function shortageQty(qty: number, storeQty: number): number {
  return Math.max(qty - storeQty, 0)
}

export function nextVendorId(existing: Array<{ id: string }>): string {
  const max = existing.reduce((highest, vendor) => {
    const match = vendor.id.match(/(\d+)$/)
    return match ? Math.max(highest, Number(match[1])) : highest
  }, 0)

  return `VEN-${String(max + 1).padStart(3, '0')}`
}

export function generatePoNumber(existing: Array<{ poNumber: string }>): string {
  const stamp = new Date()
  const prefix = `PO-${String(stamp.getFullYear()).slice(2)}${String(stamp.getMonth() + 1).padStart(2, '0')}-`
  const sequence =
    existing
      .map((item) => {
        const match = item.poNumber.match(/-(\d+)$/)
        return match ? Number(match[1]) : 0
      })
      .reduce((max, value) => Math.max(max, value), 0) + 1

  return `${prefix}${String(sequence).padStart(4, '0')}`
}

export function generateJobId(existing: Array<{ jobId: string }>): string {
  const year = new Date().getFullYear()
  const sequence =
    existing
      .map((item) => {
        const match = item.jobId.match(/JOB-\d{4}-(\d+)/)
        return match ? Number(match[1]) : 0
      })
      .reduce((max, value) => Math.max(max, value), 0) + 1

  return `JOB-${year}-${String(sequence).padStart(4, '0')}`
}

export function matchesQuery(query: string, values: Array<string | number>): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return true
  }

  return values.some((value) => String(value).toLowerCase().includes(normalized))
}
