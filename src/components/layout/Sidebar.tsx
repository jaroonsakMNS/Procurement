import {
  BarChart3,
  ClipboardList,
  Cpu,
  FileText,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  Truck,
  Users,
  Wallet,
  Warehouse,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'แดชบอร์ด', hint: 'Dashboard', icon: LayoutDashboard },
  { id: 'job-status-report', label: 'ติดตามอุปกรณ์', hint: 'Job Status', icon: BarChart3 },
  { id: 'inventory', label: 'คลังสินค้า', hint: 'Warehouse', icon: Warehouse },
  { id: 'store', label: 'ร้านค้าภายใน', hint: 'Internal Store', icon: ShoppingBag },
  { id: 'pending-purchase', label: 'รอจัดซื้อ', hint: 'Pending Purchase', icon: Truck },
  { id: 'vendors', label: 'ฐานข้อมูลร้านค้า', hint: 'Vendors', icon: Users },
  { id: 'jobs', label: 'จ๊อบ', hint: 'Jobs', icon: Store },
  { id: 'job-equipment', label: 'อุปกรณ์ในจ๊อบ', hint: 'Job Equipment', icon: Cpu },
  { id: 'purchase-orders', label: 'ใบสั่งซื้อ', hint: 'Purchase Orders', icon: FileText },
  { id: 'payments', label: 'การชำระเงิน', hint: 'Payments', icon: Wallet },
  { id: 'deliveries', label: 'รอรับของ', hint: 'Deliveries', icon: Package },
] as const

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
              <p className="text-sm font-semibold tracking-wide">ระบบจัดซื้อ</p>
              <p className="text-xs text-slate-400">Procurement</p>
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

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
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
                  <span className={`block text-[11px] ${isActive ? 'text-teal-100' : 'text-slate-500'}`}>
                    {item.hint}
                  </span>
                </span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-slate-800 px-5 py-4 text-xs text-slate-500">
          ข้อมูลจำลอง (Mock Data)
        </div>
      </aside>
    </>
  )
}
