import {
  ProjectDetails,
  ProjectFormStepData,
} from '@/schemas/project-form.schema';
import { PhaseFormData } from '@/types/project.types';

export function calculateProjectProgress(
  formData: Partial<ProjectFormStepData>,
  watchedValues: Partial<ProjectFormStepData>,
  currentStep: number
) {
  let step1Progress = 0;
  let step2Progress = 0;

  if (currentStep === 0) {
    step1Progress = calculateStep1Progress(
      watchedValues as Partial<ProjectDetails>
    );
    if ('phases' in formData && formData.phases) {
      step2Progress = calculateStep2Progress(formData.phases as any);
    }
  } else {
    step1Progress = calculateStep1Progress(formData as Partial<ProjectDetails>);
    if ('phases' in watchedValues && watchedValues.phases) {
      step2Progress = calculateStep2Progress(watchedValues.phases as any);
    }
  }
  return { step1Progress, step2Progress };
}

function calculateStep1Progress(formData: Partial<ProjectDetails>): number {
  let filledFields = 0;
  const totalRequiredFields = 5;

  if (formData?.title?.trim()) filledFields++;
  if (formData?.description?.trim()) filledFields++;
  if (formData?.techStack?.trim()) filledFields++;
  if (formData?.facultyId) filledFields++;
  if (formData?.teamMemberIds?.length && formData.teamMemberIds.length > 0)
    filledFields++;

  return (filledFields / totalRequiredFields) * 100;
}

function calculateStep2Progress(phases: PhaseFormData[]): number {
  // Progress is 100% if there's at least one phase with title and deadline
  const hasCompletePhase = phases.some(
    (phase) => phase.title?.trim() !== '' && phase.deadline !== ''
  );
  return hasCompletePhase ? 100 : 0;
}
