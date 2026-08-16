import * as XLSX from 'xlsx'
import type { EquipmentOrderStatus, JobEquipmentItem } from '../types/procurement'

export type DraftPart = Omit<JobEquipmentItem, 'id' | 'jobId'>

function normalizeHeader(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[_-]/g, '')
}

function cellText(value: unknown): string {
  if (value == null) {
    return ''
  }

  return String(value).replace(/\s+/g, ' ').trim()
}

function cellNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  const parsed = Number(String(value ?? '').replace(/,/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function excelDateToIso(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value)
    if (parsed) {
      return `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`
    }
  }

  const text = cellText(value)
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0, 10)
  }

  const dmy = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/)
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`
  }

  return new Date().toISOString().slice(0, 10)
}

function mapStatus(value: unknown): EquipmentOrderStatus {
  const text = cellText(value)

  if (text.includes('รับ')) {
    return 'received'
  }

  if (text.includes('สั่งซื้อแล้ว') || text.toLowerCase().includes('ordered')) {
    return 'ordered'
  }

  return 'pending_order'
}

function headerIndex(headers: string[], aliases: string[]): number {
  return headers.findIndex((header) => aliases.includes(header))
}

export async function parseJobPartsFile(file: File): Promise<DraftPart[]> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
  const sheetName = workbook.SheetNames[0]

  if (!sheetName) {
    return []
  }

  const rows = XLSX.utils.sheet_to_json<(string | number | Date | null)[]>(workbook.Sheets[sheetName], {
    header: 1,
    defval: null,
    raw: true,
  })

  const headerRowIndex = rows.findIndex((row) =>
    row.some((cell) => {
      const header = normalizeHeader(cell)
      return header.includes('partno') || header.includes('mnspart') || header === 'description'
    }),
  )

  if (headerRowIndex < 0) {
    throw new Error('ไม่พบหัวตารางอะไหล่ (Part No / Mns Part No)')
  }

  const headers = (rows[headerRowIndex] ?? []).map(normalizeHeader)
  const mnsIndex = headerIndex(headers, ['mnspartno', 'mnspart', 'mns'])
  const partIndex = headerIndex(headers, ['partno', 'part', 'partnumber'])
  const descIndex = headerIndex(headers, ['description', 'desc', 'รายละเอียด', 'สเปก'])
  const qtyIndex = headerIndex(headers, ['qty', 'quantity', 'จำนวน'])
  const storeIndex = headerIndex(headers, ['storeqty', 'stockqty', 'store'])
  const dateIndex = headerIndex(headers, ['วันที่ต้องการของ', 'neededdate', 'requireddate', 'duedate'])
  const statusIndex = headerIndex(headers, ['สถานะ', 'status'])
  const priceIndex = headerIndex(headers, ['price', 'unitprice', 'ราคา', 'ราคาต่อหน่วย'])

  const parts: DraftPart[] = []

  for (const row of rows.slice(headerRowIndex + 1)) {
    const partNo = cellText(partIndex >= 0 ? row[partIndex] : '')
    const mnsPartNo = cellText(mnsIndex >= 0 ? row[mnsIndex] : '')

    if (!partNo && !mnsPartNo) {
      continue
    }

    parts.push({
      mnsPartNo: mnsPartNo || '-',
      partNo: partNo || mnsPartNo,
      description: cellText(descIndex >= 0 ? row[descIndex] : ''),
      qty: cellNumber(qtyIndex >= 0 ? row[qtyIndex] : 1) || 1,
      storeQty: cellNumber(storeIndex >= 0 ? row[storeIndex] : 0),
      neededDate: excelDateToIso(dateIndex >= 0 ? row[dateIndex] : null),
      unitPrice: cellNumber(priceIndex >= 0 ? row[priceIndex] : 0),
      status: mapStatus(statusIndex >= 0 ? row[statusIndex] : ''),
    })
  }

  return parts
}

export function isSpreadsheetFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv')
}
