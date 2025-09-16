"use client";

import React, { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  User,
  LucideIcon,
} from "lucide-react";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface NavItem {
  name: string;
  icon: React.ReactElement<LucideIcon>;
}

const navItems: NavItem[] = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { name: "Projects", icon: <FolderKanban size={18} /> },
  { name: "Settings", icon: <Settings size={18} /> },
  { name: "Profile", icon: <User size={18} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [activeItem, setActiveItem] = React.useState<string>("Dashboard");

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
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
        className="fixed top-0 left-0 h-screen w-72 bg-[var(--bg-default)] backdrop-blur-xl text-[var(--text-default)] shadow-xl border-r border-[var(--border-default)] z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5.5 border-b border-[var(--border-default)]">
          <h1 className="text-xl font-semibold text-[var(--text-default)] tracking-tight">
            Project Tracker
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 mt-8 px-6">
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
                    ? "bg-[var(--accent)] text-[var(--color-accent-foreground)] shadow-lg"
                    : "hover:bg-[var(--bg-muted)]"
                }
              `}
            >
              <span
                className={`${
                  activeItem === item.name
                    ? "text-[var(--color-accent-foreground)]"
                    : "text-[var(--text-muted)]"
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

        {/* Theme Toggle */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="flex items-center justify-center p-3 bg-[var(--bg-muted)] rounded-lg border border-[var(--border-default)]">
            <AnimatedThemeToggler />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
