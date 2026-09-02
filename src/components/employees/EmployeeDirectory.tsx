import { Pencil, Plus, Trash2, UserCog } from 'lucide-react'
import { useMemo, useState } from 'react'
import { WORK_GROUPS } from '../../data/workGroups'
import { PERMISSION_LABEL, ROLE_LABEL, allowedDepartments } from '../../lib/permissions'
import type { Employee } from '../../types/procurement'
import EmployeeFormModal from './EmployeeFormModal'

interface EmployeeDirectoryProps {
  employees: Employee[]
  onSave: (employee: Omit<Employee, 'id'> & { id?: string }) => string | null
  onDelete: (id: string) => string | null
}

export default function EmployeeDirectory({ employees, onSave, onDelete }: EmployeeDirectoryProps) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Employee | undefined>()
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return employees.filter((item) => {
      if (!needle) return true
      return [item.name, item.email, item.employeeCode, item.position, item.role, item.department]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
  }, [employees, query])

  return (
    <section id="employees" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <UserCog className="h-4 w-4 text-teal-700" />
            ฐานข้อมูลพนักงานและสิทธิ์ (Employee Access)
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            กำหนดว่าใครเป็นแอดมิน หัวหน้าแผนก หรือพนักงาน — และแต่ละคนเข้าแผนกไหนได้บ้าง
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(undefined)
            setOpen(true)
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          เพิ่มพนักงาน
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-3">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ค้นหาชื่อ, อีเมล, รหัสพนักงาน..."
          className="min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
        />
        <p className="text-xs text-slate-500">{filtered.length} คน</p>
      </div>

      {notice ? <p className="mx-5 mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{notice}</p> : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">พนักงาน</th>
              <th className="px-4 py-3 font-medium">บทบาท</th>
              <th className="px-4 py-3 font-medium">แผนกที่เข้าถึง</th>
              <th className="px-4 py-3 font-medium">สิทธิ์</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 text-right font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => {
              const depts = allowedDepartments(item)
              return (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400">
                      {item.employeeCode} · {item.position}
                    </p>
                    <p className="text-xs text-slate-400">{item.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{ROLE_LABEL[item.role]}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {depts.map((id) => {
                        const group = WORK_GROUPS.find((entry) => entry.id === id)
                        return (
                          <span key={id} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                            {group?.label ?? id}
                          </span>
                        )
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.permissions.map((permission) => (
                        <span key={permission} className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] text-teal-800">
                          {PERMISSION_LABEL[permission]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        item.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.active ? 'ใช้งาน' : 'ระงับ'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(item)
                          setOpen(true)
                        }}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`ลบพนักงาน ${item.name}?`)) {
                            const message = onDelete(item.id)
                            setNotice(message ?? '')
                          }
                        }}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <EmployeeFormModal
        open={open}
        initial={editing}
        onClose={() => setOpen(false)}
        onSubmit={onSave}
      />
    </section>
  )
}
