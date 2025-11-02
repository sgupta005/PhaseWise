import { ProjectFormData, PhaseFormData } from '@/types/project.types';

export function calculateStep1Progress(formData: ProjectFormData): number {
  let filledFields = 0;
  const totalRequiredFields = 5;

  if (formData.title.trim()) filledFields++;
  if (formData.description.trim()) filledFields++;
  if (formData.techStack.trim()) filledFields++;
  if (formData.faculty) filledFields++;
  if (formData.teamMembers.length > 0) filledFields++;

  return (filledFields / totalRequiredFields) * 100;
}

export function calculateStep2Progress(phases: PhaseFormData[]): number {
  // Progress is 100% if there's at least one phase with title, deadline, and at least one task
  const hasCompletePhase = phases.some(
    (phase) =>
      phase.title.trim() !== '' &&
      phase.deadline !== '' &&
      phase.tasks.length > 0 &&
      phase.tasks.some((task) => task.task.trim() !== '')
  );
  return hasCompletePhase ? 100 : 0;
}
