import { create } from 'zustand';
import { IProjectWithTeam } from '@/types/project.types';

interface ProjectStore {
  activeProject: IProjectWithTeam | null;
  projects: IProjectWithTeam[];
  isLoading: boolean;
  setActiveProject: (project: IProjectWithTeam | null) => void;
  setProjects: (projects: IProjectWithTeam[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  getProjectById: (id: string) => IProjectWithTeam | undefined;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  activeProject: null,
  projects: [],
  isLoading: true,
  setActiveProject: (project) => set({ activeProject: project }),
  setProjects: (projects) => set({ projects }),
  setIsLoading: (isLoading) => set({ isLoading }),
  getProjectById: (id) => {
    const { projects } = get();
    return projects.find((project) => project._id.toString() === id);
  },
}));
