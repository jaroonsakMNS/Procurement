import { useState } from 'react'
import InventoryDashboard from '../components/inventory/InventoryDashboard'
import StoreCatalog from '../components/store/StoreCatalog'
import type { CartLine, InventoryItem, VendorJob } from '../types/procurement'

interface InventoryViewProps {
  inventory: InventoryItem[]
  jobs: VendorJob[]
  onRequisition: (jobId: string, lines: CartLine[]) => string
}

type TabId = 'inventory' | 'store'

const TABS: Array<{ id: TabId; label: string; hint: string }> = [
  { id: 'inventory', label: 'คลังสินค้า', hint: 'Inventory & Stock Levels' },
  { id: 'store', label: 'ร้านค้าภายใน', hint: 'Internal Store / Requisition' },
]

export default function InventoryView({ inventory, jobs, onRequisition }: InventoryViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('inventory')

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

      {activeTab === 'inventory' && <InventoryDashboard items={inventory} />}
      {activeTab === 'store' && (
        <StoreCatalog items={inventory} jobs={jobs} onSubmit={onRequisition} />
      )}
    </div>
  )
}
