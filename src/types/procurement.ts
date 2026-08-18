export type JobStatus = 'ready_for_po' | 'po_created'

export type PoStage = 'draft' | 'pending_approval' | 'sent_to_vendor' | 'delivered'

export type DeliveryProgress = 'in_transit' | 'partial' | 'ready' | 'received'

export type EquipmentOrderStatus = 'ordered' | 'pending_order' | 'received' | 'issued'

export type PendingPurchaseStatus = 'pending' | 'on_po'

export type PaymentStatus = 'pending' | 'paid'

export type StatusKey =
  | JobStatus
  | PoStage
  | DeliveryProgress
  | EquipmentOrderStatus
  | PendingPurchaseStatus
  | 'overdue'
  | 'low_stock'
  | 'in_stock'
  | 'out_of_stock'

export interface Vendor {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  taxId: string
}

export interface VendorJob {
  jobId: string
  projectName: string
  vendorName: string
  description: string
  attachmentFileName?: string
  status: JobStatus
}

export interface PurchaseOrderLine {
  pendingId?: number
  jobId?: string
  mnsPartNo: string
  partNo: string
  description: string
  qty: number
  unitPrice: number
}

export interface PurchaseOrder {
  poNumber: string
  vendorId: string
  vendorName: string
  amount: number
  stage: PoStage
  lines: PurchaseOrderLine[]
  note?: string
  createdDate?: string
  sentDate?: string
  deliveredDate?: string
  comparison?: VendorPriceComparison
}

export interface VendorQuoteLine {
  pendingId: number
  unitPrice: number
  leadDays: number
}

export interface VendorComparisonQuote {
  vendorId: string
  vendorName: string
  lines: VendorQuoteLine[]
  total: number
}

export interface VendorPriceComparison {
  quotes: VendorComparisonQuote[]
  winnerVendorId: string
}

export interface PendingPayment {
  poNumber: string
  vendorName: string
  amount: number
  dueDate: string
  source?: 'seed' | 'delivery'
  status?: PaymentStatus
  paidDate?: string
}

export interface PendingDelivery {
  id: string
  poNumber: string
  itemDetails: string
  expectedDate: string
  progress: DeliveryProgress
  vendorName?: string
  amount?: number
  receivedDate?: string
}

export interface JobEquipmentItem {
  id: number
  jobId: string
  mnsPartNo: string
  partNo: string
  description: string
  qty: number
  storeQty: number
  neededDate: string
  unitPrice: number
  status: EquipmentOrderStatus
}

export interface InventoryItem {
  sku: string
  mnsPartNo: string
  partNo: string
  description: string
  currentStock: number
  minStock: number
  unit: string
  location: string
  unitPrice: number
}

export interface PendingPurchaseItem {
  id: number
  jobId?: string
  mnsPartNo: string
  partNo: string
  description: string
  qty: number
  unitPrice: number
  status: PendingPurchaseStatus
  poNumber?: string
}

export interface CartLine {
  sku: string
  qty: number
}

export interface DashboardKpis {
  vendorJobsReady: number
  posInProcess: number
  pendingPaymentTotal: number
  pendingDeliveriesCount: number
  orderedEquipmentCount: number
  lowStockCount: number
  pendingPurchaseCount: number
}
