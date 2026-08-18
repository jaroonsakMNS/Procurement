import { useState, type ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopNav from './TopNav'

interface DashboardLayoutProps {
  children: ReactNode
  activeView: string
  onNavigate: (id: string) => void
  searchQuery: string
  onSearchChange: (value: string) => void
}

export default function DashboardLayout({
  children,
  activeView,
  onNavigate,
  searchQuery,
  onSearchChange,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar
        activeId={activeView}
        onNavigate={(id) => {
          onNavigate(id)
          setIsSidebarOpen(false)
          window.scrollTo({ top: 0, behavior: 'instant' })
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav
          activeView={activeView}
          onMenuClick={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
