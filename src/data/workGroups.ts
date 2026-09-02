import {
  BarChart3,
  Cpu,
  ContactRound,
  Factory,
  FileText,
  Handshake,
  LayoutDashboard,
  Package,
  ShoppingBag,
  ShoppingCart,
  Store,
  Tag,
  Truck,
  UserCog,
  Users,
  Wallet,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'
import type { WorkGroupId } from '../types/procurement'

export interface WorkGroup {
  id: WorkGroupId
  label: string
  hint: string
  description: string
  icon: LucideIcon
  accent: string
}

export interface NavItem {
  id: string
  label: string
  hint: string
  icon: LucideIcon
  groups: WorkGroupId[]
}

export const WORK_GROUPS: WorkGroup[] = [
  {
    id: 'purchasing',
    label: 'กลุ่มจัดซื้อ',
    hint: 'Purchasing',
    description: 'รอจัดซื้อ, เปรียบเทียบราคา, PO และร้านค้า',
    icon: ShoppingCart,
    accent: 'bg-teal-600',
  },
  {
    id: 'accounting',
    label: 'กลุ่มบัญชี',
    hint: 'Accounting',
    description: 'การชำระเงิน, PO และเอกสารรับของ',
    icon: Wallet,
    accent: 'bg-violet-600',
  },
  {
    id: 'production',
    label: 'กลุ่มผลิต',
    hint: 'Production',
    description: 'จ๊อบ, คลัง, เบิกของ และติดตามอุปกรณ์',
    icon: Factory,
    accent: 'bg-amber-600',
  },
  {
    id: 'sales',
    label: 'กลุ่มขาย',
    hint: 'Sales',
    description: 'ลูกค้า สต็อกขาย และพื้นที่ทำงานฝ่ายขาย',
    icon: Handshake,
    accent: 'bg-sky-600',
  },
]

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'แดชบอร์ด',
    hint: 'Dashboard',
    icon: LayoutDashboard,
    groups: ['purchasing', 'accounting', 'production', 'sales'],
  },
  {
    id: 'jobs',
    label: 'จ๊อบ',
    hint: 'Jobs',
    icon: Store,
    groups: ['purchasing', 'production'],
  },
  {
    id: 'job-equipment',
    label: 'อุปกรณ์ในจ๊อบ',
    hint: 'Job Equipment',
    icon: Cpu,
    groups: ['purchasing', 'production'],
  },
  {
    id: 'job-status-report',
    label: 'ติดตามอุปกรณ์',
    hint: 'Job Status',
    icon: BarChart3,
    groups: ['purchasing', 'production'],
  },
  {
    id: 'pending-purchase',
    label: 'รอจัดซื้อ',
    hint: 'Pending Purchase',
    icon: Truck,
    groups: ['purchasing'],
  },
  {
    id: 'vendors',
    label: 'ฐานข้อมูลร้านค้า',
    hint: 'Vendors',
    icon: Users,
    groups: ['purchasing'],
  },
  {
    id: 'purchase-orders',
    label: 'ใบสั่งซื้อ',
    hint: 'Purchase Orders',
    icon: FileText,
    groups: ['purchasing', 'accounting'],
  },
  {
    id: 'payments',
    label: 'การชำระเงิน',
    hint: 'Payments',
    icon: Wallet,
    groups: ['accounting'],
  },
  {
    id: 'deliveries',
    label: 'รอรับของ',
    hint: 'Deliveries',
    icon: Package,
    groups: ['purchasing', 'accounting', 'production'],
  },
  {
    id: 'inventory',
    label: 'คลังสินค้า',
    hint: 'Warehouse',
    icon: Warehouse,
    groups: ['production'],
  },
  {
    id: 'store',
    label: 'ร้านค้าภายใน',
    hint: 'Internal Store',
    icon: ShoppingBag,
    groups: ['production'],
  },
  {
    id: 'customers',
    label: 'ฐานข้อมูลลูกค้า',
    hint: 'Customers',
    icon: ContactRound,
    groups: ['sales'],
  },
  {
    id: 'sales-stock',
    label: 'สต็อกสำหรับขาย',
    hint: 'Sales Stock',
    icon: Tag,
    groups: ['sales'],
  },
  {
    id: 'employees',
    label: 'พนักงาน / สิทธิ์',
    hint: 'Employees',
    icon: UserCog,
    groups: ['purchasing', 'accounting', 'production', 'sales'],
  },
]

export function navItemsForGroup(groupId: WorkGroupId) {
  return NAV_ITEMS.filter((item) => item.groups.includes(groupId))
}

export function groupCanSee(groupId: WorkGroupId, sectionId: string) {
  return NAV_ITEMS.some((item) => item.id === sectionId && item.groups.includes(groupId))
}

export function workGroupById(groupId: WorkGroupId) {
  return WORK_GROUPS.find((group) => group.id === groupId) ?? WORK_GROUPS[0]
}
