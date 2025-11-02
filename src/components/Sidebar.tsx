'use client';

import React, { Dispatch, SetStateAction } from 'react';
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

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface NavItem {
  name: string;
  icon: React.ReactElement<LucideIcon>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { name: 'Projects', icon: <FolderKanban size={18} /> },
  { name: 'Settings', icon: <Settings size={18} /> },
  { name: 'Profile', icon: <User size={18} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [activeItem, setActiveItem] = React.useState<string>('Dashboard');

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
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
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="fixed top-0 left-0 h-screen w-72  backdrop-blur-xl  shadow-xl border-r  z-50"
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
          {navItems.map((item, idx) => (
            <motion.button
              key={idx}
              onClick={() => setActiveItem(item.name)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center gap-4 px-4 py-3.5 rounded-lg text-left transition-all duration-300
                ${
                  activeItem === item.name
                    ? 'bg-accent text-accent-foreground shadow-lg'
                    : 'hover:bg-muted'
                }
              `}
            >
              <span
                className={`${
                  activeItem === item.name
                    ? 'text-accent-foreground'
                    : 'text-muted-foreground'
                } transition-colors duration-300`}
              >
                {item.icon}
              </span>
              <span className="font-medium text-sm tracking-wide">
                {item.name}
              </span>
            </motion.button>
          ))}
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;
