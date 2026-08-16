import { useMemo, useState } from 'react'
import DashboardLayout from './components/layout/DashboardLayout'
import KpiCards from './components/dashboard/KpiCards'
import VendorAssignedJobs from './components/dashboard/VendorAssignedJobs'
import PurchaseOrderBoard from './components/dashboard/PurchaseOrderBoard'
import PendingPayments from './components/dashboard/PendingPayments'
import PendingDeliveries from './components/dashboard/PendingDeliveries'
import JobOrderedEquipment from './components/dashboard/JobOrderedEquipment'
import JobDetails from './components/jobs/JobDetails'
import InventoryDashboard from './components/inventory/InventoryDashboard'
import StoreCatalog from './components/store/StoreCatalog'
import PendingPurchaseBoard from './components/procurement/PendingPurchaseBoard'
import JobEquipmentStatusReport from './components/reports/JobEquipmentStatusReport'
import VendorDirectory from './components/vendors/VendorDirectory'
import {
  computeKpis,
  jobEquipment as initialEquipment,
  pendingDeliveries,
  pendingPayments,
  purchaseOrders as initialPurchaseOrders,
  vendorJobs as initialJobs,
} from './data/mockData'
import { inventoryItems as initialInventory, pendingPurchases as initialPending } from './data/inventory'
import { vendors as initialVendors } from './data/vendors'
import { generateJobId, generatePoNumber, matchesQuery } from './lib/format'
import type { DraftPart } from './lib/parseJobExcel'
import type {
  CartLine,
  InventoryItem,
  JobEquipmentItem,
  PendingPurchaseItem,
  PurchaseOrder,
  PurchaseOrderLine,
  Vendor,
  VendorJob,
} from './types/procurement'

