import { ProjectFormData, PhaseFormData } from '@/types/project.types';

export function validateProjectDetails(
  formData: ProjectFormData
): Partial<Record<keyof ProjectFormData, string>> {
  const errors: Partial<Record<keyof ProjectFormData, string>> = {};

  if (!formData.title.trim()) {
    errors.title = 'Project title is required';
  }

  if (!formData.description.trim()) {
    errors.description = 'Project description is required';
  }

  if (!formData.techStack.trim()) {
    errors.techStack = 'Tech stack is required';
  }

  // Uncomment if GitHub link should be required
  // if (!formData.githubLink.trim()) {
  //   errors.githubLink = 'GitHub repository URL is required';
  // } else if (
  //   !formData.githubLink.startsWith('http://') &&
  //   !formData.githubLink.startsWith('https://')
  // ) {
  //   errors.githubLink = 'Please enter a valid URL';
  // }

  if (!formData.faculty) {
    errors.faculty = 'Please select a faculty mentor';
  }

  if (formData.teamMembers.length === 0) {
    errors.teamMembers = 'Please select at least one team member';
  }

  return errors;
}

export function validatePhases(phases: PhaseFormData[]): {
  [key: string]: string;
} {
  const errors: { [key: string]: string } = {};

  if (phases.length === 0) {
    errors.general = 'Please add at least one phase';
    return errors;
  }

  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];

    if (!phase.title.trim()) {
      errors.general = `Phase ${i + 1}: Title is required`;
      return errors;
    }

    if (!phase.deadline) {
      errors.general = `Phase ${i + 1}: Deadline is required`;
      return errors;
    }

    if (phase.tasks.length === 0) {
      errors.general = `Phase ${i + 1}: Please add at least one task`;
      return errors;
    }

    for (let j = 0; j < phase.tasks.length; j++) {
      const task = phase.tasks[j];
      if (!task.task.trim()) {
        errors.general = `Phase ${i + 1}, Task ${j + 1}: Description is required`;
        return errors;
      }
    }
  }

  return errors;
}
