import { IProjectWithTeamAndPhaseTitles } from '@/types/project.types';

export function filterProjects(
  projects: IProjectWithTeamAndPhaseTitles[],
  searchQuery: string
): IProjectWithTeamAndPhaseTitles[] {
  if (!searchQuery.trim()) {
    return projects;
  }

  const query = searchQuery.toLowerCase().trim();

  return projects.filter((project) => {
    if (project.title?.toLowerCase().includes(query)) {
      return true;
    }

    if (project.description?.toLowerCase().includes(query)) {
      return true;
    }

    if (project.techStack?.some((tech) => tech.toLowerCase().includes(query))) {
      return true;
    }

    if (
      project.teamMember?.some((member) =>
        member.name?.toLowerCase().includes(query)
      )
    ) {
      return true;
    }

    if (
      project.faculty?.some((faculty) =>
        faculty?.name?.toLowerCase().includes(query)
      )
    ) {
      return true;
    }

    return false;
  });
}
