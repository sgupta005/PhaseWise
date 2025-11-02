'use client';

import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { PanelLeftOpen } from 'lucide-react';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/sidebar-context';
import { getPageTitle } from '@/lib/route-config';

function Header() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const heading = getPageTitle(pathname);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background h-[72px]">
      <div className="flex items-center gap-4">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Open sidebar"
          >
            <PanelLeftOpen size={20} className="text-muted-foreground" />
          </button>
        )}
        <h1 className="text-lg font-semibold tracking-tight">{heading}</h1>
      </div>
      <AnimatedThemeToggler />
    </div>
  );
}

export default Header;
