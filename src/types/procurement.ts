export type WorkGroupId = 'purchasing' | 'accounting' | 'production' | 'sales'

export type EmployeeRole = 'admin' | 'manager' | 'staff'

export type PermissionAction = 'view' | 'operate' | 'approve' | 'receive' | 'manage_staff'

export interface Employee {
  id: string
  employeeCode: string
  name: string
  email: string
  password: string
  phone: string
  position: string
  role: EmployeeRole
  department: WorkGroupId
  extraDepartments: WorkGroupId[]
  permissions: PermissionAction[]
  active: boolean
}

export type JobStatus = 'ready_for_po' | 'po_created'

export type PoStage = 'draft' | 'pending_approval' | 'sent_to_vendor' | 'delivered'

export type DeliveryProgress = 'in_transit' | 'partial' | 'ready' | 'received'

export type EquipmentOrderStatus = 'ordered' | 'pending_order' | 'received' | 'issued'

export type PendingPurchaseStatus = 'pending' | 'on_po'

export type JobPartTrackStatus =
  | 'pending_quote'
  | 'po_issued'
  | 'delivered_pending_payment'
  | 'ready_for_use'

export type StatusKey =
  | JobStatus
  | PoStage
  | DeliveryProgress
  | EquipmentOrderStatus
  | PendingPurchaseStatus
  | JobPartTrackStatus
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

export interface ProcessActor {
  name: string
  employeeId: string
  department: string
  position: string
  phone: string
}

export interface ProcessActionLog {
  at: string
  actor: ProcessActor
  recordedBy: {
    name: string
    workGroup: WorkGroupId
    workGroupLabel: string
  }
  note: string
}

export interface PurchaseOrder {
  poNumber: string
  vendorId: string
  vendorName: string
  amount: number
  stage: PoStage
  lines: PurchaseOrderLine[]
  note?: string
  comparison?: VendorPriceComparison
  created?: ProcessActionLog
  submitted?: ProcessActionLog
  approved?: ProcessActionLog
  receipt?: GoodsReceipt
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
}

export type GoodsCondition = 'complete' | 'partial' | 'damaged'

export interface GoodsReceiptPerson {
  name: string
  employeeId: string
  department: string
  position: string
  phone: string
}

export interface GoodsReceipt {
  receivedAt: string
  location: string
  condition: GoodsCondition
  qtyNote: string
  note: string
  receiver: GoodsReceiptPerson
  recordedBy: {
    name: string
    workGroup: WorkGroupId
    workGroupLabel: string
  }
}

export interface PendingDelivery {
  id: string
  poNumber: string
  itemDetails: string
  expectedDate: string
  progress: DeliveryProgress
  receipt?: GoodsReceipt
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

export interface Customer {
  id: string
  code: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  taxId: string
  creditTermDays: number
  active: boolean
}

export interface SalesStockItem {
  sku: string
  sellPrice: number
  minSellQty: number
  note?: string
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
