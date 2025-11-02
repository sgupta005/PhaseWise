'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useSidebar } from '@/contexts/sidebar-context';

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />

      {/* Main content area */}
      <div
        className={`flex-1 transition-all duration-500 ease-in-out ${
          sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
        }`}
      >
        <Header />

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}
