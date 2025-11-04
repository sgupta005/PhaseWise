'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProjectStore } from '@/stores/project.store';

//Sync the active project with the URL parameter
export function useActiveProject() {
  const params = useParams();
  const projectId = params.projectId as string | undefined;
  const { activeProject, getProjectById, setActiveProject, projects } =
    useProjectStore();

  useEffect(() => {
    if (!projectId) return;

    // If the active project doesn't match the URL, update it
    if (activeProject?._id !== projectId) {
      const project = getProjectById(projectId);
      if (project) {
        setActiveProject(project);
      }
    }
  }, [projectId, activeProject, getProjectById, setActiveProject, projects]);

  return activeProject;
}