function applyGoodsReceipt(inventory: InventoryItem[], lines: PurchaseOrderLine[]): InventoryItem[] {
  const next = inventory.map((item) => ({ ...item }))

  for (const line of lines) {
    const sku = line.mnsPartNo || line.partNo
    const match = next.find((item) => item.sku === sku || item.partNo === line.partNo)

    if (match) {
      match.currentStock += line.qty
      continue
    }

    next.push({
      sku,
      mnsPartNo: line.mnsPartNo,
      partNo: line.partNo,
      description: line.description,
      currentStock: line.qty,
      minStock: 5,
      unit: 'ชิ้น',
      location: 'IN-NEW',
      unitPrice: line.unitPrice,
    })
  }

  return next
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [jobs, setJobs] = useState<VendorJob[]>(initialJobs)
  const [equipment, setEquipment] = useState<JobEquipmentItem[]>(initialEquipment)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders)
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [pendingItems, setPendingItems] = useState<PendingPurchaseItem[]>(initialPending)
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [poNotice, setPoNotice] = useState<string | null>(null)

  const selectedJob = jobs.find((job) => job.jobId === selectedJobId) ?? null
  const selectedJobParts = equipment.filter((item) => item.jobId === selectedJobId)

  const kpis = useMemo(
    () =>
      computeKpis(
        jobs,
        purchaseOrders,
        pendingPayments,
        pendingDeliveries,
        equipment,
        inventory,
        pendingItems,
      ),
    [jobs, purchaseOrders, equipment, inventory, pendingItems],
  )

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) =>
        matchesQuery(searchQuery, [job.jobId, job.projectName, job.vendorName, job.status]),
      ),
    [jobs, searchQuery],
  )

  const filteredPurchaseOrders = useMemo(
    () =>
      purchaseOrders.filter((po) =>
        matchesQuery(searchQuery, [po.poNumber, po.vendorName, po.note ?? '', po.stage]),
      ),
    [purchaseOrders, searchQuery],
  )

  const filteredPayments = useMemo(
    () =>
      pendingPayments.filter((item) =>
        matchesQuery(searchQuery, [item.poNumber, item.vendorName, item.amount, item.dueDate]),
      ),
    [searchQuery],
  )

  const filteredDeliveries = useMemo(
    () =>
      pendingDeliveries.filter((item) =>
        matchesQuery(searchQuery, [item.poNumber, item.itemDetails, item.expectedDate, item.progress]),
      ),
    [searchQuery],
  )

  const filteredEquipment = useMemo(
    () =>
      equipment.filter(
        (item) =>
          (item.status === 'ordered' || item.status === 'issued') &&
          matchesQuery(searchQuery, [item.jobId, item.mnsPartNo, item.partNo, item.description, item.status]),
      ),
    [equipment, searchQuery],
  )

  function nextPendingId(list: PendingPurchaseItem[]) {
    return list.reduce((max, item) => Math.max(max, item.id), 0) + 1
  }

  function handleCreateJob(job: VendorJob, parts: DraftPart[]) {
    if (jobs.some((item) => item.jobId.toLowerCase() === job.jobId.toLowerCase())) {
      return false
    }

    setJobs((current) => [job, ...current])
    setEquipment((current) => {
      const start = current.reduce((max, item) => Math.max(max, item.id), 0)
      return [
        ...current,
        ...parts.map((part, index) => ({ ...part, id: start + index + 1, jobId: job.jobId })),
      ]
    })
    setPendingItems((current) => {
      let id = nextPendingId(current)
      const extras = parts
        .filter((part) => part.status === 'pending_order' && part.qty - part.storeQty > 0)
        .map((part) => ({
          id: id++,
          jobId: job.jobId,
          mnsPartNo: part.mnsPartNo,
          partNo: part.partNo,
          description: part.description,
          qty: part.qty - part.storeQty,
          unitPrice: part.unitPrice,
          status: 'pending' as const,
        }))
      return [...current, ...extras]
    })
    setPoNotice(null)
    setSelectedJobId(job.jobId)
    return true
  }

  function handleSavePart(part: Omit<JobEquipmentItem, 'id'> & { id?: number }) {
    setEquipment((current) => {
      if (part.id) {
        return current.map((item) => (item.id === part.id ? { ...item, ...part, id: part.id } : item))
      }

      const nextId = current.reduce((max, item) => Math.max(max, item.id), 0) + 1
      return [...current, { ...part, id: nextId }]
    })
  }

  function handleDeletePart(partId: number) {
    setEquipment((current) => current.filter((item) => item.id !== partId))
  }

  function handleRequestPurchase(partIds: number[]) {
    if (!selectedJob || partIds.length === 0) {
      return
    }

    const selectedParts = equipment.filter((item) => partIds.includes(item.id))
    const shortageParts = selectedParts.filter((part) => part.qty - part.storeQty > 0)
    setPendingItems((current) => {
      let id = nextPendingId(current)
      const extras = shortageParts
        .filter(
          (part) =>
            !current.some(
              (item) =>
                item.status === 'pending' && item.partNo === part.partNo && item.jobId === part.jobId,
            ),
        )
        .map((part) => ({
          id: id++,
          jobId: part.jobId,
          mnsPartNo: part.mnsPartNo,
          partNo: part.partNo,
          description: part.description,
          qty: part.qty - part.storeQty,
          unitPrice: part.unitPrice,
          status: 'pending' as const,
        }))
      return [...current, ...extras]
    })
    setPoNotice(
      shortageParts.length === 0
        ? 'รายการที่เลือกมีของในคลังครบแล้ว ไม่ได้ส่งไปรอจัดซื้อ'
        : `ส่ง ${shortageParts.length} รายการที่ขาดไปยังรายการรอจัดซื้อแล้ว`,
    )
  }

  function handleGeneratePo(
    pendingIds: number[],
    vendorId: string,
    quotedPrices: Record<number, number>,
  ) {
    const vendor = vendors.find((item) => item.id === vendorId)
    const selected = pendingItems.filter((item) => pendingIds.includes(item.id) && item.status === 'pending')

    if (!vendor || selected.length === 0) {
      return 'กรุณาเลือกอะไหล่และร้านค้าผู้ชนะ'
    }

    const lines: PurchaseOrderLine[] = selected.map((item) => ({
      pendingId: item.id,
      jobId: item.jobId,
      mnsPartNo: item.mnsPartNo,
      partNo: item.partNo,
      description: item.description,
      qty: item.qty,
      unitPrice: quotedPrices[item.id] ?? item.unitPrice,
    }))
    const amount = lines.reduce((sum, line) => sum + line.qty * line.unitPrice, 0)
    const poNumber = generatePoNumber(purchaseOrders)

    setPurchaseOrders((current) => [
      {
        poNumber,
        vendorId: vendor.id,
        vendorName: vendor.name,
        amount,
        stage: 'draft',
        lines,
        note: `สร้างหลังเปรียบเทียบราคา 3 ร้าน · Winning Vendor: ${vendor.name}`,
        comparison: {
          winnerVendorId: vendor.id,
          quotes: [
            {
              vendorId: vendor.id,
              vendorName: vendor.name,
              total: amount,
              lines: selected.map((item) => ({
                pendingId: item.id,
                unitPrice: quotedPrices[item.id] ?? item.unitPrice,
                leadDays: 0,
              })),
            },
          ],
        },
      },
      ...current,
    ])
    setPendingItems((current) =>
      current.map((item) =>
        pendingIds.includes(item.id) ? { ...item, status: 'on_po', poNumber } : item,
      ),
    )
    setEquipment((current) =>
      current.map((item) =>
        selected.some((pending) => pending.partNo === item.partNo && pending.jobId === item.jobId)
          ? { ...item, status: 'ordered' }
          : item,
      ),
    )

    return `สร้าง ${poNumber} ให้ ${vendor.name} ตามราคาที่ชนะการเปรียบเทียบ (${selected.length} รายการ)`
  }

  function handleMarkDelivered(poNumber: string) {
    const po = purchaseOrders.find((item) => item.poNumber === poNumber)
    if (!po || po.stage === 'delivered') {
      return
    }

    setInventory((current) => applyGoodsReceipt(current, po.lines))
    setPurchaseOrders((current) =>
      current.map((item) => (item.poNumber === poNumber ? { ...item, stage: 'delivered' } : item)),
    )
    setPendingItems((current) => current.filter((item) => item.poNumber !== poNumber))
  }

  function handleRequisition(jobId: string, lines: CartLine[]) {
    let issuedCount = 0
    let shortageCount = 0
    const nextInventory = inventory.map((item) => ({ ...item }))
    const equipmentAdds: JobEquipmentItem[] = []
    const pendingAdds: PendingPurchaseItem[] = []
    let equipmentId = equipment.reduce((max, item) => Math.max(max, item.id), 0)
    let pendingId = nextPendingId(pendingItems)

    for (const line of lines) {
      const stock = nextInventory.find((item) => item.sku === line.sku)
      if (!stock) {
        continue
      }

      const issuedQty = Math.min(stock.currentStock, line.qty)
      const shortage = line.qty - issuedQty

      if (issuedQty > 0) {
        stock.currentStock -= issuedQty
        issuedCount += 1
        equipmentAdds.push({
          id: ++equipmentId,
          jobId,
          mnsPartNo: stock.mnsPartNo,
          partNo: stock.partNo,
          description: stock.description,
          qty: issuedQty,
          storeQty: issuedQty,
          neededDate: new Date().toISOString().slice(0, 10),
          unitPrice: stock.unitPrice,
          status: 'issued',
        })
      }

      if (shortage > 0) {
        shortageCount += 1
        pendingAdds.push({
          id: ++pendingId,
          jobId,
          mnsPartNo: stock.mnsPartNo,
          partNo: stock.partNo,
          description: stock.description,
          qty: shortage,
          unitPrice: stock.unitPrice,
          status: 'pending',
        })
      }
    }

    setInventory(nextInventory)
    setEquipment((current) => [...current, ...equipmentAdds])
    setPendingItems((current) => [...current, ...pendingAdds])

    return `เบิกเข้าคลัง ${issuedCount} รายการ · ส่งขาด ${shortageCount} รายการไปรอจัดซื้อ`
  }

  function handleSaveVendor(vendor: Omit<Vendor, 'id'> & { id?: string }) {
    setVendors((current) => {
      if (vendor.id) {
        return current.map((item) => (item.id === vendor.id ? { ...item, ...vendor, id: vendor.id } : item))
      }

      const nextId = `VEN-${String(current.length + 1).padStart(3, '0')}`
      return [...current, { ...vendor, id: nextId }]
    })
  }

  return (
    <DashboardLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      <div className="mx-auto max-w-[90rem] space-y-6">
        <div id="dashboard" className="scroll-mt-24">
          <KpiCards kpis={kpis} />
        </div>

        <JobEquipmentStatusReport
          jobs={jobs}
          equipment={equipment}
          pendingItems={pendingItems}
          purchaseOrders={purchaseOrders}
          inventory={inventory}
        />

        <InventoryDashboard items={inventory} />
        <StoreCatalog items={inventory} jobs={jobs} onSubmit={handleRequisition} />
        <PendingPurchaseBoard
          items={pendingItems}
          jobs={jobs}
          vendors={vendors}
          onGeneratePo={handleGeneratePo}
        />
        <VendorDirectory
          vendors={vendors}
          onSave={handleSaveVendor}
          onDelete={(vendorId) => setVendors((current) => current.filter((item) => item.id !== vendorId))}
        />

        <JobOrderedEquipment items={filteredEquipment} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <VendorAssignedJobs
            jobs={filteredJobs}
            suggestedJobId={generateJobId(jobs)}
            existingJobIds={jobs.map((job) => job.jobId)}
            onCreateJob={handleCreateJob}
            onOpenJob={(job) => {
              setPoNotice(null)
              setSelectedJobId(job.jobId)
            }}
          />
          <PurchaseOrderBoard purchaseOrders={filteredPurchaseOrders} onMarkDelivered={handleMarkDelivered} />
          <PendingPayments payments={filteredPayments} />
          <PendingDeliveries deliveries={filteredDeliveries} />
        </div>
      </div>

      {selectedJob ? (
        <JobDetails
          job={selectedJob}
          parts={selectedJobParts}
          notice={poNotice}
          onClose={() => {
            setSelectedJobId(null)
            setPoNotice(null)
          }}
          onSavePart={handleSavePart}
          onDeletePart={handleDeletePart}
          onRequestPurchase={handleRequestPurchase}
        />
      ) : null}
    </DashboardLayout>
  )
}
