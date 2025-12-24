import { create } from 'zustand';
import { IProjectWithTeamAndPhaseTitles } from '@/types/project.types';

interface ProjectStore {
  activeProject: IProjectWithTeamAndPhaseTitles | null;
  projects: IProjectWithTeamAndPhaseTitles[];
  isLoading: boolean;
  setActiveProject: (project: IProjectWithTeamAndPhaseTitles | null) => void;
  setProjects: (projects: IProjectWithTeamAndPhaseTitles[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  getProjectById: (id: string) => IProjectWithTeamAndPhaseTitles | undefined;
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
