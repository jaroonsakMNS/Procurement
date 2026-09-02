import { Bell, LogOut, Menu, Search } from 'lucide-react'
import { workGroupById } from '../../data/workGroups'
import { ROLE_LABEL, initials } from '../../lib/permissions'
import type { Employee, WorkGroupId } from '../../types/procurement'

interface TopNavProps {
  onMenuClick: () => void
  searchQuery: string
  onSearchChange: (value: string) => void
  workGroup: WorkGroupId
  employee: Employee
  onLogout: () => void
}

export default function TopNav({
  onMenuClick,
  searchQuery,
  onSearchChange,
  workGroup,
  employee,
  onLogout,
}: TopNavProps) {
  const group = workGroupById(workGroup)

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/60 bg-white/75 px-4 py-3 backdrop-blur-xl lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={onMenuClick}
          aria-label="เปิดเมนู"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-slate-900 lg:text-lg">
            {group.label} ({group.hint})
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">{group.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <label className="relative hidden md:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={
              workGroup === 'sales'
                ? 'ค้นหาลูกค้า, สินค้า, SKU...'
                : workGroup === 'accounting'
                  ? 'ค้นหา PO, ยอดชำระ...'
                  : 'ค้นหาจ๊อบ, PO, ร้านค้า...'
            }
            className="w-64 rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm text-slate-700 outline-none ring-teal-500/30 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2"
          />
        </label>

        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          aria-label="การแจ้งเตือน"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white ${group.accent}`}>
            {initials(employee.name)}
          </div>
          <div className="hidden pr-1 sm:block">
            <p className="text-xs font-semibold text-slate-800">{employee.name}</p>
            <p className="text-[11px] text-slate-500">{ROLE_LABEL[employee.role]}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
          aria-label="ออกจากระบบ"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
