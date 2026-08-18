import { Bell, Menu, Search } from 'lucide-react'

const VIEW_META: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'แดชบอร์ดภาพรวม',
    subtitle: 'ภาพรวมระบบผลิตงานและจัดซื้อ',
  },
  jobs: {
    title: 'สร้างจ๊อบ & แนบอะไหล่',
    subtitle: 'สร้างใบงานและจัดการรายการอะไหล่ที่ต้องใช้',
  },
  po: {
    title: 'กระบวนการจัดซื้อ',
    subtitle: 'รายการรอจัดซื้อ, ใบสั่งซื้อ, เปรียบเทียบราคา และจัดการร้านค้า',
  },
  inventory: {
    title: 'ระบบคลังสินค้า',
    subtitle: 'ยอดคงเหลือ, เบิก-จ่ายอะไหล่ และร้านค้าภายใน',
  },
  deliveries: {
    title: 'รอรับของ',
    subtitle: 'ติดตามสถานะการจัดส่ง และยืนยันรับสินค้าเข้าคลัง',
  },
  payments: {
    title: 'ค้างชำระเงิน',
    subtitle: 'รายการที่รอชำระ, เรียงตามวันครบกำหนด และบันทึกการชำระ',
  },
}

interface TopNavProps {
  activeView: string
  onMenuClick: () => void
  searchQuery: string
  onSearchChange: (value: string) => void
}

export default function TopNav({
  activeView,
  onMenuClick,
  searchQuery,
  onSearchChange,
}: TopNavProps) {
  const meta = VIEW_META[activeView] ?? VIEW_META['dashboard']

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
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
            {meta.title}
          </h1>
          <p className="hidden truncate text-xs text-slate-500 sm:block">{meta.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <label className="relative hidden md:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="ค้นหาจ๊อบ, PO, ร้านค้า..."
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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white">
            สจ
          </div>
          <div className="hidden pr-1 sm:block">
            <p className="text-xs font-semibold text-slate-800">สมชาย จันทร์เพ็ญ</p>
            <p className="text-[11px] text-slate-500">เจ้าหน้าที่จัดซื้อ</p>
          </div>
        </div>
      </div>
    </header>
  )
}
