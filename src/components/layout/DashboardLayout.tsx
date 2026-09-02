import { useEffect, useState, type ReactNode } from 'react'
import { canSeeSection, navItemsForUser } from '../../lib/permissions'
import type { Employee, WorkGroupId } from '../../types/procurement'
import Sidebar from './Sidebar'
import TopNav from './TopNav'

interface DashboardLayoutProps {
  children: ReactNode
  searchQuery: string
  onSearchChange: (value: string) => void
  workGroup: WorkGroupId
  onWorkGroupChange: (group: WorkGroupId) => void
  employee: Employee
  onLogout: () => void
}

export default function DashboardLayout({
  children,
  searchQuery,
  onSearchChange,
  workGroup,
  onWorkGroupChange,
  employee,
  onLogout,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeId, setActiveId] = useState('dashboard')

  useEffect(() => {
    if (!canSeeSection(employee, workGroup, activeId)) {
      setActiveId(navItemsForUser(employee, workGroup)[0]?.id ?? 'dashboard')
    }
  }, [employee, workGroup, activeId])

  function handleNavigate(id: string) {
    setActiveId(id)
    setIsSidebarOpen(false)

    if (id === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const section = document.getElementById(id)
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleWorkGroupChange(group: WorkGroupId) {
    onWorkGroupChange(group)
    setIsSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar
        activeId={activeId}
        workGroup={workGroup}
        employee={employee}
        onNavigate={handleNavigate}
        onWorkGroupChange={handleWorkGroupChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav
          onMenuClick={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          workGroup={workGroup}
          employee={employee}
          onLogout={onLogout}
        />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
