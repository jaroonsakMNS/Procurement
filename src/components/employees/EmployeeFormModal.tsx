import { useEffect, useState } from 'react'
import type { Employee, EmployeeRole, WorkGroupId } from '../../types/procurement'
import { WORK_GROUPS } from '../../data/workGroups'
import { ALL_PERMISSIONS, PERMISSION_LABEL, ROLE_LABEL, defaultPermissions } from '../../lib/permissions'

interface EmployeeFormModalProps {
  open: boolean
  initial?: Employee
  onClose: () => void
  onSubmit: (employee: Omit<Employee, 'id'> & { id?: string }) => string | null
}

const empty: Omit<Employee, 'id'> = {
  employeeCode: '',
  name: '',
  email: '',
  password: '',
  phone: '',
  position: '',
  role: 'staff',
  department: 'purchasing',
  extraDepartments: [],
  permissions: defaultPermissions('staff', 'purchasing'),
  active: true,
}

const fieldClass =
  'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30'

export default function EmployeeFormModal({ open, initial, onClose, onSubmit }: EmployeeFormModalProps) {
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      return
    }

    setForm(
      initial
        ? {
            employeeCode: initial.employeeCode,
            name: initial.name,
            email: initial.email,
            password: initial.password,
            phone: initial.phone,
            position: initial.position,
            role: initial.role,
            department: initial.department,
            extraDepartments: initial.extraDepartments,
            permissions: initial.permissions,
            active: initial.active,
          }
        : empty,
    )
    setError('')
  }, [open, initial])

  function applyRoleDefaults(role: EmployeeRole, department: WorkGroupId) {
    setForm((current) => ({
      ...current,
      role,
      department,
      permissions: defaultPermissions(role, department),
      extraDepartments: role === 'admin' ? ['accounting', 'production', 'sales'] : current.extraDepartments.filter((id) => id !== department),
    }))
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4">
      <form
        className="my-8 w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl"
        onSubmit={(event) => {
          event.preventDefault()
          if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.position.trim()) {
            setError('กรุณากรอกชื่อ อีเมล รหัสผ่าน และตำแหน่ง')
            return
          }
          const message = onSubmit({ ...form, id: initial?.id, email: form.email.trim() })
          if (message) {
            setError(message)
            return
          }
          onClose()
        }}
      >
        <h3 className="text-sm font-semibold text-slate-900">
          {initial ? 'แก้ไขพนักงานและสิทธิ์' : 'เพิ่มพนักงาน'}
        </h3>
        <p className="mt-1 text-xs text-slate-500">กำหนดแผนกและสิทธิ์ว่าคนนี้ทำอะไรได้ในระบบ</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-xs font-medium text-slate-600">
            รหัสพนักงาน
            <input
              value={form.employeeCode}
              onChange={(event) => setForm({ ...form, employeeCode: event.target.value })}
              className={fieldClass}
              placeholder="MNS-0103"
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            ชื่อ-นามสกุล
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={fieldClass} />
          </label>
          <label className="text-xs font-medium text-slate-600">
            อีเมลเข้าสู่ระบบ
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            รหัสผ่าน
            <input
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            โทรศัพท์
            <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={fieldClass} />
          </label>
          <label className="text-xs font-medium text-slate-600">
            ตำแหน่ง
            <input
              value={form.position}
              onChange={(event) => setForm({ ...form, position: event.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            บทบาท
            <select
              value={form.role}
              onChange={(event) => applyRoleDefaults(event.target.value as EmployeeRole, form.department)}
              className={fieldClass}
            >
              {(Object.keys(ROLE_LABEL) as EmployeeRole[]).map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABEL[role]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-slate-600">
            แผนกหลัก
            <select
              value={form.department}
              onChange={(event) => applyRoleDefaults(form.role, event.target.value as WorkGroupId)}
              className={fieldClass}
            >
              {WORK_GROUPS.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset className="mt-4">
          <legend className="text-xs font-medium text-slate-600">แผนกเพิ่มเติมที่เข้าถึงได้</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {WORK_GROUPS.filter((group) => group.id !== form.department).map((group) => {
              const checked = form.extraDepartments.includes(group.id)
              return (
                <label key={group.id} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setForm((current) => ({
                        ...current,
                        extraDepartments: checked
                          ? current.extraDepartments.filter((id) => id !== group.id)
                          : [...current.extraDepartments, group.id],
                      }))
                    }
                  />
                  {group.label}
                </label>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="mt-4">
          <legend className="text-xs font-medium text-slate-600">สิทธิ์การใช้งาน</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {ALL_PERMISSIONS.map((permission) => {
              const checked = form.permissions.includes(permission)
              return (
                <label key={permission} className="flex items-start gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={checked}
                    onChange={() =>
                      setForm((current) => ({
                        ...current,
                        permissions: checked
                          ? current.permissions.filter((item) => item !== permission)
                          : [...current.permissions, permission],
                      }))
                    }
                  />
                  <span>
                    <span className="block font-medium">{PERMISSION_LABEL[permission]}</span>
                    <span className="block text-[11px] text-slate-400">{permission}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} />
          ใช้งานได้ (Active)
        </label>

        {error ? <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
            ยกเลิก
          </button>
          <button type="submit" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
            บันทึก
          </button>
        </div>
      </form>
    </div>
  )
}
