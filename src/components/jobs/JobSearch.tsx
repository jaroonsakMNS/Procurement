import { Search } from 'lucide-react'
import type { JobStatus } from '../../types/procurement'

interface JobSearchProps {
  query: string
  status: JobStatus | 'all'
  vendor: string
  vendors: string[]
  onQueryChange: (value: string) => void
  onStatusChange: (value: JobStatus | 'all') => void
  onVendorChange: (value: string) => void
}

const selectClass =
  'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30'

export default function JobSearch({
  query,
  status,
  vendor,
  vendors,
  onQueryChange,
  onStatusChange,
  onVendorChange,
}: JobSearchProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center">
      <label className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="ค้นหา Job ID หรือชื่อโครงการ (Project Name)..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/30"
        />
      </label>

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as JobStatus | 'all')}
        className={selectClass}
        aria-label="กรองตามสถานะ"
      >
        <option value="all">สถานะทั้งหมด (All Status)</option>
        <option value="ready_for_po">พร้อมเปิด PO</option>
        <option value="po_created">เปิด PO แล้ว</option>
      </select>

      <select
        value={vendor}
        onChange={(event) => onVendorChange(event.target.value)}
        className={selectClass}
        aria-label="กรองตามร้านค้า"
      >
        <option value="all">ร้านค้าทั้งหมด (All Vendors)</option>
        {vendors.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}
