'use client';

import CreateProjectCard from '@/components/CreateProjectCard';
import Sidebar from '@/components/Sidebar';
import { GridBeams } from '@/components/ui/grid-beams';
import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';

function Projects() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content area */}
      <div
        className={`flex-1 transition-all duration-500 ease-in-out ${
          sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
        }`}
      >
        {/* Topbar (desktop only toggle button) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background lg:justify-start lg:gap-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg font-semibold tracking-tight">Projects</h1>
        </div>

        {/* GridBeams content */}
        <div className="p-6 lg:p-10 transition-all duration-500 ease-in-out">
          <GridBeams
            className={`rounded-xl shadow-2xl p-8 ${
              sidebarOpen ? 'lg:ml-0' : 'lg:w-full'
            } transition-all duration-500 ease-in-out mb-10`}
          >
            <div className="flex h-48 items-center justify-center text-center">
              <h2 className="text-2xl font-bold text-muted-foreground">
                Create and Manage Your Projects
              </h2>
            </div>
          </GridBeams>
          <CreateProjectCard />
        </div>
      </div>
    </div>
  );
}

export default Projects;
