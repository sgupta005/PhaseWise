import { create } from 'zustand';
import { IProject } from '@/types/project.types';

interface ProjectStore {
  activeProject: IProject | null;
  projects: IProject[];
  isLoading: boolean;
  setActiveProject: (project: IProject | null) => void;
  setProjects: (projects: IProject[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  getProjectById: (id: string) => IProject | undefined;
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
    return projects.find((project) => project._id === id);
  },
}));
