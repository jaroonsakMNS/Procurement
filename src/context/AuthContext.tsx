import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { employees as initialEmployees } from '../data/employees'
import type { Employee } from '../types/procurement'

const STORAGE_KEY = 'mns.auth.employeeId'

interface AuthContextValue {
  employees: Employee[]
  currentUser: Employee | null
  login: (email: string, password: string) => string | null
  logout: () => void
  saveEmployee: (employee: Omit<Employee, 'id'> & { id?: string }) => string | null
  deleteEmployee: (id: string) => string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredId() {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [currentUserId, setCurrentUserId] = useState<string | null>(readStoredId)

  const currentUser = useMemo(
    () => employees.find((item) => item.id === currentUserId && item.active) ?? null,
    [employees, currentUserId],
  )

  function login(email: string, password: string) {
    const match = employees.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
    )
    if (!match) {
      return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
    }
    if (!match.active) {
      return 'บัญชีนี้ถูกระงับการใช้งาน'
    }
    sessionStorage.setItem(STORAGE_KEY, match.id)
    setCurrentUserId(match.id)
    return null
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY)
    setCurrentUserId(null)
  }

  function saveEmployee(employee: Omit<Employee, 'id'> & { id?: string }) {
    const emailTaken = employees.some(
      (item) => item.email.toLowerCase() === employee.email.trim().toLowerCase() && item.id !== employee.id,
    )
    if (emailTaken) {
      return 'อีเมลนี้มีในระบบแล้ว'
    }

    setEmployees((current) => {
      if (employee.id) {
        return current.map((item) => (item.id === employee.id ? { ...item, ...employee, id: employee.id } : item))
      }

      const seq = current.length + 1
      const nextId = `EMP-${String(seq).padStart(3, '0')}`
      return [
        ...current,
        {
          ...employee,
          id: nextId,
          employeeCode: employee.employeeCode || `MNS-${String(1000 + seq)}`,
        },
      ]
    })
    return null
  }

  function deleteEmployee(id: string) {
    if (id === currentUserId) {
      return 'ไม่สามารถลบบัญชีที่กำลังใช้งานอยู่'
    }
    const target = employees.find((item) => item.id === id)
    if (target?.role === 'admin' && employees.filter((item) => item.role === 'admin' && item.active).length <= 1) {
      return 'ต้องมีผู้ดูแลระบบอย่างน้อย 1 คน'
    }
    setEmployees((current) => current.filter((item) => item.id !== id))
    return null
  }

  return (
    <AuthContext.Provider value={{ employees, currentUser, login, logout, saveEmployee, deleteEmployee }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return value
}
