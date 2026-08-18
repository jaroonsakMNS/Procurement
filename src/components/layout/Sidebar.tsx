import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  Store,
  Wallet,
  Warehouse,
  X,
} from 'lucide-react'

export const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'แดชบอร์ด',
    hint: 'Overview',
    icon: LayoutDashboard,
  },
  {
    id: 'jobs',
    label: 'สร้างจ๊อบ & อะไหล่',
    hint: 'Jobs & Parts',
    icon: Store,
  },
  {
    id: 'po',
    label: 'กระบวนการจัดซื้อ',
    hint: 'PO Processing',
    icon: FileText,
  },
  {
    id: 'inventory',
    label: 'คลังสินค้า',
    hint: 'Inventory & Store',
    icon: Warehouse,
  },
  {
    id: 'deliveries',
    label: 'รอรับของ',
    hint: 'Pending Deliveries',
    icon: Package,
  },
  {
    id: 'payments',
    label: 'ค้างชำระเงิน',
    hint: 'Pending Payments',
    icon: Wallet,
  },
] as const

export type ViewId = (typeof NAV_ITEMS)[number]['id']

interface SidebarProps {
  activeId: string
  onNavigate: (id: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ activeId, onNavigate, isOpen, onClose }: SidebarProps) {
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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">ระบบผลิต & จัดซื้อ</p>
              <p className="text-[11px] text-slate-400">Production & Procurement</p>
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

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeId

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>
                  <span className="block font-medium">{item.label}</span>
                  <span
                    className={`block text-[11px] ${isActive ? 'text-teal-100' : 'text-slate-500'}`}
                  >
                    {item.hint}
                  </span>
                </span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-slate-800 px-5 py-4 text-xs text-slate-500">
          ข้อมูลจำลอง · Mock Data · v2.0
        </div>
      </aside>
    </>
  )
}
