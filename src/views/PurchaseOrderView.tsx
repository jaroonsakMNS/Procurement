import { useState } from 'react'
import { useMemo } from 'react'
import PurchaseOrderBoard from '../components/dashboard/PurchaseOrderBoard'
import PendingPurchaseBoard from '../components/procurement/PendingPurchaseBoard'
import VendorDirectory from '../components/vendors/VendorDirectory'
import { matchesQuery } from '../lib/format'
import type {
  PendingPurchaseItem,
  PurchaseOrder,
  Vendor,
} from '../types/procurement'

interface PurchaseOrderViewProps {
  pendingItems: PendingPurchaseItem[]
  purchaseOrders: PurchaseOrder[]
  vendors: Vendor[]
  searchQuery: string
  onGeneratePo: (
    pendingIds: number[],
    vendorId: string,
    quotedPrices: Record<number, number>,
  ) => string
  onMarkDelivered: (poNumber: string) => void
  onSaveVendor: (vendor: Omit<Vendor, 'id'> & { id?: string }) => void
  onDeleteVendor: (vendorId: string) => void
}

type TabId = 'pending' | 'orders' | 'vendors'

const TABS: Array<{ id: TabId; label: string; hint: string }> = [
  { id: 'pending', label: 'รายการรอจัดซื้อ', hint: 'Parts Pending Purchase' },
  { id: 'orders', label: 'ใบสั่งซื้อ (PO)', hint: 'Purchase Orders' },
  { id: 'vendors', label: 'ฐานข้อมูลร้านค้า', hint: 'Vendor Directory' },
]

export default function PurchaseOrderView({
  pendingItems,
  purchaseOrders,
  vendors,
  searchQuery,
  onGeneratePo,
  onMarkDelivered,
  onSaveVendor,
  onDeleteVendor,
}: PurchaseOrderViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('pending')

  const filteredOrders = useMemo(
    () =>
      purchaseOrders.filter((po) =>
        matchesQuery(searchQuery, [po.poNumber, po.vendorName, po.note ?? '', po.stage]),
      ),
    [purchaseOrders, searchQuery],
  )

  return (
    <div className="space-y-5">
      {/* Tab navigation */}
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="block">{tab.label}</span>
            <span
              className={`block text-[11px] font-normal ${
                activeTab === tab.id ? 'text-teal-100' : 'text-slate-400'
              }`}
            >
              {tab.hint}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'pending' && (
        <PendingPurchaseBoard
          items={pendingItems}
          vendors={vendors}
          onGeneratePo={onGeneratePo}
        />
      )}
      {activeTab === 'orders' && (
        <PurchaseOrderBoard
          purchaseOrders={filteredOrders}
          onMarkDelivered={onMarkDelivered}
        />
      )}
      {activeTab === 'vendors' && (
        <VendorDirectory
          vendors={vendors}
          onSave={onSaveVendor}
          onDelete={onDeleteVendor}
        />
      )}
    </div>
  )
}
