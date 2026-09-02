import { NAV_ITEMS, WORK_GROUPS } from '../data/workGroups'
import type { Employee, EmployeeRole, PermissionAction, WorkGroupId } from '../types/procurement'

export const ROLE_LABEL: Record<EmployeeRole, string> = {
  admin: 'ผู้ดูแลระบบ (Admin)',
  manager: 'หัวหน้าแผนก (Manager)',
  staff: 'พนักงาน (Staff)',
}

export const PERMISSION_LABEL: Record<PermissionAction, string> = {
  view: 'ดูข้อมูล',
  operate: 'ทำงานในแผนก (สร้าง/แก้ไข)',
  approve: 'อนุมัติเอกสาร',
  receive: 'รับของเข้าคลัง',
  manage_staff: 'จัดการพนักงานและสิทธิ์',
}

export const ALL_PERMISSIONS: PermissionAction[] = ['view', 'operate', 'approve', 'receive', 'manage_staff']

export function defaultPermissions(role: EmployeeRole, department: WorkGroupId): PermissionAction[] {
  if (role === 'admin') {
    return [...ALL_PERMISSIONS]
  }

  if (role === 'manager') {
    if (department === 'accounting' || department === 'sales') {
      return ['view', 'operate', 'approve']
    }
    return ['view', 'operate', 'approve', 'receive']
  }

  if (department === 'accounting') {
    return ['view']
  }

  if (department === 'production') {
    return ['view', 'operate', 'receive']
  }

  if (department === 'sales') {
    return ['view', 'operate']
  }

  return ['view', 'operate']
}

export function allowedDepartments(employee: Employee): WorkGroupId[] {
  if (employee.role === 'admin' || employee.permissions.includes('manage_staff')) {
    return WORK_GROUPS.map((group) => group.id)
  }

  return [...new Set([employee.department, ...employee.extraDepartments])]
}

export function hasPermission(employee: Employee, action: PermissionAction) {
  return employee.role === 'admin' || employee.permissions.includes(action)
}

export function canSeeSection(employee: Employee, groupId: WorkGroupId, sectionId: string) {
  if (sectionId === 'employees') {
    return hasPermission(employee, 'manage_staff')
  }

  if (!allowedDepartments(employee).includes(groupId)) {
    return false
  }

  return NAV_ITEMS.some((item) => item.id === sectionId && item.groups.includes(groupId))
}

export function navItemsForUser(employee: Employee, groupId: WorkGroupId) {
  return NAV_ITEMS.filter((item) => canSeeSection(employee, groupId, item.id))
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'U'
}
