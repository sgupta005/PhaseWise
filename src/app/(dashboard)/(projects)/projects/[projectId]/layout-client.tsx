'use client';

import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ProjectSidebar } from '@/components/project/ProjectSidebar';
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
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { TaskDocument } from '@/models/task.model';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectLayoutClientProps {
  children: React.ReactNode;
  project: IProjectWithTeam;
}

export default function ProjectLayoutClient({
  children,
  project,
}: ProjectLayoutClientProps) {
  const [task, setTask] = useState<TaskDocument | null>(null);

  useActiveProject();

  const pathname = usePathname();
  const projectId = project._id.toString();

  // Determine page name from the last segment
  const segments = pathname.split('/').filter(Boolean);
  const secondLastSegment = segments[segments.length - 2];
  const lastSegment = segments[segments.length - 1];
  const pageName =
    lastSegment === projectId
      ? 'Overview'
      : lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

  useEffect(
    function () {
      function fetchTask() {
        fetch(`/api/task?taskId=${lastSegment}`)
          .then((res) => res.json())
          .then((data) => {
            setTask(data.data);
          });
      }
      if (secondLastSegment === 'tasks') fetchTask();
    },
    [lastSegment]
  );

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
                {secondLastSegment && secondLastSegment === 'tasks' ? (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href={`/projects/${projectId}/tasks`}>
                        Tasks
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />

                    <BreadcrumbPage className="truncate">
                      {task?.task}
                    </BreadcrumbPage>
                  </>
                ) : (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{pageName}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto mr-8">
            <ThemeToggle />
          </div>
        </header>
        <div className="">{children}</div>
      </SidebarInset>
    </>
  );
}
