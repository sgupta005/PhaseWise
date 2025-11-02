'use client';

import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { PanelLeftOpen } from 'lucide-react';
import React from 'react';

interface TopbarProps {
  heading: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

function Topbar({ heading, sidebarOpen, setSidebarOpen }: TopbarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background h-[72px]">
      <div className="flex items-center gap-4">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Open sidebar"
          >
            <PanelLeftOpen size={24} />
          </button>
        )}
        <h1 className="text-lg font-semibold tracking-tight">{heading}</h1>
      </div>
      <AnimatedThemeToggler />
    </div>
  );
}

export default Topbar;
