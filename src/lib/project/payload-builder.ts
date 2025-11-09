import {
  ProjectFormData,
  PhaseFormData,
  CreateProjectPayload,
} from '@/types/project.types';

export function buildProjectPayload(
  projectFormData: ProjectFormData,
  phases: PhaseFormData[],
  userId: string
): CreateProjectPayload {
  // Parse tech stack from comma-separated string to array
  const techStackArray = projectFormData.techStack
    .split(',')
    .map((tech) => tech.trim())
    .filter(Boolean);

  return {
    title: projectFormData.title,
    description: projectFormData.description,
    githubLink: projectFormData.githubLink || undefined,
    projectUrl: projectFormData.projectUrl || undefined,
    techStack: techStackArray,
    isPublic: true,
    faculty: projectFormData.faculty!._id.toString(),
    teamMember: projectFormData.teamMembers.map((member) =>
      member._id.toString()
    ),
    createdBy: userId,
    phases: phases.map((phase) => ({
      title: phase.title,
      deadline: phase.deadline,
      tasks: phase.tasks.map((task) => ({
        task: task.task,
        assignedTo: task.assignedTo,
        priority: task.priority,
        dueDate: task.dueDate,
        createdBy: userId,
      })),
    })),
  };
}
