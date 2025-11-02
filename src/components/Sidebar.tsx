'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  User,
  LucideIcon,
  PanelLeftClose,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/sidebar-context';

interface NavItem {
  name: string;
  icon: React.ReactElement<LucideIcon>;
  href: string;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    href: '/dashboard',
  },
  { name: 'Projects', icon: <FolderKanban size={18} />, href: '/projects' },
  { name: 'Settings', icon: <Settings size={18} />, href: '/settings' },
  { name: 'Profile', icon: <User size={18} />, href: '/profile' },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Determine if a nav item is active based on current pathname
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-background/30 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -288, opacity: 0 }}
        animate={{ x: sidebarOpen ? 0 : -288, opacity: sidebarOpen ? 1 : 0 }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="fixed top-0 left-0 h-screen w-72  backdrop-blur-xl shadow-xl border-r z-50 bg-background"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="PhaseWise Logo"
              width={48}
              height={48}
              className="flex-shrink-0"
            />
            <h1 className="text-xl font-semibold  tracking-tight">PhaseWise</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close sidebar"
          >
            <PanelLeftClose size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Navigation */}

        <nav className="flex flex-col gap-1 px-6 mt-2">
          {navItems.map((item, idx) => {
            const active = isActive(item.href);
            return (
              <Link key={idx} href={item.href}>
                <motion.div
                  transition={{ duration: 0.15 }}
                  className={`
                    flex items-center gap-4 px-4 py-3.5 rounded-lg text-left transition-all duration-150 cursor-pointer
                    ${
                      active
                        ? 'bg-accent text-accent-foreground shadow-lg'
                        : 'hover:bg-muted'
                    }
                  `}
                >
                  <span
                    className={`${
                      active
                        ? 'text-accent-foreground'
                        : 'text-muted-foreground'
                    } transition-colors duration-150`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm tracking-wide">
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;
