'use client';

import type * as React from 'react';
import {
  LayoutDashboard,
  Users,
  ListTodo,
  ArrowLeft,
  ListOrdered,
  MessageSquareMore,
} from 'lucide-react';
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
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ProjectSwitcher } from './ProjectSwitcher';

function getProjectNavItems(projectId: string) {
  return [
    // {
    //   title: 'Overview',
    //   url: `/projects/${projectId}/overview`,
    //   icon: LayoutDashboard,
    // },
    {
      title: 'Phases',
      url: `/projects/${projectId}/phases`,
      icon: ListOrdered,
    },
    {
      title: 'Tasks',
      url: `/projects/${projectId}/tasks`,
      icon: ListTodo,
    },
    {
      title: 'Team',
      url: `/projects/${projectId}/team`,
      icon: Users,
    },
    {
      title: 'Chat',
      url: `/projects/${projectId}/chat`,
      icon: MessageSquareMore,
    },
  ];
}
export function ProjectSidebar({
  projectId,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  projectId: string;
}) {
  const pathname = usePathname();
  const projectNavItems = getProjectNavItems(projectId);

  function isActive(url: string) {
    return pathname.endsWith(url);
  }
  return (
    <Sidebar collapsible="icon" {...props} className="dark:shadow-sm z-20">
      <SidebarHeader>
        <ProjectSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="group-data-[state=collapsed]:hidden">
          <Button
            className="w-max text-muted-foreground hover:text-foreground hover:bg-transparent bg-transparetn shadow-none"
            asChild
          >
            <Link href="/projects">
              <ArrowLeft />
              <span className="text-xs tracking-tight">PROJECTS</span>
            </Link>
          </Button>
        </SidebarMenu>
        <SidebarMenu className="px-2 flex flex-col gap-2">
          {projectNavItems.map((item) => {
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
