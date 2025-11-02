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

      <div
        className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${
          sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
        }`}
      >
        <Header />

        {/* Scrollable page content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
