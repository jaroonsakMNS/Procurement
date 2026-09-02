import { ClipboardList, X } from 'lucide-react'
import { WORK_GROUPS } from '../../data/workGroups'
import { allowedDepartments, navItemsForUser } from '../../lib/permissions'
import type { Employee, WorkGroupId } from '../../types/procurement'

interface SidebarProps {
  activeId: string
  workGroup: WorkGroupId
  employee: Employee
  onNavigate: (id: string) => void
  onWorkGroupChange: (group: WorkGroupId) => void
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({
  activeId,
  workGroup,
  employee,
  onNavigate,
  onWorkGroupChange,
  isOpen,
  onClose,
}: SidebarProps) {
  const visibleGroups = WORK_GROUPS.filter((group) => allowedDepartments(employee).includes(group.id))
  const menuItems = navItemsForUser(employee, workGroup)
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-100 transition-transform lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-teal-500">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">MNS Operations</p>
              <p className="text-xs text-slate-400">จัดซื้อ · ขาย · ผลิต</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="ปิดเมนู"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-1 px-3 pb-3">
          <p className="px-2 pb-1 text-[11px] font-medium tracking-wide text-slate-500 uppercase">
            กลุ่มงาน
          </p>
          {visibleGroups.map((group) => {
            const Icon = group.icon
            const isActive = group.id === workGroup
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onWorkGroupChange(group.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                  isActive ? `${group.accent} text-white shadow-sm` : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>
                  <span className="block font-medium">{group.label}</span>
                  <span className={`block text-[11px] ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                    {group.hint}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto border-t border-slate-800 px-3 py-3">
          <p className="mb-1 px-2 text-[11px] font-medium tracking-wide text-slate-500 uppercase">
            {WORK_GROUPS.find((group) => group.id === workGroup)?.label ?? 'เมนู'}
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeId

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>
                  <span className="block font-medium">{item.label}</span>
                  <span className={`block text-[11px] ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                    {item.hint}
                  </span>
                </span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-slate-800 px-5 py-4 text-xs text-slate-500">
          เข้าสู่ระบบ: {employee.name}
        </div>
      </aside>
    </>
  )
}
