'use client';

import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ProjectSidebar } from '@/components/project/ProjectSidebar';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useActiveProject } from '@/hooks/project/useActiveProject';
import { IProjectWithTeam } from '@/types/project.types';

interface ProjectLayoutClientProps {
  children: React.ReactNode;
  project: IProjectWithTeam;
}

export default function ProjectLayoutClient({
  children,
  project,
}: ProjectLayoutClientProps) {
  useActiveProject();

  const pathname = usePathname();
  const projectId = project._id.toString();

  // Determine page name from the last segment
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  const pageName =
    lastSegment === projectId
      ? 'Overview'
      : lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

  return (
    <>
      <ProjectSidebar projectId={projectId ?? ''} />
      <SidebarInset>
        <header className="flex sticky z-10 top-0 bg-background h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <AnimatedThemeToggler className="ml-auto mr-8" />
        </header>
        <div className="">{children}</div>
      </SidebarInset>
    </>
  );
}
