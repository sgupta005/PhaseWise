'use client';

import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NotificationBell } from '@/components/NotificationBell';

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if we're in a project detail route pattern: /projects/[projectId]/*
  // This regex matches: /projects/{anything-except-slash}/{optional-subpath}
  const isProjectDetailRoute = /^\/projects\/[^/]+/.test(pathname);

  // If we're in a project detail route, let the nested layout handle sidebar/header
  if (isProjectDetailRoute) {
    return <>{children}</>;
  }

  const lastSegment = pathname.split('/').filter(Boolean).pop();
  const pageName = lastSegment
    ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
    : 'Projects';

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 py-2 z-20 bg-background shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <span className="text-sm">{pageName}</span>
          </div>
          <div className="ml-auto mr-3 flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </header>
        {children}
      </SidebarInset>
    </>
  );
}
