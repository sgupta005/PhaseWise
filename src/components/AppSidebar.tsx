'use client';

import type * as React from 'react';
import { Home, Settings, FolderOpen } from 'lucide-react';
import Link from 'next/link';

import { NavUser } from '@/components/NavUser';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'Projects',
      url: '/projects',
      icon: FolderOpen,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  function isActive(url: string) {
    return pathname.startsWith(url);
  }
  return (
    <Sidebar collapsible="icon" {...props} className="dark:shadow-sm">
      <SidebarHeader>
        <div className="flex items-center gap-2 group-data-[state=expanded]:p-2  transition-all ">
          <Image src="/logo.svg" alt="PhaseWise" width={32} height={32} />
          <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
            PhaseWise
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2 flex flex-col gap-2">
          {data.navMain.map((item) => {
            const active = isActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className="px-4"
                >
                  <Link
                    href={item.url}
                    className={cn(
                      active && 'bg-accent text-accent-foreground shadow-lg'
                    )}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
