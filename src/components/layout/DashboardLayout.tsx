import { useState, type ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopNav from './TopNav'

interface DashboardLayoutProps {
  children: ReactNode
  searchQuery: string
  onSearchChange: (value: string) => void
}

export default function DashboardLayout({
  children,
  searchQuery,
  onSearchChange,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeId, setActiveId] = useState('dashboard')

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

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar
        activeId={activeId}
        onNavigate={handleNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav
          onMenuClick={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
